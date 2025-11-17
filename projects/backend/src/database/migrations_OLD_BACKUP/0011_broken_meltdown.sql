ALTER TABLE "users" ADD COLUMN "profile_picture" varchar(255);
DROP FUNCTION IF EXISTS prevent_overbooking() cascade;