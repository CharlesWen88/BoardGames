//Load libraries
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

//Look for PORT
const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;

// Load configuration 
const config = require('./config.json');
//const URL = config.mongo || 'mongodb://localhost:27017';
const URL = "mongodb://wilma:123@hydra-shard-00-00-ppljg.gcp.mongodb.net:27017,hydra-shard-00-01-ppljg.gcp.mongodb.net:27017,hydra-shard-00-02-ppljg.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Hydra-shard-0&authSource=admin&retryWrites=true&w=majority";

// Create an instance of MongoClient
const client = new MongoClient(URL, { useNewUrlParser: true, useUnifiedTopology: true })

//Create an instance of the application
const app = express();

//GET /api/boardgames/name/:name
//db.getCollection('games').find({name: ""})
app.get('/api/boardgames/name/:name', (req, res) => {
    console.log('name: ', req.params.name)

    const name = req.params.name;

    client.db('boardgame')
        .collection('games')
        .find({
            Name: {
                $regex: `.*${name}.*`,
                $options: 'i'  //ignore case
            }
        })
        .project({ Name:1, ID:1 })
        .limit(10)
        .toArray()
        .then(result => {
            res.type('application/json');
            if (!result) {
                res.status(404)
                res.json({ message: `Not found: ${name}` })
            } else {
                res.status(200)
                res.json(result);
            }
        })
        .catch(error => {
            res.status(404)
            res.json({ message: error });
        })
    }
)

//GET /api/boardgames/category/:category
//db.getCollection('games_details').find({boardgamecategory: ""})
app.get('/api/boardgames/category/:category', (req, res) => {
    console.log('category: ', req.params.category)

    const category = req.params.category;

    client.db('boardgame')
        .collection('games_details')
        .find({
            boardgamecategory: {
                $regex: `.*${category}.*`,
                $options: 'i'  //ignore case
            }
        })
        .project({ id: 1, primary: 1 })
        .limit(10)
        .toArray()
        .then(result => {
            res.type('application/json');
            if (!result) {
                res.status(404)
                res.json({ message: `Not found: ${category}` })
            } else {
                res.status(200)
                res.json(result);
            }
        })
        .catch(error => {
            res.status(404)
            res.json({ message: error });
        })
    }
)

//GET /api/boardgames/:id
//db.getCollection('games').find({name: ""})
app.get('/api/boardgame/:id', (req, res) => {
    console.log('id:', req.params.id)

    const id = parseInt(req.params.id);

    client.db('boardgame')
        .collection('games')
        .findOne({ ID: id })
        .then(result => {
            res.type('application/json');
            if (!result) {
                res.status(404)
                res.json({ message: `Not found: ${id}` })
            } else {
                res.status(200)
                res.json(result);
            }
        })
        .catch(error => {
            res.status(404)
            res.json({ message: error });
        })
    }
)

//GET /api/comments/:name
//db.getCollection('bgg-13m-reviews').find({name: ""})
app.get('/api/comments/:id', (req, res) => {
    console.log('Id: ', req.params.id)

    const id = parseInt(req.params.id);

    client.db('boardgame')
        .collection('comments')
        .find({ ID: id })
        //.project({ Name: 1, ID: 1 })
        .limit(10)
        .toArray()
        .then(result => {
            res.type('application/json');
            if (!result) {
                res.status(404)
                res.json({ message: `Not found: ${name}` })
            } else {
                res.status(200)
                res.json(result);
            }
        })
        .catch(error => {
            res.status(404)
            res.json({ message: error });
        })
    }
)

//Start the server - listening to a port of our choosing
//Connect to mongo/boardgame
client.connect(
    (err, client) => {
        if (err) {
            console.error('failed to connect:', err)
            return;
        }
        console.info('connected to boardgame')
        // Start the server
        app.listen(PORT, () => {
            console.info(`Application started on port ${PORT} at ${new Date()}`);
        })
    }
)