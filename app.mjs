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

import { DiaryManager, ConfessionManager } from './classes.mjs';

import session from 'express-session';

const app = express();

const User = mongoose.model('User');
const Diary = mongoose.model('Diary');
const DiaryEntry = mongoose.model('DiaryEntry');
const Confession = mongoose.model('Confession');
const Feedback = mongoose.model('Feedback');

const sessionOptions = {
    secret: process.env.SESSION_SECRET,
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
  let { username, name, password } = req.body;
  username = username.toLowerCase();
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

      const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
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
      username = username.toLowerCase()
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
  const confessionManager = new ConfessionManager('user');
  const confessions = await confessionManager.getAllConfessions();
  res.render('confessions', { confessions });
});

app.get('/addConfession', isAuthenticated, (req, res) => {
    res.render('addConfession');
});

app.post('/addConfession', isAuthenticated, async (req, res) => {
    const { content } = req.body;
    const confessionManager = new ConfessionManager('user');
    await confessionManager.addConfession(req.user.id, content);
    res.redirect('/confessions');
});

app.get('/diary', isAuthenticated, async (req, res) => {
    const diary = await Diary.findOne({ user: req.user.id }).populate('entries');
    const diaryManager = new DiaryManager(diary);
    const sortedEntries = diaryManager.getSortedEntries();
    res.render('diary', { diary });
});

app.get('/addDay', isAuthenticated, (req, res) => {
    res.render('addDay');
});

app.post('/addDay', isAuthenticated, async (req, res) => {
    const { content } = req.body;
    const diary = await Diary.findOne({ user: req.user.id });
    const diaryManager = new DiaryManager(diary);
    await diaryManager.addEntry(content);
    res.redirect('/diary');
});

// app.post('/likeConfession/:id', isAuthenticated, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const confessionId = req.params.id;

//     const user = await User.findById(userId);
//     const confessionManager = new ConfessionManager('user');
//     const liked = await confessionManager.likeConfession(user, confessionId);

//     return res.redirect('/confessions');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });


// app.post('/dislikeConfession/:id', isAuthenticated, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const confessionId = req.params.id;

//     const user = await User.findById(userId);
//     const confessionManager = new ConfessionManager('user');
//     const disliked = await confessionManager.dislikeConfession(user, confessionId);

//     return res.redirect('/confessions');
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

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