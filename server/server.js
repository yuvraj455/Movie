const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors({ origin: 'https://moviehub-1-4tzm.onrender.com', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Passport configuration (LocalStrategy and GoogleStrategy)
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return done(null, false, { message: 'Incorrect email or password.' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect email or password.' });
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://moviehub-hfvs.onrender.com/auth/google/callback'
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
}
));

// Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

app.use('/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Catch-all route to return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));