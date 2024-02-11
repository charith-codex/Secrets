require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');

const app = express();

console.log(md5('123')); 

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model('User', userSchema);

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    newUser.save(); // Removed callback function
    res.render('secrets'); // Render secrets page immediately
});

app.post('/login', async function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);

    try {
        const foundUser = await User.findOne({ email: username });

        if (foundUser && foundUser.password === password) {
            res.render('secrets');
        } else {
            // Handle incorrect username or password
            res.send("Incorrect username or password.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred while logging in.");
    }
});



app.listen(3000, function () {
    console.log('Server started on port 3000');
});
