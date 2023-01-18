# movie-ticket-reservation-app
A full stack web app to handle a movie theatre ticket reservation system. The backend is built with Express.js, the frontend is built with React.js, and the database is using MySQL.

## Instructions for building and running locally:

A sample .env file with environment variables necessary for running the server has been placed in the /server folder. The DB_USER and DB_Pass fields in particular need to be provided to match a user's specific individual MySQL settings, or else the app will not be able to communicate with the data store.

### Backend:
1. cd server
1. npm install
1. node server.js

The server will now be running on http://localhost:5000. No manual interaction with the server is required.

### Database:
1. Load your MySQL server as per your individual machine settings
1. Run the 'MovieTheatre_DB.sql' script with your preferred method to construct the database schema and load sample data

### Frontend:
1. cd client
1. npm install
1. npm run build
1. npm install -g serve
1. serve -s build

The client will now be running on http://localhost:3000. Visit the address in a web browser to navigate and use the app.
