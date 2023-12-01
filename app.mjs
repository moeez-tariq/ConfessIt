import './config.mjs';
import './db.mjs';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import flash from 'connect-flash';

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import hbs from 'hbs';

import session from 'express-session';

const app = express();

const User = mongoose.model('User');
const Diary = mongoose.model('Diary');
const DiaryEntry = mongoose.model('DiaryEntry');
const Confession = mongoose.model('Confession');
const Feedback = mongoose.model('Feedback');

const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'secret cookie',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));
app.use(flash());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));

app.get('/signup', (req, res) => {
    res.render('signup');
});
  
app.post('/signup', async (req, res) => {
  const { username, name, password } = req.body;

  const MIN_PASSWORD_LENGTH = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.render('signup', { error: 'Username is already taken. Please try again!' });
      }

      if (password.length < MIN_PASSWORD_LENGTH || !hasUpperCase || !hasNumber) {
        return res.render('signup', { error: 'Invalid Password Format. Password must be at least 8 characters long and must contain at least 1 uppercase and 1 digit.' });
    }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User({
          username,
          name,
          hash: hashedPassword,
          diary: null,
          confessions: [],
      });

      await newUser.save();

      const newDiary = new Diary({
          user: newUser.id,
          entries: [],
      });

      await newDiary.save();

      newUser.diary = newDiary.id;
      await newUser.save();

      res.redirect('/signin');
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
  
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.hash);
  
        if (passwordMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      } catch (error) {
        return done(error);
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
      done(error);
    }
  });
  
  app.use(passport.initialize());
  app.use(passport.session());


const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/signin');
    }
};

  
app.post('/signin', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/signin',
  failureFlash: true
}));

app.get('/signin', (req, res) => {
  const messages = req.flash();
  if (messages.error !== undefined) {
    console.log('here');
    messages.error = messages.error + '. Enter valid username and password.';
  }
  res.render('signin', { messages });
});

app.get('/home', isAuthenticated, (req, res) => {
    res.render('home');
});

app.get('/', (req, res) => {
    res.render('mainPage');
});

app.get('/confessions', isAuthenticated, async (req, res) => {
    const confessions = await Confession.find().sort({ timestamp: -1 }).populate('user');
    res.render('confessions', { confessions });
});

app.get('/addConfession', isAuthenticated, (req, res) => {
    res.render('addConfession');
});

app.post('/addConfession', isAuthenticated, async (req, res) => {
    const { content } = req.body;
    const confession = new Confession({
        user: req.user.id,
        content,
    });
    await confession.save();
    res.redirect('/confessions');
});

app.get('/diary', isAuthenticated, async (req, res) => {
    const diary = await Diary.findOne({ user: req.user.id }).populate('entries');
    diary.entries.sort((a, b) => b.timestamp - a.timestamp);
    res.render('diary', { diary });
});

app.get('/addDay', isAuthenticated, (req, res) => {
    res.render('addDay');
});

app.post('/addDay', isAuthenticated, async (req, res) => {
    const { content } = req.body;
    const newEntry = new DiaryEntry({
        content,
    });
    await newEntry.save();
    const diary = await Diary.findOne({ user: req.user.id });
    diary.entries.push(newEntry);
    await diary.save();
    res.redirect('/diary');
});

app.post('/likeConfession/:id', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const confessionId = req.params.id;

    const user = await User.findById(userId);
    if (user.dislikedConfessions.includes(confessionId)) {
      const confession = await Confession.findById(confessionId);
      confession.likes += 1;
      confession.dislikes -= 1;

      await confession.save();
      user.dislikedConfessions = user.dislikedConfessions.filter(id => id.toString() !== confessionId);
      user.likedConfessions.push(confessionId);

      await user.save();

      return res.redirect('/confessions');
    }

    if (!user.likedConfessions.includes(confessionId)) {
      const confession = await Confession.findById(confessionId);

      confession.likes += 1;
      await confession.save();
      user.likedConfessions.push(confessionId);
      await user.save();

      return res.redirect('/confessions');
    }

    return res.redirect('/confessions');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/dislikeConfession/:id', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const confessionId = req.params.id;

    const user = await User.findById(userId);

    if (user.likedConfessions.includes(confessionId)) {
      const confession = await Confession.findById(confessionId);
      confession.likes -= 1;
      confession.dislikes += 1;

      await confession.save();

      user.likedConfessions = user.likedConfessions.filter(id => id.toString() !== confessionId);
      user.dislikedConfessions.push(confessionId);

      await user.save();

      return res.redirect('/confessions');
    }

    if (!user.dislikedConfessions.includes(confessionId)) {
      const confession = await Confession.findById(confessionId);

      confession.dislikes += 1;

      await confession.save();
      user.dislikedConfessions.push(confessionId);
      await user.save();
      return res.redirect('/confessions');
    }

    return res.redirect('/confessions');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/feedback', isAuthenticated, async (req, res) => {
  try {
    const allFeedbacks = await Feedback.find().sort({ timestamp: -1 });
    res.render('feedback', { allFeedbacks });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/feedback', isAuthenticated, async (req, res) => {
  const { content } = req.body;

  try {
    const newFeedback = new Feedback({
      user: req.user.id,
      content,
    });

    await newFeedback.save();

    const user = await User.findById(req.user.id);
    user.feedbacks.push(newFeedback.id);
    await user.save();

    res.redirect('/feedback');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});


app.listen(process.env.PORT);
