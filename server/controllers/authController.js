const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require("bcryptjs");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "596079188368-2hh5360q26vpb2c4dv9tm3vv3v4jsiso.apps.googleusercontent.com");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id,
      email: user.email,
      username: user.username
    },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" }
  );
};

// Register new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Enhanced input validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        status: 'error',
        message: "All fields are required",
        details: {
          username: !username ? "Username is required" : null,
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: "Invalid email format"
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: "Password must be at least 6 characters long"
      });
    }

    // Check if user already exists with more specific error messages
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        status: 'error',
        message: "Email already registered",
        field: "email"
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({
        status: 'error',
        message: "Username already taken",
        field: "username"
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Only try to send welcome email if email configuration exists
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Welcome to PennyPlan!',
          html: `
            <h1>Welcome to PennyPlan!</h1>
            <p>Thank you for registering with us. Your account has been successfully created.</p>
            <p>You can now start managing your finances effectively with our tools.</p>
          `
        };
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error("Error sending welcome email:", emailError);
        // Don't fail registration if email fails
      }
    }

    res.status(201).json({
      status: 'success',
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        picture: user.picture
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        status: 'error',
        message: "Validation error",
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    // Handle other errors
    res.status(500).json({
      status: 'error',
      message: "Error registering user",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Enhanced input validation
    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error',
        message: "Email and password are required",
        details: {
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: "Invalid email format"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: "Invalid email or password" 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        status: 'error',
        message: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      status: 'success',
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        picture: user.picture
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      status: 'error',
      message: "Error logging in", 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Google OAuth callback
exports.googleCallback = async (req, res) => {
  try {
    const { user } = req;
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // If this is a new user, send welcome email
    if (user.createdAt && Date.now() - user.createdAt.getTime() < 1000) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Welcome to PennyPlan!',
        html: `
          <h1>Welcome to PennyPlan!</h1>
          <p>Thank you for signing up with Google. Your account has been successfully created.</p>
          <p>You can now start managing your finances effectively with our tools.</p>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

// Verify Google token
exports.verifyGoogleToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        message: "No token provided" 
      });
    }

    // Verify token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || "596079188368-2hh5360q26vpb2c4dv9tm3vv3v4jsiso.apps.googleusercontent.com"
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google data
      const username = name.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000);
      user = new User({
        username,
        email,
        googleId,
        picture,
        password: await bcrypt.hash(Math.random().toString(36), 10) // Random password for Google users
      });

      await user.save();
    } else {
      // Update existing user's Google data
      user.googleId = googleId;
      user.picture = picture;
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateToken(user);

    res.json({
      message: "Google authentication successful",
      token: jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error("Google verification error:", error);
    res.status(500).json({ 
      message: "Error verifying Google token", 
      error: error.message 
    });
  }
};

// Get total user count
exports.getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error getting user count:', error);
    res.status(500).json({ 
      message: "Error getting user count", 
      error: error.message 
    });
  }
};
