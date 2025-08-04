-- Schema pentru postări și funcționalități adiacente (PostgreSQL)
-- user_id este VARCHAR (Auth0 user ID)

-- 1. Creează enum-urile înainte de tabele (comentate pentru a evita probleme cu JPA)
-- CREATE TYPE post_type_enum AS ENUM ('normal', 'reel');
-- CREATE TYPE post_status_enum AS ENUM ('scheduled', 'draft', 'published');
-- CREATE TYPE notification_type_enum AS ENUM ('post_scheduled', 'post_published', 'post_failed', 'reminder');
-- CREATE TYPE action_type_enum AS ENUM ('created', 'updated', 'status_changed', 'deleted');

-- 2. Tabelul principal pentru postări
CREATE TABLE posts (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    caption TEXT,
    hashtags TEXT,
    platform VARCHAR(50) NOT NULL,
    post_type VARCHAR(20) DEFAULT 'normal',
    status VARCHAR(20) DEFAULT 'scheduled',
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexuri pentru posts
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_scheduled_date ON posts(scheduled_date);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_platform ON posts(platform);
CREATE INDEX idx_posts_user_status ON posts(user_id, status);
CREATE INDEX idx_posts_user_date ON posts(user_id, scheduled_date);

-- 4. Tabel pentru scripturi video (pentru reels)
CREATE TABLE post_video_scripts (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    script_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_video_scripts_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT unique_post_script UNIQUE (post_id)
);

-- 5. Tabel pentru idei video (pentru reels)
CREATE TABLE post_video_ideas (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    idea_text TEXT NOT NULL,
    idea_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_video_ideas_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_video_ideas_post_order ON post_video_ideas(post_id, idea_order);

-- 6. Tabel pentru istoricul modificărilor postărilor
CREATE TABLE post_history (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    old_values JSONB NULL,
    new_values JSONB NULL,
    changed_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_post_history_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_post_history_post_id ON post_history(post_id);
CREATE INDEX idx_post_history_action_type ON post_history(action_type);
CREATE INDEX idx_post_history_created_at ON post_history(created_at);

-- 7. Tabel pentru template-uri de postări
CREATE TABLE post_templates (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    title_template VARCHAR(255),
    caption_template TEXT,
    hashtags_template TEXT,
    platform VARCHAR(50) NOT NULL,
    post_type VARCHAR(20) DEFAULT 'normal',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_templates_user_active ON post_templates(user_id, is_active);

-- 8. Tabel pentru hashtag-uri populare (pentru sugestii)
CREATE TABLE popular_hashtags (
    id BIGSERIAL PRIMARY KEY,
    hashtag VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_hashtag_platform UNIQUE (hashtag, platform)
);

CREATE INDEX idx_popular_hashtags_platform_category ON popular_hashtags(platform, category);
CREATE INDEX idx_popular_hashtags_usage_count ON popular_hashtags(usage_count DESC);

-- 9. Tabel pentru captions populare (pentru sugestii)
CREATE TABLE popular_captions (
    id BIGSERIAL PRIMARY KEY,
    caption_text TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    language VARCHAR(10) DEFAULT 'ro',
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_popular_captions_platform_category ON popular_captions(platform, category);
CREATE INDEX idx_popular_captions_language ON popular_captions(language);
CREATE INDEX idx_popular_captions_usage_count ON popular_captions(usage_count DESC);

-- 10. Tabel pentru idei de postări (pentru sugestii)
CREATE TABLE post_ideas (
    id BIGSERIAL PRIMARY KEY,
    idea_title VARCHAR(255) NOT NULL,
    idea_description TEXT,
    platform VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    engagement_score DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_post_ideas_platform_category ON post_ideas(platform, category);
CREATE INDEX idx_post_ideas_engagement_score ON post_ideas(engagement_score DESC);

-- 11. Tabel pentru notificări despre postări
CREATE TABLE post_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    post_id BIGINT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_post_notifications_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
);

CREATE INDEX idx_post_notifications_user_unread ON post_notifications(user_id, is_read);
CREATE INDEX idx_post_notifications_created_at ON post_notifications(created_at DESC);

-- 12. Tabel pentru statistici postări
CREATE TABLE post_analytics (
    id BIGSERIAL PRIMARY KEY,
    post_id BIGINT NOT NULL,
    platform_post_id VARCHAR(255) NULL,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,4) DEFAULT 0.0000,
    collected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_post_analytics_post_id FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    CONSTRAINT unique_post_analytics UNIQUE (post_id, collected_at)
);

CREATE INDEX idx_post_analytics_engagement_rate ON post_analytics(engagement_rate DESC);

-- 13. Trigger pentru actualizarea updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 14. Aplicarea trigger-ului pe toate tabelele cu updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_video_scripts_updated_at BEFORE UPDATE ON post_video_scripts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_templates_updated_at BEFORE UPDATE ON post_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_popular_hashtags_updated_at BEFORE UPDATE ON popular_hashtags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_popular_captions_updated_at BEFORE UPDATE ON popular_captions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_ideas_updated_at BEFORE UPDATE ON post_ideas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_post_analytics_updated_at BEFORE UPDATE ON post_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 