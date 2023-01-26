import { Router } from "express";
import * as authCtrl from "../controllers/auth.controller.js";
import { checkDuplicate, chechRolesExisted } from "../middleware/verifySignup.js";
const router = Router()

router.post("/signup", [checkDuplicate, chechRolesExisted], authCtrl.signUp)
router.post("/signin", authCtrl.signIn)

export default router;