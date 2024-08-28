exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "42703") {
    res.status(400).send({ msg: "bad request" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: err.detail });
  } else next(err);
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  console.log(`SERVER ERROR: ${err}`);
  res.status(500).send({ msg: "server error" });
};
