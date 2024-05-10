import mongoose from "mongoose";

export const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "MERN_STACK_JOB_SEEKING"
    }).then(()=>{
        console.log("Database connected successfully!!!")
        // console.log(`Server running on ${process.env.MONGO_URI}`)
    }).catch((err)=>{
        console.log(`Some error occured when connecting to Database. ${err}`);
    })
}