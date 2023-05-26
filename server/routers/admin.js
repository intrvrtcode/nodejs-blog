const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('../models/post');
const User = require('../models/user');

const adminLayout = '../views/layout/admin'
const jwtSecret = process.env.JWT_SECRET

let isAuth = false;

// Check Login
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    res.redirect('/admin');
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

// Home route admin page
router.get('/admin', async (req, res) => {
  try {

    const {auth, authreg} = req.query;

    res.render('admin/index', { pageTitle: 'Admin', layout: adminLayout, currentRoute: '/dashboard',  auth, authreg, isAuth})
  } catch (e) {
    console.log(e);
  }
});

// Post route check login
router.post('/admin', async (req, res) => {
  try {

    const { username, password } = req.body;
    const user = await User.findOne({ username });
    let failedAuth = false;

    if (!user) {
      res.redirect('/admin/?auth=error')
      failedAuth = true;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.redirect('/admin/?auth=error')
      failedAuth = true;
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie('token', token, { httpOnly: true });

    res.cookie('username', user.username);
    
    if(!failedAuth) {
      req.app.locals.getGreeting();
      res.redirect(`/dashboard/?auth=true`);
    }

  } catch (e) {
    console.log(e)
  }
});

// Post route register
router.post('/register', async (req, res) => {
  try {

    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await User.create({ username, password: hashedPassword });

      const token = jwt.sign({ userId: newUser._id }, jwtSecret);
      res.cookie('token', token, { httpOnly: true });

      res.cookie('username',  newUser.username);
      req.app.locals.getGreeting();
      res.redirect('/dashboard/?authreg=true');
    } catch (e) {
      if (e.code === 11000) {
        res.redirect('/admin/?authreg=error');
      }

      res.status(500).json({ message: 'Internal server error' });
    }

  } catch (e) {
    console.log(e)
  }
});

// Get Dashboard Page
router.get('/dashboard', authMiddleware, async (req, res) => {

  try {
    const data = await Post.find({author: req.cookies.username});
    const {auth, authreg, newP, deleted} = req.query;

    req.app.locals.getGreeting();

    res.render('admin/dashboard', { pageTitle: 'Admin', data, layout: adminLayout, currentRoute: '/dashboard', userName: req.cookies.username, auth, authreg, newP, deleted, isAuth});
  } catch (e) {
    console.log(e);
  }
});

// Get add-post page
router.get('/add-post', authMiddleware, async (req, res) => {
  try {
    res.render('admin/add-post', { pageTitle: 'Add new post', layout: adminLayout, currentRoute: '/dashboard', isAuth })
  } catch (e) {
    console.log(e);
  }
});

// Post add new post
router.post('/add-post', authMiddleware, async (req, res) => {
  try {
    try {
      const { title, body, image } = req.body;

      const newPost = new Post({ title, body, image, author: req.cookies.username });
      await Post.create(newPost);
      res.redirect('/dashboard/?newP=true');

    } catch (err) {
      console.log(err);
    }

  } catch (e) {
    console.log(e)
  }
});

// get edit-post page
router.get('/edit-post/:id', authMiddleware, async (req, res) => {
  try {
    const data = await Post.findOne({ _id: req.params.id });

    const {editP} = req.query;

    res.render('admin/edit-post', {
      data, pageTitle: 'Edit Post', layout: adminLayout, currentRoute: '/dashboard', editP, isAuth})
  } catch (err) {
    console.log(err)
  }
})

// Put edit post
router.put('/edit-post/:id', authMiddleware, async (req, res) => {
  try {

    await Post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      image: req.body.image,
      updatedAt: Date.now()
    })

    res.redirect(`/edit-post/${req.params.id}/?editP=true`);
  } catch (err) {
    console.log(err)
  }
});

// Delete post
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {
  try {

    await Post.deleteOne({ _id: req.params.id });
    res.redirect('/dashboard/?deleted=true')

  } catch (err) {
    console.log(err)
  }
});

// Get admin logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.clearCookie('username');
  req.session = null;
  res.redirect('/?logout=true');
})


module.exports = router