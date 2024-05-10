import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../model/jobSchema.js";

export const getAlljobs = catchAsyncError(async (req, res, next) => {
    const jobs = await Job.find({ expired: false });
    res.status(200).json({
        success: true,
        jobs,
    });
});


// function for posting jobs
export const postJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker is not allowed to access this resources!!", 400
            )
        );
    }

    const {
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo
    } = req.body;

    if (!title || !description || !category || !country || !city || !location) {
        return next(
            new ErrorHandler("Provide full job details", 400)
        );
    }

    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(
            new ErrorHandler("Please either provide fixed salary or ranged salary!!", 400)
        );
    }

    if (salaryFrom && salaryTo && fixedSalary) {
        return next(
            new ErrorHandler("Cannot enter fixed salary and ranged salary together!!", 400)
        );
    }


    const postedBy = req.user._id;
    const job = await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        postedBy
    });

    res.status(200).json({
        success: true,
        message: "Job posted successfully",
        job,
    })

});

// code to get job of a particular employer
export const getmyJobs = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker is not allowed to access this resources!!", 400
            )
        );
    }

    const myjobs = await Job.find({ postedBy: req.user._id });
    res.status(200).json({
        success: true,
        myjobs,
    })
});

// update the jobs
export const updateJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker is not allowed to access this resources!!", 400
            )
        );
    }

    const { id } = req.params;

    let job = await Job.findById(id);

    if (!job) {
        return next(
            new ErrorHandler("Ops job not found", 404)
        );
    }

    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFndAndModify: false
    })

    res.status(200).json({
        success: true,
        job,
        message: "Job updated succcessfully",
    });

});

// function to delete the job
export const deleteJob = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Job Seeker") {
        return next(
            new ErrorHandler("Job Seeker is not allowed to access this resources!!", 400
            )
        );
    }

    const { id } = req.params;

    let job = await Job.findById(id);

    if (!job) {
        return next(
            new ErrorHandler("Ops job not found", 404)
        );
    }

    await job.deleteOne();

    res.status(200).json({
        success: true,
        message: "job deleted succesfully"
    });

})

export const getSingleJob = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    try {
        const job = await Job.findById(id);
        if (!job) {
            return next(
                new ErrorHandler("Job not found", 404)
            );
        }
        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        return next(
            new ErrorHandler("Invalid ID/ CastError", 404)
        );
    }
})