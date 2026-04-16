# Equipment Rental System

A full-stack application for managing equipment rentals, featuring a secure NestJS backend and a modern React/Next.js frontend.

---

## 📂 Project Structure
* **`equipment-rental-backend`**: NestJS API handling Authentication, Database (PostgreSQL), and Email services.
* **`equipment-rental-frontend`**: React/Next.js interface for Customers and Admins.

---

## 🛠 Tech Stack
- **Backend:** NestJS, PostgreSQL, TypeORM.
- **Security:** Bcrypt (Password Hashing).
- **Frontend:** React / Next.js.
- **Testing:** Mailtrap (SMTP Sandbox).

---

## 🚀 Installation & Setup

### Backend & Frontend Setup
```bash
# Navigate to backend folder
cd equipment-rental-backend

# Install dependencies
npm install

# Configure your .env file with your credentials:
# DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
# MAIL_USER, MAIL_PASS

# Run in development mode
npm run start:dev

# Navigate to frontend folder
cd equipment-rental-frontend

# Install dependencies
npm install

# Run the development server
npm run dev

# Navigate to frontend folder
cd equipment-rental-frontend

# Install dependencies
npm install

# Run the development server
npm run dev

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:


```bash

$ npm install -g @nestjs/mau

$ mau deploy

```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.


## Resources


Check out a few resources that may come in handy when working with NestJS:


- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.

- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).

- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).

- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.

- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).

- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).

- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).

- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).



## Support



Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).
