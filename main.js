//Load libraries
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

//Look for PORT
const PORT = parseInt(process.argv[2] || process.env.APP_PORT) || 3000;

// Load configuration 
const config = require('./config.json');
const URL = config.mongo || 'mongodb://localhost:27017';

// Create an instance of MongoClient
const client = new MongoClient(URL, { useNewUrlParser: true, useUnifiedTopology: true })

//Create an instance of the application
const app = express();

//GET /api/boardgames/:name
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

//GET /api/boardgames/:category
//db.getCollection('games').find({name: ""})
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

app.get('/api/boardgames/:id', (req, res) => {
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