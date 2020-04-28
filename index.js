const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = process.env.DB_PATH;


app.use(cors());
app.use(bodyParser.json());




app.get('/', function (req, res) {
    res.send('I would like to go there...')
})

app.get('/Food/:id', (req, res) => {
    const id = (req.params.id);


    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {

        const collection = client.db("hotOnion").collection("Foods");

        collection.find({ id: parseInt(id) }).toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err })
            } else {
                res.send(documents[0]);
            }
        });

        //client.close();
    });
})

app.post("/placeOrder", (req, res) => {
    const orderDetails = req.body;
    orderDetails.orderDate = new Date();
    console.log(orderDetails)
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
      const collection = client.db("hotOnion").collection("orders");
  
      collection.insertOne(orderDetails, (err, documents) => {
        if (err) {
          res.status(500).send({ message: err })
        } else {
          console.log("successfully inserted", documents);
          res.send(documents.ops[0]);
        }
  
      });
  
      //client.close();
    });
  
  
  })



app.get('/foods', (req, res) => {


    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    client.connect(err => {
        const collection = client.db("hotOnion").collection("Foods");
        collection.find().toArray((err, documents) => {

            if (err) {
                res.status(500).send({ message: err })
            } else {
                res.send(documents);
            }

        })
        console.log("database connected...")
        //client.close();
    });

})


app.post('/addFoods', (req, res) => {
    const Food = req.body;
    //res.send(Food);
    console.log(Food);

    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("hotOnion").collection("Foods");
        collection.insert(Food, (err, result) => {

            if (err) {
                res.status(500).send({ message: err })
            } else {
                console.log("Data Submit", result);
            }

        })
        console.log("database connected...")
        //client.close();
    });


})


const port = process.env.PORT || 4200;
app.listen(port, () => console.log("Listening port 4200..."))