-- Script pentru actualizarea schema bazei de date pentru a folosi VARCHAR în loc de enum-uri
-- Rulează acest script pe baza de date existentă

-- 1. Actualizează tabelul posts
ALTER TABLE posts 
ALTER COLUMN post_type TYPE VARCHAR(20) USING post_type::VARCHAR(20),
ALTER COLUMN status TYPE VARCHAR(20) USING status::VARCHAR(20);

-- 2. Actualizează tabelul post_templates
ALTER TABLE post_templates 
ALTER COLUMN post_type TYPE VARCHAR(20) USING post_type::VARCHAR(20);

-- 3. Actualizează tabelul post_notifications
ALTER TABLE post_notifications 
ALTER COLUMN notification_type TYPE VARCHAR(50) USING notification_type::VARCHAR(50);

-- 4. Actualizează tabelul post_history
ALTER TABLE post_history 
ALTER COLUMN action_type TYPE VARCHAR(50) USING action_type::VARCHAR(50);

-- 5. Șterge enum-urile dacă nu mai sunt folosite
-- DROP TYPE IF EXISTS post_type_enum;
-- DROP TYPE IF EXISTS post_status_enum;
-- DROP TYPE IF EXISTS notification_type_enum;
-- DROP TYPE IF EXISTS action_type_enum; 