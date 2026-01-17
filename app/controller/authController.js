const User = require('../model/user');
const { hashedPassword, comparePassword } = require('../helper/hashedPassword');
const jwt = require('jsonwebtoken');
const sendEmailVerivicationOTP = require('../helper/sendEmail');
const EmailVerifyModel = require('../model/otpModel')
const transporter = require('../config/emailConfig');
const bcrypt = require('bcryptjs');
const Course = require('../model/course');
const Batch = require('../model/batch');
class AuthController {
    
    async Register(req, res) {
        //console.log(req.body);

        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password || !role) {
                return res.status(400).json({ message: "All fields are required" })
            }
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User already exists" })
            }
            const hashpassword = await hashedPassword(password)
            const userdata = new User({
                name,
                email,
                password: hashpassword,
                role
            })
            const user = await userdata.save();
            console.log("posted")
            sendEmailVerivicationOTP(req, user)
            return res.status(201).json({
                message: "User registered successfully and send otp please verify your email",
                data: user
            })

        } catch (error) {
            console.log('error', error.message);

            return res.status(500).json({ message: "Internal server error" })

        }
    }


    async VerifyEmail(req, res) {
        try {
            const { email, otp } = req.body;
            // Check if all required fields are provided
            if (!email || !otp) {
                return res.status(400).json({ status: false, message: "All fields are required" });
            }
            const existingUser = await User.findOne({ email });

            // Check if email doesn't exists
            if (!existingUser) {
                return res.status(404).json({ status: "failed", message: "Email doesn't exists" });
            }

            // Check if email is already verified
            if (existingUser.is_verified) {
                return res.status(400).json({ status: false, message: "Email is already verified" });
            }
            // Check if there is a matching email verification OTP
            const emailVerification = await EmailVerifyModel.findOne({ userId: existingUser._id, otp });
            if (!emailVerification) {
                if (!existingUser.is_verified) {
                    // console.log(existingUser);
                    await sendEmailVerivicationOTP(req, existingUser);
                    return res.status(400).json({ status: false, message: "Invalid OTP, new OTP sent to your email" });
                }
                return res.status(400).json({ status: false, message: "Invalid OTP" });
            }
            // Check if OTP is expired
            const currentTime = new Date();
            // 15 * 60 * 1000 calculates the expiration period in milliseconds(15 minutes).
            const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
            if (currentTime > expirationTime) {
                // OTP expired, send new OTP
                await sendEmailVerivicationOTP(req, existingUser);
                return res.status(400).json({ status: "failed", message: "OTP expired, new OTP sent to your email" });
            }
            // OTP is valid and not expired, mark email as verified
            existingUser.is_verified = true;
            await existingUser.save();

            // Delete email verification document
            await EmailVerifyModel.deleteMany({ userId: existingUser._id });
            return res.status(200).json({ status: true, message: "Email verified successfully" });


        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, message: "Unable to verify email, please try again later" });
        }


    }

    async Login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "All fields are required" })
            }
            const existingUser = await User.findOne({ email });
            // console.log('existingUser', existingUser);
            if (!existingUser) {
                return res.status(400).json({ message: "Email doesn`t exist" })
            }
            if (!existingUser.is_verified) {
                return res.status(400).json({ message: "Please verify your email to login" })
            }

            const isMatch = await comparePassword(password, existingUser.password)
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" })
            }
            const token = jwt.sign({
                _id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
            }, process.env.JWT_SECRET, { expiresIn: '1h' })

            res.cookie('token', token, { expiresIn: '10m'})

            return res.status(200).json({
                message: "User logged in successfully",
                token: token,
                user: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                }
            })

        } catch (error) {
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    async Dashboard(req, res) {
        return res.status(200).json({ message: "Welcome to the dashboard", data: req.user })
    }

    async allUsers(req, res) {
        try {
            const data = await User.find()
            // console.log(data)
            return res.status(201).json({
                message: "All Users fetched Successfully",
                Total_Users: data.length,
                data: data
            })
        } catch (error) {
            console.log(error)
        }
    }

    async deleteUsers(req, res) {
        try {
            const id = req.params.id
            const data = await User.findByIdAndDelete({ _id: id })
            // console.log(data)
            return res.status(201).json({
                message: "User deleted Successfully",
                data: data
            })
        } catch (error) {
            console.log(error)
        }
    }

    async profile(req, res) {
        try{
            const id = req.params.id
            // console.log(id)
            const data = await User.findOne({ _id: id })
            // console.log(data)
            return res.status(201).json({
                message: "User fetched Successfully",
                data: data
            })
        }catch(error) {
            console.log(error)
        }
    }

    async updateProfile(req, res) {
        try{
            const token = req.cookies.token
            // console.log(token)
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            const id = decoded._id
            // console.log(id)
            if(!id) {
                return res.status(201).json({ message: "Login Again" })
            }
            const { name, email, password, role } = req.body;
            if (!name || !email || !password || !role) {
                return res.status(400).json({ message: "All fields are required" })
            }
            const hashpassword = await hashedPassword(password)
            const userdata = {
                name,
                email,
                password: hashpassword,
                role
            }
            const userUpdate = await User.findByIdAndUpdate(id, userdata);
            const newData = await User.findOne({ _id: id })
            return res.status(201).json({
                message: "User updated Successfully",
                oldData: userUpdate,
                newData: newData
            })
        }catch(error) {
            console.log(error)
        }
    }

    async addCourse(req, res) {
         try {
            const { courseName, courseInfo, courseDuration, courseFees } = req.body;
            if (!courseName || !courseInfo || !courseDuration || !courseFees) {
                return res.status(400).json({ message: "All fields are required" })
            }
            const existingCourse = await Course.findOne({ courseName });
            if (existingCourse) {
                return res.status(400).json({ message: "Course already exists" })
            }
            const coursedata = new Course({ courseName, courseInfo, courseDuration, courseFees })
            const course = await coursedata.save();
            return res.status(201).json({
                message: "Course Added successfully",
                data: course
            })

        } catch (error) {
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" })

        }
    }

    async editCourse(req, res) {
         try {
            const id = req.params.id
            const { courseName, courseInfo, courseDuration, courseFees } = req.body;
            if (!courseName || !courseInfo || !courseDuration || !courseFees) {
                return res.status(400).json({ message: "All fields are required" })
            }
            const coursedata = { courseName, courseInfo, courseDuration, courseFees }
            const course = await Course.findByIdAndUpdate(id, coursedata);
            return res.status(201).json({
                message: "Course Updated successfully",
                data: course
            })

        } catch (error) {
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" })

        }
    }

    async deleteCourse(req, res) {
          try {
            const id = req.params.id
            const data = await Course.findByIdAndDelete({ _id: id })
            // console.log(data)
            return res.status(201).json({
                message: "Course deleted Successfully",
                data: data
            })
        } catch (error) {
            console.log(error)
        }
    }

    async addBatch(req, res) {
         try {
            const { courseId, batchName, batchStart, batchEnd, assignTeacher } = req.body;
            if (!courseId || !batchName || !batchStart || !batchEnd || !assignTeacher) {
                return res.status(400).json({ message: "All fields are required" })
            }
            const existingBatch = await Batch.findOne({ batchName });
            if (existingBatch) {
                return res.status(400).json({ message: "Batch already exists" })
            }
            const batchdata = new Batch({ courseId, batchName, batchStart, batchEnd, assignTeacher })
            const batch = await batchdata.save();
            return res.status(201).json({
                message: "Batch Added successfully",
                data: batch
            })

        } catch (error) {
            console.log('error', error.message);
            return res.status(500).json({ message: "Internal server error" })

        }
    }
}

module.exports = new AuthController();