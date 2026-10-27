-- =============================================================================
-- GREENFIELD NATIONAL HIGH SCHOOL - MYSQL INITIAL SEEDER
-- Default Admin Account: admin@greenfield.edu.ph / Admin123!
-- =============================================================================

INSERT INTO users (name, email, password_hash, role, status) VALUES
('Dr. Roberto Salazar', 'admin@greenfield.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SUPER_ADMIN', 'ACTIVE'),
('Maria Clara Santos', 'registrar@greenfield.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'REGISTRAR', 'ACTIVE')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO school_settings (setting_key, setting_value, setting_group) VALUES
('name', 'Greenfield National High School', 'identity'),
('shortName', 'GNHS', 'identity'),
('tagline', 'Scholars Bleeding Green: Standing to its Cause', 'identity'),
('motto', 'Nurturing Potential, Igniting Passions, Shaping Futures', 'identity'),
('founded', '2000', 'identity'),
('schoolId', '300101', 'identity'),
('division', 'Schools Division Office — Sample Province', 'identity'),
('region', 'Region V - Department of Education', 'identity'),
('location', 'San Isidro, Sample Municipality, Philippines', 'contact'),
('address', 'Poblacion Ward, Sample Municipality, 4700 Philippines', 'contact'),
('email', 'info.greenfieldnhs@school.edu.ph', 'contact'),
('depedEmail', '300101@deped.gov.ph', 'contact'),
('facebookPage', 'Greenfield National High School Official', 'contact'),
('contactNumber', '0917-123-4567', 'contact'),
('website', '@deped.gov.ph', 'contact'),
('officeHours', 'Monday – Friday, 7:30 AM – 5:00 PM', 'contact')
ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);

INSERT INTO accomplishments (category, title, subtitle, event_date, badge, image_url, description, athletes_json, metrics_json, is_featured, sort_order) VALUES
('Sepak Takraw', 'Palarong Panlalawigan 2024 Champion — Sepak Takraw', 'Varsity Bleeding Green Courtside Dominance', '2024 Provincial Meet', 'GOLD MEDALIST', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80', 'Displaying extraordinary agility, discipline, and teamwork, the GNHS Sepak Takraw squad clinched the Championship title at the Palarong Panlalawigan 2024, cementing Greenfield National High School as a powerhouse in regional athletics.', '["GNHS Sepak Takraw Varsity Team", "Coach & Sports Development Unit"]', '["Provincial Champion", "Regional Qualifier", "Undefeated Bracket Run"]', 1, 1),
('Boxing', 'Provincial Boxing Pride — Junior Boys Division Distinction', '51–52 kg & 53–54 kg Weight Classes', '2024 Palarong Panlalawigan', 'CHAMPIONSHIP CONTENDERS', 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=80', 'Representing the school with grit and heart in the ring, Junior Boys student-athletes in the 51–52 kls and 53–54 kls weight classes brought pride and medals to GNHS through rigorous training and relentless sportsmanship.', '["Junior Boys 53–54 kls Representative", "Junior Boys 51–52 kls Representative"]', '["51–52 kg Division", "53–54 kg Division", "Regional Meet Qualifiers"]', 1, 2),
('Drum & Lyre Corps', 'GNHS Drum and Lyre Corps (DLC) — Street & Field Exhibition', 'Cultural Heritage, Musical Precision & Visual Artistry', 'Annual Civic & Festival Competitions', 'CULTURAL EXCELLENCE', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80', 'Dressed in vibrant green and gold regalia inspired by local natural beauty and cultural heritage, the GNHS Drum and Lyre Corps captivates audiences with synchronized choreography and brass-percussion mastery.', '["GNHS DLC Majorettes", "Percussion & Lyre Ensemble"]', '["Best in Costume & Visuals", "Civic Parade Headliners", "80+ Student Performers"]', 1, 3),
('Academic & Sci-Tech', 'Division Science & Technology Fair — Research & Innovation', 'Senior High School Sci-Tech & Chemi-Calc Club', 'SY 2024–2025', 'ACADEMIC HONOR', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80', 'Beyond athletics and performing arts, GNHS learners excel in scientific investigation, mathematical problem solving, and environmental conservation projects tailored to the local ecosystem.', '["SHS Sci-Tech Researchers", "Chemi-Calc Club Officers"]', '["Eco-Science Research", "Division Quiz Bee Finalists", "Community STEM Outreach"]', 1, 4);

INSERT INTO school_projects (title, category, project_date, status, progress, lead_unit, description, impact_summary, is_flagship) VALUES
('Planting Trees to Green the Earth (Chemi-Calc Club)', 'Environmental & Sci-Tech', 'March 1, 2025', 'Active Monitoring', 100, 'SHS Sci-Tech / Chemi-Calc Club', 'Upland reforestation and ecological literacy drive conducted by Senior High School Science and Technology learners in partnership with local community foresters.', '350+ Native Seedlings Planted', 1),
('Project SAGIP-BASA & Literacy Enhancement Program', 'Curriculum & Instruction', 'SY 2024–2025', 'Ongoing', 85, 'English & Filipino Departments', 'Comprehensive reading remediation and comprehension workshops designed to ensure every Grade 7 to Grade 10 learner achieves grade-level reading proficiency.', '420+ Learners Assisted', 0),
('Grassroots Sports & Varsity Training Center', 'Athletics & Youth Development', 'Year-Round 2025', 'Ongoing', 90, 'MAPEH & Sports Coordinator', 'Structured training camp and equipment modernization for Sepak Takraw, Amateur Boxing, and Track & Field athletes preparing for provincial and regional meets.', '65 Varsity Student-Athletes', 0),
('Gulayan sa Paaralan & Eco-Composting Facility', 'Brigada Pagbasa & Brigada Eskwela', 'Q1–Q4 2025', 'Ongoing', 78, 'TLE Department & SSLG', 'Sustainable campus agriculture utilizing organic vermicomposting to supply fresh produce for school feeding programs while teaching practical agri-fishery skills.', 'Zero-Waste Campus Zone', 0),
('Digital Classroom & ICT Lab Modernization Plan', 'Infrastructure & SIP', '2025–2026 Cycle', 'In Progress', 65, 'ICT Coordinator & School Administration', 'Upgrading computer workstations, local area networking, and smart TV integration across Junior and Senior High School academic buildings under the School Improvement Plan (SIP).', '3 ICT Labs Upgraded', 0);

INSERT INTO transparency_documents (document_code, title, category, fiscal_year, date_published, file_size, allocated_amount, utilized_amount, status) VALUES
('AR-2023-GNHS', 'Annual Accomplishment & Financial Transparency Report (Jan 1 – Dec 31, 2023)', 'Annual Report', 2023, 'January 2024', '2.4 MB PDF', 2480000.00, 2455200.00, 'Verified & Posted'),
('MOOE-Q4-2024', 'MOOE Liquidation & Utilization Statement — 4th Quarter', 'Financial Statement', 2024, 'December 2024', '1.8 MB PDF', 620000.00, 615000.00, 'Verified & Posted'),
('APP-2025-GNHS', 'Annual Procurement Plan (APP) & School Operational Budget FY 2025', 'Procurement', 2025, 'January 2025', '3.1 MB PDF', 2650000.00, 1890000.00, 'Verified & Posted'),
('SRC-2024-2025', 'School Report Card (SRC) & Performance Indicators Summary', 'School Governance', 2025, 'March 2025', '4.2 MB PDF', 0.00, 0.00, 'Verified & Posted');

INSERT INTO contact_inquiries (full_name, contact_info, stakeholder_role, subject, message, status, ip_address) VALUES
('Elena Dela Cruz', 'elena.delacruz@email.com / 0917-555-0192', 'Parent / Guardian', 'Senior High School STEM Enrollment Requirements', 'Good day! May I ask for the list of documentary requirements for incoming Grade 11 STEM students this coming school year?', 'UNREAD', '127.0.0.1'),
('Engr. Marco Villanueva', 'm.villanueva@alumni.org', 'Alumni', 'Batch 2010 Computer Lab Donation Drive', 'Our alumni batch would like to donate 10 desktop units for the ICT Lab Modernization project. Who can we coordinate with?', 'IN_PROGRESS', '127.0.0.1'),
('coach.ramon@sports.ph', '0918-882-3310', 'DepEd Personnel / Partner', 'Invitational Sepak Takraw Scrimmage', 'Requesting an exhibition match with the GNHS Sepak Takraw Varsity Team next month.', 'RESOLVED', '127.0.0.1');
