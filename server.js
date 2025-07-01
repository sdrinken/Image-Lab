const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;
const mongoUri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:27017/?authSource=admin`;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let db;
MongoClient.connect(mongoUri, { useUnifiedTopology: true })
  .then(client => { db = client.db('employees'); console.log("Connected to MongoDB"); })
  .catch(err => console.error(err));

app.get('/', async (req, res) => {
  const employees = await db.collection('employees').find().toArray();
  res.render('index', { employees });
});

app.post('/add', async (req, res) => {
  const { name, surname, address, employee, iban } = req.body;
  await db.collection('employees').insertOne({ name, surname, address, employee, iban });
  res.redirect('/');
});

app.listen(port, () => console.log(`Listening on port ${port}`));