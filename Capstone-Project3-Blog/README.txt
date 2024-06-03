Blog Project Documentation
Overview
This documentation provides an overview of a simple blog application built using Node.js, Express.js, and EJS. 
The application allows users to create, view, edit, and delete blog posts. 
It uses a local JSON file (posts.json) to store post data, which is not persisted across server restarts.

File Hierarchy
Capstone-Project3-Blog/
├── data/
│   └── posts.json        # Stores blog posts in JSON format
├── node_modules/         # Node.js modules (not tracked in version control)
├── public/
│   └── css/
│       └── style.css     # Contains styles for the frontend
├── views/
│   ├── pages/
│   │   ├── edit-post.ejs # Page for editing an existing post
│   │   ├── index.ejs     # Home page showing all posts
│   │   └── new-post.ejs  # Page to create a new post
│   └── partials/
│       ├── footer.ejs    # Footer partial for the website
│       └── header.ejs    # Header partial for the website
├── app.js                # Main application file defining server and routes
├── package.json          # Node.js project manifest
└── package-lock.json     # Describes exact tree generated in node_modules/

Backend Details
Node.js & Express.js Setup:

express: The framework used to build the server.
body-parser: Middleware to parse incoming request bodies.
path: Utility for handling and transforming file paths.
Starting the Server:

The server listens on port 3000 and can be accessed locally via http://localhost:3000.
Routes:

GET /: Renders the home page displaying all posts.
GET /new-post: Serves the page to create a new blog post.
POST /posts: Handles the creation of a new post and saves it to posts.json.
GET /edit-post/:id: Displays the edit form for an existing post.
POST /edit-post/:id: Processes updates to an existing post and saves changes.
GET /delete-post/:id: Deletes a post and updates the posts.json file.
EJS Templating:

Utilizes EJS as the templating engine to dynamically generate HTML based on server-side data.
Functionality
Loading and Saving Posts:

loadPosts(): Loads posts from posts.json at startup. If the file doesn't exist or has errors, it initializes with an empty array.
savePosts(): Writes the current state of posts back to posts.json, ensuring data persistence through server sessions.

Post Management:

Posts are represented as objects with id, title, and content.
New posts are added to an array and assigned an incremental id based on array length, which serves as a simple unique identifier.
Development and Maintenance
Developers should ensure Node.js is installed to run the application. 
The application should be maintained by regularly updating dependencies, managing security patches, and ensuring the data handling remains robust against potential JSON parsing errors or file system access issues.

Running the Application
To start the application, navigate to the project directory in a terminal and run:

node app.js

This command starts the server. The blog can be accessed by visiting http://localhost:3000 in a web browser.