# Book Review API

A RESTful API built with Node.js and Express for managing books and user reviews. This project implements core backend functionalities, including user authentication with JWT, CRUD operations for books and reviews, and search capabilities.

## Table of Contents

-   [Features](#features)
-   [Tech Stack](#tech-stack)
-   [Project Setup](#project-setup)
    -   [Prerequisites](#prerequisites)
    -   [Cloning the Repository](#cloning-the-repository)
    -   [Installing Dependencies](#installing-dependencies)
    -   [Environment Variables (.env)](#environment-variables-env)
-   [How to Run Locally](#how-to-run-locally)
-   [API Endpoints](#api-endpoints)
    -   [Authentication](#authentication)
    -   [Books](#books)
    -   [Reviews](#reviews)
    -   [Search](#search)
-   [Design Decisions & Assumptions](#design-decisions--assumptions)
-   [License](#license)

## Features

* **User Authentication:** Signup and login using JWT (JSON Web Tokens).
* **Book Management:**
    * Add new books (authenticated users only).
    * Retrieve all books with pagination, and optional filters by author/genre.
    * Get detailed information for a single book, including its average rating and paginated reviews.
* **Review Management:**
    * Submit reviews for books (authenticated users, one review per user per book).
    * Update your own reviews.
    * Delete your own reviews.
* **Search Functionality:** Search books by title or author (partial and case-insensitive).

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (using Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT), `bcryptjs` for password hashing

## Project Setup

### Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js:** (v14 or higher recommended) - [nodejs.org](https://nodejs.org/)
* **npm:** (Comes with Node.js) or Yarn
* **MongoDB:**
    * **MongoDB Atlas Account:** Recommended for cloud-hosted database - [mongodb.com/atlas](https://www.mongodb.com/atlas)
    * (Alternatively) Local MongoDB Server installed and running.

### Cloning the Repository

```bash
git clone [https://github.com/YOUR_GITHUB_USERNAME/book-review-api.git](https://github.com/YOUR_GITHUB_USERNAME/book-review-api.git)
cd book-review-api

#installing dependecies
npm install

# .env

# MongoDB Connection URI (for MongoDB Atlas or local)
# Replace <username>, <password>, <cluster-name>, <database-name> with your Atlas details.
# If your password contains special characters like '@', '#', '!', URL-encode them.
# Example: If password is 'my@pass', use 'my%40pass'.
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority

# JWT Secret Key - Use a long, random, and complex string
JWT_SECRET=your_super_secret_jwt_key_here

# Port for the Express server to listen on
PORT=5000


#Start the backend server
npm start
# or
node server.js
```


## API Endpoints

You can test these endpoints using tools like **Postman**, **Insomnia**, or `curl` commands.

* **Base URL for all API requests:** `http://localhost:5000/api`
* **For Authenticated Endpoints:** You'll need a JWT (JSON Web Token) obtained from `/api/signup` or `/api/login`. Include it in the `Authorization` header as `Bearer <YOUR_JWT_TOKEN>`.

---

### Authentication

#### 1. Register a New User

* **URL:** `/api/signup`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body (JSON):**
    ```json
    {
        "username": "newuser",
        "password": "strongpassword123"
    }
    ```
* **Success Response (JSON):** `201 Created`
    ```json
    {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
        "username": "newuser",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTFhMmMzZDRlNWY2YjdiOGM5ZDAwMiIsImlhdCI6MTYyMTIzNDU2NywiZXhwIjoxNjIxMzIzNDU2N30.exampleJWTtoken"
    }
    ```
* **`curl` Example:**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"username": "newuser", "password": "strongpassword123"}' http://localhost:5000/api/signup
    ```

#### 2. Authenticate User & Get Token (Login)

* **URL:** `/api/login`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Request Body (JSON):**
    ```json
    {
        "username": "newuser",
        "password": "strongpassword123"
    }
    ```
* **Success Response (JSON):** `200 OK`
    ```json
    {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e1",
        "username": "newuser",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTFhMmMzZDRlNWY2YjdiOGM5ZDAwMiIsImlhdCI6MTYyMTIzNDU2NywiZXhwIjoxNjIxMzIzNDU2N30.anotherExampleJWTtoken"
    }
    ```
* **`curl` Example:**
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"username": "newuser", "password": "strongpassword123"}' http://localhost:5000/api/login
    ```

---

### Books

#### 1. Add a New Book

* **URL:** `/api/books`
* **Method:** `POST`
* **Headers:**
    * `Content-Type: application/json`
    * `Authorization: Bearer <YOUR_JWT_TOKEN>`
* **Request Body (JSON):**
    ```json
    {
        "title": "The Hitchhiker's Guide to the Galaxy",
        "author": "Douglas Adams",
        "genre": "Science Fiction"
    }
    ```
* **Success Response (JSON):** `201 Created`
    ```json
    {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
        "title": "The Hitchhiker's Guide to the Galaxy",
        "author": "Douglas Adams",
        "genre": "Science Fiction",
        "user": "60a1b2c3d4e5f6a7b8c9d0e1",
        "createdAt": "2023-10-26T10:00:00.000Z",
        "updatedAt": "2023-10-26T10:00:00.000Z",
        "__v": 0
    }
    ```
* **`curl` Example:** (Replace `YOUR_JWT_TOKEN`)
    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{"title": "The Hitchhiker\'s Guide to the Galaxy", "author": "Douglas Adams", "genre": "Science Fiction"}' http://localhost:5000/api/books
    ```

#### 2. Get All Books

* **URL:** `/api/books`
* **Method:** `GET`
* **Query Parameters (Optional):**
    * `?page=1&limit=10` (for pagination)
    * `?author=Douglas Adams` (filter by author)
    * `?genre=Science Fiction` (filter by genre)
    * `?keyword=galaxy` (search by title or author)
* **Success Response (JSON):** `200 OK`
    ```json
    {
        "books": [
            {
                "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
                "title": "The Hitchhiker's Guide to the Galaxy",
                "author": "Douglas Adams",
                "genre": "Science Fiction",
                "user": "60a1b2c3d4e5f6a7b8c9d0e1",
                "createdAt": "2023-10-26T10:00:00.000Z",
                "updatedAt": "2023-10-26T10:00:00.000Z",
                "averageRating": 0,
                "__v": 0
            }
        ],
        "page": 1,
        "pages": 1,
        "totalBooks": 1
    }
    ```
* **`curl` Example:**
    ```bash
    curl http://localhost:5000/api/books?page=1&limit=5&genre=Fantasy
    ```

#### 3. Get Book Details by ID

* **URL:** `/api/books/:id`
* **Method:** `GET`
* **Path Parameter:** `:id` - The `_id` of the book.
* **Query Parameters (Optional for reviews):**
    * `?reviewPage=1&reviewLimit=5`
* **Success Response (JSON):** `200 OK`
    ```json
    {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
        "title": "The Hitchhiker's Guide to the Galaxy",
        "author": "Douglas Adams",
        "genre": "Science Fiction",
        "user": "60a1b2c3d4e5f6a7b8c9d0e1",
        "createdAt": "2023-10-26T10:00:00.000Z",
        "updatedAt": "2023-10-26T10:00:00.000Z",
        "averageRating": 0,
        "reviews": [],
        "reviewPage": 1,
        "reviewPages": 0,
        "totalReviews": 0,
        "__v": 0
    }
    ```
* **`curl` Example:** (Replace `BOOK_ID` with an actual book ID)
    ```bash
    curl http://localhost:5000/api/books/60a1b2c3d4e5f6a7b8c9d0e2
    ```

---

### Reviews

#### 1. Submit a Review for a Book

* **URL:** `/api/books/:id/reviews`
* **Method:** `POST`
* **Path Parameter:** `:id` - The `_id` of the book being reviewed.
* **Headers:**
    * `Content-Type: application/json`
    * `Authorization: Bearer <YOUR_JWT_TOKEN>`
* **Request Body (JSON):**
    ```json
    {
        "rating": 5,
        "comment": "Absolutely brilliant, made me laugh out loud!"
    }
    ```
* **Success Response (JSON):** `201 Created`
    ```json
    {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e3",
        "book": "60a1b2c3d4e5f6a7b8c9d0e2",
        "user": "60a1b2c3d4e5f6a7b8c9d0e1",
        "rating": 5,
        "comment": "Absolutely brilliant, made me laugh out loud!",
        "createdAt": "2023-10-26T10:05:00.000Z",
        "updatedAt": "2023-10-26T10:05:00.000Z",
        "__v": 0
    }
    ```
* **Note:** Only one review per user per book is allowed.
* **`curl` Example:** (Replace `BOOK_ID` and `YOUR_JWT_TOKEN`)
    ```bash
    curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{"rating": 5, "comment": "Absolutely brilliant, made me laugh out loud!"}' http://localhost:5000/api/books/60a1b2c3d4e5f6a7b8c9d0e2/reviews
    ```

#### 2. Update Your Own Review

* **URL:** `/api/reviews/:id`
* **Method:** `PUT`
* **Path Parameter:** `:id` - The `_id` of the review to update.
* **Headers:**
    * `Content-Type: application/json`
    * `Authorization: Bearer <YOUR_JWT_TOKEN>`
* **Request Body (JSON):**
    ```json
    {
        "rating": 4,
        "comment": "Still brilliant, but maybe a 4 for minor pacing issues."
    }
    ```
* **Success Response (JSON):** `200 OK`
    ```json
    {
        "_id": "60a1b2c3d4e5f6a7b8c9d0e3",
        "book": "60a1b2c3d4e5f6a7b8c9d0e2",
        "user": "60a1b2c3d4e5f6a7b8c9d0e1",
        "rating": 4,
        "comment": "Still brilliant, but maybe a 4 for minor pacing issues.",
        "createdAt": "2023-10-26T10:05:00.000Z",
        "updatedAt": "2023-10-26T10:10:00.000Z",
        "__v": 0
    }
    ```
* **`curl` Example:** (Replace `REVIEW_ID` and `YOUR_JWT_TOKEN`)
    ```bash
    curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_JWT_TOKEN" -d '{"rating": 4, "comment": "Still brilliant, but maybe a 4 for minor pacing issues."}' http://localhost:5000/api/reviews/60a1b2c3d4e5f6a7b8c9d0e3
    ```

#### 3. Delete Your Own Review

* **URL:** `/api/reviews/:id`
* **Method:** `DELETE`
* **Path Parameter:** `:id` - The `_id` of the review to delete.
* **Headers:**
    * `Authorization: Bearer <YOUR_JWT_TOKEN>`
* **Success Response (JSON):** `200 OK`
    ```json
    {
        "message": "Review removed"
    }
    ```
* **`curl` Example:** (Replace `REVIEW_ID` and `YOUR_JWT_TOKEN`)
    ```bash
    curl -X DELETE -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:5000/api/reviews/60a1b2c3d4e5f6a7b8c9d0e3
    ```

---

### Search

#### 1. Search Books by Title or Author

* **URL:** `/api/search?q=<SEARCH_QUERY>`
* **Method:** `GET`
* **Query Parameter:** `q` - The search term (e.g., `galaxy`, `adams`).
* **Success Response (JSON):** `200 OK`
    ```json
    [
        {
            "_id": "60a1b2c3d4e5f6a7b8c9d0e2",
            "title": "The Hitchhiker's Guide to the Galaxy",
            "author": "Douglas Adams",
            "genre": "Science Fiction",
            "user": "60a1b2c3d4e5f6a7b8c9d0e1",
            "createdAt": "2023-10-26T10:00:00.000Z",
            "updatedAt": "2023-10-26T10:00:00.000Z",
            "averageRating": 4.5,
            "__v": 0
        }
    ]
    ```
* **`curl` Example:**
    ```bash
    curl http://localhost:5000/api/search?q=hitchhiker
    ```

---

## Database Schema Design

This API utilizes a MongoDB database, with schemas defined using Mongoose. Below is a brief overview of the main collections and their relationships.

### 1. User Schema (`User` Collection)

Represents a user in the system.

* **`_id`**: MongoDB's default unique identifier for the document.
* **`username`**:
    * **Type:** `String`
    * **Required:** Yes
    * **Unique:** Yes
    * **Description:** User's unique identifier for login.
* **`password`**:
    * **Type:** `String`
    * **Required:** Yes
    * **Description:** Hashed password of the user (stored securely using `bcryptjs`).
* **`createdAt`**:
    * **Type:** `Date`
    * **Description:** Timestamp for when the user was created.
* **`updatedAt`**:
    * **Type:** `Date`
    * **Description:** Timestamp for when the user's data was last updated.

### 2. Book Schema (`Book` Collection)

Represents a book entry.

* **`_id`**: MongoDB's default unique identifier for the document.
* **`title`**:
    * **Type:** `String`
    * **Required:** Yes
    * **Description:** The title of the book.
* **`author`**:
    * **Type:** `String`
    * **Required:** Yes
    * **Description:** The author of the book.
* **`genre`**:
    * **Type:** `String`
    * **Required:** Yes
    * **Description:** The genre of the book.
* **`user`**:
    * **Type:** `ObjectId`
    * **Ref:** `User`
    * **Required:** Yes
    * **Description:** References the user who added this book.
* **`createdAt`**:
    * **Type:** `Date`
    * **Description:** Timestamp for when the book was added.
* **`updatedAt`**:
    * **Type:** `Date`
    * **Description:** Timestamp for when the book's data was last updated.
* **`averageRating`**:
    * **Type:** `Virtual (Number)`
    * **Description:** A calculated field that dynamically computes the average rating from all associated reviews for this book. **Not stored directly** in the database.

### 3. Review Schema (`Review` Collection)

Represents a user's review for a specific book.

* **`_id`**: MongoDB's default unique identifier for the document.
* **`book`**:
    * **Type:** `ObjectId`
    * **Ref:** `Book`
    * **Required:** Yes
    * **Description:** References the book being reviewed.
* **`user`**:
    * **Type:** `ObjectId`
    * **Ref:** `User`
    * **Required:** Yes
    * **Description:** References the user who submitted the review.
* **`rating`**:
    * **Type:** `Number`
    * **Required:** Yes
    * **Min:** 1
    * **Max:** 5
    * **Description:** The rating given by the user (1-5 stars).
* **`comment`**:
    * **Type:** `String`
    * **Description:** Optional textual comment accompanying the rating.
* **`createdAt`**:
    * **Type:** `Date`
    * **Description:** Timestamp for when the review was submitted.
* **`updatedAt`**:
    * **Type:** `Date`
    * **Description:** Timestamp for when the review was last updated.

### Relationships:

* **One-to-Many (User to Book):** One user can add multiple books. (A `Book` has a `user` field referencing the `User` who added it).
* **Many-to-Many (User to Book via Review):** Users can review many books, and books can have many reviews from different users.
* **One-to-Many (Book to Review):** One book can have multiple reviews. (A `Review` has a `book` field referencing the `Book` it's for).
* **One-to-One (User to Review for a specific book):** Each user can submit only one review for a given book. This is enforced by a unique compound index on `(book, user)` within the `Review` schema.

---