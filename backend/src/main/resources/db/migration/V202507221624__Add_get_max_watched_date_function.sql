-- V202507221624__Add_get_max_watched_date_function.sql
CREATE OR REPLACE FUNCTION get_max_watched_date(jsonb_dates jsonb)
RETURNS date AS $$
SELECT MAX(CAST(value ->> 0 AS DATE))
FROM jsonb_array_elements(jsonb_dates);
$$ LANGUAGE SQL IMMUTABLE;