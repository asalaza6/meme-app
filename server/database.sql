CREATE DATABASE memelogin;

--create extension 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--set extension
CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

--insert fake users

INSERT INTO users (user_name, user_email,user_password) VALUES ('alex','alex@gmail.com','alex');


--create images table

CREATE TABLE images(
    image_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    user_id uuid NOT NULL,
    image_name VARCHAR(255) NOT NULL,
    image_type VARCHAR(255) NOT NULL,
    create_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP(2)
);

--create comments table

CREATE TABLE comments(
    comment_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    image_id uuid NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    comment_content VARCHAR(255) NOT NULL,
    create_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP(2)
);

--create comments table

CREATE TABLE likes(
    like_id uuid PRIMARY KEY DEFAULT
    uuid_generate_v4(),
    image_id uuid NOT NULL,
    user_id uuid NOT NULL
);
