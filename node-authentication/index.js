const express = require('express');
const app = express();
const port = 8080;

const cors = require('cors');
app.use(cors());
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

const http = require('http').createServer(app);
http.listen(port, () => {
  console.log(`listening on ${port}`);
});
