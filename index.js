const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World! with Fresh Valley");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zvuaj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("freshValley").collection("products");

  // get data
  app.get("/products", (req, res) => {
    productCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });

  // post data
  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct).then((result) => {
      res.send(result.insertedCount > 0);
      console.log("posted data", newProduct);
    });
  });
  app.post("/addCheckOut", (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct).then((result) => {
      console.log(result);
    });
    console.log(newProduct);
  });

  // delete data
  app.delete("/delete/:id", (req, res) => {
    const id = ObjectID(req.params.id);
    res.send(id);
    productCollection
      .findOneAndDelete({ _id: id })
      .then((documents) => res.send(!!documents.value));
  });
});

app.listen(port);
