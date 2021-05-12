CREATE DATABASE memelogin;

--create extension 
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--set extension

--updated
CREATE TABLE users(
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    PRIMARY KEY(user_name)
);

--updated images table
CREATE TABLE images(
    image_id uuid DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL REFERENCES users(user_name),
    image_type VARCHAR(255) NOT NULL,
    create_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP(2),
    PRIMARY KEY(image_id)
);

--updated comments table
CREATE TABLE comments(
    comment_id uuid DEFAULT uuid_generate_v4(),
    image_id uuid NOT NULL REFERENCES images(image_id),
    user_name VARCHAR(255) REFERENCES users(user_name),
    comment_content VARCHAR(255) NOT NULL,
    create_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP(2),
    PRIMARY KEY(comment_id)
);

--update likes table
CREATE TABLE likes(
    image_id uuid NOT NULL REFERENCES images(image_id),
    user_name VARCHAR(255) NOT NULL REFERENCES users(user_name),
    PRIMARY KEY(image_id, user_name)
);

-- follows table
CREATE TABLE follows(
    followee VARCHAR(255) REFERENCES users(user_name),
    follower VARCHAR(255) REFERENCES users(user_name),
    PRIMARY KEY (followee,follower)
);