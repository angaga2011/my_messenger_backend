# Web Messenger Application

This project is a web-based messenger application that allows users to **sign up, log in, and chat** with their contacts or groups in real time. It is built with a **React** frontend and an **Express** backend, using **MongoDB** for data storage and **Socket.io** for real-time messaging.

## Table of Contents
1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [Setup Instructions](#setup-instructions)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
6. [Instructions for Deploying on Render.com](#instructions-for-deploying-on-rendercom)
7. [Usage](#usage)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

### Implemented Features ✅
- User **registration** and **authentication**
- Real-time messaging with **Socket.io**
- Group chat creation and messaging
- Dark mode support 🌙
- Contact management (add/delete contacts or groups)

### In-Progress Features ⚠️
- User profile management
- Adding or deleting participants in an existing group

### Planned Features (Stretch Goals) 🛠💧
- Media sharing (videos, audio) in chats
- Profile customization (profile picture and status message)
- Search functionality for messages and conversations
- Push notifications for new messages
- Message read receipts

---

## Technologies Used

### Frontend
- **React**: Component-based frontend library
- **React Router**: Routing within the application
- **Axios**: HTTP client for API calls
- **Socket.io-client**: Real-time communication with the backend
- **Vite**: Modern build tool for frontend development

### Backend
- **Express**: Node.js web framework for the backend API
- **MongoDB**: Database for storing user data, contacts, and messages
- **Socket.io**: Real-time event-based communication
- **JWT**: Authentication and authorization
- **Multer**: Middleware for file uploads

---

## Project Structure

```
messenger_frontend
├── public/...                  # Public assets (HTML, images, etc.)
├── src/
│   ├── assets/...              # Static assets (e.g., images, icons)
│   ├── components/             # React components
│   │   ├── ChatInput.jsx       # Chat input field component
│   │   ├── ChatScreen.jsx      # Main chat screen logic
|   |   ├── ChatMessages.jsx    # Messages component
│   │   ├── ChatSection.jsx     # Chat message display
│   │   ├── ContactsSection.jsx # Contact list section
|   |   ├── ContactItem.jsx     # Contact item
│   │   ├── LogIn.jsx           # Login page component
│   │   ├── Settings.jsx        # User settings page
│   │   ├── SignUp.jsx          # Sign-up page component
│   ├── styles/                 # CSS files for styling components
│   ├── App.jsx                 # Main App component
│   ├── index.html              # React root
│   ├── ...
├── .env                        # Environment variables
├── .gitignore                  # Ignored files for git
├── package.json                # Project dependencies
├── README.md                   # Project documentation
└── ...

my_messenger_backend/           # Backend root directory
│   ├── config/
│   │   └── db.js               # MongoDB connection setup
│   ├── controllers/...         # API controllers for routes
│   ├── routes/                 # API routes
|   |   ├── auth.js             # Authentication routes
|   |   ├── messages.js         # Messaging routes
|   |   ├── userAccount.js      # Account management routes
|   |   ├── userContacts.js     # Contacts management routes
|   |   ├── userGroups          # Groups management routes
│   ├── utils/...               # Utility functions (e.g., JWT auth)
│   ├── app.js                  # Express server setup
├── .env                        # Environment variables
├── .gitignore                  # Ignored files for git
├── package.json                # Project dependencies
├── README.md                   # Project documentation
└── ...
```

---

## Setup Instructions

### Backend Setup

*Note: I had issues with firewall while running it from local machine

Clone the repository:
```sh
git clone https://github.com/angaga2011/my_messenger_backend.git
```

Navigate to the backend directory:
```sh
cd my_messenger_backend
```

Install the dependencies:
```sh
npm install
```

Create a `.env` file in the backend root directory:
```env
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=5000
```

Start the backend server:
```sh
npm run dev
```

---

### Frontend Setup

Clone the repository:
```sh
git clone https://github.com/angaga2011/messenger_frontend.git
```

Navigate to the frontend directory:
```sh
cd messenger_frontend
```

Install the dependencies:
```sh
npm install
```

Create a `.env` file in the frontend root directory:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:
```sh
npm run dev
```

---

## Running the Application

1. Ensure that both the **backend** and **frontend** servers are running.
2. Open your browser and navigate to:
   ```sh
   http://localhost:3000
   ```

---

## Instructions for Deploying on Render.com

If there are firewall issues when running locally, you can deploy both the frontend and backend on [Render.com](https://render.com):

1. **Deploy Backend**:
   - Go to [Render Dashboard](https://dashboard.render.com) and create a new service.
   - Select "Web Service" and connect your backend repository.
   - Specify build command: 
   ```sh
   npm install
   ``` 
   - Specify start command: 
   ```sh
   node app.js
   ``` 
   - Add the required environment variables (`MONGO_URI`, `JWT_SECRET`, and `PORT`) in the Render environment settings.
   - Deploy the backend service.

2. **Deploy Frontend**:
   - Create static service for the frontend.
   - Specify build command: 
   ```sh
   npm run build
   ``` 
   - Specify publish directory: dist
   - Add the environment variable `VITE_API_URL` with the value set to your backend's Render URL (e.g., `https://your-backend-url.onrender.com`).
   - Deploy the frontend service.

3. Access your application using the provided frontend Render URL.

---

## Usage

- **Sign Up**: Register by providing a username, email, and password.
- **Log In**: Access the app using your credentials.
- **Add Contact/Group**: Click add button and follow instructions in the prompt.
- **Chat**: Select a contact or group and send/receive real-time messages.

### Settings
- Enter settings using a button on the control panel.
- Toggle dark mode.
- Manage your profile (in development).

### Contacts
- Add or delete individual contacts and groups using a button on the control panel (deletes selected contact).

### Other
- Log out using the button on the control panel.

*Note: You can open a second window in incognito mode to log into a second account for testing the messaging feature.*

---

## Screenshots

**Chat Interface**  
![Chat Interface](src/assets/Screenshots/Chat.png)

**Login Page**  
![Login Page](src/assets/Screenshots/Login.png)

**Settings Page**  
![Settings Page](src/assets/Screenshots/Settings.png)

---

## Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch:
   ```sh
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```sh
   git commit -m "Add your feature description"
   ```
4. Push the branch and create a pull request.

---

## License

This project is licensed under the **MIT License**.
