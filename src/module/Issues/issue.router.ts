import { Router } from "express";
import { issueController } from "./issue.controller";
import Authentication from "../../middleware/auth";


const router = Router();

router.post('/',Authentication('contributor','maintainer') ,issueController.createIssue);


export const issuesRouter = router