# SlotSwapper - Peer-to-Peer Time-Slot Scheduling Platform

A modern, full-stack web application that allows users to swap time slots with each other. Users can mark their busy calendar slots as "swappable" and request to exchange them with other users' available slots.

## 🚀 Live Demo
- **Frontend**: https://slotswapper-1-v9wo.onrender.com
- **Backend**: https://slotswapper-ew13.onrender.com

## 📋 Project Overview

SlotSwapper is a comprehensive scheduling platform that goes beyond basic calendar management. It introduces a peer-to-peer marketplace where users can exchange time slots, making scheduling more flexible and collaborative.

### Key Design Choices

1. **Database Transactions**: Implemented atomic operations for slot swapping to ensure data consistency
2. **JWT Authentication**: Stateless authentication for scalability
3. **Real-time Notifications**: Live updates without page refresh for better UX
4. **Analytics Dashboard**: Performance tracking to encourage user engagement
5. **Modern UI/UX**: Gradient designs, animations, and intuitive interactions
6. **TypeScript**: Full-stack type safety for maintainability

## 🛠️ Local Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** database (local or cloud)
- **Git** for version control

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/SlotSwapper.git
cd SlotSwapper
```

### Step 2: Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 3: Environment Configuration

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

### Step 4: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 5: Access Application
- **Frontend**: https://slotswapper-1-v9wo.onrender.com
- **Backend API**: https://slotswapper-ew13.onrender.com
- **Health Check**: https://slotswapper-ew13.onrender.com/health

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/auth/signup` | Create user account | `{ name, email, password }` | `{ token, user }` |
| POST | `/api/auth/login` | User authentication | `{ email, password }` | `{ token, user }` |

### Event Management
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/events` | Get user's events | - | `Event[]` |
| POST | `/api/events` | Create new event | `{ title, startTime, endTime }` | `Event` |
| PATCH | `/api/events/:id/status` | Update event status | `{ status }` | `Event` |
| DELETE | `/api/events/:id` | Delete event | - | `{ message }` |

### Swap Operations
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/swaps/swappable-slots` | Browse available slots | - | `Event[]` |
| POST | `/api/swaps/swap-request` | Create swap request | `{ mySlotId, theirSlotId }` | `SwapRequest` |
| POST | `/api/swaps/swap-response/:id` | Accept/reject swap | `{ accept: boolean }` | `SwapRequest` |
| GET | `/api/swaps/incoming` | Get incoming requests | - | `SwapRequest[]` |
| GET | `/api/swaps/outgoing` | Get outgoing requests | - | `SwapRequest[]` |

### Profile Management
| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/profile` | Get user profile | - | `User` |
| PUT | `/api/profile` | Update profile | `{ name?, email?, currentPassword?, newPassword? }` | `User` |

### Example API Usage

**Create Account:**
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Create Event:**
```bash
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Team Meeting","startTime":"2024-01-15T10:00:00Z","endTime":"2024-01-15T11:00:00Z"}'
```

**Request Swap:**
```bash
curl -X POST http://localhost:3001/api/swaps/swap-request \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"mySlotId":"event_id_1","theirSlotId":"event_id_2"}'
```

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for HTTP requests
- **date-fns** for date manipulation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

## 🎯 Key Features

### Core Functionality
- ✅ **User Authentication**: JWT-based signup/login
- ✅ **Calendar Management**: CRUD operations for events
- ✅ **Slot Status Management**: BUSY → SWAPPABLE → SWAP_PENDING
- ✅ **Swap Marketplace**: Browse available slots from other users
- ✅ **Request System**: Send/receive swap requests
- ✅ **Atomic Transactions**: Database-level consistency

### Advanced Features
- ✅ **Real-time Notifications**: Live notification bell with counts
- ✅ **Analytics Dashboard**: Performance metrics and charts
- ✅ **Profile Management**: Complete user profile editing
- ✅ **Modern UI/UX**: Gradient designs and smooth animations
- ✅ **Responsive Design**: Mobile-first approach

## 🧠 Assumptions Made

1. **Time Zones**: All times are stored in UTC, frontend handles local display
2. **Slot Duration**: No minimum/maximum duration restrictions
3. **Concurrent Swaps**: Users can have multiple pending requests
4. **User Trust**: No verification system for swap completion
5. **Data Persistence**: All swaps are permanent once accepted

## 🚧 Challenges Faced

### 1. **Database Transactions**
**Challenge**: Ensuring atomic swap operations to prevent data inconsistency
**Solution**: Implemented MongoDB transactions with proper rollback mechanisms

### 2. **Real-time Updates**
**Challenge**: Keeping UI synchronized with backend state changes
**Solution**: Polling-based notifications with 30-second intervals

### 3. **Complex State Management**
**Challenge**: Managing multiple interdependent states (events, swaps, notifications)
**Solution**: React Context for global state, local state for UI interactions

### 4. **TypeScript Configuration**
**Challenge**: Vite + TypeScript build issues with import paths
**Solution**: Proper tsconfig.json setup and environment type declarations

### 5. **Authentication Flow**
**Challenge**: Seamless login/logout with token persistence
**Solution**: Axios interceptors with automatic token attachment

## 📊 Project Structure

```
SlotSwapper/
├── src/                    # Frontend React Application
│   ├── components/         # Reusable UI Components
│   ├── pages/             # Application Pages
│   ├── context/           # React Context
│   ├── services/          # API Integration
│   ├── types/             # TypeScript Definitions
│   └── App.tsx            # Main application
├── backend/               # Backend API Server
│   ├── src/
│   │   ├── models/        # Database Models
│   │   ├── routes/        # API Routes
│   │   ├── middleware/    # Custom Middleware
│   │   └── server.ts      # Express server
│   └── package.json
├── package.json
├── .gitignore
└── README.md
```

## 🚀 Deployment

### Frontend Build Commands
- **Build**: `npm run build`
- **Output**: `dist/`
- **Environment**: `VITE_API_URL=https://slotswapper-ew13.onrender.com/api`

### Backend Build Commands
- **Root Directory**: `backend`
- **Build**: `npm install && npm run build`
- **Start**: `npm start`

## 🧪 Testing the Application

### Multi-User Testing Flow
1. **User A**: Create account → Add events → Make some swappable
2. **User B**: Create account → Add events → Browse marketplace
3. **User B**: Request swap with User A's slot
4. **User A**: Receive notification → Accept/reject request
5. **Both Users**: View updated calendars and analytics

### Test Accounts
Create multiple accounts with different emails to test the full swap functionality.

## 🎨 Design Philosophy

- **User-Centric**: Intuitive interface with clear visual feedback
- **Performance-First**: Optimized rendering and API calls
- **Scalable Architecture**: Modular components and services
- **Security-Focused**: Input validation and secure authentication
- **Modern Standards**: TypeScript, ES6+, and best practices

## 📈 Future Enhancements

- WebSocket integration for real-time notifications
- Calendar integration (Google Calendar, Outlook)
- Mobile application (React Native)
- Advanced analytics with ML insights
- Team/organization management
- Recurring event support

## 📄 License

This project is created for the ServiceHive Full Stack Intern technical challenge.

---

**Built with ❤️ for ServiceHive Technical Challenge**

*SlotSwapper - Where scheduling meets intelligence*

## 📞 Contact

For any questions or clarifications about this project, please reach out through the ServiceHive hiring process.
