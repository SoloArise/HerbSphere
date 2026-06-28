const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const INTERN_ID = "TBI-26100935";
const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

const collectionPath = path.join(__dirname, "..", "backend", "HerbSphere.postman_collection.json");
const outputPath = path.join(__dirname, "..", `W4_APICollection_${INTERN_ID}.json`);

async function run() {
  console.log("Starting backend server...");
  const server = spawn("node", ["server.js"], {
    cwd: path.join(__dirname, "..", "backend"),
    env: { ...process.env, PORT: String(PORT) },
    shell: true,
  });

  server.stdout.on("data", (data) => {
    console.log(`[Server]: ${data.toString().trim()}`);
  });

  server.stderr.on("data", (data) => {
    console.error(`[Server Error]: ${data.toString().trim()}`);
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  console.log("Reading Postman collection template...");
  const collection = JSON.parse(fs.readFileSync(collectionPath, "utf8"));

  // Create a copy of the products data so we can restore if needed, or we just run the requests.
  // The backend uses in-memory data. If we delete a product, it will be gone for that run.
  // That's fine, we can run GET/PUT before DELETE.
  
  const items = collection.item;

  for (const item of items) {
    console.log(`Executing request: ${item.name}`);
    
    // Resolve URL
    let urlString = "";
    if (typeof item.request.url === "string") {
      urlString = item.request.url;
    } else if (item.request.url && item.request.url.raw) {
      urlString = item.request.url.raw;
    }

    urlString = urlString
      .replace("{{baseUrl}}", BASE_URL)
      .replace("{{productId}}", "1");

    const method = item.request.method;
    const headers = {};
    if (item.request.header) {
      item.request.header.forEach((h) => {
        headers[h.key] = h.value;
      });
    }

    let body = undefined;
    if (item.request.body && item.request.body.mode === "raw") {
      body = item.request.body.raw;
    }

    try {
      const res = await fetch(urlString, {
        method,
        headers,
        body,
      });

      const resBodyText = await res.text();
      let statusText = res.statusText;
      if (!statusText) {
        if (res.status === 200) statusText = "OK";
        else if (res.status === 201) statusText = "Created";
        else if (res.status === 204) statusText = "No Content";
        else if (res.status === 400) statusText = "Bad Request";
        else if (res.status === 404) statusText = "Not Found";
        else if (res.status === 500) statusText = "Internal Server Error";
        else statusText = "Unknown";
      }

      const responseHeaders = [];
      res.headers.forEach((value, key) => {
        responseHeaders.push({ key, value });
      });

      // Construct Postman response object
      const postmanResponse = {
        name: item.name + " Response",
        originalRequest: {
          method: item.request.method,
          header: item.request.header || [],
          body: item.request.body || null,
          url: item.request.url
        },
        status: statusText,
        code: res.status,
        _postman_previewlanguage: "json",
        header: responseHeaders,
        cookie: [],
        body: resBodyText
      };

      item.response = [postmanResponse];
      console.log(`Success: ${res.status} ${statusText}`);
    } catch (err) {
      console.error(`Error executing ${item.name}:`, err.message);
    }
  }

  console.log(`Writing updated collection with saved responses to ${outputPath}...`);
  fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), "utf8");

  console.log("Stopping backend server...");
  server.kill();
  
  // Force exit to clean up any remaining handles
  process.exit(0);
}

run().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
