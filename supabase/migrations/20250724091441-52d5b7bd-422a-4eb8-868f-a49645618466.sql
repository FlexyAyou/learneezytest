-- Create the user_role enum type
CREATE TYPE user_role AS ENUM ('student', 'instructor', 'tutor', 'admin', 'manager', 'parent', 'content_creator', 'external_trainer', 'internal_trainer', 'technician');

-- Create the user_status enum type 
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'suspended');