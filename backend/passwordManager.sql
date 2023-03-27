CREATE DATABASE passwordManager;
USE passwordManager;

CREATE TABLE user(
    username varchar(120) PRIMARY KEY NOT NULL,
    password varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    surename varchar(255) NOT NULL,
    token varchar(255)
);

CREATE TABLE credential(
    username varchar(120) NOT NULL,
    name varchar(120) NOT NULL,
    secret varchar(1000) NOT NULL,
    PRIMARY KEY (username, name),
    FOREIGN KEY (username) REFERENCES user(username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE active_session(
	session_id varchar(250) PRIMARY KEY NOT NULL,
    username varchar(120),
    FOREIGN KEY (username) REFERENCES user(username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE session_variable(
	session_id varchar(250) PRIMARY KEY NOT NULL,
    value varchar(255) NOT NULL,
    FOREIGN KEY (session_id) REFERENCES active_session(session_id) ON UPDATE CASCADE ON DELETE CASCADE
);