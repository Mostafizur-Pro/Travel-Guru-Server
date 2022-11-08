const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// User Name : travelGuru
// User Password : 1FhsnUyK8wHosOWV
// process.env.DB_USER
// process.env.DB_PASSWORD

const uri =
  "mongodb+srv://travelGuru:1FhsnUyK8wHosOWV@cluster0.5xecsyp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("travelGuru").collection("services");
    const commentCollection = client.db("travelGuru").collection("comments");
    // only 3 service in show display
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    // all service show display
    app.get("/servicesall", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    //  service find in id
    app.get("/servicesall/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const serviceId = await serviceCollection.findOne(query);
      res.send(serviceId);
    });

    // comments field add in mongodb
    app.post("/comments", async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);
      res.send(result);
    });

    app.get("/comments", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = commentCollection.find(query);
      const comment = await cursor.toArray();
      res.send(comment);
    });
    // app.patch("/comments/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const status = req.body.status;
    //   let query = { _id: ObjectId(id) };
    //   const updateComment = {
    //     $set: {
    //       status: status,
    //     },
    //   };

    //   const result = await commentCollection.updateOne(query, updateComment);
    //   res.send(result);
    // });
    app.delete("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await commentCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("genius car server is running");
});
app.listen(port, () => {
  console.log(`Genius car server rining on ${port}`);
});
