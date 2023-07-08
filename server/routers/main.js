const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const Comment = require('../models/comment')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET

// routers

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect(303, '/admin');
    return null;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    isAuth = true;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

// Home Route
router.get('/', async (req, res) => {
  try {
    let perPage = 5;
    let page = req.query.page || 1;
    const { logout } = req.query;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const prevPage = parseInt(page) + 1;
    const nextPage = parseInt(page) - 1;
    const hasPrevPage = prevPage <= Math.ceil(count / perPage);
    const hasNextPage = nextPage > 0;

    res.render('index', { data, current: page, prevPage: hasPrevPage ? prevPage : null, nextPage: hasNextPage ? nextPage : null, pageTitle: 'Blog page with NodeJs & MongoDB', currentRoute: '/', logout });
  } catch (e) {
    console.log(e)
  }
});

// Post Route
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById(slug).exec();
    let comments = await Comment.findOne({ id_post: slug })

    const isUpvote = data.likes.includes(req.cookies.username);

    if (comments) {
      comments = comments
    } else {
      comments = { body: [] }
    }

    res.render('post', { data, comments, isUpvote, pageTitle: null, currentRoute: `/post/${slug}` });
  } catch (e) {
    console.log(e);
  }
});

// POST Search
router.post('/search', async (req, res) => {
  try {

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
      ]
    })

    res.render('search', { data, pageTitle: 'Looking for posts', currentRoute: '/' });

  } catch (e) {
    console.log(e);
  }
})

// GET - about page
router.get('/about', (req, res) => {
  res.render('about', { pageTitle: 'About this blog', currentRoute: '/about' })
})

// GET - contact section
router.get('/contact', (req, res) => {
  const { send } = req.query;

  res.render('contact', { pageTitle: 'Contact Us', currentRoute: '/contact', send })
})

// POST - contact section
router.post('/contact', (req, res) => {
  const { email, subject, message } = req.body;

  // nodemailer config
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SENDER,
      pass: process.env.PASSWORD
    }
  });

  const mailOptions = {
    from: email,
    to: process.env.SENDER,
    subject: subject,
    text: message + `\n(sender: ${email})`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      res.redirect('/contact/?send=error')
    } else {
      res.redirect('/contact/?send=true')
    }
  });
});

// POST - add comment
router.post('/post/comment/:id', authMiddleware, async (req, res) => {
  const person = req.cookies.username || 'Anonim'

  const newComment = { person: person, comment: req.body.comment };
  const response = await Comment.findOneAndUpdate(
    { id_post: req.params.id },
    { $push: { body: newComment } })

  res.redirect('/post/' + req.params.id)
})


// POST - upvote
router.post('/post/upvote/:id', authMiddleware, async (req, res) => {
  const action = req.body.action

  let response = null;

  if (action === 'up') {
    response = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { likes: req.cookies.username } }
    ).exec();
  } else {
    response = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { likes: req.cookies.username } }
    ).exec();
  }

  res.send(response)
  res.end();
})

module.exports = router;