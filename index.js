const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./Db/Db');
const routes = require('./Route/Route');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});