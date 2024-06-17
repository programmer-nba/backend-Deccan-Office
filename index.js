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
const RequestProjectRoutes = require('./routes/Project/Project.route');
const ProjectTypeRoutes = require('./routes/Project/ProjectType.route');
const AgreementRoutes = require('./routes/Agreement/agreement.route');
const UserRoutes = require('./routes/User/user.route');
const UserinfoRoutes = require('./routes/Userinfo/userinfo.route');
const ExamRoute = require('./routes/Exam/exam.route');
const ExamTypeRoutes = require('./routes/Exam/examtype.route');
const PostRoutes = require('./routes/Post/post.route');
const ExamResultsRoutes = require('./routes/Exam/examresults.route');
const LeaveTypeRoutes = require('./routes/Leave/LeaveType.route');
const ContactRoutes = require('./routes/Contact/contact.route');
const SubTypeRoute = require('./routes/Project/SubType.route');
const SignatureRoutes = require('./routes/Employees/signature.route');
const ImagehandlingRoutes = require('./routes/services/imageHandling.route')
const RequestUpateTime = require('./routes/Time_to_Work/requesttime.route')
const postType = require('./routes/Post/post.type')
const recordType = require('./routes/Record/record.type')

app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.set("strictQuery", true);
mongoose.connect(process.env.DB).then(() => console.log('Connected!'));
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use('/ddsc-office/uploads/picture', express.static(path.join(__dirname, 'uploads/picture')));
app.use('/ddsc-office/uploads/pdf', express.static(path.join(__dirname, 'uploads/pdf')));

const ddsc = '/ddsc-office'
// เรียกใช้ Path ตรงนี้ <=
app.use(ddsc, EmployeesRoutes);
app.use(ddsc, require('./routes/event/marquee.route'));
app.use(ddsc, RecordsRoutes);
app.use(ddsc, recordType);
app.use(ddsc, TimeInOut);
app.use(ddsc + '/request', RequestUpateTime);
app.use(ddsc + '/role', Role);

//ภายใน
app.use(ddsc + '/leave', LeaveRoutes);
app.use(ddsc + '/leavetype', LeaveTypeRoutes);
app.use(ddsc + '/admin', AdminRoutes);
app.use(ddsc + '/partners', PartnerRoutes);
app.use(ddsc + '/document', DocumentRoutes);

// สัญญาจ้างพนักงาน
app.use(ddsc + '/agreement', AgreementRoutes);

// สัญญาฝ่ายกฎหมาย
app.use(ddsc + '/lawyer', require('./routes/Term/term.route'));

// services
// notify
app.use(ddsc + '/notify', require('./routes/services/notify.route'));
// image
app.use(ddsc + '/uploads', ImagehandlingRoutes);

//ผู้สมัครงาน
app.use(ddsc + '/user', UserRoutes)
app.use(ddsc + '/user_info', UserinfoRoutes)
app.use(ddsc + '/signature', SignatureRoutes)

//รับสมัครพนักงาน
app.use(ddsc + '/post', PostRoutes);
app.use(ddsc + '/post/type', postType);
app.use(ddsc + '/exam', ExamRoute);
app.use(ddsc + '/exam-type', ExamTypeRoutes);
app.use(ddsc + '/examresults', ExamResultsRoutes);
app.use(ddsc + '/contact', ContactRoutes)

// รับงาน
app.use(ddsc + '/project', RequestProjectRoutes);
app.use(ddsc + '/project-types', ProjectTypeRoutes);
app.use(ddsc + '/project-subtypes', SubTypeRoute);

// ปฏิทิน
app.use(ddsc + '/event', require('./routes/event/event.route'))

//tossgun
app.use(ddsc + '/onestopservice', require('./routes/Tossagunshop/onestopservice'));


const port = process.env.PORT || 9996;

app.listen(port, () => {
  console.log(`API Running PORT ${port}`);
});
//app.use(router)
