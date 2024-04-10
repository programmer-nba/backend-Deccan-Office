require("dotenv").config();
var express = require('express');
var path = require('path');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var logger = require('morgan');

//var router = require('./routes/route')

//กำหนดตัวแปร และดึง Route <=
const EmployeesRoutes = require('./routes/Employees/employees.route');
const RecordsRoutes = require('./routes/Record/record.route');
const TimeInOut = require('./routes/Time_to_Work/timetowork.route');
const LeaveRoutes = require('./routes/Leave/leave.route');
const PartnerRoutes = require('./routes/Partner/partner.route')
const AdminRoutes = require('./routes/Admin/admin.route');
const DocumentRoutes = require('./routes/Document/document.route');
const Role = require('./routes/role/role');
const RequestProjectRoutes = require ('./routes/Project/Project.route');
const ProjectTypeRoutes = require ('./routes/Project/ProjectType.route');



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
app.use('/ddsc-office', Role);
app.use('/ddsc-office/leave', LeaveRoutes);
app.use('/ddsc-office/admin',AdminRoutes);
app.use('/ddsc-office/partners',PartnerRoutes);
app.use('/ddsc-office/document',DocumentRoutes);
app.use('/ddsc-office/project',RequestProjectRoutes);
app.use('/ddsc-office/project/type',ProjectTypeRoutes);


const port = process.env.PORT || 9996;

app.listen(port, () => {
  console.log(`API Running PORT ${port}`);
});
//app.use(router)
