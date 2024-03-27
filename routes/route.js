const router = require('express').Router();
const main = require('../controllers/Employees/employeeController');
const regis = require('../controllers/Employees/registerController');
const login = require('../controllers/Employees/loginController');
const time = require('../controllers/Employees/timeInOutController')
const auth = require("../lib/auth");
const authAdmin = require("../lib/authAdmin");
const record = require('../controllers/record_report/record')
const project = require('../controllers/project/project_detail')
const Partner = require('../controllers/partners/partner')
const admin = require('../controllers/Admin/admin.controller')
const partnerProject = require('../controllers/project/peojectCreate')
//const bt = require('../controllers/Employees/breakTimeController')

//CRUD employees table(Admin Only)
router.route('/ddsc-office/post').post( authAdmin, main.Post) //ใช้กำหนด path ที่ต้องการทำให้ไม่ต้องไปประกาศใน File Server แล้ว
router.route('/ddsc-office/get').get(authAdmin, main.getAll)
router.route('/ddsc-office/getid/:id').get(authAdmin, main.getByID)
router.route('/ddsc-office/update/:id').put(authAdmin, main.Update)
router.route('/ddsc-office/del/:id').delete(authAdmin, main.Delete)

//GET ME
router.route('/ddsc-office/getme').get(auth, main.getMe)

//Register
// router.route('/ddsc-office/register').post( regis.CreateRegister )
//Login
router.route('/ddsc-office/login').post(login.loginController)

//TimeInOut
router.route('/ddsc-office/time').post(auth, time.timeIn)
router.route('/ddsc-office/timeout').put(auth, time.timeOut) //ลงเวลาเลิกงาน
router.route('/ddsc-office/time/getme').get(auth, time.getMe)
router.route('/ddsc-office/uptime/:id').put(authAdmin, time.updateTime)
router.route('/ddsc-office/deltime/:id').delete(authAdmin, time.deleteTime)
router.route('/ddsc-office/time/getday').get(auth, time.getTimeDay)

//breakTime
//router.route('/ddsc-office/break').post( auth, bt.break_time )

//record
router.route('/ddsc-office/record/post').post(record.create)
router.route('/ddsc-office/record/getAll').get(record.getAll)
router.route('/ddsc-office/record/del/:id').delete(record.delend)
router.route('/ddsc-office/record/update/:id').put(record.update)

//project
router.route('/ddsc-office/project/post').post(project.createProject)
router.route('/ddsc-office/project/editTOR').put(project.updateTOR)
router.route('/ddsc-office/project/delTOR').delete(project.deleteTOR)

//สมัคร
router.post('/ddsc-office/partners/register', Partner.register)
router.post('/ddsc-office/partners/login/', Partner.login)
router.get("/ddsc-office/partners/me", Partner.me)
//ดึงข้อมูลทั้งหมด
router.get('/ddsc-office/partners', authAdmin, Partner.getall)
//ดึงข้อมูล by id
router.get('/ddsc-office/partners/byid/:id', auth, Partner.getbyid)
// แก้ไขข้อมูล partner
router.put('/ddsc-office/partners/:id', auth, Partner.edit)
// ลบข้อมูล partner
router.delete('/ddsc-office/partners/:id', auth, Partner.delete)

//admin
router.route('/ddsc-office/admin/partner/confirm/:id').put(authAdmin, admin.confirmPartner)
router.route('/ddsc-office/admin/partner/cancel/:id').put(authAdmin, admin.cancelPartner)

//project partner
router.route('/ddsc-office/project/partner/create').post(partnerProject.create)
router.route('/ddsc-office/project/partner/del/:id').delete(partnerProject.delend)
router.route('/ddsc-office/project/partner/getAll').get(partnerProject.getAll)
router.route('/ddsc-office/project/partner/update/:id').put(partnerProject.updateProject)

//เพิ่มรูป partner
router.route('/ddsc-office/partners/upLogo/:id').put(Partner.logo)
router.route('/ddsc-office/partners/updateStatus/:id').put(Partner.updateStatus)
router.route('/ddsc-office/partners/upIden/:id').put(Partner.iden)
router.route('/ddsc-office/partners/upCompany/:id').put(Partner.fileCompany)
router.route('/ddsc-office/partners/approve/:id').put(Partner.approve)
router.route('/ddsc-office/partners/wait/:id').put(Partner.waitStatus)
router.route('/ddsc-office/partners/addSignature/:id').put(Partner.addsignature)
router.route('/ddsc-office/partners/OTP/:id').put(Partner.OTP)
router.route('/ddsc-office/partners/contract/:id').put(Partner.contract)

module.exports = router;