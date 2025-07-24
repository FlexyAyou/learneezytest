-- Test the trigger function manually
DO $$
DECLARE 
    test_metadata jsonb := '{"firstName": "Test", "lastName": "User", "role": "student", "isAdult": true}';
BEGIN
    -- Test if we can cast the role
    RAISE NOTICE 'Role from metadata: %', test_metadata->>'role';
    RAISE NOTICE 'Cast to user_role: %', (test_metadata->>'role')::user_role;
    
    -- Test if we can insert into profiles manually  
    INSERT INTO public.profiles (id, first_name, last_name, role, is_adult)
    VALUES (
        gen_random_uuid(),
        test_metadata->>'firstName',
        test_metadata->>'lastName', 
        (test_metadata->>'role')::user_role,
        COALESCE((test_metadata->>'isAdult')::boolean, true)
    );
    
    RAISE NOTICE 'Manual insert successful';
END $$;