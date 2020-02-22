CREATE TABLE users (
   id BIGINT NOT NULL AUTO_INCREMENT,
   email varchar(255) NOT NULL,
   password varchar(255) NOT NULL,
   username varchar(255) NOT NULL,
   PRIMARY KEY (id)
);

CREATE TABLE role (
  id BIGINT NOT NULL,
  name varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

insert into role (id,name ) value (0,'ROLE_ADMIN');
insert into role (id,name ) value (1,'ROLE_USER');

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id),
  role_id BIGINT NOT NULL REFERENCES role(id),
  PRIMARY KEY (user_id,role_id)

);

