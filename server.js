import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('this is working');
});

app.listen(3001, () => {
  console.log('App is running on port 3001');
});
/*
/signin --> POST = success/fail
/register --> POST = user
/profile/:id --> GET = user
/image --> PUT --> user
*/
