insert into users (id, firstname, lastname)
select $1, $2, $3
where not exists (
    select 1 from users
    where id = $1
)
returning id, firstname, lastname;

-- insert into users (id, firstname, lastname)
-- select 3, 'Donovan', 'Hiland'
-- where not exists (
--     select 1 from users
--     where id = 1
-- )
-- returning id, firstname, lastname;
