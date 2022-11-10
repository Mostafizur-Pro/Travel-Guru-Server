const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5xecsyp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized access " });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (error, decoded) {
    if (error) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    res.decoded = decoded;
    next();
  });
}

async function run() {
  try {
    const serviceCollection = client.db("travelGuru").collection("services");
    const commentCollection = client.db("travelGuru").collection("comments");

    // jwt;
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
      });
      res.send({ token });
    });

    // only 3 service in show display
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    // My service add
    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
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

    // all review find
    app.get("/comments", async (req, res) => {
      // const decoded = req.decoded;
      // console.log("inside orders api", decoded);
      // if (decoded.email !== req.query.email) {
      //   res.status(403).send({ message: "Unauthrized access" });
      // }

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

    // comments field add in mongodb
    app.post("/comments", async (req, res) => {
      const comment = req.body;
      const result = await commentCollection.insertOne(comment);
      res.send(result);
    });

    app.patch("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      let query = { _id: ObjectId(id) };
      const updateComment = {
        $set: {
          status: status,
        },
      };

      const result = await commentCollection.updateOne(query, updateComment);
      res.send(result);
    });

    // review find with id
    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const serviceId = await commentCollection.findOne(query);
      res.send(serviceId);
    });

    app.put("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const data = req.body;
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          name: data.name,
          comment: data.comments,
        },
      };
      const result = await commentCollection.updateOne(
        query,
        updatedUser,
        option
      );
      res.send(result);
    });
    // review delete
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
  res.send("travel-guru car server is running");
});
app.listen(port, () => {
  console.log(`travel-guru car server rining on ${port}`);
});
