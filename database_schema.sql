-- =====================================================
-- DATABASE SCHEMA FOR SOCIAL MEDIA APP ONBOARDING (PostgreSQL)
-- =====================================================

-- Create database (run this separately if needed)
-- CREATE DATABASE social_media_app;

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY, -- Auth0 user ID
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- =====================================================
-- BUSINESS PROFILES TABLE
-- =====================================================
CREATE TABLE business_profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    target_audience TEXT,
    business_description TEXT,
    location VARCHAR(255),
    website VARCHAR(500),
    phone VARCHAR(50),
    email VARCHAR(255),
    brand_voice VARCHAR(100),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================================================
-- SOCIAL MEDIA PLATFORMS TABLE
-- =====================================================
CREATE TABLE social_media_platforms (
    id SERIAL PRIMARY KEY,
    business_profile_id INTEGER NOT NULL,
    platform_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_profile_id) REFERENCES business_profiles(id) ON DELETE CASCADE,
    UNIQUE (business_profile_id, platform_name)
);

-- =====================================================
-- BUSINESS GOALS TABLE
-- =====================================================
CREATE TABLE business_goals (
    id SERIAL PRIMARY KEY,
    business_profile_id INTEGER NOT NULL,
    goal_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_profile_id) REFERENCES business_profiles(id) ON DELETE CASCADE,
    UNIQUE (business_profile_id, goal_name)
);

-- =====================================================
-- BUSINESS CHALLENGES TABLE
-- =====================================================
CREATE TABLE business_challenges (
    id SERIAL PRIMARY KEY,
    business_profile_id INTEGER NOT NULL,
    challenge_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_profile_id) REFERENCES business_profiles(id) ON DELETE CASCADE,
    UNIQUE (business_profile_id, challenge_name)
);

-- =====================================================
-- COMPETITORS TABLE
-- =====================================================
CREATE TABLE competitors (
    id SERIAL PRIMARY KEY,
    business_profile_id INTEGER NOT NULL,
    competitor_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_profile_id) REFERENCES business_profiles(id) ON DELETE CASCADE
);

-- =====================================================
-- CONTENT GENERATION HISTORY TABLE
-- =====================================================
CREATE TABLE content_generation_history (
    id SERIAL PRIMARY KEY,
    business_profile_id INTEGER NOT NULL,
    content_type VARCHAR(20) CHECK (content_type IN ('post', 'caption', 'hashtags', 'reel_script')) NOT NULL,
    generated_content TEXT NOT NULL,
    platform VARCHAR(50),
    post_type VARCHAR(50),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_profile_id) REFERENCES business_profiles(id) ON DELETE CASCADE
);

-- =====================================================
-- SCHEDULED POSTS TABLE
-- =====================================================
CREATE TABLE scheduled_posts (
    id SERIAL PRIMARY KEY,
    business_profile_id INTEGER NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    hashtags TEXT,
    platform VARCHAR(50) NOT NULL,
    post_type VARCHAR(20) CHECK (post_type IN ('post', 'reel', 'story')) NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    status VARCHAR(20) CHECK (status IN ('draft', 'scheduled', 'published', 'failed')) DEFAULT 'draft',
    video_script TEXT, -- For reels
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (business_profile_id) REFERENCES business_profiles(id) ON DELETE CASCADE
);

-- =====================================================
-- REFERENCE TABLES FOR DROPDOWN OPTIONS
-- =====================================================

-- Business Types Reference
CREATE TABLE business_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- Industries Reference
CREATE TABLE industries (
    id SERIAL PRIMARY KEY,
    industry_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- Social Media Platforms Reference
CREATE TABLE platform_reference (
    id SERIAL PRIMARY KEY,
    platform_name VARCHAR(50) NOT NULL UNIQUE,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- Brand Voices Reference
CREATE TABLE brand_voices (
    id SERIAL PRIMARY KEY,
    voice_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- Goals Reference
CREATE TABLE goals_reference (
    id SERIAL PRIMARY KEY,
    goal_name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- Challenges Reference
CREATE TABLE challenges_reference (
    id SERIAL PRIMARY KEY,
    challenge_name VARCHAR(255) NOT NULL UNIQUE,
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- =====================================================
-- INSERT REFERENCE DATA
-- =====================================================

-- Insert Business Types
INSERT INTO business_types (type_name, category, sort_order) VALUES
('Salon de înfrumusețare', 'Beauty', 1),
('Restaurant/Café', 'Food', 2),
('Magazin de îmbrăcăminte', 'Fashion', 3),
('Salon de coafură', 'Beauty', 4),
('Clinică medicală', 'Health', 5),
('Spa/Masaj', 'Wellness', 6),
('Magazin de bijuterii', 'Fashion', 7),
('Salon de tatuaje', 'Beauty', 8),
('Magazin de sport', 'Sports', 9),
('Farmacie', 'Health', 10),
('Magazin de electronice', 'Technology', 11),
('Servicii de curățenie', 'Services', 12),
('Servicii de transport', 'Services', 13),
('Servicii de construcții', 'Services', 14),
('Servicii de IT', 'Technology', 15),
('Servicii de marketing', 'Services', 16),
('Servicii de contabilitate', 'Services', 17),
('Servicii juridice', 'Services', 18),
('Servicii de educație', 'Education', 19),
('Altele', 'Other', 20);

-- Insert Industries
INSERT INTO industries (industry_name, category, sort_order) VALUES
('Beauty & Personal Care', 'Beauty', 1),
('Food & Beverage', 'Food', 2),
('Fashion & Accessories', 'Fashion', 3),
('Health & Wellness', 'Health', 4),
('Home & Garden', 'Home', 5),
('Sports & Fitness', 'Sports', 6),
('Technology', 'Technology', 7),
('Education', 'Education', 8),
('Professional Services', 'Services', 9),
('Entertainment', 'Entertainment', 10),
('Travel & Tourism', 'Travel', 11),
('Automotive', 'Automotive', 12),
('Real Estate', 'Real Estate', 13),
('Financial Services', 'Finance', 14),
('Non-profit', 'Non-profit', 15),
('Altele', 'Other', 16);

-- Insert Social Media Platforms
INSERT INTO platform_reference (platform_name, sort_order) VALUES
('Instagram', 1),
('Facebook', 2),
('TikTok', 3),
('YouTube', 4),
('LinkedIn', 5),
('Twitter/X', 6),
('Pinterest', 7),
('Snapchat', 8);

-- Insert Brand Voices
INSERT INTO brand_voices (voice_name, description, sort_order) VALUES
('Profesional și formal', 'Comunicare formală și profesională', 1),
('Prietenos și accesibil', 'Ton prietenos și accesibil', 2),
('Tânăr și dinamic', 'Energie tânără și dinamică', 3),
('Luxos și elegant', 'Ton luxos și elegant', 4),
('Humoristic și distractiv', 'Conținut amuzant și distractiv', 5),
('Educațional și informativ', 'Conținut educațional și informativ', 6),
('Motivant și inspirat', 'Ton motivant și inspirat', 7),
('Relaxat și natural', 'Comunicare relaxată și naturală', 8);

-- Insert Goals
INSERT INTO goals_reference (goal_name, category, sort_order) VALUES
('Creșterea numărului de urmăritori', 'Growth', 1),
('Creșterea vânzărilor', 'Sales', 2),
('Creșterea conștientizării brandului', 'Branding', 3),
('Atragerea de clienți noi', 'Acquisition', 4),
('Păstrarea clienților existenți', 'Retention', 5),
('Creșterea engagement-ului', 'Engagement', 6),
('Promovarea serviciilor noi', 'Promotion', 7),
('Construirea unei comunități', 'Community', 8);

-- Insert Challenges
INSERT INTO challenges_reference (challenge_name, category, sort_order) VALUES
('Lipsa de timp pentru conținut', 'Time', 1),
('Dificultatea în găsirea de idei noi', 'Creativity', 2),
('Engagement scăzut', 'Engagement', 3),
('Dificultatea în atragerea de clienți', 'Acquisition', 4),
('Competiția mare', 'Competition', 5),
('Algoritmii social media', 'Algorithm', 6),
('Consistența în postare', 'Consistency', 7),
('Măsurarea rezultatelor', 'Analytics', 8);

-- =====================================================
-- VIEWS FOR EASY DATA ACCESS
-- =====================================================

-- View for complete business profile with all related data
CREATE VIEW complete_business_profile AS
SELECT 
    bp.*,
    u.email as user_email,
    STRING_AGG(DISTINCT smp.platform_name, ', ') as social_platforms,
    STRING_AGG(DISTINCT bg.goal_name, ', ') as goals,
    STRING_AGG(DISTINCT bc.challenge_name, ', ') as challenges,
    STRING_AGG(DISTINCT c.competitor_name, ', ') as competitors
FROM business_profiles bp
LEFT JOIN users u ON bp.user_id = u.id
LEFT JOIN social_media_platforms smp ON bp.id = smp.business_profile_id AND smp.is_active = TRUE
LEFT JOIN business_goals bg ON bp.id = bg.business_profile_id AND bg.is_active = TRUE
LEFT JOIN business_challenges bc ON bp.id = bc.business_profile_id AND bc.is_active = TRUE
LEFT JOIN competitors c ON bp.id = c.business_profile_id
GROUP BY bp.id, u.email;

-- View for onboarding statistics
CREATE VIEW onboarding_stats AS
SELECT 
    COUNT(*) as total_users,
    SUM(CASE WHEN onboarding_completed = TRUE THEN 1 ELSE 0 END) as completed_onboarding,
    SUM(CASE WHEN onboarding_completed = FALSE THEN 1 ELSE 0 END) as incomplete_onboarding,
    ROUND((SUM(CASE WHEN onboarding_completed = TRUE THEN 1 ELSE 0 END)::DECIMAL / COUNT(*)) * 100, 2) as completion_rate
FROM business_profiles;

-- =====================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- =====================================================

-- Function to create complete business profile
CREATE OR REPLACE FUNCTION create_business_profile(
    p_user_id VARCHAR(255),
    p_business_name VARCHAR(255),
    p_business_type VARCHAR(100),
    p_industry VARCHAR(100),
    p_target_audience TEXT,
    p_business_description TEXT,
    p_location VARCHAR(255),
    p_website VARCHAR(500),
    p_phone VARCHAR(50),
    p_email VARCHAR(255),
    p_brand_voice VARCHAR(100),
    p_social_platforms JSONB,
    p_goals JSONB,
    p_challenges JSONB,
    p_competitors JSONB
)
RETURNS INTEGER AS $$
DECLARE
    business_profile_id INTEGER;
    platform_value TEXT;
    goal_value TEXT;
    challenge_value TEXT;
    competitor_value TEXT;
BEGIN
    -- Insert business profile
    INSERT INTO business_profiles (
        user_id, business_name, business_type, industry, target_audience,
        business_description, location, website, phone, email, brand_voice,
        onboarding_completed
    ) VALUES (
        p_user_id, p_business_name, p_business_type, p_industry, p_target_audience,
        p_business_description, p_location, p_website, p_phone, p_email, p_brand_voice,
        TRUE
    ) RETURNING id INTO business_profile_id;
    
    -- Insert social media platforms
    FOR platform_value IN SELECT jsonb_array_elements_text(p_social_platforms)
    LOOP
        INSERT INTO social_media_platforms (business_profile_id, platform_name)
        VALUES (business_profile_id, platform_value);
    END LOOP;
    
    -- Insert goals
    FOR goal_value IN SELECT jsonb_array_elements_text(p_goals)
    LOOP
        INSERT INTO business_goals (business_profile_id, goal_name)
        VALUES (business_profile_id, goal_value);
    END LOOP;
    
    -- Insert challenges
    FOR challenge_value IN SELECT jsonb_array_elements_text(p_challenges)
    LOOP
        INSERT INTO business_challenges (business_profile_id, challenge_name)
        VALUES (business_profile_id, challenge_value);
    END LOOP;
    
    -- Insert competitors
    FOR competitor_value IN SELECT jsonb_array_elements_text(p_competitors)
    LOOP
        INSERT INTO competitors (business_profile_id, competitor_name)
        VALUES (business_profile_id, competitor_value);
    END LOOP;
    
    RETURN business_profile_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get business profile with all data
CREATE OR REPLACE FUNCTION get_business_profile(p_user_id VARCHAR(255))
RETURNS TABLE (
    id INTEGER,
    user_id VARCHAR(255),
    business_name VARCHAR(255),
    business_type VARCHAR(100),
    industry VARCHAR(100),
    target_audience TEXT,
    business_description TEXT,
    location VARCHAR(255),
    website VARCHAR(500),
    phone VARCHAR(50),
    email VARCHAR(255),
    brand_voice VARCHAR(100),
    onboarding_completed BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_email VARCHAR(255),
    social_platforms TEXT,
    goals TEXT,
    challenges TEXT,
    competitors TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT * FROM complete_business_profile WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_business_profiles_updated_at
    BEFORE UPDATE ON business_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_posts_updated_at
    BEFORE UPDATE ON scheduled_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX idx_business_profiles_onboarding ON business_profiles(onboarding_completed);
CREATE INDEX idx_business_profiles_business_type ON business_profiles(business_type);
CREATE INDEX idx_business_profiles_industry ON business_profiles(industry);
CREATE INDEX idx_social_media_platforms_business_profile_id ON social_media_platforms(business_profile_id);
CREATE INDEX idx_business_goals_business_profile_id ON business_goals(business_profile_id);
CREATE INDEX idx_business_challenges_business_profile_id ON business_challenges(business_profile_id);
CREATE INDEX idx_competitors_business_profile_id ON competitors(business_profile_id);
CREATE INDEX idx_content_generation_business_profile_id ON content_generation_history(business_profile_id);
CREATE INDEX idx_content_generation_content_type ON content_generation_history(content_type);
CREATE INDEX idx_content_generation_generated_at ON content_generation_history(generated_at);
CREATE INDEX idx_scheduled_posts_business_profile_id ON scheduled_posts(business_profile_id);
CREATE INDEX idx_scheduled_posts_scheduled_date ON scheduled_posts(scheduled_date);
CREATE INDEX idx_scheduled_posts_status ON scheduled_posts(status);
CREATE INDEX idx_scheduled_posts_platform ON scheduled_posts(platform);
CREATE INDEX idx_scheduled_posts_platform_status ON scheduled_posts(platform, status);

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON DATABASE social_media_app IS 'Database for Social Media App Onboarding System';
COMMENT ON TABLE users IS 'Stores user information from Auth0';
COMMENT ON TABLE business_profiles IS 'Stores complete business profile information from onboarding';
COMMENT ON TABLE social_media_platforms IS 'Stores selected social media platforms for each business';
COMMENT ON TABLE business_goals IS 'Stores business goals selected during onboarding';
COMMENT ON TABLE business_challenges IS 'Stores business challenges selected during onboarding';
COMMENT ON TABLE competitors IS 'Stores competitor information for each business';
COMMENT ON TABLE content_generation_history IS 'Stores history of generated content';
COMMENT ON TABLE scheduled_posts IS 'Stores scheduled posts for each business';

/*
DATABASE SCHEMA FOR SOCIAL MEDIA APP ONBOARDING (PostgreSQL)

This schema supports:
1. User authentication via Auth0
2. Complete business profile onboarding
3. Social media platform preferences
4. Business goals and challenges tracking
5. Competitor analysis
6. Content generation history
7. Post scheduling functionality
8. Reference data for dropdowns

Key Features:
- Foreign key relationships for data integrity
- Indexes for optimal query performance
- Views for easy data access
- Functions for common operations
- JSONB support for flexible data storage
- Comprehensive audit trail with timestamps
- Automatic updated_at triggers

Usage:
1. Run this script to create the database
2. Use the functions for common operations
3. Query the views for easy data access
4. Monitor onboarding completion rates

PostgreSQL Specific Features:
- SERIAL for auto-incrementing IDs
- JSONB for JSON data storage
- STRING_AGG for string concatenation
- CHECK constraints for enum-like behavior
- Triggers for automatic timestamp updates
*/ 