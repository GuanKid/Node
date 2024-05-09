const express = require('express');
const path = require('path');
const newPostController = require('./controllers/newPost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const storePostController = require('./controllers/storePost');
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const logoutController = require('./controllers/logout');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const BlogPost = require('./models/BlogPost');
const fileUpload = require('express-fileupload');


const app = express();
const ejs = require('ejs');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const validateMiddleWare = (req, res, next) => {
    if (req.files == null || req.body.title == null) {
        return res.redirect('/posts/new')
    }
    next()
};

app.use('/posts/store', validateMiddleWare);

mongoose.connect('mongodb://localhost/my_database', { useUnifiedTopology: true, useNewUrlParser: true });

const PORT = 4000;

// Moved session middleware above other routes
app.use(expressSession({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

global.loggedIn = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next()
});

app.use(fileUpload());

app.listen(PORT, () => {
    console.log('App listening on port 4000');
});

app.get('/', async (req, res) => {
    const blogposts = await BlogPost.find({});
    res.render('index', {
        blogposts: blogposts
    });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/samplepost', (req, res) => {
    res.render('samplepost');
});

app.get('/post/:id', async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post', {
        blogpost: blogpost
    });
});

app.get('/posts/new', newPostController);

app.get('/create', (req, res) => {
    res.render('create');
});

app.post('/posts/store', async (req, res) => {
    try {
        let image = req.files.image;
        await image.mv(path.resolve(__dirname, 'public/img', image.name));
        await BlogPost.create({
            ...req.body,
            image: '/img/' + image.name
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/auth/register', newUserController);
app.post('/users/register', storeUserController);

app.get('/auth/login', loginController);
app.post('/users/login', loginUserController);

app.get('/auth/logout', logoutController);

app.get('/posts/new', authMiddleware, newPostController)

app.post('/posts/store', authMiddleware, storePostController)

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController)


app.get('/posts/new',authMiddleware, newPostController)
// app.get('/', homeController)
// app.get('/post/:id',getPostController)
app.post('/posts/store', authMiddleware, storePostController)
app.get('/auth/register', redirectIfAuthenticatedMiddleware,newUserController)
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)
app.post('/users/login',redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/auth/logout', logoutController)
app.use((req, res) => res.render('notfound'));