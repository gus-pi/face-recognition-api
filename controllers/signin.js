const handleSignIn = (req, res, db, bcrypt) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('Incorrect form submission.');
  }
  db.select('email', 'hash')
    .from('login')
    .where({
      email: email,
    })
    .then(async (data) => {
      const isValid = await bcrypt.compare(password, data[0].hash);
      if (isValid) {
        db.select('*')
          .from('users')
          .where({
            email: email,
          })
          .then((user) => res.json(user[0]))
          .catch((err) => res.status(400).json('Unable to get user'));
      } else {
        res.status(400).json('Wrong credentials');
      }
    })
    .catch((err) => res.status(400).json('Wrong credentials'));
};

export { handleSignIn };
