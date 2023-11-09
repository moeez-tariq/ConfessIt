import './config.mjs';
import './db.mjs';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

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

const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'secret cookie',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));

app.get('/signup', (req, res) => {
    res.render('signup');
});
  
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          return res.redirect('/signup?error=Username%20is%20already%20taken');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
        username,
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
  
app.get('/signin', (req, res) => {
    res.render('signin');
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
  
        // Compare the provided password with the stored hashed password
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
    done(null, user.id); // Store user id in the session
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
    failureRedirect: '/signin'
}));

app.get('/home', isAuthenticated, (req, res) => {
    res.render('home');
});

app.get('/', (req, res) => {
    res.render('mainPage');
});

app.get('/confessions', isAuthenticated, async (req, res) => {
    const confessions = await Confession.find().populate('user');
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
app.listen(process.env.PORT || 3000);
//added a comment 2

//added a comment

