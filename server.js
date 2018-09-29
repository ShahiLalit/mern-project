const express = require('express');
const app = express();
const port = process.env.PORT || 8888;

const mongoose = require('mongoose');

// DB Config
const db = require('./config/keys.json').mongoURI;

app.get('/', (req, res) => res.send('Hello World!!'));

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`MongoDB Connected!!`))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server running on port: ${port}`));
