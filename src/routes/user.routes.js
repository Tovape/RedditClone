import * as userController from "../controllers/user.controller.js";
import * as authController from "../controllers/auth.controller.js";
import { Router } from "express";
const router = Router();

router.get("/", userController.getUsers)

router.get("/:userId", userController.getUserById)

router.put("/:userId", userController.updateUserById)

router.post("/addSaved/:postId", userController.addSavedPost)

router.delete("/:userId", userController.deleteUserById)

export default router;