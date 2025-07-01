-- V202507011100__Create_movies_table.sql
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tmdb_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    release_year INTEGER,
    poster_url VARCHAR(512),
    director VARCHAR(255),
    plot_summary TEXT,
    user_rating INTEGER,
    user_review TEXT,
    watched_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_user_id ON movies(user_id);