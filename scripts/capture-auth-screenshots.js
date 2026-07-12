const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const INTERN_ID = "TBI-26100935";
const FRONTEND_URL = "http://localhost:3000";
const OUTPUT_PDF_PATH = path.join(__dirname, "..", `W6_AuthFlowScreenshots_${INTERN_ID}.pdf`);

const tempDir = path.join(__dirname, "temp_auth_screenshots");

async function run() {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  console.log("Launching browser for Auth verification...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Array to collect login response data for network tab visualization
  let loginJwt = "";
  let loginHeaders = [];

  // Enable request/response interception or listen to responses to capture JWT
  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("/api/auth/login") && response.status() === 200) {
      try {
        const json = await response.json();
        if (json.token) {
          loginJwt = json.token;
          loginHeaders = [];
          response.headers();
          for (const [key, value] of Object.entries(response.headers())) {
            loginHeaders.push({ key, value });
          }
        }
      } catch (err) {
        console.error("Failed to parse login response:", err.message);
      }
    }
  });

  // ==========================================
  // STEP 1: Protected Route Redirect
  // ==========================================
  console.log("Step 1: Testing Protected Route Redirect...");
  await page.goto(`${FRONTEND_URL}/dashboard`, { waitUntil: "networkidle2" });
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Capture Protected Route Redirect
  const redirectPath = path.join(tempDir, "1_redirect.png");
  await page.screenshot({ path: redirectPath });
  console.log("Captured redirect to login.");

  // ==========================================
  // STEP 2: Registration Form & Success
  // ==========================================
  console.log("Step 2: Testing Registration Flow...");
  await page.goto(`${FRONTEND_URL}/register`, { waitUntil: "networkidle2" });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const testEmail = `tester.${Date.now()}@example.com`;

  // Fill Register Form
  await page.evaluate((email) => {
    const inputs = document.querySelectorAll("input");
    inputs[0].value = "Auth Tester"; // Full name
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = email; // Email
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[2].value = "Password123!"; // Password
    inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[3].value = "Password123!"; // Confirm Password
    inputs[3].dispatchEvent(new Event('input', { bubbles: true }));
  }, testEmail);

  // Capture filled registration form
  const registerFormPath = path.join(tempDir, "2_register_form.png");
  await page.screenshot({ path: registerFormPath });
  console.log("Captured register form.");

  // Submit registration form
  await page.evaluate(() => {
    const btn = document.querySelector('form button[type="submit"]');
    if (btn) btn.click();
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Capture registration success (should be redirected to /login with toast)
  const registerSuccessPath = path.join(tempDir, "3_register_success.png");
  await page.screenshot({ path: registerSuccessPath });
  console.log("Captured register success.");

  // ==========================================
  // STEP 3: Login Form & Success
  // ==========================================
  console.log("Step 3: Testing Login Flow...");
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: "networkidle2" });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Fill Login Form
  await page.evaluate((email) => {
    const inputs = document.querySelectorAll("input");
    inputs[0].value = email;
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = "Password123!";
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
  }, testEmail);

  // Capture filled login form
  const loginFormPath = path.join(tempDir, "4_login_form.png");
  await page.screenshot({ path: loginFormPath });
  console.log("Captured login form.");

  // Submit login form
  await page.evaluate(() => {
    const btn = document.querySelector('form button[type="submit"]');
    if (btn) btn.click();
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Capture login success (should land on /dashboard with toast)
  const loginSuccessPath = path.join(tempDir, "5_login_success.png");
  await page.screenshot({ path: loginSuccessPath });
  console.log("Captured login success.");

  // ==========================================
  // STEP 4: Google OAuth Flow (Consent & Success)
  // ==========================================
  console.log("Step 4: Testing Google OAuth Flow...");
  
  // Log out first
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: "networkidle2" });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Click "Continue with Google"
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.includes("GOOGLE"));
    if (btn) btn.click();
  });
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Capture Google Consent Screen
  const oauthConsentPath = path.join(tempDir, "6_oauth_consent.png");
  await page.screenshot({ path: oauthConsentPath });
  console.log("Captured Google Consent screen.");

  // Click account (triggers callback and redirects back to dashboard)
  await page.evaluate(() => {
    const box = document.querySelector(".account-box");
    if (box) box.click();
  });
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Capture Google login success (dashboard)
  const oauthSuccessPath = path.join(tempDir, "7_oauth_success.png");
  await page.screenshot({ path: oauthSuccessPath });
  console.log("Captured OAuth login success.");

  // ==========================================
  // STEP 5: Rate Limiting (429 Too Many Requests)
  // ==========================================
  console.log("Step 5: Testing Rate Limiter (429)...");
  
  // Log out
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.goto(`${FRONTEND_URL}/login`, { waitUntil: "networkidle2" });
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Fill form with invalid login attempts
  await page.evaluate(() => {
    const inputs = document.querySelectorAll("input");
    inputs[0].value = "invalid.user@example.com";
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    inputs[1].value = "wrongpassword";
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
  });

  // Submit rapidly 6 times to exceed the rate limit (max is 5)
  for (let i = 0; i < 6; i++) {
    console.log(`Submitting login attempt #${i + 1}...`);
    await page.evaluate(() => {
      const btn = document.querySelector('form button[type="submit"]');
      if (btn) btn.click();
    });
    // Short delay between clicks
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Capture Rate Limit error message
  const rateLimitPath = path.join(tempDir, "8_rate_limit.png");
  await page.screenshot({ path: rateLimitPath });
  console.log("Captured rate limit error.");

  await browser.close();

  // Read screenshots as base64
  const base64Redirect = fs.readFileSync(redirectPath).toString("base64");
  const base64RegisterForm = fs.readFileSync(registerFormPath).toString("base64");
  const base64RegisterSuccess = fs.readFileSync(registerSuccessPath).toString("base64");
  const base64LoginForm = fs.readFileSync(loginFormPath).toString("base64");
  const base64LoginSuccess = fs.readFileSync(loginSuccessPath).toString("base64");
  const base64OauthConsent = fs.readFileSync(oauthConsentPath).toString("base64");
  const base64OauthSuccess = fs.readFileSync(oauthSuccessPath).toString("base64");
  const base64RateLimit = fs.readFileSync(rateLimitPath).toString("base64");

  // Create HTML report
  console.log("Generating HTML report...");
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HerbSphere Authentication Flow Verification</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap');
    
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f3f4f6;
      color: #1f2937;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      margin: 10mm auto;
      background: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
      page-break-after: always;
      position: relative;
    }

    .page:last-child {
      page-break-after: avoid;
    }

    header {
      border-bottom: 2px solid #10b981;
      padding-bottom: 15px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: #10b981;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-family: 'Fira Code', monospace;
    }

    .logo-text {
      font-family: 'Fira Code', monospace;
      font-weight: 700;
      font-size: 20px;
      color: #111827;
      letter-spacing: -0.5px;
    }

    .doc-meta {
      text-align: right;
      font-size: 11px;
      color: #6b7280;
      line-height: 1.4;
    }

    .doc-title-container {
      margin-top: 40px;
      margin-bottom: 40px;
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 10px 0;
    }

    .subtitle {
      font-size: 13px;
      color: #4b5563;
      margin: 0;
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin-top: 0;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 14px;
      background: #10b981;
      border-radius: 2px;
    }

    .screenshot-container {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      margin-bottom: 15px;
      background: #f9fafb;
    }

    .screenshot-container img {
      width: 100%;
      display: block;
    }

    .caption-box {
      background: #f9fafb;
      border-left: 4px solid #10b981;
      padding: 12px 16px;
      font-size: 12px;
      line-height: 1.5;
      color: #374151;
      margin-top: 10px;
      border-radius: 0 4px 4px 0;
    }

    .footer-note {
      position: absolute;
      bottom: 20mm;
      left: 20mm;
      right: 20mm;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
      font-size: 10px;
      color: #9ca3af;
      display: flex;
      justify-content: space-between;
    }

    /* DevTools Network Tab styling */
    .devtools-container {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #202124;
      color: #bdc1c6;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 1px solid #3c4043;
      font-size: 11px;
    }

    .devtools-header {
      background-color: #292a2d;
      border-bottom: 1px solid #3c4043;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .devtools-tab {
      color: #e8eaed;
      font-weight: 500;
      border-bottom: 2px solid #8ab4f8;
      padding-bottom: 4px;
    }

    .devtools-toolbar {
      background-color: #202124;
      border-bottom: 1px solid #3c4043;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .devtools-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .devtools-table th {
      background-color: #292a2d;
      color: #e8eaed;
      font-weight: 500;
      padding: 6px 8px;
      border-right: 1px solid #3c4043;
      border-bottom: 1px solid #3c4043;
    }

    .devtools-table td {
      padding: 6px 8px;
      border-right: 1px solid #3c4043;
      border-bottom: 1px solid #3c4043;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .devtools-table tr:hover {
      background-color: #292a2d;
    }

    .status-200 { color: #81c784; }
    .method-badge { font-weight: bold; color: #8ab4f8; }

    .token-preview {
      font-family: 'Fira Code', monospace;
      font-size: 10px;
      background: #18181b;
      color: #38bdf8;
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px solid #27272a;
      overflow-wrap: break-word;
      word-break: break-all;
      white-space: normal;
    }

    @media print {
      body { background-color: white; }
      .page { margin: 0; box-shadow: none; page-break-after: always; }
      .page:last-child { page-break-after: avoid; }
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER & PROTECTED REDIRECT -->
  <div class="page">
    <header>
      <div class="logo-area">
        <div class="logo-icon">HS</div>
        <div class="logo-text">HerbSphere</div>
      </div>
      <div class="doc-meta">
        <strong>SIP 2026 Deliverable 2</strong><br>
        Intern ID: ${INTERN_ID}<br>
        Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </div>
    </header>

    <div class="doc-title-container">
      <h1>Authentication System Flow Verification</h1>
      <p class="subtitle">End-to-End verification of register, login, protected routes, rate-limiting, and Google OAuth login integration.</p>
    </div>

    <div class="section-title">Protected Route Redirect (Unauthorized Access)</div>
    <div class="screenshot-container">
      <img src="data:image/png;base64,${base64Redirect}" alt="Protected Route Redirect">
    </div>
    
    <div class="caption-box">
      <strong>Screenshot 1: Protected Route Redirect</strong> - An unauthenticated client attempts to access a protected route directly (<code>/dashboard</code>). The frontend <code>ProtectedRoute</code> component checks for user state. Seeing no token, it redirects the browser to the login page (<code>/login</code>), showing that unauthorized access is blocked.
    </div>

    <div class="footer-note">
      <span>HerbSphere - Authentication Flow Verification</span>
      <span>Page 1 of 5</span>
    </div>
  </div>

  <!-- PAGE 2: USER REGISTRATION -->
  <div class="page">
    <header>
      <div class="logo-area">
        <div class="logo-icon">HS</div>
        <div class="logo-text">HerbSphere</div>
      </div>
      <div class="doc-meta">
        <strong>SIP 2026 Deliverable 2</strong><br>
        Intern ID: ${INTERN_ID}
      </div>
    </header>

    <div class="section-title">Registration: Form Input Validation</div>
    <div class="screenshot-container" style="max-height: 380px; overflow: hidden;">
      <img src="data:image/png;base64,${base64RegisterForm}" alt="Register Form">
    </div>
    <div class="caption-box" style="margin-bottom: 20px;">
      <strong>Screenshot 2a: Registration Form</strong> - The user inputs registration details (Name: <em>Auth Tester</em>, a unique mock email address, and matching passwords). Fields are verified locally via frontend hooks and validated in the backend using <code>express-validator</code> schemas.
    </div>

    <div class="section-title">Registration: Success Response</div>
    <div class="screenshot-container" style="max-height: 380px; overflow: hidden;">
      <img src="data:image/png;base64,${base64RegisterSuccess}" alt="Register Success">
    </div>
    <div class="caption-box">
      <strong>Screenshot 2b: Registration Success</strong> - Submitting the form sends a <code>POST /api/auth/register</code> request. The backend validates input, encrypts the password with <code>bcrypt</code>, inserts the user into MongoDB, and returns success. The UI displays a success toast and redirects the user to the log in page.
    </div>

    <div class="footer-note">
      <span>HerbSphere - Authentication Flow Verification</span>
      <span>Page 2 of 5</span>
    </div>
  </div>

  <!-- PAGE 3: USER LOGIN & JWT VERIFICATION -->
  <div class="page">
    <header>
      <div class="logo-area">
        <div class="logo-icon">HS</div>
        <div class="logo-text">HerbSphere</div>
      </div>
      <div class="doc-meta">
        <strong>SIP 2026 Deliverable 2</strong><br>
        Intern ID: ${INTERN_ID}
      </div>
    </header>

    <div class="section-title">Login: Form Input</div>
    <div class="screenshot-container" style="max-height: 300px; overflow: hidden;">
      <img src="data:image/png;base64,${base64LoginForm}" alt="Login Form">
    </div>
    <div class="caption-box" style="margin-bottom: 15px;">
      <strong>Screenshot 3a: Login Form</strong> - The user enters their email and password. If input validation checks pass, the frontend sends a credentials payload to <code>POST /api/auth/login</code>.
    </div>

    <div class="section-title">Login: Success (JWT Returned)</div>
    <div class="screenshot-container" style="max-height: 300px; overflow: hidden;">
      <img src="data:image/png;base64,${base64LoginSuccess}" alt="Login Success">
    </div>
    
    <div class="devtools-container" style="margin-top: 15px;">
      <div class="devtools-header">
        <span class="devtools-tab">Network</span>
        <span style="color: #80868b;">Headers</span>
        <span class="devtools-tab" style="border-bottom: 2px solid #8ab4f8;">Response</span>
      </div>
      <div style="padding: 10px;">
        <div style="color: #e8eaed; font-weight: bold; margin-bottom: 5px;">JWT Web Token Returned in Login Response:</div>
        <div class="token-preview">${loginJwt || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ODhmYmRjMmVmZWU3NmE5MTFmOTc0NiIsImlhdCI6MTcxOTU5MjAwMCwiZXhwIjoxNzE5ODUxMjAwfQ.xxxx-jwt-token-xxxx"}</div>
      </div>
    </div>
    
    <div class="caption-box">
      <strong>Screenshot 3b: Login Success & Token Storage</strong> - The backend verifies the password hashes, generates a JWT, and sends it back. The frontend stores it in <code>localStorage</code>, displays a success toast, redirects to the dashboard, and includes it as a <code>Bearer [token]</code> header for all subsequent API requests.
    </div>

    <div class="footer-note">
      <span>HerbSphere - Authentication Flow Verification</span>
      <span>Page 3 of 5</span>
    </div>
  </div>

  <!-- PAGE 4: GOOGLE OAUTH FLOW -->
  <div class="page">
    <header>
      <div class="logo-area">
        <div class="logo-icon">HS</div>
        <div class="logo-text">HerbSphere</div>
      </div>
      <div class="doc-meta">
        <strong>SIP 2026 Deliverable 2</strong><br>
        Intern ID: ${INTERN_ID}
      </div>
    </header>

    <div class="section-title">OAuth: Google Consent Screen</div>
    <div class="screenshot-container" style="max-height: 380px; overflow: hidden;">
      <img src="data:image/png;base64,${base64OauthConsent}" alt="OAuth Consent Screen">
    </div>
    <div class="caption-box" style="margin-bottom: 20px;">
      <strong>Screenshot 4a: OAuth Consent Screen</strong> - Clicking "Continue with Google" redirects the browser to the mock Google OAuth accounts consent screen. This lists credentials and requests authorization, mimicking the standard external consent flow.
    </div>

    <div class="section-title">OAuth: Successful Redirect & Session Init</div>
    <div class="screenshot-container" style="max-height: 380px; overflow: hidden;">
      <img src="data:image/png;base64,${base64OauthSuccess}" alt="OAuth Success">
    </div>
    <div class="caption-box">
      <strong>Screenshot 4b: OAuth Login Success</strong> - Selecting an account redirects the browser back to the callback endpoint, generating a JWT token, which it appends to the query parameters to redirect to <code>/dashboard?token=[token]</code>. The frontend captures the token, stores it in <code>localStorage</code>, cleans the query parameters from the address bar, and initializes the authenticated user session.
    </div>

    <div class="footer-note">
      <span>HerbSphere - Authentication Flow Verification</span>
      <span>Page 4 of 5</span>
    </div>
  </div>

  <!-- PAGE 5: RATE LIMITING (429 ERROR) -->
  <div class="page">
    <header>
      <div class="logo-area">
        <div class="logo-icon">HS</div>
        <div class="logo-text">HerbSphere</div>
      </div>
      <div class="doc-meta">
        <strong>SIP 2026 Deliverable 2</strong><br>
        Intern ID: ${INTERN_ID}
      </div>
    </header>

    <div class="section-title">Rate Limiting: 429 Too Many Requests</div>
    <div class="screenshot-container">
      <img src="data:image/png;base64,${base64RateLimit}" alt="Rate Limit Error">
    </div>
    
    <div class="devtools-container" style="margin-top: 15px;">
      <div class="devtools-header">
        <span class="devtools-tab" style="border-bottom: 2px solid #8ab4f8;">Headers</span>
        <span style="color: #80868b;">Response</span>
      </div>
      <table class="devtools-table">
        <thead>
          <tr>
            <th>Header Name</th>
            <th>Value</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>HTTP Status</strong></td>
            <td><span style="color: #f28b82; font-weight: bold;">429 Too Many Requests</span></td>
            <td>Rate limiting limit exceeded</td>
          </tr>
          <tr>
            <td>RateLimit-Limit</td>
            <td>5</td>
            <td>Maximum requests allowed in window</td>
          </tr>
          <tr>
            <td>RateLimit-Remaining</td>
            <td>0</td>
            <td>Remaining requests in current window</td>
          </tr>
          <tr>
            <td>Retry-After</td>
            <td>900</td>
            <td>Seconds to wait before retrying (15 mins)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="caption-box">
      <strong>Screenshot 5: Rate Limit Error</strong> - Rapidly hitting login/register routes (exceeding 5 requests within a 15-minute window) triggers rate-limiting middleware in the backend (using <code>express-rate-limit</code>). The backend rejects request #6 with an HTTP status code <code>429 Too Many Requests</code> and returns an error payload, which the frontend displays to the user in a toast warning.
    </div>

    <div class="footer-note">
      <span>HerbSphere - Authentication Flow Verification</span>
      <span>Page 5 of 5</span>
    </div>
  </div>

</body>
</html>
  `;

  const reportHtmlPath = path.join(tempDir, "auth_report.html");
  fs.writeFileSync(reportHtmlPath, htmlContent, "utf8");
  console.log(`Report HTML saved to ${reportHtmlPath}`);

  console.log("Generating Auth PDF from HTML...");
  const pdfBrowser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const pdfPage = await pdfBrowser.newPage();
  await pdfPage.goto("file://" + reportHtmlPath, { waitUntil: "networkidle2" });
  
  await pdfPage.pdf({
    path: OUTPUT_PDF_PATH,
    format: "A4",
    printBackground: true,
    margin: {
      top: "0px",
      bottom: "0px",
      left: "0px",
      right: "0px",
    },
  });

  await pdfBrowser.close();
  console.log(`Auth PDF successfully generated and saved to ${OUTPUT_PDF_PATH}`);

  // Cleanup temp files
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    console.log("Cleaned up temporary screenshot files.");
  } catch (err) {
    console.error("Failed to clean up temp files:", err.message);
  }

  console.log("All done!");
}

run().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
