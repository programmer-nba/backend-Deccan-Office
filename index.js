require("dotenv").config();
var express = require('express');
var path = require('path');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
//var router = require('./routes/route')

//กำหนดตัวแปร และดึง Route <=
const EmployeesRoutes = require('./routes/Employees/employees.route');
const RecordsRoutes = require('./routes/Record/record.route');
const TimeInOut = require('./routes/Time_to_Work/timetowork.route');


app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB).then(() => console.log('Connected!'));
const cors = require("cors");

app.use(express.json());
app.use(cors());

// เรียกใช้ Path ตรงนี้ <=
app.use('/ddsc-office', EmployeesRoutes);
app.use('/ddsc-office', RecordsRoutes);
app.use('/ddsc-office', TimeInOut);



const port = process.env.PORT || 9996;

app.listen(port, () => {
  console.log(`API Running PORT ${port}`);
});
//app.use(router)
