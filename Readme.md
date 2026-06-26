# 🎥 VideoTube

A full-stack video sharing platform inspired by YouTube, built using the MERN stack. Users can securely upload, watch, and manage videos, interact with content through likes and comments, subscribe to channels, and manage their profiles.

## 🚀 Features

- 🔐 User Authentication & Authorization using JWT
- 📹 Video Upload & Streaming
- 👍 Like & Unlike Videos
- 💬 Comment on Videos
- 🔔 Subscribe & Unsubscribe to Channels
- 👤 User Profile Management
- 📝 Video CRUD Operations
- ☁️ Cloudinary Integration for Video & Thumbnail Storage
- 📂 File Upload Handling with Multer
- 📡 RESTful APIs following MVC Architecture
- 🔒 Secure Password Hashing with bcrypt

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- Cloudinary

## 📂 Project Structure

```
VideoTube/
│
├── client/             # React Frontend
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   ├── config/
│   └── index.js
│
├── .env
├── package.json
└── README.md
```

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/your-username/videotube.git
cd videotube
```

### Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

## 🔑 Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret

REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## ▶️ Run the Project

### Start Backend

```bash
npm run dev
```

### Start Frontend

```bash
npm run dev
```

The application will be available at:

```
Frontend: http://localhost:5173
Backend: http://localhost:5000
```

## 🔮 Future Enhancements

- Playlist Management
- Watch History
- Notifications
- Infinite Scrolling
- Admin Dashboard
- Video Analytics

## 🤝 Contributing

Contributions are welcome. Feel free to fork this repository and submit a pull request.

## 👨‍💻 Author

**Himanshu Sharma**

- GitHub: https://github.com/HimanshuSharma-07
- LinkedIn: https://www.linkedin.com/in/himanshu-sharma-31644b321
