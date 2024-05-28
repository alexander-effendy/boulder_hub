-- postgres is locally persistent

-- Switch to the boulder_hub database
\c boulder_hub

-- drop if exists
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS pictures;
DROP TABLE IF EXISTS videos;
DROP TABLE IF EXISTS boulders;
DROP TABLE IF EXISTS gyms;
DROP TABLE IF EXISTS users;

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    oauth_id VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Gyms (
    gym_id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Boulders (
    boulder_id SERIAL PRIMARY KEY,
    gym_id INT NOT NULL,
    color VARCHAR(20),
    grade VARCHAR(10),
    description TEXT,
    FOREIGN KEY (gym_id) REFERENCES Gyms(gym_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Videos (
    video_id SERIAL PRIMARY KEY,
    boulder_id INT NOT NULL,
    user_id INT NOT NULL,
    url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (boulder_id) REFERENCES Boulders(boulder_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Pictures (
    picture_id SERIAL PRIMARY KEY,
    boulder_id INT NOT NULL,
    user_id INT NOT NULL,
    url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (boulder_id) REFERENCES Boulders(boulder_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Comments (
    comment_id SERIAL PRIMARY KEY,
    boulder_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (boulder_id) REFERENCES Boulders(boulder_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
