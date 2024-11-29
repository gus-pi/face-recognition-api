const handleSignIn = (req, res, db, bcrypt) => {
  db.select('email', 'hash')
    .from('login')
    .where({
      email: req.body.email,
    })
    .then(async (data) => {
      const isValid = await bcrypt.compare(req.body.password, data[0].hash);
      if (isValid) {
        db.select('*')
          .from('users')
          .where({
            email: req.body.email,
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