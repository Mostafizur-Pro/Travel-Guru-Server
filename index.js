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
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });
    app.get("/servicesall", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/servicesall/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const serviceId = await serviceCollection.findOne(query);
      res.send(serviceId);
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
