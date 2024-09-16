const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const HttpError = require("../models/errorModel");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");

const userRegister = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;

    if (!name || !email || !password || !password2) {
      return next(new HttpError("Fill all the fields", 421));
    }

    if (password != password2) {
      return next(new HttpError("Both the password doesnot match", 423));
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ message: `${user.email} is already registered` });
    }

    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json(newUser);
  } catch (err) {
    return next(new HttpError("User registration failed", 422));
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const newEmail = email.toLowerCase();

    if (!email || !password) {
      return next(new HttpError("Please fill all the fields", 421));
    }
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("User not found", 426));
    }
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new HttpError("Invalid credentials", 401));
      }

      const { _id: id, name, email } = user;

      const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ token, id, name, email });
    }
  } catch (err) {
    return next(new HttpError("User login failed", 422));
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select(`-password`);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    res.status(200).json(user);
  } catch (err) {
    return next(new HttpError("Failed to a user data", 501));
  }
};

const getAuthors = async (req, res, next) => {
  try {
    const user = await User.find().select(`-password`);
    if (!user) {
      return next(new HttpError("users data not found", 403));
    }
    if (user) {
      res.status(200).json(user);
    }
  } catch (err) {
    return next(new HttpError("Failed to fetch users", 502));
  }
};

const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("please choose an image file", 404));
    }

    const user = await findById(req.user.id);
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError("Failed to delete", 502));
        }
      });
    }

    const { avatar } = req.files;
    if (avatar.size > 5000000) {
      return next(new HttpError("Avatar size is too large", 400));
    }

    let avatarName = avatar.name.split(".");
    const newAvatarName =
      avatarName[0] + uuidv4() + "." + avatarName[avatarName.length - 1];
    avatar.mv(
      path.join(__dirname, "..", "uploads", avatarName),
      async (err) => {
        if (err) {
          return next(new HttpError("Failed to upload", 502));
        }
        await User.findByIdAndUpdate(
          req.user.id,
          { avatar: newavatarName },
          { new: true }
        );
        res.status(200).json({ message: "Avatar changed successfully" });
      }
    );
  } catch (error) {
    return next(new HttpError("Failed to change avatar", 500));
  }
};

const editUsers = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    if (
      !name ||
      !email ||
      !currentPassword ||
      !newPassword ||
      !confirmNewPassword
    ) {
      return next(new HttpError("Please fill all the fields", 421));
    }

    if (newPassword !== confirmNewPassword) {
      return next(
        new HttpError("New password and confirm password does not match", 423)
      );
    }

    if (currentPassword === newPassword) {
      return next(
        new HttpError("new password and current password should not match")
      );
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new HttpError("User data not found in database", 404));
    } else if (email != user.email) {
      return next(new HttpError("User not found", 404));
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return next(new HttpError("Invalid current password", 401));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword }, { new: true });
    res.status(200).json(user);

  } catch {
    return next(new HttpError("Failed to change the user details", 501));
  }
};

module.exports = { userRegister, userLogin, getUser, getAuthors, changeAvatar , editUsers};
