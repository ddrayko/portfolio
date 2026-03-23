UPDATE admins 
SET password = 'password'
WHERE email = 'your-email@example.com';

-- If the admin doesn't exist yet, insert it
INSERT INTO admins (email, password)
VALUES ('your-email@example.com', 'password')
ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password;
