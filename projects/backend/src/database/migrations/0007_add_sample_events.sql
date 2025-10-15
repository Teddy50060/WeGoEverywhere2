-- Migration: Add sample events, users, and participant data for testing
-- This migration creates test data to verify upcoming events and participant count functionality

-- First, insert sample users (making sure they are over 20 years old per the check constraint)
INSERT INTO users ("firstName", "lastName", "telephone_number", "bio", "birthdate", "sex") VALUES
  ('John', 'Doe', '+1234567890', 'Love attending tech events and workshops', '1990-05-15', 'Male'),
  ('Jane', 'Smith', '+1234567891', 'Passionate about health and fitness activities', '1988-08-22', 'Female'),
  ('Alice', 'Johnson', '+1234567892', 'Environmental activist and nature lover', '1992-12-10', 'Female'),
  ('Bob', 'Wilson', '+1234567893', 'Music enthusiast and concert goer', '1985-03-07', 'Male'),
  ('Emma', 'Brown', '+1234567894', 'Lifelong learner and education advocate', '1991-09-18', 'Female'),
  ('Tom', 'Davis', '+1234567895', 'Tech entrepreneur and startup founder', '1987-06-25', 'Male'),
  ('Sarah', 'Miller', '+1234567896', 'Yoga instructor and wellness coach', '1993-11-30', 'Female'),
  ('Mike', 'Garcia', '+1234567897', 'Environmental engineer', '1989-04-12', 'Male');

-- Insert sample events with various categories and dates
INSERT INTO event ("name", "cost", "date", "time", "place", "capacity", "detail", "user_id") VALUES
  ('Tech Conference 2025', 50.00, '2025-11-15', '09:00:00', 'Convention Center Bangkok', 200, 'Annual technology conference featuring the latest in AI, blockchain, and web development. Join industry leaders and innovators for a day of learning and networking.', 1),
  
  ('Yoga in the Park', 0.00, '2025-10-25', '07:00:00', 'Lumpini Park', 30, 'Start your day with a peaceful yoga session in nature. All levels welcome. Bring your own mat and water bottle.', 2),
  
  ('Coding Workshop: React Basics', 25.00, '2025-11-20', '14:00:00', 'Tech Hub Coworking Space', 25, 'Learn the fundamentals of React.js in this hands-on workshop. Perfect for beginners who want to start building modern web applications.', 6),
  
  ('Environmental Cleanup Drive', 0.00, '2025-10-30', '08:00:00', 'Chao Phraya Riverbank', 50, 'Join us in cleaning up the riverbank and making a positive impact on our environment. Gloves and bags provided. Lunch included.', 3),
  
  ('Jazz Night Concert', 35.00, '2025-11-10', '19:00:00', 'Blue Note Bangkok', 80, 'An evening of smooth jazz featuring local and international artists. Enjoy great music, drinks, and atmosphere in an intimate venue.', 4),
  
  ('Business Networking Mixer', 15.00, '2025-11-05', '18:00:00', 'Rooftop Bar Central World', 100, 'Connect with entrepreneurs, professionals, and business leaders. Great opportunity to expand your network and explore new business opportunities.', 6),
  
  ('Healthy Cooking Class', 40.00, '2025-11-12', '16:00:00', 'Culinary Institute Bangkok', 20, 'Learn to prepare nutritious and delicious meals with our expert chef. All ingredients provided. Take home recipe cards and cooking tips.', 7),
  
  ('Startup Pitch Competition', 0.00, '2025-12-01', '13:00:00', 'Innovation District', 150, 'Watch aspiring entrepreneurs pitch their innovative ideas to a panel of investors. Network with startups and potential collaborators.', 6),
  
  ('Photography Walk: Old Bangkok', 20.00, '2025-11-18', '10:00:00', 'Wat Pho Temple', 15, 'Explore the historic streets of old Bangkok while learning photography techniques. Professional photographer guide included.', 8),
  
  ('Meditation Workshop', 30.00, '2025-11-08', '15:00:00', 'Wellness Center Sukhumvit', 25, 'Learn mindfulness and meditation techniques to reduce stress and improve mental clarity. Suitable for beginners and experienced practitioners.', 7);

-- Insert participant relationships (users joining events)
-- User 1 (John) joins multiple tech and business events
INSERT INTO joined ("user_id", "event_id") VALUES
  (1, 1), -- Tech Conference
  (1, 3), -- Coding Workshop
  (1, 6), -- Business Networking
  (1, 8); -- Startup Pitch

-- User 2 (Jane) joins health and wellness events
INSERT INTO joined ("user_id", "event_id") VALUES
  (2, 2), -- Yoga in the Park
  (2, 7), -- Healthy Cooking
  (2, 10); -- Meditation Workshop

-- User 3 (Alice) joins environmental and photography events
INSERT INTO joined ("user_id", "event_id") VALUES
  (3, 4), -- Environmental Cleanup
  (3, 9), -- Photography Walk
  (3, 2); -- Yoga in the Park

-- User 4 (Bob) joins music and social events
INSERT INTO joined ("user_id", "event_id") VALUES
  (4, 5), -- Jazz Night
  (4, 6), -- Business Networking
  (4, 8); -- Startup Pitch

-- User 5 (Emma) joins educational events
INSERT INTO joined ("user_id", "event_id") VALUES
  (5, 3), -- Coding Workshop
  (5, 7), -- Healthy Cooking
  (5, 8), -- Startup Pitch
  (5, 10); -- Meditation Workshop

-- User 6 (Tom) joins his own events and others
INSERT INTO joined ("user_id", "event_id") VALUES
  (6, 1), -- Tech Conference (his event)
  (6, 3), -- Coding Workshop (his event)
  (6, 6), -- Business Networking (his event)
  (6, 8), -- Startup Pitch (his event)
  (6, 5); -- Jazz Night

-- User 7 (Sarah) joins wellness events
INSERT INTO joined ("user_id", "event_id") VALUES
  (7, 2), -- Yoga in the Park
  (7, 7), -- Healthy Cooking (her event)
  (7, 10), -- Meditation Workshop (her event)
  (7, 4); -- Environmental Cleanup

-- User 8 (Mike) joins environmental and tech events
INSERT INTO joined ("user_id", "event_id") VALUES
  (8, 4), -- Environmental Cleanup
  (8, 9), -- Photography Walk (his event)
  (8, 1), -- Tech Conference
  (8, 3); -- Coding Workshop

-- Add some additional participants to make events look more realistic
INSERT INTO joined ("user_id", "event_id") VALUES
  -- More participants for Tech Conference (popular event)
  (2, 1), (3, 1), (4, 1), (5, 1), (7, 1),
  
  -- More participants for free events
  (1, 2), (4, 2), (5, 2), (6, 2), (8, 2), -- Yoga in the Park
  (1, 4), (2, 4), (5, 4), (6, 4), -- Environmental Cleanup
  (2, 8), (3, 8), (7, 8), -- Startup Pitch
  
  -- Jazz Night Concert
  (1, 5), (2, 5), (3, 5), (7, 5), (8, 5),
  
  -- Business Networking
  (2, 6), (3, 6), (5, 6), (7, 6), (8, 6),
  
  -- Coding Workshop
  (2, 3), (4, 3), (7, 3),
  
  -- Healthy Cooking
  (1, 7), (3, 7), (4, 7), (6, 7), (8, 7),
  
  -- Photography Walk
  (1, 9), (2, 9), (4, 9), (5, 9), (6, 9), (7, 9),
  
  -- Meditation Workshop
  (1, 10), (3, 10), (4, 10), (6, 10), (8, 10);

-- Verify the data was inserted correctly
-- This will show us the events with their participant counts
-- SELECT 
--   e."name", 
--   e."date", 
--   e."capacity", 
--   COUNT(j."user_id") as current_participants
-- FROM event e 
-- LEFT JOIN joined j ON e."event_id" = j."event_id" 
-- GROUP BY e."event_id", e."name", e."date", e."capacity"
-- ORDER BY e."date";