const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")
const app = express()


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POT', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']

}))

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your React app's URL
    credentials: true
}));

const bp = require("body-parser")
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

const LoginRoute = require('./Routes/Login_Router')

    dotenv.config({ path: '.env' });
const PORT = process.env.PORT || 8080
console.log("Server Started", PORT)
const mongoose = require("mongoose");
mongoose.pluralize(null)

mongoose.connect(process.env.MONGO_URL, {

})
    .then(() => console.log(`Connected To Database`))
    .then(() => {
        app.listen(PORT)
    })
    .catch((error) => console.log(error));


app.get("/", (req, res) => {
    res.send("Hello World")
})


app.use('/Login', LoginRoute)