# DEEL BACKEND

## Setup instructions

### Prerequisite

1. Have Node.js and npm installed
2. Start by cloning this repository.
3. In the repo root directory, run `npm install` to gather all dependencies.

### Running backend

1. Next, `npm run seed` will seed the local SQLite database. **Warning: This will drop the database if it exists**. The database lives in a local file `database.sqlite3`.
2. Then run `npm start` which should start both the server and the React client.
3. Import the `Deel BE.postman_collection.json` file for the Postman API request collection for the document

### Running testcases

1. Run `npm run test`. this will create a separate copy of SQLite database for testing

[TODO]: add more testcases, currently test coverage is low.

## Technical Decisions

1. Updates to the project structure was made for readability and maintainability
2. Separate database for Unit tests is used, instead of mocking database calls.
3. An http header `x-profile-id` is used inplace for authentication to identify the user calling the API (This should be changed for a real project)
4. Many GET APIs are designed to accept `profileId` as query params, this was a intentional decision as the requirements was not super specific and this will help in making the APIs extendable. (Admin listing contract for another employee)

### Trade offs due to the time contraint

1. Logger not configured. ideally configure a logger like `Pino` or `Winston` for logging and use appropriate log levels while logging
2. Update database to alternative RDMS system like `Mysql` or `Postgres`. SQLite should not be used in a non-dev environment
3. Use process manager like `pm2` to run server on production system instead of nodemon.
4. Dockerize the application for easy build and deployment
5. Add API documentation with OpenAPI Spec or Swagger
6. Add authentication
7. Improve unit testing setup, setup and teardown database for each test file.
8. Clean commit history, do atomic commits for every feature
