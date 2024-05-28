###### WEB APP DESCRIPTION ######
BetaSpray

###### TECH STACK ######
Database Tech Stack:
1. PostgreSQL: Relational database management system (RDBMS), used as the primary database for storing application data.

Backend Tech Stack:
1. Node.js: Runtime environment
2. Express.js: Web framework
3. Passport.js: Authentication middleware
4. passport-google-oauth20: Google OAuth 2.0 strategy for Passport (this is sick)
5. dotenev: Environment variable management (.env file)
6. pg (node-postgres): PostgreSQL client
7. express-session: Session management
8. body-parser: Request body parsing

Frontend Tech Stack:
1. React: JavaScript library for building user interfaces
2. Vite: Build tool and development server
3. Tailwind CSS: Utility-first CSS framework
4. TypeScript: Typed superset of JavaScript
5. Shadcn UI: UI component library for React

###### SET UP ######
TERMINAL 1:
1. go to database/
2. run: psql postgres (this will take you into psql mode)
3. run: create database boulder_hub; (with the semikolon)

TERMINAL 2:
1. also in database dir, run 'psql -f initialize.sql postgres'

TERMINAL 3:
1. go to server/
2. npm start

Web Browser:
1. also in server/
2. go to your web browser url: localhost:3000/auth, select your google account and it will direct you into localhost:3000/profile