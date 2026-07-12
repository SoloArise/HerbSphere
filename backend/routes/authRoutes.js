const express = require("express");
const passport = require("passport");
const { check } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { registerUser, loginUser, getCurrentUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const generateToken = require("../utils/generateToken");

const router = express.Router();

// Rate limiter for authentication endpoints: 5 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validators
const registerValidator = [
  check("name", "Name is required").not().isEmpty().trim(),
  check("email", "Please enter a valid email address").isEmail().normalizeEmail(),
  check("password", "Password must be at least 8 characters long").isLength({ min: 8 }),
];

const loginValidator = [
  check("email", "Please enter a valid email address").isEmail().normalizeEmail(),
  check("password", "Password is required").not().isEmpty(),
];

// Local Auth routes
router.post("/register", authLimiter, registerValidator, validateRequest, registerUser);
router.post("/login", authLimiter, loginValidator, validateRequest, loginUser);
router.get("/me", protect, getCurrentUser);

// Google OAuth routes
router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === "placeholder_id") {
    // Redirect to local mock consent screen
    return res.redirect("/api/auth/mock-google-consent");
  }
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

router.get("/mock-google-consent", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sign in - Google Accounts</title>
      <style>
        body { font-family: 'Roboto', arial, sans-serif; background-color: #f0f4f9; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .card { background: white; border-radius: 8px; width: 450px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border: 1px solid #dadce0; box-sizing: border-box; }
        .logo { display: flex; justify-content: center; margin-bottom: 20px; }
        h1 { font-size: 24px; font-weight: 400; text-align: center; color: #202124; margin: 0 0 8px; }
        p { font-size: 16px; text-align: center; color: #5f6368; margin: 0 0 30px; }
        .account-box { border: 1px solid #dadce0; border-radius: 4px; padding: 12px; display: flex; align-items: center; cursor: pointer; transition: background 0.2s; }
        .account-box:hover { background: #f8f9fa; }
        .avatar { width: 32px; height: 32px; border-radius: 50%; background: #4285F4; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 12px; }
        .details { flex: 1; }
        .name { font-weight: 500; font-size: 14px; color: #3c4043; }
        .email { font-size: 12px; color: #5f6368; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
        </div>
        <h1>Choose an account</h1>
        <p>to continue to <strong>HerbSphere</strong></p>
        <div class="account-box" onclick="location.href='/api/auth/google/callback?mock=true'">
          <div class="avatar">JD</div>
          <div class="details">
            <div class="name">John Doe</div>
            <div class="email">john.doe@gmail.com</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

router.get("/google/callback", (req, res, next) => {
  if (req.query.mock === "true") {
    // Handle mock login success
    const handleMockLogin = async () => {
      const User = require("../models/User");
      let user = await User.findOne({ email: "john.doe@gmail.com" });
      if (!user) {
        user = await User.create({
          name: "John Doe",
          email: "john.doe@gmail.com",
          googleId: "mock_google_id_123456",
          avatar: "",
          role: "user",
        });
      }
      const token = generateToken(user._id);
      res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard?token=${token}`);
    };
    return handleMockLogin().catch(next);
  }

  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL || "http://localhost:3000"}/login?error=oauth_failed`,
    session: false,
  })(req, res, next);
});

module.exports = router;
