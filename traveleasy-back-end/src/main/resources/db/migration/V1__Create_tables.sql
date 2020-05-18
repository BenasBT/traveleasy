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

CREATE TABLE category (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name varchar(255) NOT NULL,
  valid bool,
  PRIMARY KEY (id)
);

CREATE TABLE price_types (
  id BIGINT NOT NULL,
  name varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE photos (
  id BIGINT NOT NULL AUTO_INCREMENT,
  service_id BIGINT,
  name varchar(255) NOT NULL,
  dir varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE service (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL REFERENCES users(id),
  name varchar(255) NOT NULL,
  description varchar(255),
  price double,
  price_type varchar(255) NOT NULL,
  start_time time,
  end_time time,
  start_date date,
  end_date date,
  min_people_count integer,
  max_people_count integer,
  status varchar(255) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE archive (

    id BIGINT NOT NULL AUTO_INCREMENT,
    archive_id BIGINT NOT NULL,

    user_id BIGINT NOT NULL REFERENCES users(id),
    provider_id BIGINT NOT NULL REFERENCES users(id),

    service_name varchar(255) NOT NULL,
    service_description varchar(255),

    service_price double,
    service_price_type varchar(255) NOT NULL,
    event_price_counter double,
    event_price double,
    full_price double,

    event_start_date date,
    event_start_time time,

    event_end_date date,
    event_end_time time,

    event_people_count integer,

    PRIMARY KEY (id)
);

CREATE TABLE service_category (
  service_id BIGINT NOT NULL REFERENCES service(id),
  category_id BIGINT NOT NULL REFERENCES category(id),
  PRIMARY KEY (service_id,category_id)
);

CREATE TABLE event (
    id BIGINT NOT NULL AUTO_INCREMENT,
    service_id BIGINT NOT NULL REFERENCES service(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    provider_id BIGINT NOT NULL REFERENCES users(id),

    fixed_date bool,
    start_time time,
    end_time time,

    start_date date,
    end_date date,
    people_count integer,

    price_counter double,
    price double,
    PRIMARY KEY (id)
);
CREATE TABLE purchase (
   id BIGINT NOT NULL AUTO_INCREMENT,
   purchase_id BIGINT NOT NULL,
   service_id BIGINT NOT NULL REFERENCES service(id),
   user_id BIGINT NOT NULL REFERENCES users(id),
   provider_id BIGINT NOT NULL REFERENCES users(id),

   start_time time,
   end_time time,

   start_date date,
   end_date date,
   people_count integer,

   price_counter double,
   price double,
   full_price double,
   PRIMARY KEY (id)
);

CREATE TABLE marked (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL REFERENCES users(id),
    service_id BIGINT NOT NULL REFERENCES service(id),
    PRIMARY KEY (id)
);


insert into role (id,name) value (0,'ROLE_ADMIN');
insert into role (id,name) value (1,'ROLE_USER');
insert into role (id,name) value (2,'ROLE_PROVIDER');

insert into category (id,name,valid) value (1,'Takeout Food',true);
insert into category (id,name,valid) value (2,'Indoors Food',true);
insert into category (id,name,valid) value (3,'Transfer Of Items',true);
insert into category (id,name,valid) value (4,'Delivery',true);
insert into category (id,name,valid) value (5,'Transportation Of People',true);
insert into category (id,name,valid) value (6,'Premises',true);
insert into category (id,name,valid) value (7,'Activities',true);
insert into category (id,name,valid) value (8,'Rent',true);


insert into category (id,name,valid) value (999,'Other',true);

insert into price_types (id,name) value (0,'PERSON');
insert into price_types (id,name) value (1,'HOUR');
insert into price_types (id,name) value (2,'DAY');
insert into price_types (id,name) value (3,'UNIT');
insert into price_types (id,name) value (4,'KM');