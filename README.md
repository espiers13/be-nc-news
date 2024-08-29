# Northcoders News API

Hosted on: Render
https://nc-news-es.onrender.com
Northcoders News is an API built for the purpose of accessing application data programatically.
This mimics real world backend services (such as Reddit) and provides this information to the front end architecture.

This database is run with PostgreSQL and node-postgres.

To install PostgreSQL: https://www.w3schools.com/postgresql/postgresql_install.php

To install npm:
npm install npm@latest -g

Installation:

1. Clone the reop:
   https://github.com/espiers13/be-nc-news.git

2. Install dependencies:
   npm install

3. devDependencies used:
   {
   "husky": "^8.0.2",
   "jest": "^27.5.1",
   "jest-extended": "^2.0.0",
   "jest-sorted": "^1.0.15",
   "pg-format": "^1.0.4",
   "supertest": "^7.0.0"
   }

4. In order to successfully connect the two databases in be-nc-news locally the following files must be added:
   .env.development
   .env.test

These files must contain the following:
.env.development --> PGDATABASE=nc_news
.env.test --> PGDATABASE=nc_news_test

5. In order to set up the database run command:
   npm run setup-dbs

6. To seed the local database run command:
   npm run seed

7. Tests are run using jest supertest. To run tests use command:
   npm run test

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
