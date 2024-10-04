const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const MongoStore = require('connect-mongo');
const session = require('express-session');

// Database connection
const db = require('./config/mongoose');

// Passport strategies
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const passportLocal = require('./config/passport-local-strategy');

const hostname = process.env.HOSTNAME;
const port = process.env.PORT || 5000;
const app = express();

// CORS Middleware setup
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin (React app)
    credentials: true, // Allow credentials (cookies, headers, etc.)
}));

// Other middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session setup
app.use(session({
    name: 'Meow',
    secret: process.env.TOKEN_SECRET_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (60 * 60 * 1000), // 1 hour
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_DB_URL,
        autoRemove: 'disabled',
        collectionName: 'sessions',
    }, (err) => {
        console.log(err || 'connect-mongodb setup ok');
    })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1', require('./routes/index'));

// Start the server
app.listen(port, hostname, function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Server is up and running at http://${hostname}:${port}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    db.close().then(() => {
        console.log('Database connection closed');
        process.exit(0);
    }).catch((error) => {
        console.error('Error closing the database connection:', error);
        process.exit(1);
    });
});
