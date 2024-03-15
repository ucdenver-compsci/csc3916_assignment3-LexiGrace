/*
CSC3916 HW2
File: Server.js
Description: Web API scaffolding for Movie API
 */

var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require('./Movies');
const mongooe = require('mongoose');
const {MongoClient}=require('mongodb');
require('dotenv').config();

var app = express();

//app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());


var router = express.Router();

const uri = process.env.DB;
const port = process.env.PORT || 8080;


mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// function getJSONObjectForMovieRequirement(req) {
//     var json = {
//         headers: "No headers",
//         key: process.env.UNIQUE_KEY,
//         body: "No body"
//     };

//     if (req.body != null) {
//         json.body = req.body;
//     }

//     if (req.headers != null) {
//         json.headers = req.headers;
//     }

//     return json;
// }

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
    router.route('/movies')
        //get /movies
        .get((req, res) =>{
            Movie.find({}).exec(function(error, movies){
                if (error){
                    console.error('Sorry, it looks like there was an error finding movies:', error);
                }
                res.status(200).json(movies);
            })
        })

        .post(authJwtController.isAuthenticated,(req, res) =>{
            //post /movies
            const {title, releaseDate, genre, actors} = req.body;
            if (!title){
                return res.status(400).json({error: 'Please entire a title'});
            }
            const newMovie = new Movie ({title, releaseDate, genre, actors});

            newMovie.save(function(error){
                if (error){
                    console.error('Sorry, it looks like there was an error saving this movie, please try again later.', error);
                }
                res.json({succes: true, msg: 'Movie was successfully saved'});
            });

        })

        .put(authJwtController.isAuthenticated, (req, res) =>{
            const {title}=req.title;
            const {releaseDate, genre, actors} = req.body;
            if(!title){
                return res.status(400).json({error: 'Please entire a title'});
            }
            Movie.findOneAndUpdate ({title: title}, {releaseDate, genre, actors}, {new: true})
                .then(updatedMovie =>{
                    res.status(200).json(updatedMovie);
                })
                .catch(error=> res.status(500).json({error: 'Sorry, an error has occured and this movie is not able to be updated at this time'}));

        })

        .delete(authJwtController, (req, res) =>{
            const {title} =req.title;

            if(!title){
                return res.status(200).json({error: 'You must enter a valid movie title'});
            }
            Movie.findOneAndDelete({title: title})
                .then(deletedMovie =>{
                    if (!deletedMovie){
                        return res.status(404).json({error: 'This movie was not found'});
                    }
                  res.status(200).json({message: 'The movie has been successfully deleted'});
                })
                .catch(error => res.status(500).json({error: 'An error has occured, the movie has not been deleted at this time'}));
            
        })

        .http((req, res) => {
            res.status(405).send({message: 'This method is not supported.'});
        })
});

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


