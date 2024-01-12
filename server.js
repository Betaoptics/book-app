require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./src/Backend/middleware/logger');
const errorHandler = require('./src/Backend/middleware/errorHandler');
const cors = require('cors');
const corsOptions = require('./src/Backend/config/corsOptions');
const connectDB = require('./src/Backend/config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

// Serve static files
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve book catalog files
app.use('/', require('./src/Backend/routes/root'));
app.use('/catalog/book', require('./src/Backend/routes/catalogRoutes'));
app.use('/catalog/books', require('./src/Backend/routes/bookRoutes'));

// test connection to MongoDB
// app.get("/message", (req, res) => {
//     res.json({ message: "Hello from server!" });
//   });

// If no files are found, return a default view.
app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'Backend', 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' });
    } else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

// If connection is opened successfully, listen to port: 3500 (server)
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

// If error happens in server, write into a log file.
mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log');
});