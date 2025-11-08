ALTER TABLE "users"
ALTER COLUMN "profile_picture" TYPE varchar(255);
DROP FUNCTION IF EXISTS prevent_overbooking() cascade;