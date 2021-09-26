const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const db = require("./db.js");
const app = express();
app.use(bodyParser.json());
const collection = "api";
const path = require('path');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/api', (req, res) => {
    db.getDB().collection(collection).find({}).toArray((err, documents) => {
        if (err)
            console.log(err);
        else {
            res.json(documents);
        }
    });
});

app.put('/:id', (req, res) => {
    const apiID = req.params.id;
    const userInput = req.body;

    db.getDB().collection(collection).findOneAndUpdate({ _id: db.getPrimaryKey(apiID) }, { $set: { apiID: userInput.api } }, { returnOriginal: false }, (err, result) => {
        if (err)
            console.log(err);
        else {
            res.json(result);
        }
    });
})

app.post('/api', (req, res) => {
    const userInput = req.body;
    if (err) {
        const err = new Error("invalid");
        err.status = 400;
        next(err);
    }
    else {
        db.getDB().collection(collection).insertOne(userInput, (err, result) => {
            if (err) {
                const err = new Error("failed to insert");
                err.status = 400;
                next(err);
            }
            else {
                res.json({ result: result, document: result.ops[0], msg: "successful", err: null });
            }
        });
    }
})

app.delete('/:id', (req, res) => {
    const apiID = req.params.id;

    db.getDB().collection(collection).findOneAndDelete({ _id: db.getPrimaryKey(apiID) }, (err, result) => {
        if (err)
            console.log(err);
        else
            res.json(result);
    })
})

db.connect((err) => {
    if (err) {
        console.log("unable to connect");
        process.exit(1);
    }
    else {
        app.listen(4000, () => {
            console.log(`listening on port 4000`);
        });
    }
});

