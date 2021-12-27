require('dotenv').config();
const { PORT, DB_URL } = process.env;

const express = require('express');
const app = express();
const port = PORT || 4000;

app.use(express.json());
const cors = require('cors');
app.use(cors());

const mongoose = require('mongoose');
mongoose
  .connect(DB_URL)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.error(err));

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

const http = require('http').createServer(app);
http.listen(port, () => {
  console.log(`listening on ${port}`);
});
