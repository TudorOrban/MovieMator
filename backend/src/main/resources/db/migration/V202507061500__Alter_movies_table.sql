-- V202507061500__Alter_movies_table.sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movie_status_enum') THEN
        CREATE TYPE movie_status_enum AS ENUM ('WATCHED', 'WATCHLIST');
    END IF;
END
$$;

ALTER TABLE movies
ALTER COLUMN user_rating TYPE REAL;

ALTER TABLE movies
ADD COLUMN status movie_status_enum NOT NULL DEFAULT 'WATCHED';

ALTER TABLE movies
ADD COLUMN genres JSONB;

ALTER TABLE movies
ADD COLUMN runtime_minutes INTEGER;

ALTER TABLE movies
ADD COLUMN actors JSONB;

CREATE INDEX idx_movies_status ON movies (status);
