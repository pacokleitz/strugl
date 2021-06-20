/* Table of users */
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(30) UNIQUE NOT NULL,
    profile_name VARCHAR(30) NOT NULL,
	email VARCHAR(254) UNIQUE NOT NULL,
    password_hash VARCHAR(64) NOT NULL
);

/* Table of posts per users */
CREATE TABLE IF NOT EXISTS posts (
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL
    content  VARCHAR(1000) NOT NULL,
    date_created DATE NOT NULL,
    date_updated DATE,
    PRIMARY KEY ('post_id'),
    FOREIGN KEY ('user_id') REFERENCES users('user_id')
);

/* Table of topics associated to posts*/
CREATE TABLE IF NOT EXISTS topics (
    post_id INTEGER NOT NULL, 
    topic VARCHAR(30) NOT NULL, 
    PRIMARY KEY ('post_id', 'topic'),
    UNIQUE INDEX ('post_id', 'topic')
    FOREIGN KEY ('post_id') REFERENCES posts('post_id')
);

/* Table of topics followed by users */
CREATE TABLE IF NOT EXISTS interests (
    user_id INTEGER NOT NULL, 
    topic VARCHAR(30) NOT NULL, 
    PRIMARY KEY ('user_id', 'topic'),
    UNIQUE INDEX ('user_id', 'topic')
    FOREIGN KEY ('user_id') REFERENCES users('user_id')
);

/* Table of follows between users per user */
CREATE TABLE IF NOT EXISTS followings (
    user_id INTEGER NOT NULL, 
    following_id INTEGER NOT NULL, 
    date_created DATE NOT NULL,
    PRIMARY KEY ('user_id', 'following_id'),
    UNIQUE INDEX ('following_id', 'user_id')
    FOREIGN KEY ('user_id') REFERENCES users('user_id')
    FOREIGN KEY ('following_id') REFERENCES users('user_id')
);

/* Table of posts upvotes pr user */
CREATE TABLE IF NOT EXISTS upvotes (
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    date_created DATE NOT NULL,
    PRIMARY KEY ('user_id', 'post_id'),
    UNIQUE INDEX ('post_id', 'user_id'),
    FOREIGN KEY ('post_id') REFERENCES posts('post_id'),
    FOREIGN KEY ('user_id') REFERENCES users('user_id')
);

/* Table of posts bookmarks
CREATE TABLE IF NOT EXISTS bookmarks (
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    date_created DATE NOT NULL,
    PRIMARY KEY ('user_id', 'post_id'),
    UNIQUE INDEX ('post_id', 'user_id'),
    FOREIGN KEY ('post_id') REFERENCES posts('post_id'),
    FOREIGN KEY ('user_id') REFERENCES users('user_id')
);