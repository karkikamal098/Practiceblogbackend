const { Router } = require("express");

const router = Router();

const {
  userRegister,
  userLogin,
  getUser,
  getAuthors,
  changeAvatar,
  editUsers
} = require("../controllers/userControllers");

const auth = require("../middleware/authMiddleware");

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/:id", getUser);
router.get("/", getAuthors);
router.post("/change-avatar", auth, changeAvatar);
router.patch("/editUsers", auth, editUsers);


module.exports = router;
