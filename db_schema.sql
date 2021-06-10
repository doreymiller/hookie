-- to import this into postgresql
-- type `psql` to get into the psql interface
-- then type `\i db_schema.sql`.
-- It will create the database and connect you directly.

CREATE DATABASE hookie;
\c hookie;

CREATE TABLE users (
  id serial PRIMARY KEY,
  ip varchar(39) UNIQUE
);

CREATE TABLE bins (
  id serial PRIMARY KEY,
  user_id integer REFERENCES users(id),
  hex_id varchar(10) UNIQUE NOT NULL,
  private boolean DEFAULT false,
  creation_time timestamp NOT NULL,
  request_count integer
);

CREATE TABLE requests (
  id serial PRIMARY KEY,
  content jsonb,
  request_time timestamp,
  bin_id integer REFERENCES bins(id)
);

--INITIALIZE THREE USERS
INSERT INTO users (ip) VALUES ('192.1.1.1');
INSERT INTO users (ip) VALUES ('192.1.1.2');
INSERT INTO users (ip) VALUES ('192.1.1.3');


--INITIALIZE THREE NEW BINS
INSERT INTO bins (user_id, hex_id, private, creation_time, request_count)
VALUES (1, '2abc9f', false, CURRENT_TIMESTAMP, 2);

INSERT INTO bins (user_id, hex_id, private, creation_time, request_count)
VALUES (1, 'a34bc9f', false, CURRENT_TIMESTAMP, 3);

INSERT INTO bins (user_id, hex_id, private, creation_time, request_count)
VALUES (2, '7affc9f', true, CURRENT_TIMESTAMP, 1);

-- CREATE 6 NEW REQUESTS TIED TO BINS CREATED EARLIER
INSERT INTO requests (request_time, bin_id) VALUES (CURRENT_TIMESTAMP, 1);
INSERT INTO requests (request_time, bin_id) VALUES (CURRENT_TIMESTAMP, 1);
INSERT INTO requests (request_time, bin_id) VALUES (CURRENT_TIMESTAMP, 2);
INSERT INTO requests (request_time, bin_id) VALUES (CURRENT_TIMESTAMP, 2);
INSERT INTO requests (request_time, bin_id) VALUES (CURRENT_TIMESTAMP, 2);
INSERT INTO requests (request_time, bin_id) VALUES (CURRENT_TIMESTAMP, 3);