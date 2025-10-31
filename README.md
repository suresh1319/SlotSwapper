# SlotSwapper - Peer-to-Peer Time-Slot Scheduling

A full-stack web application that allows users to swap time slots with each other. Users can mark their busy calendar slots as "swappable" and request to exchange them with other users' available slots.

## 🚀 Live Demo
- **Frontend**: [Deploy to Vercel/Netlify]
- **Backend**: [Deploy to Render/Railway]

## ✨ Features

### Core Functionality
- **User Authentication**: JWT-based signup and login
- **Calendar Management**: Create, view, and manage personal events
- **Slot Status Management**: Mark events as BUSY, SWAPPABLE, or SWAP_PENDING
- **Marketplace**: Browse available swappable slots from other users
- **Swap Requests**: Request to swap slots with other users
- **Request Management**: Accept or reject incoming swap requests
- **Real-time Updates**: Dynamic state management without page refreshes

### Technical Features
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Authentication**: JWT tokens with protected routes
- **Database Transactions**: Atomic swap operations
- **Input Validation**: Server-side validation with express-validator
- **Error Handling**: Comprehensive error states and user feedback

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **TailwindCSS** for styling and responsive design
- **React Router** for client-side navigation
- **Axios** for HTTP requests
- **date-fns** for date formatting

### Backend
- **Node.js** with Express framework
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
SlotSwapper/
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   │   └── Navbar.tsx
│   ├── pages/             # Page components
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx   # User's calendar
│   │   ├── Marketplace.tsx # Browse swappable slots
│   │   └── Requests.tsx    # Manage swap requests
│   ├── context/           # React context
│   │   └── AuthContext.tsx
│   ├── services/          # API services
│   │   └── api.ts
│   ├── types/             # TypeScript interfaces
│   │   └── index.ts
│   └── App.tsx            # Main app component
├── backend/               # Backend API
│   ├── src/
│   │   ├── models/        # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Event.ts
│   │   │   └── SwapRequest.ts
│   │   ├── routes/        # API routes
│   │   │   ├── auth.ts
│   │   │   ├── events.ts
│   │   │   └── swaps.ts
│   │   ├── middleware/    # Custom middleware
│   │   │   └── auth.ts
│   │   └── server.ts      # Express server
│   ├── package.json
│   └── tsconfig.json
├── package.json
├── tailwind.config.js
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** database (local or cloud)
- **npm** or **yarn** package manager
- **Git** for version control

### 📋 Quick Start

1. **Clone the repository**:
```bash
git clone <repository-url>
cd SlotSwapper
```

2. **Install frontend dependencies**:
```bash
npm install
```

3. **Setup Backend**:
```bash
cd backend
npm install
```

4. **Configure Environment Variables**:

Create `.env` file in root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

Create `.env` file in `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
```

5. **Start Development Servers**:

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
npm run dev
```

### 🌐 Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| POST | `/api/auth/signup` | Create new user account | `{ name, email, password }` |
| POST | `/api/auth/login` | User login | `{ email, password }` |

### Events Management
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| GET | `/api/events` | Get user's events | - |
| POST | `/api/events` | Create new event | `{ title, startTime, endTime }` |
| PATCH | `/api/events/:id/status` | Update event status | `{ status }` |
| DELETE | `/api/events/:id` | Delete event | - |

### Swap Operations
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|-------------|
| GET | `/api/swaps/swappable-slots` | Get available slots from other users | - |
| POST | `/api/swaps/swap-request` | Create swap request | `{ mySlotId, theirSlotId }` |
| POST | `/api/swaps/swap-response/:requestId` | Accept/reject swap request | `{ accept: boolean }` |
| GET | `/api/swaps/incoming` | Get incoming swap requests | - |
| GET | `/api/swaps/outgoing` | Get outgoing swap requests | - |

## 🎯 Core Swap Logic

The application implements a sophisticated swap mechanism:

1. **Slot Discovery**: Users can browse swappable slots from other users
2. **Request Creation**: Users select their own swappable slot to offer in exchange
3. **Status Management**: Both slots are marked as SWAP_PENDING during the request
4. **Atomic Transactions**: Database transactions ensure data consistency
5. **Ownership Transfer**: On acceptance, slot ownership is exchanged between users
6. **Status Reset**: On rejection, slots revert to SWAPPABLE status

## 🧪 Testing the Application

### User Flow Testing
1. **Sign Up**: Create a new account with name, email, and password
2. **Create Events**: Add calendar events with title, start time, and end time
3. **Make Swappable**: Change event status from BUSY to SWAPPABLE
4. **Browse Marketplace**: View available slots from other users
5. **Request Swap**: Select your slot to offer in exchange for another user's slot
6. **Manage Requests**: Accept or reject incoming swap requests
7. **View Results**: See updated calendar with swapped events

### API Testing
Use tools like Postman or curl to test API endpoints:

```bash
# Login to get JWT token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create event (with Bearer token)
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Meeting","startTime":"2024-01-15T10:00:00Z","endTime":"2024-01-15T11:00:00Z"}'
```

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)

1. **Connect Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" and import your GitHub repository

2. **Configure Build Settings**:
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

3. **Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### Backend Deployment (Render)

1. **Create Web Service**:
   - Go to [Render Dashboard](https://render.com)
   - Create new Web Service from GitHub

2. **Configure Settings**:
   ```
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Environment Variables**:
   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-production-jwt-secret
   PORT=3001
   NODE_ENV=production
   ```

## 🛠️ Development Commands

### Frontend Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Commands
```bash
npm run dev          # Start development server with nodemon
npm run build        # Compile TypeScript to JavaScript
npm start            # Start production server
```

## 🐛 Troubleshooting

### Common Issues

**Authentication Errors**:
- Ensure JWT_SECRET is set in backend environment
- Check token format in Authorization header
- Verify token expiration (7 days default)

**Database Connection**:
- Ensure MongoDB is running locally or connection string is correct
- Check network connectivity for cloud databases
- Verify database permissions

**CORS Issues**:
- Backend CORS is configured for all origins in development
- Update CORS settings for production deployment

**Swap Transaction Failures**:
- Check that both slots exist and are SWAPPABLE
- Ensure no existing pending requests for the slots
- Verify user permissions for slot ownership

### Port Conflicts
```bash
# Kill process on port 3001 (Windows)
netstat -ano | findstr :3001
taskkill /PID <process-id> /F

# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <process-id> /F
```

## ✅ Features Implemented

### Core Requirements ✅
- ✅ **User Authentication**: JWT-based signup and login
- ✅ **Calendar Management**: CRUD operations for events
- ✅ **Swap Logic**: Complex transaction-based slot swapping
- ✅ **Marketplace**: Browse available swappable slots
- ✅ **Request Management**: Accept/reject swap requests
- ✅ **Protected Routes**: Authentication-based access control
- ✅ **State Management**: Dynamic UI updates without refresh

### Technical Requirements ✅
- ✅ **Database Schema**: Users, Events, SwapRequests models
- ✅ **API Endpoints**: All required REST endpoints
- ✅ **Input Validation**: Server-side validation
- ✅ **Error Handling**: Comprehensive error states
- ✅ **TypeScript**: Full type safety throughout
- ✅ **Responsive Design**: Mobile-friendly interface

## 🎨 Design Decisions

### Database Schema
- **Users**: Basic authentication fields with bcrypt password hashing
- **Events**: Flexible event model with status enum for swap states
- **SwapRequests**: Tracks swap relationships with status management

### Authentication Strategy
- JWT tokens with 7-day expiration
- Local storage for token persistence
- Protected route components with context-based auth

### State Management
- React Context for global authentication state
- Local component state for UI interactions
- API-driven data fetching with loading states

### Transaction Safety
- MongoDB transactions for atomic swap operations
- Rollback on any failure during swap process
- Prevents race conditions and data inconsistency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is created for the ServiceHive Full Stack Intern technical challenge.

---

**Built with ❤️ for ServiceHive Technical Challenge**