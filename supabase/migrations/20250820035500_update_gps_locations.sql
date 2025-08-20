-- Update GPS locations to match spots.csv coordinates
-- This migration updates existing locations with correct Binghamton University area coordinates

-- First, clear existing location data (except delivery-only locations)
DELETE FROM locations WHERE is_delivery_only = false;

-- Insert the correct GPS locations from spots.csv
INSERT INTO locations (name, latitude, longitude, is_delivery_only) VALUES
('Court Street Downtown', 42.099118, -75.917538, false),
('Riverwalk BU Center', 42.098765, -75.916543, false),
('Confluence Park', 42.090123, -75.912345, false),
('Southside Walking Bridge', 42.091409, -75.914568, false),
('General Hospital', 42.086741, -75.915711, false),
('McArthur Park', 42.086165, -75.926153, false),
('Greenway Path', 42.086678, -75.932483, false),
('Vestal Center', 42.091851, -75.951729, false),
('Innovation Park', 42.093877, -75.958331, false),
('BU East Gym', 42.091695, -75.963590, false),
('BU Fine Arts Building', 42.089282, -75.967441, false),
('Whitney Hall', 42.088456, -75.965432, false),
('Student Union', 42.086903, -75.966704, false),
('Appalachian Dining', 42.084523, -75.971264, false),
('Hinman Dining Hall', 42.086314, -75.973292, false),
('BU Science Building', 42.090227, -75.972315, false);
