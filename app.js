const express = require("express");
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./model/user');
const app = express();

app.use(express.static("public"));
app.use(bodyparser.json());

app.set('view engine', 'ejs');
app.set('views', 'views');


app.post('/api/login', async(req, res) =>{
    //res.json({status : 'ok', data : 'dsfdsfdasf'});
    const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

    const JWT_SECRET = "984r7y4gyubhfjvv{}%#^y46y5WT#%Y5yI*){-[0HtCxASdsdQERrfbvcbnmhk)*P_(++}_|";
    
	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign(
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })

})



/**
 * Registering the User
 */
app.post('/api/register', async (req, res) =>{
    
    //console.log(req.body);

    const {username, password:plainTextPassword } = req.body;

    /**
     * Passing username and password checks
     */
    if(!username || typeof username !== 'string'){
        return res.json({status: 'error', error: 'Invalid username'});
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}


    /**
     * Applying hashing to encrypt the password
     */
    const password = await bcrypt.hash(plainTextPassword, 10);


    res.json({status: 'ok'})
    try{
        const response = await User.create({
            username,
            password
        })
        console.log('User added successfully: ',response);
    }catch(error){
        console.log(JSON.stringify(error));
        if(error.code === 11000){
            return res.json({status: 'error', error: 'Username is already used'})
        }
        throw(error);
        //return res.json({status : 'error'});
    }
})



/**
 * Connecting the mongodb database
 */
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/logs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
});



/**
 * Rendering the Home page
 */
app.get("/", function (req, res) {
    //   res.send("Hello World!");
    res.render("Home");
});

app.get('/login', function (req, res){
    res.render('logs/login');
})


/**
 * Rendering the Registration page
 */
app.get('/register', function (req, res) {
    //   res.send("Hello World!");
    res.render('logs/register');
});

// app.get("/route/:title/:title1", function(req, res){
//     const V1 = req.params.title;
//     const V2 = req.params.title1;
//     res.render("F2.ejs", {
//         title : V1,
//         title1 : V2
//     });
// });


/**
 * 404 error page is rendered here
 */
app.get("*", function(req, res){
    res.send("Error!! That route does not exist.")
})




app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
