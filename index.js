const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: 'https://build-innovation-gamma.vercel.app',  // Specify the allowed origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
require('./config/database').connect();

// routes
const user = require('./routes/user');
app.use('/', user);


app.listen(PORT, () => {
    console.log(`App is Listen At ${PORT}`);
});
