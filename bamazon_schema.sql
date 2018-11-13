-- drop the database if it already exists on server
DROP DATABASE IF EXISTS bamazon_db;

-- create database
Create DATABASE bamazon_db;

-- use Database
USE bamazon_db;

-- create a table W/ columns (item_id, product_name, department_name, price, stock_quantity)
CREATE TABLE products (

    item_id INT AUTO_INCREMENT,
    product_name VARCHAR(100),
    department_name Varchar(50),
    price DECIMAL (10,2) NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)  
)




