import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from '../middlewares/error.js';
import { User } from '../model/userSchema.js';
import { sendTokens } from '../utils/jwtToken.js';

export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, phone, role, password } = req.body;
    if (!name || !email || !phone || !role || !password) {
        return next(new ErrorHandler("Please fill the necessary details"));
    }
    const isEmail = await User.findOne({ email });
    if (isEmail) {
        return next(new ErrorHandler("Email already exist"));
    }
    const user = await User.create({
        name,
        email,
        phone,
        role,
        password
    });
    sendTokens(user, 200, res, "user registered successfully")
});


export const login = catchAsyncError(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return next(new ErrorHandler("Please Provide email, password and role.", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or password", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or password", 400));
    }

    if (user.role !== role) {
        return next(new ErrorHandler("User with this role not found", 400));
    }

    sendTokens(user, 200, res, "User logged in successfully");

});

export const logout = catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token", "", {
        httpOnly : true,
        expires: new Date(Date.now()),
    }).json({
        success: true,
        message: "User Logged out successfully!!"
    });
});


export const getUser = catchAsyncError((req,res,next)=>{
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    })
})