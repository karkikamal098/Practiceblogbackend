const fs = require("fs");
const path = require("path");

const HttpError = require("../models/errorModel");



const addPost = async (req, res, next) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return next(new HttpError("Please fill all the fields", 422));
  }
};

const getPosts = async (req, res, next) => {
  res.json("success");
};

const getPostById = async (req, res, next) => {
  const { postId } = req.params;

  if (!postId) {
    return next(new HttpError("Please provide a post ID", 422));
  }

};

const getPostByCategory = (req, res, next) => {
  const { category } = req.params;

  if (!category) {
    return next(new HttpError("Please provide a category", 422));
  }
};

const getPostByAuthor = (req, res, next) => {
  const { author } = req.params;

  if (!author) {
    return next(new HttpError("Please provide an author", 422));
  }
};

const editPost = async (req, res, next) => {
  const { postId, title, content } = req.body;

  if (!postId || !title || !content) {
    return next(new HttpError("Please fill all the fields", 422));
  }
};

const deletePost = async (req, res, next) => {
  const { postId } = req.body;

  if (!postId) {
    return next(new HttpError("Please provide a post ID", 422));
  }
};

module.exports = {
  addPost,
  getPosts,
  getPostById,
  getPostByCategory,
  getPostByAuthor,
  editPost,
  deletePost,
};
