const express = require('express');
const router = express.Router();
const Post = require('../models/post');

// routers

// Home Route
router.get('/', async (req, res) => {
  try {
    let perPage = 5;
    let page = req.query.page || 1;
    const {logout} = req.query;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.count();
    const prevPage = parseInt(page) + 1;
    const nextPage = parseInt(page) - 1;
    const hasPrevPage = prevPage <= Math.ceil(count / perPage);
    const hasNextPage = nextPage > 0;

    res.render('index', { data, current: page, prevPage: hasPrevPage ? prevPage : null, nextPage: hasNextPage ? nextPage : null, pageTitle: 'Blog page with NodeJs & MongoDB', currentRoute: '/', logout});
  } catch (e) {
    console.log(e)
  }
});

// Post Route
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById(slug).exec();
    res.render('post', {data, pageTitle: 'Test', currentRoute: `/post/${slug}`});
  } catch(e) {
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
        {title: {$regex: new RegExp(searchNoSpecialChar, 'i')}},
        {body: {$regex: new RegExp(searchNoSpecialChar, 'i')}}
      ]
    })    

    res.render('search', {data, pageTitle: 'Search', currentRoute: '/'});

  } catch(e) {
    console.log(e);
  }
})

router.get('/about', (req, res) => {
  res.render('about', {pageTitle: 'NodeJs with mongoDB Blog', currentRoute: '/about'})
})

module.exports = router;

// function insertPostData() {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },
//     {
//       title: "Discover how to use Express.js",
//       body: "Discover how to use Express.js, a popular Node.js web framework, to build web applications."
//     },
//     {
//       title: "Asynchronous Programming with Node.js",
//       body: "Asynchronous Programming with Node.js: Explore the asynchronous nature of Node.js and how it allows for non-blocking I/O operations."
//     },
//     {
//       title: "Learn the basics of Node.js and its architecture",
//       body: "Learn the basics of Node.js and its architecture, how it works, and why it is popular among developers."
//     },
//     {
//       title: "NodeJs Limiting Network Traffic",
//       body: "Learn how to limit netowrk traffic."
//     },
//     {
//       title: "Learn Morgan - HTTP Request logger for NodeJs",
//       body: "Learn Morgan."
//     },
//   ])
// }

// insertPostData();
