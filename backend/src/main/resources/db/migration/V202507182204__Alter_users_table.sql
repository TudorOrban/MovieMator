-- V202507182204__Alter_users_table.sql
ALTER TABLE users
ADD COLUMN is_profile_public BOOLEAN DEFAULT FALSE NOT NULL;