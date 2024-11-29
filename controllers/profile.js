const handleGetProfile = (req, res, db) => {
  const { id } = req.params;
  let found = false;
  db('users')
    .select('*')
    .from('users')
    .where({
      id: id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json('User not found.');
      }
    })
    .catch((err) => console.log(err));
  // if (!found) {
  //   res.status(404).json('User not found.');
  // }
};

export { handleGetProfile };
