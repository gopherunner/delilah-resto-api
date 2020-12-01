SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

-- Create the Database Delilah_resto
DROP DATABASE IF EXISTS delilah_resto;
CREATE DATABASE IF NOT EXISTS delilah_resto;
USE delilah_resto;

-- Create Customers table
DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers`(
    `customer_id` INT(11) UNSIGNED AUTO_INCREMENT NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `fullname` VARCHAR(100) NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(50) NOT NULL,
    `is_admin` BOOLEAN NOT NULL DEFAULT false,
    `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `active` BOOLEAN NOT NULL DEFAULT true,
    PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Products table
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products`(
    `product_id` INT(10) UNSIGNED AUTO_INCREMENT NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `product_detail` VARCHAR(255) NOT NULL,
    `product_price` DECIMAL(7, 2) NOT NULL,
    `product_photo` VARCHAR(255) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `active` BOOLEAN NOT NULL,
    PRIMARY KEY (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Orders table
DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders`(
    `order_id` INT(10) UNSIGNED AUTO_INCREMENT NOT NULL,
    `customer_id` INT(10) UNSIGNED NOT NULL,
    `order_total` DECIMAL(7, 2) NOT NULL, 
    `order_status` ENUM('new', 'confirmed', 'preparing', 'delivering', 'delivered') NOT NULL DEFAULT 'new', 
    `payment_method` ENUM('cash', 'credit card', 'debit card') NOT NULL, 
    `address` VARCHAR(200) NOT NULL, 
    `order_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (`order_id`),
    FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Orders_details table
DROP TABLE IF EXISTS `orders_details`;
CREATE TABLE IF NOT EXISTS `orders_details` (
    `product_id` INT(10) UNSIGNED NOT NULL,
    `order_id` INT(10) UNSIGNED NOT NULL, 
    `product_qty` INT(10) UNSIGNED NOT NULL,
    UNIQUE `order_details_id` (`product_id`, `order_id`), 
    PRIMARY KEY (`product_id`, `order_id`),
    FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert customers data
INSERT INTO `customers` (`username`, `password`, `fullname`, `address`, `email`, `phone_number`, `is_admin`, `active`) VALUES ('admin', '$2b$05$s5lufTbOf96V88HEJg2VH.mo.YkjcKL.rwDn8ucXT0ZtCY63NDoYe', 'Admin User', 'Admin City 123', 'admin@delilah-resto.com', '1112345678',true,true);
INSERT INTO `customers` (`username`, `password`, `fullname`, `address`, `email`, `phone_number`) VALUES ('toto', 'toto123', 'Toto Anders', 'Dog City 456', 'toto@toto.com', '1145678901');

-- Insert products data
INSERT INTO `products` (`product_name`, `product_detail`, `product_price`, `product_photo`, `active`) VALUES ('Milanesa Napolitana', 'Milanesa Napolitana con queso y salsa de tomate', '250.20', 'https://cdn1.cocina-familiar.com/recetas/thumb/como-hacer-la-mejor-milanesa-a-la-napolitana.JPG', true);
INSERT INTO `products` (`product_name`, `product_detail`, `product_price`, `product_photo`, `active`) VALUES ('Pollo al Spiedo', 'Pollo al Spiedo con Papas fritas', '400.00', 'https://lh3.googleusercontent.com/proxy/KmJj9I8cvjCIJCInO5rgHVshVDFkDO7ZNBw2wyOGmHUtRhHXzVcpX23MAG3VTI2QEuekyqNsvB6SIvnx7Ok4yGib', true);

-- Insert orders data
INSERT INTO `orders` (`customer_id`, `payment_method`,`order_total`, `address`) VALUES ('1', 'cash', '1050.20', 'Admin City 123');
INSERT INTO `orders` (`customer_id`, `payment_method`, `order_total`, `address`) VALUES ('2', 'credit card', '400.00', 'Admin City 123');
INSERT INTO `orders` (`customer_id`, `payment_method`, `order_total`, `address`) VALUES ('1', 'debit card', '800.00', ' Admin City 123');
-- Insert order_detail data
INSERT INTO `orders_details` (`order_id`, `product_id`, `product_qty`) VALUES ('1', '1', '1');
INSERT INTO `orders_details` (`order_id`, `product_id`, `product_qty`) VALUES ('1', '2', '1');
INSERT INTO `orders_details` (`order_id`, `product_id`, `product_qty`) VALUES ('2', '2', '1');
INSERT INTO `orders_details` (`order_id`, `product_id`, `product_qty`) VALUES ('3', '2', '2');

