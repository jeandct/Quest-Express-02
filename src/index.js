const express = require('express');
require('dotenv').config();
const movies = require('./movies');
const connection = require('./conf');
const port = process.env.PORT;

const app = express();

connection.connect((err) => {
  if (err) console.error(err);
  else console.log('Connected as id' + connection.threadId);
});

app.get('/', (req, res) => {
  res.send('Welcome to my favorite movie list');
});

app.get('/api/movies', (req, res) => {
  // res.status(200).json(movies);
  connection.query('SELECT * FROM movies', (err, results) => {
    if (err) {
      res.status(500).send('Error retrieving data');
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/api/movies/:id', (req, res) => {
  let { id } = req.params;
  console.log('On route');
  connection.query(
    'SELECT * FROM movies where id = ?',
    [id],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving data');
      } else {
        res.status(200).json(results);
      }
    }
  );
});

app.get('/api/search', (req, res) => {
  let { maxDuration } = req.query;

  connection.query(
    'SELECT * FROM movies WHERE duration <= ?',
    [maxDuration],
    (err, results) => {
      if (err) {
        res.status(500).send('Data not retrieved');
      } else {
        console.log(maxDuration);
        res.status(200).json(results);
      }
    }
  );
});

app.get('/api/users', (req, res) => {
  res.status(401).send('Unauthorized');
});

app.listen(port, (err) => {
  if (err) console.log(err);
  else console.log(`listening on port ${port}`);
});
