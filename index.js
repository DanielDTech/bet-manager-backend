const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const DB_FILE = './db.json';

app.use(cors());
app.use(bodyParser.json());

app.get('/dbs/:id', (req, res) => {
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  const { threads, history } = db
  const bets = [...history];

  for (const thread of threads) {
    bets.push(...thread.bets);
    serialize(thread, 'bets');
  }

  serialize(db, 'history');
  serialize(db, 'threads');

  res.send({ db, threads, bets });
});

app.put('/dbs/:id', (req, res) => {
  fs.writeFile(DB_FILE, JSON.stringify(req.body.db, null, 2), (err) => {
    if (err) {
      res.status(500).json({ error: 'Error saving data' });
    } else {
      res.json({ success: true });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

function serialize(object, key) {
  object[key] = object[key].map(value => value.id);
}