# College Event Management System

A full-stack event management application built with React (Frontend) and Node.js/Express (Backend) using Firestore as the database.

## Features

- Student Registration and Login
- Admin Login
- Create, Read, Update, Delete Events
- View All Events (Students)
- Event Management Dashboard (Admin)

## Tech Stack

- **Frontend**: React, React Router
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Styling**: CSS

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── db.js              # Firestore configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   └── eventController.js # Event CRUD operations
│   ├── routes/
│   │   ├── auth.js            # Auth routes
│   │   └── events.js          # Event routes
│   └── index.js               # Backend server
├── src/
│   ├── pages/                 # React pages/components
│   └── components/            # Reusable components
└── public/                    # Static files
```

## Local Development Setup

### Prerequisites
- Node.js installed
- Firebase project with Firestore enabled
- Firebase service account key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sample
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Firebase**
   - Place your Firebase service account key file in `backend/config/` directory
   - Or set environment variables (see below)

4. **Start Backend Server**
   ```bash
   npm run backend
   # or
   node backend/index.js
   ```
   Backend runs on `http://localhost:5000`

5. **Start Frontend** (in a new terminal)
   ```bash
   npm start
   ```
   Frontend runs on `http://localhost:3000`

## Environment Variables (For Production)

Create a `.env` file in the root directory or set these in your deployment platform:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email
```

## Deployment

### Option 1: Vercel (Frontend) + Railway/Render (Backend) - Recommended

#### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Build settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
5. Add environment variable for API URL:
   - `REACT_APP_API_URL=https://your-backend-url.com`

#### Backend Deployment (Railway)
1. Go to [Railway](https://railway.app)
2. New Project > Deploy from GitHub
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
6. Deploy

### Option 2: Render (Full Stack)

1. Go to [Render](https://render.com)
2. Create two services:
   - **Web Service** (Frontend)
     - Build Command: `npm install && npm run build`
     - Start Command: `serve -s build`
   - **Web Service** (Backend)
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Start Command: `node index.js`
     - Add environment variables

### Option 3: Netlify (Frontend) + Heroku (Backend)

#### Frontend (Netlify)
1. Connect GitHub repo to Netlify
2. Build command: `npm run build`
3. Publish directory: `build`

#### Backend (Heroku)
1. Create `Procfile` in backend folder:
   ```
   web: node index.js
   ```
2. Deploy to Heroku:
   ```bash
   heroku create your-app-name
   heroku config:set FIREBASE_PROJECT_ID=...
   heroku config:set FIREBASE_PRIVATE_KEY=...
   heroku config:set FIREBASE_CLIENT_EMAIL=...
   git push heroku main
   ```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Events
- `GET /api/events/all` - Get all events
- `POST /api/events/create` - Create new event (Admin)
- `PUT /api/events/update/:id` - Update event (Admin)
- `DELETE /api/events/delete/:id` - Delete event (Admin)

## Important Notes

⚠️ **Security**: 
- Never commit Firebase service account keys to GitHub
- Use environment variables in production
- The `.gitignore` file already excludes sensitive files

## License

This is a college project for educational purposes.
