# Authmika-API

## Installation

- Clone the repository
- Copy the `.env.sample` file to `.env`.
- Update the below variables in `.env` file to connect the database.
  ```
  DB_HOST= localhost
  DB_PORT= 3306
  DB_USERNAME=
  DB_PASSWORD=
  DB_DATABASE=authmika
  ```
- Update the below variables in `.env` file for email.
  ```
  MAIL_MAILER=smtp
  MAIL_HOST=127.0.0.1
  MAIL_PORT=1025
  MAIL_USERNAME=null
  MAIL_PASSWORD=null
  MAIL_ENCRYPTION=null
  MAIL_FROM_ADDRESS=
  MAIL_FROM_NAME=
  ```
- Update the below variable in `.env` file to JWT token expiration in seconds.
  ```
  JWT_EXPIRATION=
  ```
- Update the below variable in `.env` file to password reset token expiration in seconds.
  ```
  PASSWORD_RESET_EXPIRATION_TIME=
  ```
- Run `pnpm install` or `npm install`.
- Run `npx sequelize-cli db:migrate`.
- Run `pnpm run start:dev` or `npm run start:dev`.

