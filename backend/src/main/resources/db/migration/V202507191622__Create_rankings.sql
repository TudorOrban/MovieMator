-- V202507191622__Create_rankings.sql
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ranking_type_enum') THEN
        CREATE TYPE ranking_type_enum AS ENUM ('LIST', 'TIER_LIST');
    END IF;
END
$$;

CREATE TABLE rankings (
    id BIGSERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    tags JSONB,
    last_viewed_at TIMESTAMP,

    ranking_type ranking_type_enum NOT NULL DEFAULT 'TIER_LIST',
    ranking_data JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_rankings_user_id ON rankings(user_id);