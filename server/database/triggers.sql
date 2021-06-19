CREATE TRIGGER user_update 
BEFORE UPDATE
ON user FOR EACH ROW
SET NEW.updated_on = NOW();

CREATE TRIGGER family_update 
BEFORE UPDATE
ON family FOR EACH ROW
SET NEW.updated_on = NOW();

CREATE TRIGGER family_not_registered_update
BEFORE UPDATE
ON family_not_registered FOR EACH ROW
SET NEW.updated_on = NOW();

CREATE TRIGGER coupons_update 
BEFORE UPDATE
ON coupon FOR EACH ROW
SET NEW.updated_on = NOW();