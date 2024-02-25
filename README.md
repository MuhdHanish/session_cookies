# Session and Cookie Management with Express.js

This is a simple project demonstrating session and cookie management, as well as basic authentication using Express.js, EJS templates, MongoDB for data storage, and bcrypt for password hashing.

## Features

- **User Authentication**: Users can sign up and log in securely.
- **Session Management**: Sessions are maintained using `express-session` middleware and stored in MongoDB using `connect-mongodb-session`.
- **Password Hashing**: Passwords are securely hashed using bcrypt before being stored in the database.
- **Request Validation**: Request bodies are validated using `express-validator` middleware to ensure required fields are filled and email formats are valid.
- **Error Handling**: Errors during signup, login, and logout are caught and appropriate error messages are rendered to the user.

## Setup

1. **Install Dependencies**:
   ```bash
   npm install

2. **Start the Server**:
   ```bash
   npm run dev
2. **Access the Application**:
   - Open your browser and go to http://localhost:3000 to access the application.

## Usage

- **Signup**: Visit the signup page http://localhost:3000/signup to create a new account.
- **Login**: Visit the login page http://localhost:3000/login to log in to your account.
- **Logout**: Click on the "Logout" button to log out of your account.
- **Protected Routes**: Access to the home page http://localhost:3000/ is restricted to authenticated users only.

## Dependencies

- **Express.js**: Web application framework for Node.js.
- **express-session**: Middleware for session management.
- **express-validator**: Middleware for request validation.
- **bcryptjs**: Library for password hashing.
- **mongoose**: MongoDB object modeling tool.
- **connect-mongodb-session**: Session store for MongoDB.
- **EJS**: Embedded JavaScript templates for server-side rendering.


## What are Sessions and Cookies?

- **Sessions**: Sessions are a way to store user data on the server side. When a user logs in, a session is created and a unique session ID is generated. This session ID is stored as a cookie in the user's browser. Subsequent requests from the same user include this session ID, allowing the server to identify the user and retrieve their session data.

- **Cookies**: Cookies are small pieces of data stored in the user's browser. They are often used for tracking user sessions, storing user preferences, and implementing features like "remember me" functionality. In the context of session management, cookies are used to store session IDs, which are then used to retrieve session data from the server.

## Authentication and Authorization

- **Authentication**: Authentication is the process of verifying the identity of a user. In this project, users are authenticated using their email and password. Upon successful authentication, a session is created for the user, allowing them to access protected routes.

- **Authorization**: Authorization is the process of determining whether a user has permission to access certain resources or perform certain actions. In this project, authorization is implemented using middleware functions to restrict access to certain routes based on whether the user is authenticated.


This README provides comprehensive information about the project, including setup instructions, usage guidelines, dependencies, and explanations of session and cookie management, as well as authentication and authorization.
