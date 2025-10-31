# SlotSwapper - Peer-to-Peer Time-Slot Scheduling Platform

A modern, full-stack web application that allows users to swap time slots with each other. Users can mark their busy calendar slots as "swappable" and request to exchange them with other users' available slots.

## 🚀 Live Demo
- **Frontend**: [Deploy to Vercel/Netlify]
- **Backend**: [Deploy to Render/Railway]

## ✨ Key Features

### 🔐 **Authentication & Security**
- JWT-based user authentication
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Session management with token persistence

### 📅 **Smart Calendar Management**
- Create, view, edit, and delete events
- Dynamic status management (BUSY → SWAPPABLE → SWAP_PENDING)
- Visual status indicators with color coding
- Time conflict detection and prevention

### 🔄 **Advanced Swap System**
- **Marketplace**: Browse available swappable slots from other users
- **Smart Matching**: Intelligent slot compatibility checking
- **Atomic Transactions**: Database-level consistency for swaps
- **Request Management**: Accept/reject incoming swap requests
- **Status Tracking**: Real-time swap status updates

### 🔔 **Real-Time Notifications**
- Live notification bell with pending request count
- Auto-refreshing notification system (30-second intervals)
- Visual indicators for unread notifications
- Quick access to pending requests

### 📊 **Analytics Dashboard**
- **Performance Metrics**: Success rate, total swaps, activity tracking
- **Visual Charts**: Weekly activity graphs with interactive bars
- **Swap Partners**: Top collaboration partners ranking
- **Insights**: AI-powered optimization tips and recommendations
- **Progress Tracking**: Personal swapping statistics

### 👤 **Profile Management**
- Complete profile editing (name, email, password)
- Account information display
- Security features with current password verification
- Real-time update confirmations

## 🏗️ Tech Stack

### **Frontend**
- **React 18** with TypeScript for type safety
- **Vite** for lightning-fast development and builds
- **TailwindCSS** for modern, responsive design
- **React Router** for client-side navigation
- **Axios** for HTTP requests with interceptors
- **date-fns** for advanced date formatting and manipulation

### **Backend**
- **Node.js** with Express framework
- **TypeScript** for full-stack type safety
- **MongoDB** with Mongoose ODM
- **JWT** for stateless authentication
- **bcryptjs** for secure password hashing
- **express-validator** for robust input validation
- **Database Transactions** for atomic operations

## 📁 Project Architecture

```
SlotSwapper/
├── src/                    # Frontend React Application
│   ├── components/         # Reusable UI Components
│   │   ├── Navbar.tsx      # Navigation with notifications
│   │   └── NotificationBell.tsx # Real-time notifications
│   ├── pages/             # Application Pages
│   │   ├── Login.tsx       # Authentication
│   │   ├── Signup.tsx      # User registration
│   │   ├── Dashboard.tsx   # Personal calendar management
│   │   ├── Marketplace.tsx # Browse available slots
│   │   ├── Requests.tsx    # Manage swap requests
│   │   ├── Analytics.tsx   # Performance dashboard
│   │   └── Profile.tsx     # User profile management
│   ├── context/           # React Context
│   │   └── AuthContext.tsx # Global authentication state
│   ├── services/          # API Integration
│   │   └── api.ts         # Centralized API calls
│   ├── types/             # TypeScript Definitions
│   │   └── index.ts       # Shared interfaces
│   └── App.tsx            # Main application component
├── backend/               # Backend API Server
│   ├── src/
│   │   ├── models/        # Database Models
│   │   │   ├── User.ts    # User authentication model
│   │   │   ├── Event.ts   # Calendar event model
│   │   │   └── SwapRequest.ts # Swap transaction model
│   │   ├── routes/        # API Route Handlers
│   │   │   ├── auth.ts    # Authentication endpoints
│   │   │   ├── events.ts  # Event CRUD operations
│   │   │   ├── swaps.ts   # Swap logic and transactions
│   │   │   ├── profile.ts # User profile management
│   │   │   └── notifications.ts # Notification system
│   │   ├── middleware/    # Custom Middleware
│   │   │   └── auth.ts    # JWT verification
│   │   └── server.ts      # Express server configuration
│   ├── package.json
│   └── tsconfig.json
├── package.json
├── tailwind.config.js
├── .gitignore
└── README.md
```

## 🛠️ Installation & Setup

### **Prerequisites**
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** database (local or cloud)
- **Git** for version control

### **Quick Start**

1. **Clone Repository**
```bash
git clone <repository-url>
cd SlotSwapper
```

2. **Install Dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

3. **Environment Configuration**

Create `.env` in root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

Create `.env` in `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/slotswapper
JWT_SECRET=your-super-secret-jwt-key-here
PORT=3001
```

4. **Start Development Servers**

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

5. **Access Application**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🔌 API Documentation

### **Authentication Endpoints**
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Create user account | `{ name, email, password }` |
| POST | `/api/auth/login` | User authentication | `{ email, password }` |

### **Event Management**
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/events` | Get user's events | - |
| POST | `/api/events` | Create new event | `{ title, startTime, endTime }` |
| PATCH | `/api/events/:id/status` | Update event status | `{ status }` |
| DELETE | `/api/events/:id` | Delete event | - |

### **Swap Operations**
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/swaps/swappable-slots` | Browse available slots | - |
| POST | `/api/swaps/swap-request` | Create swap request | `{ mySlotId, theirSlotId }` |
| POST | `/api/swaps/swap-response/:id` | Accept/reject swap | `{ accept: boolean }` |
| GET | `/api/swaps/incoming` | Get incoming requests | - |
| GET | `/api/swaps/outgoing` | Get outgoing requests | - |

### **Profile Management**
| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/api/profile` | Get user profile | - |
| PUT | `/api/profile` | Update profile | `{ name?, email?, currentPassword?, newPassword? }` |

## 🎯 Core Swap Logic

The application implements sophisticated swap mechanics:

1. **Slot Discovery**: Users browse swappable slots from other users
2. **Request Creation**: Select personal swappable slot to offer in exchange
3. **Status Management**: Both slots marked as SWAP_PENDING during negotiation
4. **Atomic Transactions**: Database transactions ensure data consistency
5. **Ownership Transfer**: On acceptance, slot ownership exchanges between users
6. **Status Reset**: On rejection, slots revert to SWAPPABLE status

## 🧪 Testing Guide

### **User Flow Testing**
1. **Registration**: Create account with name, email, password
2. **Event Creation**: Add calendar events with title, start/end times
3. **Status Management**: Mark events as SWAPPABLE
4. **Marketplace**: Browse available slots from other users
5. **Swap Requests**: Select your slot to offer for another user's slot
6. **Request Management**: Accept/reject incoming swap requests
7. **Analytics**: View performance metrics and activity charts

### **Multi-User Testing**
Create multiple accounts to test complete swap functionality:

**User A**: Create events → Make swappable → Browse marketplace
**User B**: Create events → Make swappable → Request User A's slot
**User A**: Receive notification → Accept/reject request
**Result**: Successful slot ownership exchange

## 🚀 Deployment

### **Frontend (Vercel)**
1. Connect GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set environment variables:
   - `VITE_API_URL=https://your-backend-url.com/api`

### **Backend (Render)**
1. Create Web Service from GitHub
2. Configure settings:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
3. Set environment variables:
   - `MONGODB_URI=your-mongodb-connection-string`
   - `JWT_SECRET=your-production-jwt-secret`
   - `PORT=3001`

## 🎨 Design Features

### **Modern UI/UX**
- **Gradient Backgrounds**: Beautiful color transitions
- **Card-Based Design**: Clean, modern component layouts
- **Smooth Animations**: Hover effects and transitions
- **Emoji Integration**: Intuitive visual indicators
- **Responsive Design**: Mobile-first approach

### **Visual Feedback**
- **Status Indicators**: Color-coded event statuses
- **Loading States**: Animated spinners and skeletons
- **Success/Error Messages**: Clear user feedback
- **Progress Indicators**: Visual activity tracking

## 🏆 Unique Selling Points

### **1. Intelligence Layer**
- Real-time analytics dashboard
- Performance tracking and optimization tips
- Smart notification system

### **2. Enterprise-Grade Features**
- Database transactions for data integrity
- Comprehensive error handling
- Security best practices

### **3. User Experience Excellence**
- Intuitive interface design
- Real-time updates without page refresh
- Professional-grade animations and interactions

### **4. Scalable Architecture**
- TypeScript for maintainability
- Modular component structure
- RESTful API design

## 🐛 Troubleshooting

### **Common Issues**

**Authentication Problems**:
- Verify JWT_SECRET in backend environment
- Check token format in Authorization header
- Ensure token hasn't expired (7-day default)

**Database Connection**:
- Confirm MongoDB is running
- Validate connection string format
- Check network connectivity for cloud databases

**Port Conflicts**:
```bash
# Windows - Kill process on port
netstat -ano | findstr :3001
taskkill /PID <process-id> /F
```

**Build Errors**:
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript compilation: `npm run build`
- Verify environment variables are set

## 📈 Performance Features

- **Optimized Rendering**: React hooks for efficient updates
- **API Caching**: Intelligent data fetching strategies
- **Database Indexing**: Optimized queries for scalability
- **Lazy Loading**: Component-based code splitting

## 🔒 Security Measures

- **JWT Authentication**: Stateless, secure token system
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Controlled cross-origin access
- **SQL Injection Prevention**: Mongoose ODM protection

## 📝 License

This project is created for the ServiceHive Full Stack Intern technical challenge.

---

**Built with ❤️ for ServiceHive Technical Challenge**

*SlotSwapper - Where scheduling meets intelligence*