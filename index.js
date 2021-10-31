const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// CONNECT TO MONGODB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.is406.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// ASYNC FUNCTION
async function run() {
    try {
        await client.connect();
        console.log('Connected to database');

        const database = client.db("ExpressTrip");
        const serviceCollection = database.collection("services");
        const bookingCollection = database.collection("bookings");


        //  POST API (CREATE DATA FROM CLIENT)


        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hitting the service post');

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            console.log('Hitting the booking post');

            const result = await bookingCollection.insertOne(booking);
            console.log(result);
            res.json(result);
        })



        //  GET API
        app.get('/services', async (req, res) => {

            // RUN FIND OPERATION FOR ALL DATA FROM DATABASE COLLECTION                         
            const cursor = serviceCollection.find({});

            // CONVERT DATA TO AN ARRAY
            const services = await cursor.toArray();
            res.send(services);
        })

        //  GET SINGLE SERVICE (READ SPECIFIC DATA FROM SERVER DATABASE)
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            console.log('getting specific service', id);
            res.json(service);
        })



        app.get('/bookings', async (req, res) => {

            // RUN FIND OPERATION FOR ALL DATA FROM DATABASE COLLECTION                         
            const cursor = bookingCollection.find({});

            // CONVERT DATA TO AN ARRAY
            const bookings = await cursor.toArray();
            res.send(bookings);
        })

        //  GET SINGLE BOOKING (READ SPECIFIC DATA FROM SERVER DATABASE)
        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await bookingCollection.findOne(query);
            console.log('getting specific service', id);
            res.json(service);
        })







        //  DELETE API (DELETE DATA FROM CLIENT)
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            console.log('Delete request generated from client side for id:', id);
            res.json(result);
        })


        //  PUT API (UPDATE DATA FROM CLIENT)
        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updatedStatus.status,
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc, options);
            console.log('updating service');
            res.json(result);
        })


    } finally {
        // await client.close();
    }
}
// CALL ASYNC FUNCTION TO EXECUTE
run().catch(console.dir);









app.get('/', (req, res) => {
    res.send('Hello from the ExpressTrip Server')
});

app.listen(port, () => {
    console.log('Listening to', port)
});
