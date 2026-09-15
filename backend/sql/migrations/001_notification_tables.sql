-- Add line_id to tb_operator and tb_technician if not exists
ALTER TABLE tb_operator ADD COLUMN IF NOT EXISTS line_id VARCHAR(50) UNIQUE;
ALTER TABLE tb_technician ADD COLUMN IF NOT EXISTS line_id VARCHAR(50) UNIQUE;

-- Create tb_notification_log for Admin LINE broadcast history
CREATE TABLE IF NOT EXISTS tb_notification_log (
  id SERIAL PRIMARY KEY,
  sender_admin_id INT REFERENCES tb_operator(operator_id),
  target_type VARCHAR(50) NOT NULL,
  target_user_id INT, -- Can be null if target_type is 'all_users' etc.
  target_role VARCHAR(20),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'success', 'failed'
  error_detail TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Drop existing tb_notification if we need to recreate it to match new specs
-- (In a real production environment we would migrate data, but here we can safely drop/recreate since it's a new feature and not used yet)
DROP TABLE IF EXISTS tb_notification;

CREATE TABLE IF NOT EXISTS tb_notification (
  id SERIAL PRIMARY KEY,
  recipient_id INT NOT NULL,
  recipient_role VARCHAR(20) NOT NULL, -- 'citizen' | 'operator' | 'technician'
  request_id VARCHAR(20) REFERENCES tb_repairrequest(request_id),
  type VARCHAR(50) NOT NULL, -- 'new_assignment', 'status_update', 'system'
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_recipient ON tb_notification(recipient_id, recipient_role);
