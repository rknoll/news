export default () => {
  return (err, req, res, next) => {
    console.log(err);
    res.status(500).send({message: err && err.message || err});
  };
};
