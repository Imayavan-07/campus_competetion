-- UniSync Campus OS Seed Data

-- Seed Venues
INSERT IGNORE INTO `venues` (`id`, `name`, `capacity`, `building`, `facilities`) VALUES
('v1', 'Main Innovation Arena', 450, 'Tech Quad Arena', 'Dual Projectors, Laser Timing Sensors, PA Audio, Bleacher Seating'),
('v2', 'Main Auditorium', 1200, 'Central Academic Complex', 'Stage Lighting, Proscenium Stage, Broadcast Studio, Multi-Mic Array'),
('v3', 'Engineering Hall A', 300, 'Faculty of Engineering', 'Tiered Lecture Seating, Gigabit LAN, Presentation Screens'),
('v4', 'Arts Center 102', 80, 'Fine Arts Wing', 'Adjustable Spotlights, Display Easels, Darkroom Access, Acoustic Panels'),
('v5', 'Exhibition Ground', 2500, 'Open Campus Grounds', 'Outdoor Canopy Staging, High-Power Generators, Food Stall Bays'),
('v6', 'Advanced Robotics Lab', 120, 'Research Annex', '3D Printers, Soldering Benches, ESD-Safe Mats, Power Supplies'),
('v7', 'Science Block C', 200, 'Natural Sciences Complex', 'Fume Hoods, Demonstration Bench, Dual 4K Displays'),
('v8', 'Botanical Gardens & Quad', 150, 'Outdoor Campus Grounds', 'Open-Air Lawn, Solar Lighting, Gazebo Stage'),
('v9', 'Innovation Hub Labs', 250, 'Student Innovation Center', 'Hardware Dev Kits, High-Speed Mesh Wi-Fi, Breakout Pods'),
('v10', 'Student Union Lounge', 100, 'Student Life Center', 'Modular Sofas, AV Monitors, Coffee Bar Station'),
('v11', 'Sports Oval', 1500, 'Athletics & Recreation Center', 'Floodlights, Track Markings, Scoreboard, First-Aid Station'),
('v12', 'Debate Hall B', 90, 'Humanities Wing', 'Podium Mics, Tiered Gallery, Video Recording Suite');

-- Seed Clubs
INSERT IGNORE INTO `clubs` (`id`, `name`, `dept`, `president`, `coordinator`, `email`, `phone`, `description`, `category`, `members_count`, `events_count`) VALUES
(1, 'Campus Photography Club', 'Arts & Culture', 'Evan Wright', 'Alice Johnson', 'photography@university.edu', '+1 (555) 234-8765', 'Dedicated to visual arts, darkroom techniques, and campus journalism.', 'Cultural', 45, 3),
(2, 'Robotics Society', 'Engineering', 'Jane Doe', 'Bob Smith', 'robotics@university.edu', '+1 (555) 678-1290', 'Building autonomous rovers, combat bots, and AI hardware systems.', 'Technical', 120, 4),
(3, 'Debate & Oratory Team', 'Arts & Culture', 'Michael Scott', 'Alice Johnson', 'debate@university.edu', '+1 (555) 342-8910', 'Inter-collegiate parliamentary debate and public speaking symposiums.', 'Literary', 30, 5),
(4, 'Quantum & Chess Guild', 'Science', 'Beth Harmon', 'Fiona Gallagher', 'chess@university.edu', '+1 (555) 456-7890', 'Strategic board gaming, FIDE tournaments, and quantum algorithms.', 'Academic', 25, 2),
(5, 'Collegiate Esports Society', 'Sports', 'Tenzing Norgay', 'George Miller', 'esports@university.edu', '+1 (555) 789-0123', 'Competitive gaming tournaments, varsity leagues, and game engine workshops.', 'Gaming', 88, 4),
(6, 'Renewable Energies Club', 'Engineering', 'Claire Bennett', 'Diana Prince', 'renewables@university.edu', '+1 (555) 890-3456', 'Solar vehicle development, green grid research, and climate initiatives.', 'Innovation', 54, 2);
