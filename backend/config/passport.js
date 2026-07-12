const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "placeholder_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_secret",
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already has googleId linked
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // 2. Check if user exists by email
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : "";
        
        if (email) {
          user = await User.findOne({ email });
        }

        if (user) {
          // Link google account to existing local account
          user.googleId = profile.id;
          if (!user.avatar) {
            user.avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : "";
          }
          await user.save();
          return done(null, user);
        }

        // 3. Create a brand new Google user
        user = await User.create({
          name: profile.displayName || "Google User",
          email: email,
          googleId: profile.id,
          avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : "",
          role: "user",
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
