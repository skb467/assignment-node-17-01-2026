require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const dbCon=require('./app/config/dbCon')
const cors=require('cors')
const path=require('path')
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
dbCon()


//cose
app.use(cors())

//setup session
app.use(session({
    secret: 'hellowelcometowebskitters',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24
    }
}))

app.use(cookieParser())
//setup ejs as the template engine

app.set("view engine", "ejs");
app.set('views','views')

//middleware use
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//create static folder
app.use(express.static('public'));
app.use('/uploads',express.static(path.join(__dirname,'/uploads')));
app.use('/uploads',express.static('uploads'));

//create a api route

const AuthRoute=require('./app/router/authRouter')
app.use('/api',AuthRoute)

const PORT=process.env.PORT || 3006
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
})