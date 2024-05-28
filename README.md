to run .sql script: 

TERMINAL 1:
1. go to database/
2. run: psql postgres (this will take you into psql mode)
3. run: create database boulder_hub; (with the semikolon)

TERMINAL 2:
1. also in database dir, run 'psql -f initialize.sql postgres'

TERMINAL 3:
1. go to server/
2. npm start

TERMINAL 4:
1. also in server/
2. run: curl localhost:3000/auth (this to create account, which is going to be a button on the frontend)
3. then run: curl localhost:3000/profile (this to view profile)