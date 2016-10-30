drop table if exists users;

create table users (
  id bigint primary key not null,
  firstname varchar(20),
  lastname varchar(20)
);
