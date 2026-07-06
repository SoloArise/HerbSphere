const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const INTERN_ID = "TBI-26100935";
const OUTPUT_PNG_PATH = path.join(__dirname, "..", `W5_SchemaDiagram_${INTERN_ID}.png`);
const OUTPUT_PDF_PATH = path.join(__dirname, "..", `W5_SchemaDiagram_${INTERN_ID}.pdf`);

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HerbSphere Database Schema Diagram</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background-color: #0f172a;
      color: #e2e8f0;
      margin: 0;
      padding: 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      box-sizing: border-box;
    }

    .container {
      width: 1000px;
      position: relative;
      background-color: #1e293b;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
      z-index: 1;
    }

    header {
      margin-bottom: 40px;
      border-bottom: 1px solid #334155;
      padding-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #f8fafc;
      margin: 0 0 8px 0;
      font-family: 'Fira Code', monospace;
      letter-spacing: -0.5px;
    }

    .subtitle {
      font-size: 13px;
      color: #94a3b8;
      margin: 0;
    }

    .meta-box {
      text-align: right;
      font-size: 11px;
      color: #64748b;
      line-height: 1.5;
    }

    .diagram-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 30px;
      position: relative;
      height: 480px;
      margin-top: 30px;
    }

    /* DB Table card styling */
    .db-table {
      width: 280px;
      background-color: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      font-size: 11px;
      position: relative;
      z-index: 10;
    }

    .db-table-header {
      padding: 10px 14px;
      font-weight: 600;
      color: #ffffff;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #334155;
    }

    .table-product .db-table-header {
      background: linear-gradient(135deg, #065f46, #047857);
      border-bottom: 2px solid #059669;
    }

    .table-customer .db-table-header {
      background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
      border-bottom: 2px solid #2563eb;
    }

    .table-order .db-table-header {
      background: linear-gradient(135deg, #581c87, #7e22ce);
      border-bottom: 2px solid #9333ea;
    }

    .table-type {
      font-size: 9px;
      background-color: rgba(255,255,255,0.15);
      padding: 1px 5px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .db-table-fields {
      padding: 6px 0;
    }

    .field-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 14px;
      border-bottom: 1px solid #1e293b;
    }

    .field-row:last-child {
      border-bottom: none;
    }

    .field-name {
      font-family: 'Fira Code', monospace;
      font-weight: 500;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .field-key-pk {
      color: #f59e0b;
      font-weight: bold;
      font-size: 9px;
    }

    .field-key-fk {
      color: #38bdf8;
      font-weight: bold;
      font-size: 9px;
    }

    .field-type {
      color: #94a3b8;
      font-size: 10px;
    }

    .embedded-fields {
      background-color: #1e293b;
      padding: 4px 0 4px 12px;
      border-left: 2px solid #475569;
      margin: 2px 14px;
      border-radius: 0 4px 4px 0;
    }

    .embedded-field-row {
      display: flex;
      justify-content: space-between;
      padding: 4px 10px;
      font-size: 10px;
    }

    /* Relationship arrows SVG overlay */
    .relation-svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 5;
    }

    .relation-line {
      fill: none;
      stroke: #64748b;
      stroke-width: 2;
      stroke-dasharray: 4 4;
    }

    .relation-line-active {
      fill: none;
      stroke: #38bdf8;
      stroke-width: 2;
      marker-end: url(#arrow);
    }

    .relation-label {
      font-size: 10px;
      fill: #94a3b8;
      font-family: 'Fira Code', monospace;
    }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <div>
        <h1>🌿 HerbSphere Database Schema</h1>
        <p class="subtitle">Entity-Relationship Diagram representing the MongoDB data layer structured via Mongoose.</p>
      </div>
      <div class="meta-box">
        <strong>Week 5 Database Integration</strong><br>
        Intern ID: ${INTERN_ID}<br>
        Database: MongoDB / Mongoose
      </div>
    </header>

    <div class="diagram-area">
      <!-- SVG Overlay for drawing connections -->
      <svg class="relation-svg">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8"/>
          </marker>
          <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <circle cx="5" cy="5" r="3" fill="#64748b"/>
          </marker>
        </defs>

        <!-- Customer to Order Link -->
        <!-- Draw path from Customer table _id (left: 0px, top: ~100px) to Order customer (mid: 300px to 600px) -->
        <path d="M 280,103 L 310,103 L 310,138 L 360,138" class="relation-line-active" />
        <text x="290" y="93" class="relation-label">1</text>
        <text x="340" y="130" class="relation-label">N</text>

        <!-- Product to Order Link -->
        <!-- Draw path from Product table _id (right: 1000px, top: ~100px) to Order products.product (mid: ~640px) -->
        <path d="M 720,103 L 690,103 L 690,230 L 640,230" class="relation-line-active" />
        <text x="705" y="93" class="relation-label">1</text>
        <text x="655" y="222" class="relation-label">N</text>
      </svg>

      <!-- Customer Model -->
      <div class="db-table table-customer" style="margin-top: 20px;">
        <div class="db-table-header">
          <span>Customer</span>
          <span class="table-type">Collection</span>
        </div>
        <div class="db-table-fields">
          <div class="field-row">
            <span class="field-name"><span class="field-key-pk">🔑</span> _id</span>
            <span class="field-type">ObjectId</span>
          </div>
          <div class="field-row">
            <span class="field-name">name</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">email</span>
            <span class="field-type">String (Unique)</span>
          </div>
          <div class="field-row">
            <span class="field-name">phone</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">address</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">createdAt</span>
            <span class="field-type">Date</span>
          </div>
          <div class="field-row">
            <span class="field-name">updatedAt</span>
            <span class="field-type">Date</span>
          </div>
        </div>
      </div>

      <!-- Order Model -->
      <div class="db-table table-order" style="width: 300px;">
        <div class="db-table-header">
          <span>Order</span>
          <span class="table-type">Collection</span>
        </div>
        <div class="db-table-fields">
          <div class="field-row">
            <span class="field-name"><span class="field-key-pk">🔑</span> _id</span>
            <span class="field-type">ObjectId</span>
          </div>
          <div class="field-row">
            <span class="field-name"><span class="field-key-fk">🔗</span> customer</span>
            <span class="field-type">ObjectId (Ref)</span>
          </div>
          <div class="field-row">
            <span class="field-name">products</span>
            <span class="field-type">Array</span>
          </div>
          
          <!-- Nested array fields -->
          <div class="embedded-fields">
            <div class="embedded-field-row">
              <span class="field-name" style="color: #cbd5e1;"><span class="field-key-fk">🔗</span> product</span>
              <span class="field-type" style="color: #94a3b8;">ObjectId (Ref)</span>
            </div>
            <div class="embedded-field-row">
              <span class="field-name" style="color: #cbd5e1;">quantity</span>
              <span class="field-type" style="color: #94a3b8;">Number</span>
            </div>
          </div>

          <div class="field-row">
            <span class="field-name">totalAmount</span>
            <span class="field-type">Number</span>
          </div>
          <div class="field-row">
            <span class="field-name">status</span>
            <span class="field-type">String (Enum)</span>
          </div>
          <div class="field-row">
            <span class="field-name">createdAt</span>
            <span class="field-type">Date</span>
          </div>
          <div class="field-row">
            <span class="field-name">updatedAt</span>
            <span class="field-type">Date</span>
          </div>
        </div>
      </div>

      <!-- Product Model -->
      <div class="db-table table-product" style="margin-top: 20px;">
        <div class="db-table-header">
          <span>Product</span>
          <span class="table-type">Collection</span>
        </div>
        <div class="db-table-fields">
          <div class="field-row">
            <span class="field-name"><span class="field-key-pk">🔑</span> _id</span>
            <span class="field-type">ObjectId</span>
          </div>
          <div class="field-row">
            <span class="field-name">name</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">category</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">description</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">price</span>
            <span class="field-type">Number</span>
          </div>
          <div class="field-row">
            <span class="field-name">stock</span>
            <span class="field-type">Number</span>
          </div>
          <div class="field-row">
            <span class="field-name">image</span>
            <span class="field-type">String</span>
          </div>
          <div class="field-row">
            <span class="field-name">createdAt</span>
            <span class="field-type">Date</span>
          </div>
          <div class="field-row">
            <span class="field-name">updatedAt</span>
            <span class="field-type">Date</span>
          </div>
        </div>
      </div>
    </div>
  </div>

</body>
</html>
`;

async function run() {
  const tempDir = path.join(__dirname, "temp_diagram");
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  const tempHtmlPath = path.join(tempDir, "diagram.html");
  fs.writeFileSync(tempHtmlPath, htmlContent, "utf8");

  console.log("Launching browser for diagram capture...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 750, deviceScaleFactor: 2 }); // High DPI capture

  await page.goto("file://" + tempHtmlPath, { waitUntil: "networkidle2" });
  
  // Find the container element
  const container = await page.$(".container");
  
  console.log("Taking screenshot of schema diagram...");
  await container.screenshot({ path: OUTPUT_PNG_PATH });
  console.log(`PNG schema diagram saved to ${OUTPUT_PNG_PATH}`);

  console.log("Printing schema diagram PDF...");
  await page.pdf({
    path: OUTPUT_PDF_PATH,
    width: "1200px",
    height: "850px",
    printBackground: true,
    margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" }
  });
  console.log(`PDF schema diagram saved to ${OUTPUT_PDF_PATH}`);

  await browser.close();

  // Clean up
  fs.rmSync(tempDir, { recursive: true, force: true });
  console.log("Temporary diagram files cleaned up.");
}

run().catch((err) => {
  console.error("Schema diagram generation failed:", err);
  process.exit(1);
});
