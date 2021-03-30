var bodyParser = require('body-parser'),
    methodOverride = require('method-override');
mongoose = require('mongoose');
expressSanitizer = require('express-sanitizer');
express = require('express');
app = express();

//App Config
mongoose.connect('mongodb://localhost/restful_blog_app', { useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride('_method'));

const Blog = require('./models/blog')

//RESTful Routes

app.get('/', (req, res) => {
    res.redirect('/blogs');
})

//INDEX
app.get('/blogs', (req, res) => {
    Blog.find({}, function (err, blogs) {
        if (err) {
            console.log('Error!');
        } else {
            res.render('index', { blogs: blogs });
        }
    })
})

//NEW
app.get('/blogs/new', (req, res) => {
    res.render('new');
})

//CREATE
app.post('/blogs', (req, res) => {
    //create a new blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, newBlog) => {
        if (err) {
            res.render('new');
        } else {
            res.redirect('/blogs');
        }
    })
})

//SHOW
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.render('show', { blog: foundBlog });
        }
    })
})

//EDIT
app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id, (err, foundBlog) => {
        if (err) {
            res.render('/blogs');
        } else {
            res.render('edit', { blog: foundBlog });
        }
    })
})

//UPDATE
app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) => {
        if (err) {
            res.redirect('/blogs');
        } else {
            res.redirect('/blogs/' + req.params.id);
        }
    })
})

//DELETE
app.delete('/blogs/:id/delete', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
        if (err) {
            res.render('/blogs');
        } else {
            res.redirect('/blogs');
        }
    })
})

//Start Server
app.listen(3000, () => {
    console.log('Server Started!');
})