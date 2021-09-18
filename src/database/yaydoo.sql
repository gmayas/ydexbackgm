/*
-- Schema for CRUD by Yaydoo

CREATE SCHEMA yaydoo
    AUTHORIZATION aovudieocshokj;

COMMENT ON SCHEMA yaydoo
    IS 'Schema for CRUD by Yaydoo';

GRANT ALL ON SCHEMA yaydoo TO PUBLIC;

GRANT ALL ON SCHEMA yaydoo TO aovudieocshokj;

-- yaydoo.users

CREATE TABLE IF NOT EXISTS yaydoo.users
(
    id_user serial,
    name_user character varying(255),
    email_user character varying(255),
    password_user character varying(255),
    PRIMARY KEY (id_user)
);

ALTER TABLE yaydoo.users
    OWNER to aovudieocshokj;

INSERT INTO yaydoo.users(name_user, email_user, password_user)
	VALUES ('gmayas', 'isc_gmayas@hotmail.com', 'pass12345');

SELECT id_user, name_user, email_user, password_user
	FROM yaydoo.users;


-- yaydoo.userdata

CREATE TABLE IF NOT EXISTS yaydoo.userdata
(
    id_userdata serial,
    id_user_userdata integer,
    address_userdata character varying(255),
    phone_userdata character varying(20),
    birthdate_userdata date,
    PRIMARY KEY (id_userdata, id_user_userdata),
	FOREIGN KEY (id_user_userdata)
      REFERENCES yaydoo.users(id_user)
);

ALTER TABLE yaydoo.userdata
    OWNER to aovudieocshokj;

-- PostgreSQL uses the yyyy-mm-dd format date.

INSERT INTO yaydoo.userdata(id_user_userdata, address_userdata, phone_userdata, birthdate_userdata)
	VALUES ('1', 'Veronoca 302', '+52 782 823 2380','1975-02-08');

-- Select data user

select name_user, email_user, password_user, address_userdata, phone_userdata, birthdate_userdata
from yaydoo.users as us
left join yaydoo.userdata as ud on (id_user = id_user_userdata );

-- Select data user age

SELECT id_userdata, id_user_userdata, address_userdata, phone_userdata, 
       birthdate_userdata, Age(birthdate_userdata) age_userdata 
	FROM yaydoo.userdata
	Where id_user_userdata = '1';