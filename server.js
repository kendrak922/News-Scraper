
const express = require('express');
const exphbs  = require('express-handlebars');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const request = require('request');
const cheerio = require('cheerio')

//mongo
const db = require("./models/Index");

//mongoose
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

const PORT = 3000;

///express
const app = express();
app.use(express.static("public"));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
 

//body-parser
app.use(bodyParser.urlencoded({ extended: true }));
//cheerio
app.get('/', function (req, res) {
    res.render('home');
});

app.get("/scrape", function(req, res){
    request("https://www.nytimes.com/",function(err, response ,html){
        const $ = cheerio.load(response.data)
        $(".title").each(function(i, element){
            let result = {};
            result.title = $(this).children("a").text();
            result.link = $(this).childeren("a").attr("href");

        db.Article.create(result)
        .then(function(dbArticle){
            console.log(dbArticle);
        })
        .catch(function(err){
            return res.json(err);
     });
    });
});
    });
    

 
// $('h2.title').text('Hello there!')
// $('h2').addClass('welcome')
 

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  