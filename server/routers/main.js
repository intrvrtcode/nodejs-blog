const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const nodemailer = require('nodemailer');

// nodemailer config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'aldirmd.freelance@gmail.com',
    pass: 'wadlyhldarnqdgeo'
  }
});


// routers

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
    res.render('post', { data, pageTitle: null, currentRoute: `/post/${slug}` });
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
  const {send} = req.query;

  res.render('contact', { pageTitle: 'Contact Us', currentRoute: '/contact', send })
})

// POST - contact section
router.post('/contact', (req, res) => {
  const { email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'aldi.rahmaddani12@gmail.com',
    subject: subject,
    text: message + `\n(sender: ${email})`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.redirect('/contact/?send=error')
    } else {
      res.redirect('/contact/?send=true')
    }
  });
})

module.exports = router;
