const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

const fs = require('fs');
const postsFilePath = './data/posts.json';

let posts = [];

//Set EJS as templating engine 
app.set('view engine', 'ejs');

//Middleware for static files and body parsing
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

// Function to load posts from file
function loadPosts() {
    try {
        const data = fs.readFileSync(postsFilePath, 'utf8');
        posts = JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // File not found, create the file.
            console.log('No posts file found, creating new file.');
            savePosts();  // Save the initial empty array to file
        } else if (error instanceof SyntaxError) {
            // Syntax error in JSON parsing, log the error and use an empty array
            console.error('Error parsing JSON in posts file:', error);
            savePosts();  // Reset file with empty array
        } else {
            // Other errors, throw them
            throw error;
        }
    }
}

// Function to save posts to file
function savePosts() {
    const filePath = path.join(__dirname, 'data', 'posts.json');
    fs.writeFile(filePath, JSON.stringify(posts, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Failed to save posts:', err);
        }
    })
}

// Initialize posts on app start
loadPosts();


// Home page - Display all posts
app.get('/', (req, res) => {
    res.render('pages/index', { posts: posts });
});

// New Post page
app.get('/new-post', (req, res) => {
    res.render('pages/new-post');
});

// Create Post
app.post('/posts', (req, res) => {
    const newPost = {
        id: posts.length + 1, // Simple ID assignment
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost); // Adding new post to the array

    savePosts(); // This function should write the posts array to posts.json
    res.redirect('/'); // Redirecting to home to show all posts
});

app.get('/edit-post/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(post => post.id === postId);
    if (post) {
        res.render('pages/edit-post', { post: post });
    } else {
        res.status(404).send('Post not found');
    }
});

app.post('/edit-post/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    let found = false;

    // Iterate over the posts array to find and update the post
    posts = posts.map(post => {
        if (post.id === postId) {
            found = true;
            return { ...post, title, content };  // Update the post with new data
        }
        return post;  // Return unmodified post
    });

    // Save the updated posts array to the JSON file
    if (found) {
        savePosts(); 
        res.redirect('/');
    } else {
        res.status(404).send('Post not found');
    }
});

app.get('/delete-post/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const newPosts = posts.filter(post => post.id !== postId);
    if (posts.length !== newPosts.length) {
        posts = newPosts;
        savePosts();
        res.redirect('/');
    } else {
        res.status(404).send('Post not found');
    }
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));