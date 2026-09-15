# Secure e-Health Record Management System

A secure full-stack Electronic Health Record (EHR) management system designed to manage patient medical records with authentication, role-based access control, encrypted data storage, and AI-assisted preliminary assessment.

The system follows a client-server architecture with a React frontend, Node.js/Express backend, and MongoDB database.

---

## 🚀 Features

- Secure user authentication
- Patient and Doctor role-based access
- JWT-based authentication
- Role-Based Access Control (RBAC)
- Password hashing using bcrypt
- AES-256-GCM encryption for sensitive medical data
- Electronic Health Record (EHR) management
- Create, read, update and delete medical records
- Medical record history
- Patient and doctor profiles
- Secure RESTful APIs
- Input validation and protected API routes
- AI-assisted preliminary health assessment
- MongoDB database integration
- Responsive web interface

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      React.js        │
                    │     Frontend         │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │    Node.js +         │
                    │     Express.js       │
                    │      Backend         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌────────────┐   ┌─────────────┐  ┌─────────────┐
       │    JWT     │   │  AES-256    │  │    Ollama   │
       │    Auth    │   │ Encryption  │  │  Llama 3.2  │
       └────────────┘   └─────────────┘  └─────────────┘
              │                │
              └────────────────┼────────────────┐
                               ▼                │
                    ┌──────────────────────┐   │
                    │      MongoDB         │◄──┘
                    │       Atlas          │
                    └──────────────────────┘
```

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* RESTful APIs

### Database

* MongoDB
* MongoDB Atlas

### Security

* JWT Authentication
* bcrypt Password Hashing
* Role-Based Access Control (RBAC)
* AES-256-GCM Encryption
* Protected API routes
* Input validation

### AI

* Ollama
* Llama 3.2

### Development Tools

* Git
* GitHub
* VS Code
* Postman

---

## 🔐 Security Architecture

Security is a core part of the application because medical records contain sensitive information.

### 1. Password Security

User passwords are never stored directly in the database.

Passwords are hashed using bcrypt before being stored.

```text
User Password
      │
      ▼
   bcrypt
      │
      ▼
Password Hash
      │
      ▼
   MongoDB
```

During login, the entered password is compared against the stored hash.

---

### 2. JWT Authentication

After successful login, the backend generates a JSON Web Token (JWT).

The token is used to authenticate subsequent API requests.


Login
  │
  ▼
Credentials Verification
  │
  ▼
JWT Generated
  │
  ▼
Client
  │
  ▼
Protected API Request
  │
  ▼
JWT Verification
  │
  ▼
Authorized Request
```

JWT allows the backend to identify the authenticated user without storing a server-side login session.

---

### 3. Role-Based Access Control

The system separates access based on user roles.

Current roles include:

* Patient
* Doctor

Authorization is performed after authentication.

For example:


User → Login
       ↓
     JWT
       ↓
Identify User
       ↓
Check Role
       ↓
Allow / Deny Resource
```

This prevents unauthorized users from accessing protected healthcare operations.

---

## 🔒 AES-256-GCM Encryption

Sensitive medical information is encrypted before being stored.

The project uses AES-256-GCM encryption.


Medical Data
     │
     ▼
AES-256-GCM Encryption
     │
     ▼
Encrypted Data
     │
     ▼
MongoDB
```

When authorized data is requested:


MongoDB
   │
   ▼
Encrypted Data
   │
   ▼
AES-256-GCM Decryption
   │
   ▼
Original Medical Data
```

AES encryption provides confidentiality, while GCM also provides authenticated encryption.

The encryption process uses:

* Secret encryption key
* Nonce / IV
* Authentication tag
* Ciphertext

The encryption key is kept outside the source code using environment configuration.

---

## 🏥 Electronic Health Records

The application provides functionality for managing electronic health records.

Users can perform operations such as:

* Create medical records
* View medical records
* Update medical records
* Delete medical records
* View record history
* Manage patient information

Medical information is handled through protected backend APIs.

---

## 👨‍⚕️ Patient and Doctor Access

### Patient

Patients can:

* Create and manage their profile
* Access their medical information
* View their records
* Manage permitted health information

### Doctor

Doctors can access patient information according to the authorization rules implemented by the backend.

This separation is implemented using Role-Based Access Control.

---

## 🤖 AI-Assisted Preliminary Assessment

The project also integrates a locally running AI model using Ollama and Llama 3.2.

The backend exposes an AI assessment endpoint:

```text
POST /api/ai/assessment
```

The general workflow is:

```text
User Medical Information
          │
          ▼
      React.js
          │
          ▼
       Express
          │
          ▼
   AI Assessment API
          │
          ▼
      Ollama
          │
          ▼
      Llama 3.2
          │
          ▼
Preliminary Assessment
          │
          ▼
      Frontend
```

The AI component is intended for preliminary informational assessment and does not replace professional medical diagnosis.

---

## 🔄 Application Workflow

### Registration


User
 ↓
Registration Form
 ↓
Backend API
 ↓
Input Validation
 ↓
bcrypt Password Hashing
 ↓
MongoDB
```

### Login


User
 ↓
Login
 ↓
Express API
 ↓
Password Verification
 ↓
JWT Generation
 ↓
Client
```

### Medical Record Operation


Authenticated User
        ↓
JWT Verification
        ↓
Role Verification
        ↓
API Authorization
        ↓
Medical Record Operation
        ↓
AES-256 Encryption / Decryption
        ↓
MongoDB
``

## 📁 Project Structure

The project follows a modular client-server structure.


e-health-record-management/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
``
## ⚙️ Environment Variables

Create a `.env` file inside the backend directory.

Example:


PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

ENCRYPTION_KEY=your_32_byte_encryption_key



## 🧑‍💻 Installation

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd e-health-record-management
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create:

```text
backend/.env
```

and add the required MongoDB, JWT and encryption configuration.

### 4. Start the backend

```bash
npm start
```

or, if the project uses a development script:

```bash
npm run dev
```

---

## 🎨 Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will then be available through the development server URL shown by Vite.

---

## 🗄️ Database

The project uses MongoDB for storing application data.

MongoDB Atlas can be used as the cloud database.

The backend communicates with MongoDB through the application's database layer.

Sensitive medical fields are encrypted before storage where encryption is applied.

---

## 🔌 REST API

The backend follows RESTful API principles.

Major API responsibilities include:

| Function        | Purpose                            |
| --------------- | ---------------------------------- |
| Authentication  | Registration and login             |
| Authorization   | Role and permission verification   |
| Profile         | User profile management            |
| Medical Records | EHR CRUD operations                |
| AI Assessment   | Preliminary AI-assisted assessment |

Example AI endpoint:

```text
POST /api/ai/assessment
```

Protected APIs require authentication through JWT.

---

## 🧪 Testing

The application can be tested using:

* Browser
* Postman
* REST API requests
* Authentication test cases
* Role-based authorization scenarios
* CRUD operations
* Invalid input scenarios

Important test cases include:

* Valid registration
* Invalid registration
* Valid login
* Invalid login
* Accessing protected API without JWT
* Patient accessing unauthorized resources
* Doctor accessing permitted resources
* Medical record creation
* Medical record update
* Medical record deletion
* Encryption/decryption workflow
* AI assessment request

---

## 🛡️ Security Considerations

The project applies several application-security practices:

* Password hashing using bcrypt
* JWT-based authentication
* Role-Based Access Control
* AES-256-GCM encryption
* Protected API endpoints
* Input validation
* Environment-based secrets
* Separation of frontend and backend responsibilities

For a production healthcare system, additional requirements would be necessary, including comprehensive auditing, key management, compliance controls, monitoring, backups, access logging, and infrastructure hardening.

---

## 🚧 Limitations

This project is an academic/software engineering implementation and should not be considered a production healthcare platform.

Current limitations include:

* AI output is not a medical diagnosis
* Production-grade compliance has not been implemented
* Advanced audit logging can be expanded
* Enterprise-grade key management is outside the current scope
* Large-scale deployment and high availability are outside the academic scope

---

## 🔮 Future Improvements

Potential future improvements include:

* Multi-factor authentication
* Detailed audit logs
* Advanced doctor-patient workflows
* Digital prescriptions
* Medical document upload
* Appointment management
* Notifications
* Stronger encryption key management
* Automated security monitoring
* Advanced AI-assisted health analytics
* Mobile application
* Cloud-native deployment
* Comprehensive compliance and privacy controls

---

## 🎯 Project Objectives

The main objectives of the project are:

1. Build a secure electronic health record management platform.
2. Implement authentication and authorization.
3. Protect sensitive medical information using encryption.
4. Provide role-based access to healthcare information.
5. Implement secure REST APIs.
6. Integrate an AI model for preliminary assessment.
7. Demonstrate secure full-stack application development.

---

## 📌 Key Concepts Demonstrated

This project demonstrates practical implementation of:

* Full-Stack Development
* Client-Server Architecture
* REST APIs
* CRUD Operations
* Authentication
* Authorization
* JWT
* RBAC
* Password Hashing
* AES-256-GCM
* MongoDB
* API Security
* Environment Variables
* AI Integration
* Git & GitHub

---

## ⚠️ Disclaimer

This application is developed for educational and demonstration purposes.

The AI-assisted assessment is informational only and must not be treated as a medical diagnosis or a substitute for consultation with a qualified healthcare professional.

---

## 👨‍💻 Project

**Secure e-Health Record Management System**

Built using:

`React.js` · `Node.js` · `Express.js` · `MongoDB` · `JWT` · `RBAC` · `AES-256-GCM` · `Ollama` · `Llama 3.2`

---

