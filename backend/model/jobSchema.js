import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "provide job title"],
        minLength: [3, "Job title must contain atleast 3 charactes!!"],
        maxLength: [30, "Job title should not exceed 50 characters!!"]
    },
    description: {
        type: String,
        required: [true, "provide the job description"],
        minLength: [3, "Job descrition must contain atleast 3 charactes!!"],
        maxLength: [350, "Job description should not exceed 350 characters!!"]
    },
    category: {
        type: String,
        required: [true, "job category is requiredd"]
    },
    country: {
        type: String,
        required: [true, "Provide the counrty in which job is requiredd"]
    },
    city: {
        type: String,
        required: [true, "Provide the city in which job is requiredd"]
    },
    location: {
        type: String,
        required: [true, "Provide the exact location"],
        minLength: [50, " job location  must contain atleast 50 characters"]
    },
    fixedSalary: {
        type: Number,
        minLength: [4, "Fixed salary must atleast 4 digits"],
        maxLength: [9, "Fixed salary cannot exceed 9 digits"]
    },
    salaryFrom: {
        type: Number,
        minLength: [4, "Salaryfrom must atleast 4 digits"],
        maxLength: [9, "Salaryfrom cannot exceed 9 digits"]
    },
    salaryTo: {
        type: Number,
        minLength: [4, "SalaryTo must atleast 4 digits"],
        maxLength: [9, "SalaryTo cannot exceed 9 digits"]
    },
    expired: {
        type: Boolean,
        default: false
    },
    jobPostedOn: {
        type: Date,
        default: Date.now,
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        requiredd: true
    },
});

export const Job = mongoose.model("Job", jobSchema);