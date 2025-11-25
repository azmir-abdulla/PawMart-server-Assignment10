const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = "mongodb+srv://kuttodb:NB5CjFvz1n0Nf1Cf@cluster0.lgpbd6x.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("kuttodb");
    const recentlistsCollection = db.collection("recentlist");

 
    // GET all recent listings
   
    app.get('/recentlist', async (req, res) => {
      const result = await recentlistsCollection.find().toArray();
      res.send(result);
    });


    // GET single listing by ID

    app.get('/recentlist/:id', async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);

      const result = await recentlistsCollection.findOne({ _id: objectId });

      res.send({
        success: true,
        result
      });
    });

  // GET listings by user email
    app.get('/mylistings', async (req, res) => {
      const email = req.query.email;

      if (!email) {
        return res.send({
          success: false,
          message: "Email is required"
        });
      }

      const result = await recentlistsCollection.find({ email: email }).toArray();

      res.send({
        success: true,
        count: result.length,
        data: result
      });
    });


    
    // POST – Add new listing
  
    app.post('/recentlist', async (req, res) => {
      const data = req.body;

      const result = await recentlistsCollection.insertOne(data);

      res.send({
        acknowledged: true,
        result
      });
    });

    // Update item
    app.put ('/recentlist/:id', async (req, res) => {

      const {id} = req.params;
      const data = req.body;
      console.log(id);
      console.log(data);

      const objectId = new ObjectId(id);
      const filter ={ _id: objectId };
      const update ={
        $set: data}
      const result = await recentlistsCollection.updateOne(filter, update);

      res.send(
        {
          success: true,
          result
        });
    })

    // DELETE – Delete listing by ID
    app.delete('/recentlist/:id', async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
     const result = await recentlistsCollection.deleteOne(filter);


      res.send(
        {
          success: true,
        }
      )



    });








    console.log("MongoDB connected successfully!");

  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
