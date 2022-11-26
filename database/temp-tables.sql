CREATE TABLE IF NOT EXISTS registeredusers (
    id varchar(255) NOT NULL,
    first_name varchar(255),
    last_name varchar(255),
    email_address varchar(255) NOT NULL UNIQUE,
    password varchar(255),
    address varchar(255),
    credit_card varchar(255),
    annual_fee_expiry_date varchar(255),
    PRIMARY KEY (id)
);
