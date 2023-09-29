CREATE DATABASE my_mariooffertucci;
USE my_mariooffertucci;

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

CREATE TABLE active_sessions(
	session_id varchar(250) PRIMARY KEY NOT NULL,
    username varchar(120),
    FOREIGN KEY (username) REFERENCES user(username) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE refresh_token_ids(
	session_id varchar(250) PRIMARY KEY NOT NULL,
    refresh_token varchar(255) NOT NULL,
    FOREIGN KEY (session_id) REFERENCES active_sessions(session_id) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO `user` (`username`, `password`, `name`, `surename`, `token`) VALUES ('test_user', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3', 'test', 'test', '')
