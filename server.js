const express = require('express');
const app = express();
const port = process.env.PORT || 8888;

// Requiring Routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const mongoose = require('mongoose');

// DB Config
const db = require('./config/keys.json').mongoURI;

app.get('/', (req, res) => res.send('Hello World!!'));

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log(`MongoDB Connected!!`))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server running on port: ${port}`));
