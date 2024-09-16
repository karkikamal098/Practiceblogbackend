const { Router } = require("express");

const router = Router();


const auth = require("../middleware/authMiddleware");



const {
  addPost,
  getPosts,
  getPostById,
  getPostByCategory,
  getPostByAuthor,
  editPost,
  deletePost,
} = require("../controllers/postControllers");

router.post("/addpost", addPost);
router.get("/post", getPosts);
router.get("/post/:id", getPostById);
router.get("/post/category/:category", getPostByCategory);
router.get("/post/author/:authorId", getPostByAuthor);
router.patch("/editpost/:id", auth, editPost);
router.delete("/deletepost/:id", auth, deletePost);




module.exports = router;
