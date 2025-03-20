# Blog Post Manager

A full-stack application for managing blog posts with CRUD functionality.

## Features

- Create, read, update, and delete blog posts
- Responsive UI with clean design
- Form validation and error handling
- RESTful API with proper error handling
- Containerized with Docker

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB for data storage
- Jest for unit testing
- Docker for containerization

### Frontend
- React
- React Context API for state management
- React Router for navigation
- CSS for styling


## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB
- Docker and Docker Compose (optional)

### Running with Docker

The easiest way to run the application is using Docker Compose:

docker-compose up


This will start the backend, frontend, and MongoDB services. The application will be available at http://localhost.

### Running Locally

#### Backend

1. Navigate to the backend directory:

cd backend


2. Install dependencies:

npm install

DO NOT FORGET TO INSTALL MONGO VIA DOCKER
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
newgrp docker
docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:latest

3. Create a `.env` file with the following content:

PORT=5000
MONGO_URI=mongodb://localhost:27017/blog-post-manager
NODE_ENV=development



4. Start the server:

npm start



The API will be available at http://localhost:5000.

#### Frontend

1. Navigate to the frontend directory:

cd frontend


2. Install dependencies:

npm install



3. Create a `.env` file with the following content:


REACT_APP_API_URL=http://localhost:5000/api/v1


4. Start the development server:

npm start



The frontend will be available at http://localhost:3000.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/v1/posts | Get all posts |
| GET    | /api/v1/posts/:id | Get a specific post |
| POST   | /api/v1/posts | Create a new post |
| PATCH  | /api/v1/posts/:id | Update a post |
| DELETE | /api/v1/posts/:id | Delete a post |

## Testing

### Backend Tests

Run the backend tests with:


cd backend
npm test


