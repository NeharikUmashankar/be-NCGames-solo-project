exports.handleErrorCodes = (err, req, res, next) => {
  if (["22P02"].includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Entry not found" });
  } else if (err.msg != undefined) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle404s = (err, req, res, next) => {
  if (err.message !== undefined) {
    res.status(404).send({ msg: "ID not found" });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal server error" });
};

exports.handleBadPath = (req, res) => {
  res.status(404).send({ msg: "Path not found" });
};
