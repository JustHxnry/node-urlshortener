require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./modules/routes');
const config = require('config');

const app = express();

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var port = config.get('port');

app.listen(port, () => console.log(`Web Started : ${port}`));