const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

// use the middleware
app.use(cors());
app.use(express.json());

//name : product_server_crud
// pass : 8VsP1yBnfO5AkJIl

const uri = `mongodb+srv://${process.env.SECRET_KEY}:${process.env.SECRET_HASH}@cluster0.nrvwj.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const product = client.db("Product_Collection");
    const collectionProduct = product.collection("No_Of_Product");

    // find all the data from the database
    app.get("/product", async (req, res) => {
      const query = {};
      const cursor = collectionProduct.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // get a singel data from the user interface
    app.get("/product/:id", async(req,res) =>{
        const id = req.params.id;
        const query = {_id : ObjectId(id)};
        const result = await collectionProduct.findOne(query);
        res.send(result);
    })

    // post a singel data from the user interface
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      const result = await collectionProduct.insertOne(newProduct);
      console.log(`a product is inseted ${result.insertedId}`);
      res.send(result);
    });

    // deleted a single Product
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await collectionProduct.deleteOne(query);
      res.send(result);
    });

    // update a single data from the user interface
    app.put("/product/:id", async (req, res) => {
      const productInfo = req.body;
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: productInfo.name,
          gender: productInfo.gender,
          picture: productInfo.picture,
          price: productInfo.price,
        },
      };
      const result = await collectionProduct.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Server How Are You");
});

app.listen(port, () => {
  console.log(`Listening port ${port} successfully`);
});
