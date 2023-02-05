import * as postController from "../controllers/post.controller.js";
import { Router } from "express";
import { verifyToken } from "../middleware/authJwt.js";
const router = Router();

router.get("/postsort/:postSort", postController.getPosts)

router.get("/postitle/:postTitle/:postLimit/:postSort", postController.getPostsByTitle)

router.get("/postid/:postId", postController.getPostById)

router.post("/", verifyToken, postController.createPost)

router.put("/:postId", verifyToken, postController.updatePostById)

router.delete("/:postId", verifyToken, postController.deletePostById)

export default router;