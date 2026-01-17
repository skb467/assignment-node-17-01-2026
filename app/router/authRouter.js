const express = require('express');
const authController = require('../controller/authController');
const AuthCheck = require('../middleware/authCheck');
const AdminAuth = require('../middleware/adminAuth')
const ManagementAuth = require('../middleware/managementAuth')

const router = express.Router();


router.post('/register', authController.Register)
router.post('/verify-email', authController.VerifyEmail)
router.post('/login', authController.Login)

//auth protected route
router.get('/dashboard', AuthCheck, authController.Dashboard)
router.get('/profile/:id', AuthCheck, authController.profile)
router.get('/all-users', AuthCheck, AdminAuth, authController.allUsers)
router.delete('/delete-user/:id', AuthCheck, AdminAuth, authController.deleteUsers)
router.post('/update-profile/:id', AuthCheck, authController.updateProfile)

router.post('/add-course', AuthCheck, AdminAuth, authController.addCourse)
router.post('/edit-course/:id', AuthCheck, AdminAuth, authController.editCourse)
router.delete('/delete-course/:id', AuthCheck, AdminAuth, authController.deleteCourse)

router.post('/add-batch', AuthCheck, ManagementAuth, authController.addBatch)


module.exports = router;


