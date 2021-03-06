require('dotenv').config()

var express = require('express');
var app = express();
const passport = require('passport');
var BnetStrategy = require('passport-bnet').Strategy;
const MongoClient = require("mongodb").MongoClient
var path = require('path');
const BodyParser = require("body-parser")
const DB_ADMIN = process.env.DB_ADMIN
const DB_PASS = process.env.DB_PASS
const CONNECTION_URL = `mongodb+srv://${DB_ADMIN}:${DB_PASS}@cluster0-2km2k.mongodb.net/test?retryWrites=true&w=majority`;
const DATABASE_NAME = "RaidGenerator";


var database, collection;
MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
    if(error) {
        throw error;
    }
    database = client.db(DATABASE_NAME);
    collection = database.collection("token");
    console.log("Connected to `" + DATABASE_NAME + "`!")
    startServer()
})
let startServer = () =>{
    app.use(BodyParser.json());
    app.use(BodyParser.urlencoded({ extended: true }));
    
    // Use the BnetStrategy within Passport.
    passport.use(new BnetStrategy({
        clientID: process.env.BNET_ID,
        clientSecret: process.env.BNET_SECRET,
        callbackURL: "https://raidgenerator.herokuapp.com/auth/bnet/callback",
        region: 'us'
    }, (accessToken, refreshToken, profile, done) => {
        // Profile returns the Bnet Id, Battletag
        return done(null, profile);
    }))
    app.use(express.static(path.join(__dirname, '../public')));
    //attempt to grab token from database
    app.get('/tokenFromDB', (req, res) => {
        let token = ""
        res.setHeader('Content-Type', 'application/json');
        MongoClient.connect(CONNECTION_URL)
        .then((db)=>{
            let aDatabase = db.db(DATABASE_NAME)
            let aCollection = aDatabase.collection("token")
            return aCollection
        }).then((aCollection)=> {
            token = aCollection.findOne({})
            return token
        }).then((token)=>{
            res.send(JSON.stringify({token: `${token.blizzToken}`}))
        })
      });

    //TEST
    app.get("/aWeirdPath", (req,res,next) => {
        console.log("caught trying to go to /weirdpath")
        res.send("paths work on server!")
    })
    app.get('/auth/bnet', (req, res, next) => {
        passport.authenticate('bnet', 
        (err, user, info) => {
            if (err) {
            console.log("error in first route")
            return next(err)
        }
        })(req, res, next);
    });
    app.get('/auth/bnet/callback', (req, res, next) => {
        passport.authenticate('bnet', { failureRedirect: "https://raidgenerator.herokuapp.com" + '/loginFailure' }, (err, user, info) => {
            if (err) {
            console.log("error in second route")
            return next(err);
            }
            blizzToken = user.token
            collection.findOneAndReplace(
                {}, {blizzToken: blizzToken}
            )
            console.log("added token to DB successfully!")
            res.redirect("https://raidgenerator.herokuapp.com"  + '/loginSuccess' );
            
    })(req, res, next);
    });

    app.get('/*', function(req, res) {
        res.sendFile(path.join(__dirname, '../public/index.html'), function(err) {
          if (err) {
            res.status(500).send(err)
          }
        })
      })

    
    //app.get('/', function (req, res) {
    //    res.sendFile(path.join(__dirname, '../public', 'index.html'));
    //  });
      


    app.listen(process.env.PORT || 8083, function() {
        
    });


}