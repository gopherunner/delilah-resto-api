# Delilah Resto REST API

This is the third project of the Full Stack Developer course at Acamica.

# Procedure

### Installation

1. Clone the repo
    ```sh
   git clone https://github.com/gopherunner/delilah-resto-api.git
   ```
2. Install NPM packages
    ```sh
    cd delilah-resto-api
    npm install
    ```
### Install & configure the MySQL (MariaDB) database (in this example I did it for MacOS)

1. Install MariaDB with Brew:
    ```sh
    brew update
    brew install mariadb
    ```

2. After a successful installation, we can start the server and also ensure it autostarts in the future:
    ```sh
    brew services start mariadb
    ```

3. You should get some feedback from the last command like:
    ```sh
    ==> Successfully started `mariadb` (label: ...)
    ```

4. You must change the root password and secure your installation:
    ```sh
    sudo /usr/local/bin/mysql_secure_installation
    ```

5. Create an **.env** file on the root of the project with the following configuration:
    ```sh
    APP_PORT=3000
    APP_SECRET=s3cr3t
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=<password set for mariadb>
    DB_NAME=delilah_resto
    DB_PORT=3306
    ```
6. Import the Delilah Resto Database schemas into the DB:
    ```sh
    cd delilah-resto-api/db
    $ mysql -u root -p#### -h localhost < delilah_resto.sql
    ```
    NOTE: replace the #### with the password you set for the db

7. Start the REST API:

    ```sh
    cd delilah-resto-api
    $ npm start
    ```
    
    Check that the REST API is working
    ```sh
    [INFO] Connecting to the Database (delilah_resto) on port 3306...
    [INFO] Connection established!
    [INFO] Starting Delilah Resto API Server, listening on port 3000
    ```

8. Install JSON commandline JQ:
    
    in Mac OS:
    
    ```sh
    brew install jq
    ```

# Examples

* **Customer Login and retrieve the Token to use later on**

```sh
$ TOKEN=$(curl -H "Content-Type: application/json" --request POST -d '{ "username": "admin", "password": "admin" }' \
    http://localhost:3000/customers/login | jq -r '.token')
```

* **List all the available Products**

```sh
$ curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" --request GET http://localhost:3000/products \
    | json_pp -json_opt pretty
```

* **List all the available Orders**

```sh
$ curl -H 'Accept: application/json' -H "Authorization: Bearer ${TOKEN}" --request GET \
    http://localhost:3000/orders | json_pp -json_opt pretty,canonical
```


# Endpoints

### Customers

|  METHOD | ENDPOINT            | BODY                                                           | HEADER         | DESCRIPTION                               |
|---------|---------------------|----------------------------------------------------------------|----------------|-------------------------------------------|
| POST    | /customers/register | { username, password, fullname, address, email, phone_number } |                | Create a new Customer                     |
| POST    | /customers/login    | { username, password }                                         |                | Login Customer and get the Token          |
| GET     | /customers/orders   |                                                                | { token }      | Returns all the orders from the customer  |
| PUT     | /customers/:id      |                                                                | { adminToken } | Modify an existing Customer               |

### Products

|  METHOD | ENDPOINT      | BODY                                                                           | HEADER         | DESCRIPTION                 |
|---------|---------------|--------------------------------------------------------------------------------|----------------|-----------------------------|
| POST    | /products     | { username, password, fullname, address, email, phone_number }                 | { adminToken } | Create a new Product        |
| GET     | /products     |                                                                                | { token }      | Return all the Products     |
| GET     | /products/:id |                                                                                | { token }      | Return an specific Product  |
| PUT     | /products/:id | { product_name, product_detail, product_price, product_photo, active }         | { adminToken } | Modify an existing Product  |
| DELETE  | /products/:id |                                                                                | { adminToken } | Deletes an existing Product |

### Orders

|  METHOD | ENDPOINT    | BODY                                   | HEADER         | DESCRIPTION                            |
|---------|-------------|----------------------------------------|----------------|----------------------------------------|
| POST    | /orders     | { username, payment_method, products } | { token }      | Create a new Order                     |
| GET     | /orders     |                                        | { adminToken } | Return all the Orders                  |
| GET     | /orders/:id |                                        | { adminToken } | Return an specific Order               |
| PUT     | /orders/:id | { order_status }                       | { adminToken } | Modify the status of an existing Order |
| DELETE  | /orders/:id |                                        | { adminToken } | Deletes an existing Order              |
