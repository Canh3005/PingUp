# PingUp Project Rules

> **Note**: These rules are based on actual patterns found in the PingUp codebase. Follow these conventions to maintain consistency.

---

## 🎯 General Principles
- Write clean, readable, and maintainable code
- Follow DRY (Don't Repeat Yourself) principle
- Use meaningful variable and function names
- Comment complex logic, especially business logic

---

## ⚛️ React Frontend Rules

### Tech Stack
- **React**: 19.1.1 (latest)
- **Build Tool**: Vite 7.x (using rolldown-vite)
- **Styling**: TailwindCSS 4.1.16
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios 1.13.1
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Component Structure
```jsx
// ✅ CORRECT: Functional component with hooks
import React, { useState } from 'react';

const ComponentName = () => {
  const [state, setState] = useState(null);
  
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

**Rules:**
- Use **functional components** with hooks (no class components)
- One component per file
- Component files use **PascalCase** with `.jsx` extension
- Export component as **default export**
- Keep components focused on single responsibility

### File Organization
```
client/src/
├── api/              # API service files (authApi.js, projectApi.js, etc.)
├── assets/           # Images, icons, static files
├── components/       # Reusable components
├── context/          # React Context providers (authContext.jsx)
├── pages/            # Page components (Home.jsx, Feed.jsx, etc.)
├── services/         # Utility services (httpClient.js)
├── utils/            # Helper functions
└── constants/        # Constants and config
```

### State Management
- Use **React hooks**: `useState`, `useEffect`, `useContext`, `useRef`
- For global state, use **Context API** (see `authContext.jsx`)
- Avoid prop drilling - use context for deeply nested props
- Custom hooks should start with `use` prefix

**Example from codebase:**
```jsx
// authContext.jsx pattern
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = (userData) => setUser(userData);
  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Styling with TailwindCSS
- Use **TailwindCSS 4** utility classes
- Default font: **Outfit** (imported from Google Fonts)
- Use semantic class names for custom CSS
- Follow mobile-first responsive design

**Example:**
```jsx
<div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
</div>
```

### API Calls Pattern
**All API calls MUST be in separate service files in `src/api/`**

```javascript
// ✅ CORRECT: authApi.js
import httpClient from "../services/httpClient";

const authApi = {
  login: async ({ email, password }) => {
    const res = await httpClient.post("/auth/login", { email, password });
    return res.data;
  },
  register: async ({ email, password, userName }) => {
    const res = await httpClient.post("/auth/register", { email, password, userName });
    return res.data;
  },
};

export default authApi;
```

**Rules:**
- Use `httpClient` from `services/httpClient.js` (configured axios instance)
- Use async/await syntax
- Return `res.data` from API functions
- Group related APIs in one file (e.g., `authApi.js`, `projectApi.js`)
- Handle errors in components using try/catch

### HTTP Client Configuration
- Base URL: `VITE_API_BASE_URL` or `http://localhost:3000/api`
- Automatic token attachment via interceptors
- Automatic token refresh on 401 errors
- Uses `auth_token` and `refresh_token` from localStorage

### Routing Pattern
```jsx
// App.jsx pattern
import { Routes, Route } from "react-router-dom";

const App = () => {
  const { user } = useAuth();
  
  return (
    <Routes>
      <Route path="/" element={!user ? <Home /> : <Layout />}>
        <Route index element={<Feed />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:profileId" element={<Profile />} />
      </Route>
    </Routes>
  );
};
```

### ESLint Rules
- Follow ESLint config in `eslint.config.js`
- Unused vars pattern: `^[A-Z_]` (uppercase/underscore prefixed vars ignored)
- Use React Hooks rules (recommended-latest)
- Use React Refresh for Vite

---

## 🚀 Backend Rules

### Tech Stack
- **Runtime**: Node.js with ES Modules (`"type": "module"`)
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose 8.19.2
- **Authentication**: JWT (jsonwebtoken 9.0.3) + bcrypt 6.0.0
- **Real-time**: Socket.io 4.8.1 with Redis adapter
- **Validation**: Zod 4.2.1
- **File Upload**: Multer 2.0.2 + Cloudinary
- **Security**: Helmet 8.1.0, CORS
- **Logging**: Morgan
- **Dev**: Nodemon 3.1.10

### Project Structure
```
server/
├── chat/             # Chat-related modules
├── configs/          # Configuration files (db.js, env.js, redis.js)
├── controllers/      # Request handlers
├── loaders/          # App initialization (expressLoader, socketLoader)
├── middlewares/      # Auth, error handling, etc.
├── models/           # Mongoose schemas
├── routes/           # Route definitions
├── services/         # Business logic
├── utils/            # Helper functions
└── server.js         # Entry point (calls bootstrap)
```

### Application Bootstrap Pattern
**Use loader pattern for initialization:**

```javascript
// server.js
import { bootstrap } from "./loaders/index.js";
bootstrap();

// loaders/index.js
export async function bootstrap() {
  await connectDB();
  const app = createExpressApp();
  
  // Optional Redis adapter for Socket.io
  let redisAdapterFactory = null;
  if (env.enableRedisAdapter) {
    const clients = await createRedisClients();
    if (clients) {
      const { createAdapter } = await import("@socket.io/redis-adapter");
      const { pubClient, subClient } = clients;
      redisAdapterFactory = () => createAdapter(pubClient, subClient);
    }
  }
  
  const { server } = await createSocketServer(app, { redisAdapterFactory });
  
  server.listen(env.port, () => {
    console.log(`[server] listening on :${env.port}`);
  });
}
```

### API Structure (Routes/Controllers/Services)
**Follow 3-layer architecture:**

1. **Routes** - Define endpoints and attach controllers
2. **Controllers** - Handle requests/responses
3. **Services** - Business logic and database operations

**Example:**

```javascript
// routes/authRoutes.js
import express from "express";
import authController from "../controllers/authController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", auth, authController.getProfile);

export default router;

// controllers/authController.js
import authService from "../services/authService.js";

const login = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(req.body);
    res.status(200).json({ message: "Login successful", accessToken, refreshToken, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default { login, register, getProfile };

// services/authService.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");
  
  const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  
  return { accessToken, refreshToken, user };
};

export default { login, register };
```

### API Endpoint Conventions
- **Base path**: `/api`
- **RESTful naming**: Use plural nouns (`/users`, `/projects`, `/comments`)
- **Nested resources**: `/projects/:projectId/comments`

**Current endpoints:**
```
/api/auth/*              # Authentication
/api/profile/*           # User profiles
/api/upload/*            # File uploads
/api/projects/*          # Projects
/api/comments/*          # Comments
/api/project-hubs/*      # Project hubs
/api/milestones/*        # Milestones
/api/users/*             # User operations (follow)
/api/chat/*              # Chat
/api/conversations/*     # Conversations
/api/messages/*          # Messages
```

### Mongoose Models Pattern
```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    followers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // ✅ ALWAYS include timestamps
  }
);

// Add indexes for performance
userSchema.index({ email: 1 });

// Add virtuals for computed properties
userSchema.virtual('followersCount').get(function() {
  return this.followers.length;
});

// Add instance methods
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
```

**Rules:**
- Always use `timestamps: true` for createdAt/updatedAt
- Use camelCase for field names
- Use enums for restricted values
- Add indexes for frequently queried fields
- Use virtuals for computed properties
- Use instance methods for model-specific logic
- Use refs for relationships

### Authentication Pattern
**JWT with refresh tokens:**

```javascript
// Generate tokens
const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
  expiresIn: "1h",
});
const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
  expiresIn: "7d"
});

// Verify token in middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token, authorization denied' 
      });
    }

    const decoded = authService.verifyToken(token);
    const user = await User.findById(decoded.userId).select('-password');
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid'
    });
  }
};
```

**Rules:**
- Access token: 1 hour expiry
- Refresh token: 7 days expiry
- Store tokens in localStorage (client-side)
- Attach user to `req.user` in middleware
- Always exclude password from user object (`select('-password')`)

### Error Handling Pattern
```javascript
// Controller pattern
const someController = async (req, res) => {
  try {
    const result = await someService.doSomething(req.body);
    res.status(200).json({ message: "Success", data: result });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
```

**Response format:**
```javascript
// Success
{ message: "Success message", data: {...}, user: {...} }

// Error
{ error: "Error message", success: false }
```

### Environment Variables
- Use `dotenv` for configuration
- Access via `process.env.VARIABLE_NAME`
- Never commit `.env` files
- Required vars: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `MONGODB_URI`, `PORT`

### Utilities
- Use **lodash** for utility functions (already imported in some files)
- Example: `_.toString()` for safe string conversion

---

## 🔒 Security Rules

### Authentication
- Hash passwords with **bcrypt** (10 rounds)
- Use JWT for stateless authentication
- Implement token refresh mechanism
- Validate tokens in middleware

### Input Validation
- Use **Zod** for schema validation
- Validate all user inputs
- Sanitize data before database operations
- Use Mongoose validators in schemas

### API Security
- Use **Helmet** for security headers
- Configure **CORS** properly
- Rate limit sensitive endpoints
- Never expose sensitive data in responses

---

## 📝 Code Style

### JavaScript/ES6+
- Use **ES Modules** (`import/export`)
- Use `const` by default, `let` when reassignment needed
- Never use `var`
- Use arrow functions for callbacks
- Use template literals for strings
- Use destructuring when appropriate
- Use async/await instead of promises chains

### Naming Conventions
- **Variables/Functions**: camelCase (`getUserProfile`, `isActive`)
- **Components**: PascalCase (`UserProfile`, `Navbar`)
- **Constants**: UPPER_SNAKE_CASE (`JWT_SECRET`, `API_BASE_URL`)
- **Files**: Match component/module name
  - Components: `UserProfile.jsx`
  - Services: `authService.js`
  - Routes: `authRoutes.js`

### Comments
```javascript
// ✅ GOOD: Explain WHY, not WHAT
// Prevent infinite loop by marking request as retried
originalRequest._retry = true;

// ❌ BAD: Obvious comment
// Set user to null
setUser(null);
```

### ESLint Suppressions
- Use `// eslint-disable-next-line no-undef` for process.env
- Use `/* eslint-disable react-refresh/only-export-components */` when needed

---

## 🧪 Testing
- Write tests for critical business logic
- Test authentication flows
- Test API endpoints
- Test error scenarios
- Use descriptive test names

---

## 📦 Dependencies Management
- Use `npm` for package management
- Keep dependencies up to date
- Use exact versions for critical packages
- Document why specific versions are used (e.g., rolldown-vite override)

---

## 🚀 Development Workflow

### Scripts
```bash
# Client
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run lint     # Run ESLint

# Server
npm run dev      # Start with nodemon
```

### Git Commits
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

---

## 🎨 UI/UX Guidelines
- Use **Lucide React** for icons
- Use **React Hot Toast** for notifications
- Follow consistent spacing and layout
- Ensure responsive design
- Maintain accessibility standards

---

## 📚 Additional Notes
- Socket.io can use Redis adapter for scalability
- Cloudinary integration for file uploads
- Morgan for HTTP request logging
- Separate chat module in server
- Support for project hubs and milestones
