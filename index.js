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
const AgreementRoutes = require('./routes/Agreement/agreement.route');
const DraftDocumentRoutes = require('./routes/Document/draftdocument.route');
const UserRoutes = require ('./routes/User/user.route');
const UserinfoRoutes = require ('./routes/Userinfo/userinfo.route');
const ExamRoute = require('./routes/Exam/exam.route');
const ExamTypeRoutes = require('./routes/Exam/examtype.route');
const PostRoutes = require('./routes/Post/post.route');
const ExamResultsRoutes = require('./routes/Exam/examresults.route');


app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB).then(() => console.log('Connected!'));
const cors = require("cors");

app.use(express.json());
app.use(cors());

const ddsc = '/ddsc-office'
// เรียกใช้ Path ตรงนี้ <=
app.use( ddsc , EmployeesRoutes);
app.use( ddsc , RecordsRoutes);
app.use( ddsc , TimeInOut);
app.use( ddsc , Role);
app.use( ddsc + '/leave', LeaveRoutes);
app.use( ddsc + '/admin',AdminRoutes);
app.use( ddsc + '/partners',PartnerRoutes);
app.use( ddsc + '/document',DocumentRoutes);
app.use( ddsc + '/project',RequestProjectRoutes);
app.use( ddsc + '/project/type',ProjectTypeRoutes);
app.use( ddsc + '/agreement', AgreementRoutes);
app.use( ddsc + '/document/draft', DraftDocumentRoutes);
app.use( ddsc + '/user', UserRoutes)
app.use( ddsc + '/user_info', UserinfoRoutes)
app.use( ddsc + '/post', PostRoutes);
app.use( ddsc + '/exam',ExamRoute);
app.use( ddsc + '/exam-type', ExamTypeRoutes);
app.use( ddsc + '/examresults',ExamResultsRoutes);



const port = process.env.PORT || 9996;

app.listen(port, () => {
  console.log(`API Running PORT ${port}`);
});
//app.use(router)
