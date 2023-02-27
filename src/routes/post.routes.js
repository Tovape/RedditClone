import * as postController from "../controllers/post.controller.js";
import { Router } from "express";
import { verifyToken } from "../middleware/middleware.js";
const router = Router();

router.get("/postsort/:postSort", postController.getPosts)

router.get("/postitle/:postTitle/:postLimit/:postSort", postController.getPostsByTitle)

router.get("/postid/:postId", postController.getPostById)

router.get("/postaccount/", postController.getPostsByAccount)

router.get("/savedpostaccount/", postController.savedPostAccount)

router.get("/upvotedpostaccount/", postController.upvotedPostAccount)

router.get("/downvotedpostaccount/", postController.downvotedPostAccount)

router.post("/postcomment/:postId", postController.createComment)

router.post("/", verifyToken, postController.createPost)

router.post("/postupvote/:postId", postController.upvotePost)

router.post("/postdownvote/:postId", postController.downvotePost)

router.put("/:postId", verifyToken, postController.updatePostById)

router.delete("/:postId", verifyToken, postController.deletePostById)

export default router;