-- FITVERSE AI PROD SCHEMA V1.0

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums for TypeORM consistency
CREATE TYPE exercises_difficulty_enum AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE exercises_environment_enum AS ENUM ('home', 'gym', 'both');
CREATE TYPE workouts_category_enum AS ENUM ('strength', 'cardio', 'yoga', 'zumba', 'home', 'stretching');

-- 1. ZONES Table
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    theme_color VARCHAR(20)
);

-- 2. USERS Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(100),
    spotify_id VARCHAR(100),
    spotify_refresh_token TEXT,
    current_streak INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. EXERCISES Table
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    zone_id UUID REFERENCES zones(id),
    primary_muscle VARCHAR(100),
    secondary_muscle VARCHAR(100),
    equipment VARCHAR(100),
    difficulty exercises_difficulty_enum,
    environment exercises_environment_enum,
    thumbnail_url TEXT,
    preview_video_url TEXT,
    calories_per_10min INT,
    avg_duration_min INT,
    is_compound BOOLEAN DEFAULT FALSE,
    is_injury_friendly BOOLEAN DEFAULT FALSE,
    demo_video_url TEXT,
    steps JSONB,
    common_mistakes TEXT,
    safety_tips TEXT,
    trainer_advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. WORKOUTS Table
CREATE TABLE workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    zone_id UUID REFERENCES zones(id),
    exercise_order JSONB, -- Array of exercise UUIDs
    total_duration_min INT,
    estimated_calories INT,
    hero_thumbnail_url TEXT,
    category workouts_category_enum DEFAULT 'strength',
    equipment_required TEXT,
    difficulty VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. PLAYLISTS Table
CREATE TABLE playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    spotify_playlist_id VARCHAR(100) NOT NULL,
    zone_id UUID REFERENCES zones(id),
    thumbnail_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PROGRESS Table
CREATE TABLE workout_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    workout_id UUID REFERENCES workouts(id),
    duration_completed_min INT,
    calories_burned INT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. PROFESSIONALS Table (V4.1 ADDITIVE)
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Optional link to user account
    name VARCHAR(255) NOT NULL,
    title VARCHAR(100) NOT NULL,
    bio TEXT,
    experience_years INT,
    specialization VARCHAR(100),
    profile_image_url TEXT,
    verified_status BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3, 2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. COMMUNITY POSTS Table
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. COMMUNITY COMMENTS Table
CREATE TABLE community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. COMMUNITY LIKES Table
CREATE TABLE community_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(post_id, user_id) -- Prevent duplicate likes
);

-- Search Indexes
CREATE INDEX idx_exercise_name ON exercises USING GIN (to_tsvector('english', name));
CREATE INDEX idx_exercise_muscles ON exercises (primary_muscle, secondary_muscle);
CREATE INDEX idx_community_posts_user ON community_posts(user_id);
CREATE INDEX idx_community_comments_post ON community_comments(post_id);

-- Seed Initial Zones
INSERT INTO zones (name, theme_color) VALUES 
('All Access', '#ccff00'),
('Strength', '#ff4757'),
('Cardio/HIIT', '#2ed573'),
('Yoga Flow', '#70a1ff'),
('Mobility', '#ffa502');
