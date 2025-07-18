-- V202507182039__Fix_user_settings_issue.sql
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'users'
          AND column_name = 'user_settings'
    ) THEN
        ALTER TABLE users
        ADD COLUMN user_settings JSONB NOT NULL DEFAULT '{}'::jsonb;
    END IF;
END $$;

ALTER TABLE movies
DROP COLUMN user_settings;