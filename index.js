require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json({limit: '50mb', type: 'application/json'}));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB, {useNewUrlParser: true});
const cors = require("cors");

app.use(express.json());
app.use(cors());

//login & register
app.use('/ddsc-office', require('./routes/index'));


const port = process.env.PORT || 8998;

app.listen(port, () => {
  console.log(`API Running PORT ${port}`);
});
