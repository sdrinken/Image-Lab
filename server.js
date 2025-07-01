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
  .then(client => {
    db = client.db('employees');
    console.log("Connected to MongoDB");

    // ✅ Define routes *after* db is ready

    app.get('/', async (req, res) => {
      try {
        const employees = await db.collection('employees').find().toArray();
        res.render('index', { employees });
      } catch (err) {
        console.error(err);
        res.status(500).send("Error loading data");
      }
    });

    app.post('/add', async (req, res) => {
      try {
        const { name, surname, address, employee, iban } = req.body;
        await db.collection('employees').insertOne({ name, surname, address, employee, iban });
        res.redirect('/');
      } catch (err) {
        console.error(err);
        res.status(500).send("Error adding employee");
      }
    });

    app.listen(port, () => console.log(`App listening on port ${port}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
  });
