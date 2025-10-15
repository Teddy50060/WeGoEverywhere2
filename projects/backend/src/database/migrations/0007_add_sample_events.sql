-- Migration: Add sample events
-- Created: 2025-10-15
-- Description: Insert sample events into the event table

INSERT INTO event (name, cost, date, time, place, capacity, detail, rating, status, "userId") VALUES
('Tech Meetup Bangkok', 0.00, '2025-10-20', '18:00:00', 'Bangkok Tech Hub, Silom Road', 50, 'Join us for an exciting tech meetup with industry professionals. We''ll discuss the latest trends in software development, AI, and startup culture. Network with like-minded individuals and expand your tech community!', 4.5, 'active', 1),

('Weekend Coding Workshop', 500.00, '2025-10-22', '10:00:00', 'Chiang Mai Innovation Center', 30, 'Learn new programming skills in a hands-on workshop environment. This intensive weekend session covers React, Node.js, and modern web development practices. Perfect for beginners and intermediate developers!', 4.8, 'active', 2),

('Startup Networking Night', 200.00, '2025-10-25', '19:00:00', 'Co-working Space Thonglor', 40, 'Connect with entrepreneurs, startup founders, and investors. Share your ideas, find co-founders, and learn about the startup ecosystem in Thailand. Light refreshments and networking activities included.', 4.2, 'active', 1),

('Design Thinking Workshop', 800.00, '2025-10-28', '14:00:00', 'Creative Design Studio, Siam', 25, 'Creative design session for UI/UX enthusiasts and product designers. Learn design thinking methodologies, user research techniques, and prototyping tools. Includes hands-on exercises and portfolio review.', 4.7, 'active', 3),

('AI & Machine Learning Seminar', 300.00, '2025-11-01', '13:00:00', 'Bangkok University Tech Campus', 80, 'Explore the fascinating world of artificial intelligence and machine learning. Industry experts will share insights on current trends, career opportunities, and practical applications in various industries.', 4.6, 'active', 2),

('Mobile App Development Bootcamp', 1200.00, '2025-11-05', '09:00:00', 'Digital Innovation Hub, Sukhumvit', 20, 'Intensive 3-day bootcamp covering iOS and Android development. Build your first mobile app from scratch using React Native. Includes deployment guide and app store submission tips.', 4.9, 'active', 4),

('Freelancer Success Workshop', 150.00, '2025-11-08', '16:00:00', 'Remote Work Cafe, Ekkamai', 35, 'Learn how to build a successful freelancing career in tech. Topics include client acquisition, project management, pricing strategies, and building a strong online presence. Perfect for aspiring freelancers!', 4.3, 'active', 5),

('Blockchain & Cryptocurrency Talk', 0.00, '2025-11-12', '20:00:00', 'Bangkok Fintech Hub', 60, 'Understanding blockchain technology and cryptocurrency markets. Expert speakers will explain DeFi, NFTs, smart contracts, and investment strategies. Q&A session and networking included.', 4.4, 'active', 1),

('Women in Tech Panel', 0.00, '2025-11-15', '18:30:00', 'Impact Hub Bangkok', 45, 'Inspiring panel discussion featuring successful women leaders in technology. Topics include career growth, overcoming challenges, work-life balance, and mentorship opportunities. Open to all genders.', 4.8, 'active', 3),

('Cloud Computing Workshop', 600.00, '2025-11-18', '10:30:00', 'AWS Training Center, Sathorn', 30, 'Hands-on workshop covering AWS, Azure, and Google Cloud platforms. Learn about cloud architecture, deployment strategies, and cost optimization. Certification preparation tips included.', 4.6, 'active', 2);
