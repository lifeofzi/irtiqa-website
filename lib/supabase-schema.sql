-- Run this in Supabase SQL editor

create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  razorpay_order_id text unique not null,
  razorpay_payment_id text,
  product_id text not null,
  product_name text not null,
  product_price integer not null,
  size text,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text,
  buyer_address text not null,
  status text default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered')),
  tracking_id   text,
  tracking_link text,
  created_at timestamptz default now()
);

-- If updating an existing table, run:
-- alter table orders add column if not exists tracking_link text;

create table if not exists inventory (
  product_id text not null,
  size       text not null,
  stock      integer not null default 10,
  primary key (product_id, size)
);
