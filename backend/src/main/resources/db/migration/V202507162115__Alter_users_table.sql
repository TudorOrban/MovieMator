-- V202507162115__Alter_users_table.sql
ALTER TABLE movies
ADD COLUMN user_settings JSONB NOT NULL DEFAULT '{}'::jsonb;