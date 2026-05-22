import { Router } from "express";
import { issueController } from "./issue.controller";
import Authentication from "../../middleware/auth";


const router = Router();

router.post('/',Authentication('contributor','maintainer') ,issueController.createIssue);
router.get('/',issueController.getAllIssues);
router.get('/:id',issueController.getIssueById);
router.patch('/:id',Authentication('contributor','maintainer'),issueController.updateIssueByid);

export const issuesRouter = router