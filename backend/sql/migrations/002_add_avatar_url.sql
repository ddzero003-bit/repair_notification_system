-- Add avatar_url column to all user tables

ALTER TABLE tb_user ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE tb_operator ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE tb_technician ADD COLUMN IF NOT EXISTS avatar_url TEXT;
