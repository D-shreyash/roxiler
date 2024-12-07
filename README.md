# Roxiler Assignment

## Project Overview
This is a full-stack web application with a React frontend and a Node.js backend. The frontend communicates with the backend using RESTful API requests. The backend is responsible for initializing the database and handling API calls, while the frontend provides the user interface.

## Steps to Run the Project

### Backend

1. **Clone the Repository**
   Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   cd <repository-backend-directory>
   
Install Dependencies Install the necessary backend dependencies:
 ```bash
npm install

Configure Environment Variables Create a .env file in the back_end directory and add the following:
 ```bash
MONGO_URI=<your-mongo-db-uri>

Start the Server Start the backend server:
 ```bash
npm start

The backend will run on http://localhost:5000.

Initialize the Database To initialize the database with the provided seed URL, send a GET request:
 ```bash
GET http://localhost:5000/api/initialize
This will set up the necessary data in the database.
