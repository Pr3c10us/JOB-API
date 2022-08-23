// Required modules
const express = require('express');
const connectDB = require('./Database/connectDB');
const errorhandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const router = require('./Router/router');
const app = express();
require('dotenv').config();

//Parameters
const port = process.env.PORT || 8081;

//middleware
app.use(express.json());

// Router levels
app.use('/api/v1', router);

app.use(errorhandler);
app.use(notFound);
//Serve api
const Serve = async () => {
  await connectDB(process.env.MONGO_URI);
  console.log('Connected to database');

  app.listen(port, () => {
    console.log(
      `Api running on http://localhost:${port}/api/v1`
    );
  });
};
Serve();
