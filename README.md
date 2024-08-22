
## To Run Locally

Clone the project

```bash
git clone https://github.com/choiquychoi/hospital-web.git
```

Install dependencies

```bash
npm install
```

Download XAMPP and create a database named hospital_web.

Then Run migrations in terminal

```bash
npx sequelize-cli db:migrate
```

Start the server

```bash
npm run start
```


# Hospital Management System

Hospital management system is a website which can control all the management related to a hospital, like admitting patients, booking beds, calling an ambulance, managing payments, creating reports of patients and many more thing online.
