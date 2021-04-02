const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser =require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
require('dotenv').config()


const port = process.env.PORT || 7000
app.use(cors());
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfj8i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err',err)
  const bookCollection = client.db("bookShop").collection("books");
  // const orderCollection = client.db("bookShop").collection("orders");
 
  app.get('/books',(req, res)=>{
    bookCollection.find()
    .toArray((err,items) =>{
      res.send(items)
    })
  })



  app.get('/books/:id',(req, res)=>{
    bookCollection.find({_id: ObjectID(req.params.id)})
    .toArray((err,items) =>{
      res.send(items[0])
    })
  })


app.post('/addBook',(req,res)=>{
  const newOrder = req.body;
  console.log(newOrder)
  bookCollection.insertOne(newOrder)
  .then(result =>{
    console.log(result.insertedCount)
    res.send(result.insertedCount > 0)
  })
})

// app.post('/addOrder',(req,res)=>{
//   const newOrder = req.body;
//   console.log(newOrder)
//   orderCollection.insertOne(newOrder)
//   .then(result =>{
//     console.log(result.insertedCount)
//     res.send(result.insertedCount > 0)
//   })
// })


// app.get('/oders',(req, res)=>{
//   orderCollection.find({})
//   .toArray((err,items) =>{
//     res.send(items)
//   })
// })
// app.get('/books/:email',(req, res)=>{
//   orderCollection.find({email: ObjectID(req.params.email)})
//   .toArray((err,items) =>{
//     res.send(items)
//   })
// })

  // client.close();
});




app.listen(port)