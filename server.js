import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';
import { handleRegister } from './controllers/register.js';
import { handleSignIn } from './controllers/signin.js';
import { handleGetProfile } from './controllers/profile.js';
import { handleImage } from './controllers/image.js';

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

const CLARIFAI_API_URL =
  'https://api.clarifai.com/v2/models/face-detection/outputs';
const PAT = '5c99ecce9bc84da98b455273e6bf1358';

app.post('/clarifai', async (req, res) => {
  const { imageUrl } = req.body;
  const raw = JSON.stringify({
    user_app_id: { user_id: 'ci84gqtwtwmy', app_id: 'test' },
    inputs: [{ data: { image: { url: imageUrl } } }],
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Key ${PAT}`,
    },
    body: raw,
  };

  try {
    const response = await fetch(CLARIFAI_API_URL, requestOptions);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch from Clarifai API' });
  }
});

app.listen(3001, () => {
  console.log('App is running on port 3001');
});
