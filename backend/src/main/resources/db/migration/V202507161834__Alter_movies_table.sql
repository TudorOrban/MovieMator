-- V202507161834__Alter_movies_table.sql
ALTER TABLE movies
ADD COLUMN watched_dates JSONB;

-- Migrate existing watched_date to watched_dates
UPDATE movies
SET watched_dates = jsonb_build_array(watched_date::text)
WHERE watched_date IS NOT NULL;