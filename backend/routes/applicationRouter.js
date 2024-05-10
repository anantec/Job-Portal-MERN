import express from 'express';
import { emploerGetAllApplication, jobseekerDeleteApplication, jobseekerGetAllApplication, postApplication } from "../controllers/applicationController.js";
import { isAuthorized } from '../middlewares/auth.js';

const router = express.Router();

router.get("/jobseeker/getall",isAuthorized, jobseekerGetAllApplication);
router.get("/employer/getall",isAuthorized, emploerGetAllApplication);
router.delete("/delete/:id", isAuthorized, jobseekerDeleteApplication);
router.post("/post", isAuthorized, postApplication);

export default router;