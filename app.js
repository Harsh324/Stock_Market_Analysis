// const { application } = require("express");
const express = require("express");
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(express.static("public"));
app.use(bodyparser.json());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.post('/api/register', async (req, res) =>{
    console.log(req.body);
    res.json({status: 'ok'})
})


app.get("/", function (req, res) {
    //   res.send("Hello World!");
    res.render("Home");
});

app.get("/register", function (req, res) {
    //   res.send("Hello World!");
    res.render("logs/register");
});

// app.get("/route/:title/:title1", function(req, res){
//     const V1 = req.params.title;
//     const V2 = req.params.title1;
//     res.render("F2.ejs", {
//         title : V1,
//         title1 : V2
//     });
// });

app.get("*", function(req, res){
    res.send("Error!! That route does not exist.")
})


app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
