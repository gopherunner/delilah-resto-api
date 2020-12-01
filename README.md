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
    npm install
    ```
4. Install & configure the MySQL (MariaDB) database (in this example I did it for MacOS)
    4.1 Install MariaDB with Brew:
        ```sh
        brew update
        brew install mariadb
        ```
    4.2. After a successful installation, we can start the server and also ensure it autostarts in the future:
        ```sh
        brew services start mariadb
        ```
        You should get some feedback from the last command like:
        ```sh
        ==> Successfully started `mariadb` (label: ...)
        ```
    4.3. You must change the root password and secure your installation:
        ```sh
        sudo /usr/local/bin/mysql_secure_installation
        ```

5. Create an **.env** file with the following configuration:
    ```sh
    APP_PORT=3000
    APP_SECRET=s3cr3t
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=<password set for mariadb>
    DB_NAME=delilah_resto
    DB_PORT=3306
    ```
