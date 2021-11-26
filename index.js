const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fsd1c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



async function run() {
  try {
    await client.connect();
    const database = client.db("naturo");
    const offersCollection = database.collection("offers");
    const offerDetailsCollection = database.collection("offerDetails");
    const bookingInfoCollection = database.collection("bookingInfo");

    // add offer
    app.post("/addOffer", async (req, res) => {
      const result = await offersCollection.insertOne(req.body);
    });

    //get all offer
    app.get("/allOffer", async (req, res) => {
      const result = await offersCollection.find({}).toArray();
      res.send(result);
    });
    //get  alloffer details
    app.get("/offerDetails", async (req, res) => {
      const result = await offerDetailsCollection.find({}).toArray();
      res.send(result);
    });
    //get offer with id
    app.get("/offerDetails/:id", async (req, res) => {
      const id = req.params.id;
      const result = await offerDetailsCollection.findOne({ id: id });
      res.send(result);
    });
    //add booking info
    app.post("/bookingInfo", async (req, res) => {
      const result = await bookingInfoCollection.insertOne(req.body);
      res.send(result);
    });
    //get all booking info
    app.get("/allBookingInfo", async (req, res) => {
      const result = await bookingInfoCollection.find({}).toArray();
      res.send(result);
    });
    //delete  booking list from all booking
    app.delete("/deleteBooking/:id", async (req, res) => {
      const result = await bookingInfoCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
    //delete booking from mybooking
    app.delete("/deleteMyBooking/:id", async (req, res) => {
      const result = await bookingInfoCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    });
    //get all data by filtering user email
    app.get("/allBookingInfo/:email", async (req, res) => {
      const result = await bookingInfoCollection
        .find({
          email: req.params.email,
        })
        .toArray();
      res.send(result);
    });
//change status pending to approved through put method
    app.put("/bookingStatus/:id", async (req, res) => {
      const id = req.params.id;

      const result = await bookingInfoCollection.findOne({
        _id: ObjectId(id),
      });

      let status = result.status == "Pending" ? "Approved" : "Pending";

      const filter = { _id: ObjectId(id) };

      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result2 = await bookingInfoCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result2);
    });
  } finally {
    //  await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running natour server");
});
app.listen(port, () => {
  console.log("runnign natour server on port", port);
});