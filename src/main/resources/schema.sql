CREATE TABLE IF NOT EXISTS orders(
  id serial,
  order_date date default now(),
  name varchar(100) NOT NULL,
  ship_to varchar(100) NOT NULL,
  payment_method varchar(20) NOT NULL,
  Payment_id varchar(20) NOT NULL,
  amount float NOT NULL
);

