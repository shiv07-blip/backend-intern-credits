CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);


CREATE TABLE credits (
    user_id INT PRIMARY KEY,
    credits INT NOT NULL DEFAULT 0,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- TRIGGER FUNCTION TO AUTO-UPDATE 'last_updated' ON CHANGE
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER ON 'credits' TABLE TO USE THAT FUNCTION
CREATE TRIGGER trigger_update_last_updated
BEFORE UPDATE ON credits
FOR EACH ROW
EXECUTE FUNCTION update_last_updated_column();

-- ADD DUMMY USERS
INSERT INTO users (email, name) VALUES
('alice@example.com', 'Alice Wonderland'),
('bob@example.com', 'Bob Builder'),
('charlie@example.com', 'Charlie Chaplin'),
('diana@example.com', 'Diana Prince'),
('eve@example.com', 'Eve Online');

-- ADD DUMMY USERS CREDITS
INSERT INTO credits (user_id, credits) VALUES
(1, 50),
(2, 120),
(3, 0),
(4, 85),
(5, 10);
