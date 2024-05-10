import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../model/applicationSchema.js";
import cloudinary from 'cloudinary'
import { Job } from "../model/jobSchema.js";

// code for employer to get all application
export const emploerGetAllApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker is not allowed to access this resource", 400)
        );
    }

    const { _id } = req.user;
    const applications = await Application.find({ "employerId.user": _id });
    res.status(200).json({
        success: true,
        applications
    })
});

// for applicant to check whome he has send the application for job
export const jobseekerGetAllApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employer") {
        return next(
            new ErrorHandler("Employer is not allowed to access this resource", 400)
        );
    }

    const { _id } = req.user;
    const applications = await Application.find({ "applicantId.user": _id });
    res.status(200).json({
        success: true,
        applications
    });

});

//code for job seeker to delete the application send by user or applicant 
export const jobseekerDeleteApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Employer") {
        return next(
            new ErrorHandler("Employer is not allowed to access this resource", 400)
        );
    }

    const { id } = req.params;
    const application = await Application.findById(id);

    if (!application) {
        return next(
            new ErrorHandler(
                "OOPS appplicatons not found", 404
            )
        );
    }

    await application.deleteOne();
    res.status(200).json({
        success: true,
        message: "Application deleted successfully!!!"
    });
    
});

// code to post application by the applicant
export const postApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
        return next(
            new ErrorHandler("Employer is not allowed to access this resource!!", 400)
        );
    }

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(
            new ErrorHandler("Resume file require!!")
        );
    }

    const { resume } = req.files;
    const allowedFormats = ['image/png', 'image/jpeg', 'image/webp'];

    if (!allowedFormats.includes(resume.mimetype)) {
        return next(
            new ErrorHandler("Invalid file type. Please Upload your resume PNG, JPG or WEBP format.!!", 400)
        )
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.log("Cloudinary error", cloudinaryResponse.error || "Unknown Cloudinary error");

        return next(
            new ErrorHandler("Failed to upload resume", 500)
        );
    }

    const { name, email, coverLetter, phone, address, jobId } = req.body;
    const applicantId = {
        user: req.user._id,
        role: "Job Seeker"
    };
    if (!jobId) {
        return next(
            new ErrorHandler("Job not found", 404)
        );
    }

    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        return next(
            new ErrorHandler("Job not Found", 404)
        );
    }

    const employerId = {
        user: jobDetails.postedBy,
        role: "Employer"
    };

    if (!name ||
        !email ||
        !coverLetter ||
        !phone ||
        !address ||
        !applicantId ||
        !employerId ||
        !resume) {
        return next(
            new ErrorHandler("Please fill all the fields", 400)
        );
    }


    const application = await Application.create({
        name,
        email,
        coverLetter,
        phone,
        address,
        applicantId,
        employerId,
        resume: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });

    res.status(200).json({
        success: true,
        message: "Application submitted successfully!",
        application,
    })

});
