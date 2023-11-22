import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", async (req, res) => {
    
     bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        })

        try {
            await newUser.save()
            res.render("secrets");
        } catch (error) {
            console.log(error.message);
        }     
    });
    
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
    const foundUser = await User.findOne({email: username});
    if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result) {
            if (result === true) {
                res.render("secrets");
            }
        });
            
        }
    } catch (error) {
        console.log(error.message);
        }
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});