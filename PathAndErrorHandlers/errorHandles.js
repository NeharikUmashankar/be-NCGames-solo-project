exports.handle400s = (err, req, res, next) => {
  if (["22P02"].includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handle404s = (err, req, res, next) => {
  if (err.message !== undefined) {
    res.status(404).send({ msg: "Path not found" });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};

exports.handleBadPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};
