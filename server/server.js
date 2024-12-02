const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const LocalStrategy = require('passport-local').Strategy;
const bcryptjs = require('bcryptjs'); // Using bcryptjs instead of bcrypt
const User = require('./models/User');
const path = require('path');

const app = express();

// Middleware
app.use(cors({ origin: 'https://movie-1-gyg3.onrender.com', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Local Strategy Configuration
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: 'Incorrect email or password.' });
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect email or password.' });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Only configure Google Strategy if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const GoogleStrategy = require('passport-google-oauth20').Strategy;
  
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://movie-tfrt.onrender.com/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
        }).save();
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));
} else {
  console.log('Google OAuth credentials not found. Google authentication will be disabled.');
}

// Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

app.use('/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));