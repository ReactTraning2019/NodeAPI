var express = require('express');
var database = require('./database.js');
var bodyParser = require('body-parser')
var fs = require('fs');

var app = express();
var dbObject;
var studentDetails;


app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(bodyParser.json());  

app.get('/', (req, res) => {
   res.status(200).send("Welcome to student scorecard dashboard!!!");
});

app.get('/getScore', (req, res) => {

    if(dbObject) {
        dbObject.collection('TestScorecard')
                .find({},
                {
                    _id: false  
                })
                .toArray(function(err, objects)
                {
                    res.send(200, objects);
                });
    }
    else {
        res.send(200, studentDetails);
    }
    
 });

app.post('/insertScore', express.json(), (req, res) => {
    
    var score = req.body;
    
    if(dbObject) {
        dbObject.collection('TestScorecard')
                .insertOne(score, function(err, result) {
                    if (err) {
                        console.log('Failed to add score', err);
                        res.status(500).send('Failed to add score');
                    }
                    else {
                        console.log("Score added");
                        res.status(200).send("Success");
                    }                                        
                });
    }
    else {
        studentDetails.push(score);

        fs.writeFile('./static/scorecard.json', JSON.stringify(studentDetails), 'utf8', (err) => {
            if (!err) {
                console.log('Data saved!');
                res.status(200).send(studentDetails);
            }
            else {
                console.log('Failed to insert data', err);
                res.status(500).send('Failed to insert data');
            }
        });

    }
    
});

app.listen(3000);

database.connectToDatabase((err, db) => {
    if(err) {
        //console.log('Failed to connect to database', err);
        console.log('Failed to connect to database');

        fs.readFile('./static/scorecard.json', ( err, body) => {
            if (!err) {
                try { 
                    var scorecard = JSON.parse(body) 
                }
                catch (err) {}
                
                studentDetails = scorecard;
                console.log('\nInitial student data +++++++ ', scorecard);
            }              
        })
    }
    else {
        dbObject = db;

        dbObject.collection('TestScorecard', function (err, collection) {
            //collection.insert({ studentName: 'Roger', maths: 78, physics: 67, chemistry: 75, english: 70 });
        });
    }

})