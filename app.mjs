import './config.mjs';
import './db.mjs';

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import hbs from 'hbs';

const session = require('express-session');
const sessionOptions = {
    secret: process.env.SESSION_SECRET || 'secret cookie',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// configure templating to hbs
app.set('view engine', 'hbs');

// body parser (req.body)
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('mainPage');
});
  
app.listen(process.env.PORT || 3000);