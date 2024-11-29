const handleRegister = async (req, res, db, bcrypt) => {
  const { name, email, password } = req.body;

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  db.transaction((trx) => {
    trx
      .insert({
        hash: hashedPassword,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        trx('users')
          .returning('*')
          .insert({
            name: name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json('Unable to register'));
};

export { handleRegister };
