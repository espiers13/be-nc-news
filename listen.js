const app = require("./app/server");

const { PORT = 9090 } = process.env;

app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  } else console.log(`listening on ${PORT}...`);
});

// app.listen(PORT, () => console.log(`Listening on ${PORT}...`));
