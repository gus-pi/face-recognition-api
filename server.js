import express from 'express';
import bcrypt from 'bcrypt';
import cors from 'cors';
import knex from 'knex';

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

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('wrong email or password');
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  db('users')
    .returning('*')
    .insert({
      name: name,
      email: email,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json('Unable to register'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(404).json('User not found.');
  }
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json('User not found.');
  }
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
