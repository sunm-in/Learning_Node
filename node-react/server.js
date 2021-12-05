const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());

const http = require('http').createServer(app);
http.listen(8080, () => {
  console.log('listening on 8080');
});

app.use(express.static(path.join(__dirname, 'react-node/build')));

// /react로 들어갔을 때 리액트 페이지 보여주기
// app.use('/', express.static(path.join(__dirname, 'public')));
// app.use('/react', express.static(path.join(__dirname, 'react-node/build')));

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public/main.html'));
// });

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'react-node/build/index.html'));
// });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'react-node/build/index.html'));
});
