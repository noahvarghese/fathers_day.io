DROP DATABASE IF EXISTS ${DATABASE};
CREATE DATABASE ${DATABASE};
USE ${DATABASE};

CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) COLLATE UTF8_GENERAL_CI NOT NULL,
    email VARCHAR(255) COLLATE UTF8_GENERAL_CI NOT NULL,
    password VARCHAR(255) NOT NULL,
    reset_token VARCHAR(32) DEFAULT NULL,
    reset_token_expiry DATETIME DEFAULT NULL,
    created_on DATETIME DEFAULT NOW(),
    updated_on DATETIME DEFAULT NOW(),
    deleted_on DATETIME DEFAULT NULL,
    UNIQUE(email),
    PRIMARY KEY(id)
);

CREATE TABLE family (
    id INT NOT NULL AUTO_INCREMENT,
    requester INT NOT NULL,
    receiver INT NOT NULL,
    requester_relationship ENUM('HUSBAND', 'WIFE', 'PARENT', 'GRANDPARENT', 'GREATGRANDPARENT', 'CHILD', 'GRANDCHILD', 'GREATGRANDCHILD'),
    receiver_relationship ENUM('HUSBAND', 'WIFE', 'PARENT', 'GRANDPARENT', 'GREATGRANDPARENT', 'CHILD', 'GRANDCHILD', 'GREATGRANDCHILD'),
    confirmed TINYINT(1),
    created_on DATETIME DEFAULT NOW(),
    updated_on DATETIME DEFAULT NOW(),
    deleted_on DATETIME DEFAULT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(requester) REFERENCES user(id),
    FOREIGN KEY(receiver) REFERENCES user(id)
);

CREATE TABLE family_not_registered (
    id INT NOT NULL AUTO_INCREMENT,
    registered_user_id INT NOT NULL,
    unregistered_email VARCHAR(255) NOT NULL,
    registered_user_relationship_type ENUM('HUSBAND', 'WIFE', 'PARENT', 'GRANDPARENT', 'GREATGRANDPARENT', 'CHILD', 'GRANDCHILD', 'GREATGRANDCHILD'),
    created_on DATETIME DEFAULT NOW(),
    updated_on DATETIME DEFAULT NOW(),
    deleted_on DATETIME DEFAULT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(registered_user_id) REFERENCES user(id)
);

CREATE TABLE coupon (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) COLLATE UTF8_GENERAL_CI NOT NULL,
    redemption_requested TINYINT(1),
    to_be_completed_by_date DATETIME DEFAULT NULL,
    redeemed TINYINT(1), 
    redeem_notes VARCHAR(255) COLLATE UTF8_GENERAL_CI DEFAULT NULL,
    completed TINYINT(1),
    relationship INT NOT NULL,
    created_on DATETIME DEFAULT NOW(),
    updated_on DATETIME DEFAULT NOW(),
    deleted_on DATETIME DEFAULT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (relationship) REFERENCES family(id)
);
