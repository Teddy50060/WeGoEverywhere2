-- Fix participant data for testing - use correct user and event IDs

-- User 8 (John) joins multiple tech and business events
INSERT INTO joined ("user_id", "event_id") VALUES
  (8, 19), -- Tech Conference 2025
  (8, 21), -- Coding Workshop: React Basics  
  (8, 24), -- Business Networking Mixer
  (8, 26); -- Startup Pitch Competition

-- User 9 (Jane) joins health and wellness events  
INSERT INTO joined ("user_id", "event_id") VALUES
  (9, 20), -- Yoga in the Park
  (9, 25), -- Healthy Cooking Class
  (9, 28); -- Meditation Workshop

-- User 10 (Alice) joins environmental and photography events
INSERT INTO joined ("user_id", "event_id") VALUES
  (10, 22), -- Environmental Cleanup Drive
  (10, 27), -- Photography Walk: Old Bangkok
  (10, 20); -- Yoga in the Park

-- User 11 (Bob) joins music and social events
INSERT INTO joined ("user_id", "event_id") VALUES
  (11, 23), -- Jazz Night Concert
  (11, 24), -- Business Networking Mixer
  (11, 26); -- Startup Pitch Competition

-- User 12 (Emma) joins educational events
INSERT INTO joined ("user_id", "event_id") VALUES
  (12, 21), -- Coding Workshop: React Basics
  (12, 25), -- Healthy Cooking Class
  (12, 26), -- Startup Pitch Competition
  (12, 28); -- Meditation Workshop

-- User 13 (Tom) joins multiple events
INSERT INTO joined ("user_id", "event_id") VALUES
  (13, 19), -- Tech Conference 2025
  (13, 21), -- Coding Workshop: React Basics
  (13, 24), -- Business Networking Mixer
  (13, 26), -- Startup Pitch Competition
  (13, 23); -- Jazz Night Concert

-- User 14 (Sarah) joins wellness events
INSERT INTO joined ("user_id", "event_id") VALUES
  (14, 20), -- Yoga in the Park
  (14, 25), -- Healthy Cooking Class
  (14, 28), -- Meditation Workshop
  (14, 22); -- Environmental Cleanup Drive

-- Add some additional participants to make events look more realistic
INSERT INTO joined ("user_id", "event_id") VALUES
  -- More participants for Tech Conference (popular event)
  (9, 19), (10, 19), (11, 19), (12, 19), (14, 19),
  
  -- More participants for free events
  (8, 20), (11, 20), (12, 20), (13, 20), -- Yoga in the Park (more realistic for 30 capacity)
  (8, 22), (9, 22), (12, 22), (13, 22), -- Environmental Cleanup Drive
  (9, 26), (10, 26), (14, 26), -- Startup Pitch Competition
  
  -- Jazz Night Concert  
  (8, 23), (9, 23), (10, 23), (12, 23), (14, 23),
  
  -- Business Networking
  (9, 24), (10, 24), (12, 24), -- Business Networking
  
  -- Coding Workshop
  (9, 21), (10, 21), (14, 21),
  
  -- Healthy Cooking
  (8, 25), (10, 25), (11, 25), (13, 25),
  
  -- Photography Walk
  (8, 27), (9, 27), (11, 27), (12, 27), (13, 27),
  
  -- Meditation Workshop
  (8, 28), (10, 28), (11, 28), (13, 28);
