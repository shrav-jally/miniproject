const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/v1/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }

      // If user doesn't exist, create new user
      const email = profile.emails[0].value;
      const existingEmail = await User.findOne({ email });

      if (existingEmail) {
        // If email exists but not with Google, link accounts
        existingEmail.googleId = profile.id;
        existingEmail.picture = profile.photos[0].value;
        await existingEmail.save();
        return done(null, existingEmail);
      }

      // Create new user
      user = new User({
        username: profile.displayName,
        email: email,
        googleId: profile.id,
        picture: profile.photos[0].value
      });

      await user.save();
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

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

module.exports = passport; 