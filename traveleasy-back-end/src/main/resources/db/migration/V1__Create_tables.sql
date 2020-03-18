


CREATE TABLE users (
   id BIGINT NOT NULL AUTO_INCREMENT,
   email varchar(255) NOT NULL UNIQUE,
   email_verified BIT NOT NULL,
   password varchar(255),
   name varchar(255) NOT NULL,
   image_url varchar(255),
   provider varchar(255),
   provider_id varchar(255),
   PRIMARY KEY (id),
   UNIQUE (email)
);

CREATE TABLE role (
  id BIGINT NOT NULL,
  name varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id),
  role_id BIGINT NOT NULL REFERENCES role(id),
  PRIMARY KEY (user_id,role_id)

);

insert into role (id,name ) value (0,'ROLE_ADMIN');
insert into role (id,name ) value (1,'ROLE_USER');

