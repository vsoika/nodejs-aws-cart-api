CREATE TYPE statuses AS ENUM ('OPEN', 'ORDERED');

create extension if not exists "uuid-ossp";

create table carts (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null default uuid_generate_v4(),
    created_at date not null DEFAULT (CURRENT_DATE),
    updated_at date not null DEFAULT (CURRENT_DATE),
    status statuses
);

create table cart_items (
    cart_id uuid,
    product_id uuid not null default uuid_generate_v4(),
    count INTEGER,
    foreign key (cart_id) references carts(id)
);

WITH foreign_cart_id AS (
    insert into
        carts (status)
    values
        ('OPEN'),
        ('OPEN'),
        ('ORDERED') returning id
)
insert into
    cart_items (count, cart_id)
SELECT
    13,
    id
FROM
    foreign_cart_id;

SELECT
    *
from
    carts;

SELECT
    *
from
    cart_items;