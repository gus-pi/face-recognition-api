import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import { handleRegister } from './controllers/register.js';
import { handleSignIn } from './controllers/signin.js';
import { handleGetProfile } from './controllers/profile.js';
import { handleClarifai, handleImage } from './controllers/image.js';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'admin',
    database: 'smart-brain',
  },
});

const app = express();

app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  db.select('*')
    .from('users')
    .then((users) => res.json(users))
    .catch((err) => console.log(err));
});

app.post('/signin', (req, res) => {
  handleSignIn(req, res, db, bcrypt);
});

app.post('/register', (req, res) => {
  handleRegister(req, res, db, bcrypt);
});

app.get('/profile/:id', (req, res) => {
  handleGetProfile(req, res, db);
});

app.put('/image', (req, res) => {
  handleImage(req, res, db);
});

app.post('/image', (req, res) => {
  handleClarifai(req, res);
});

app.listen(3001, () => {
  console.log('App is running on port 3001');
});
