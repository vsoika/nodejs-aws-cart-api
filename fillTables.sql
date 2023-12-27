CREATE TYPE statuses AS ENUM ('OPEN', 'ORDERED');

create extension if not exists "uuid-ossp";

create table cart (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null default uuid_generate_v4(),
    created_at date not null DEFAULT (CURRENT_DATE),
    updated_at date not null DEFAULT (CURRENT_DATE),
    status statuses
);

create table cart_items (
    id uuid not null default uuid_generate_v4() primary key,
    cart_id uuid,
    product_id uuid not null default uuid_generate_v4(),
    count INTEGER,
    foreign key (cart_id) references cart(id) ON DELETE CASCADE ON UPDATE NO ACTION
);

WITH foreign_cart_id AS (
    insert into
        cart (status)
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
    cart;

SELECT
    *
from
    cart_items;