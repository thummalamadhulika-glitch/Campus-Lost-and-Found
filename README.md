
# Campus Lost and Found Portal

## Project Description

Campus Lost and Found Portal is a web-based application developed to help students report lost and found items within the college campus.

Students can report lost or found belongings, search for items, and submit claims to recover their belongings. Administrators can manage items and approve or reject student claims.

## Objectives

- To provide an online platform for reporting lost and found items.
- To help students search for missing belongings.
- To allow students to submit claims.
- To help administrators manage reports and claims.
- To maintain item and claim details in a database.

## Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Testing
- Postman

### Tools
- Visual Studio Code
- Git and GitHub

## Main Features

1. Student Registration and Login
2. Lost Item Reporting
3. Found Item Reporting
4. Image Upload
5. Search and Filter Items
6. Date Sorting
7. Student Dashboard
8. Claim Submission
9. Admin Dashboard
10. Approve and Reject Claims

## Project Structure

Campus-Lost-and-Found/
- frontend/
- backend/
- Screenshots/
- README.md

## Installation and Setup

### 1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_LINK

### 2. Install Backend Dependencies

cd backend

npm install

### 3. Configure Environment Variables

Create a .env file inside the backend folder.

Add your MongoDB connection string and JWT secret.

Do not upload your .env file to GitHub.

### 4. Start the Backend Server

npm run dev

### 5. Open the Frontend

Open frontend/index.html using a browser or Live Server.

## API Testing

The application was tested using Postman.

The following APIs were tested:

1. Student Registration
2. Student Login
3. Get All Items
4. Add New Item
5. Search Items
6. Get My Items
7. Submit Claim
8. Get My Claims
9. Admin Get All Claims
10. Approve and Reject Claims

## Conclusion

The Campus Lost and Found Portal provides a simple and convenient way for students to report and search for lost and found items. It also helps administrators manage claims efficiently using a database-driven web application.
