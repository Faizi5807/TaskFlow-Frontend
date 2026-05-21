# TaskFlow ⚡
TaskFlow is a modern, high-performance, real-time-like Kanban and list-based agile project management task board (Jira Clone). It empowers teams to collaborate, delegate, track progress, and manage tasks efficiently.

Built using the latest web standards—React 19, TypeScript, React Router v7, and Vite—with advanced compilation optimizations (Babel React Compiler), TaskFlow delivers a smooth, fast user experience.
# 🚀 Key Features
📊 Visual Dashboard & Analytics: 
Real-time counters showing task distribution across project status categories: Total Tasks, To Do, In Progress, and Completed.

📋 Agile Task Board: 
Interactive task cards displaying status indicators (with pulsing animations for active progress), assigned user details, relative timestamps (e.g. "2h ago"), and fast state transition buttons.

🔄 Task Lifecycle Management: 
  Smooth task flow transitions:
To Do ➔ In Progress (one-click Start action) ➔ Completed (one-click Complete action).

🔍 Advanced Search & Filtering: 
Instantly filter tasks by category tabs or run real-time search queries matching headings or description texts.

🔐 Role-Based Access Control (RBAC): 
  Integrated roles dictating dashboard operations:
    Administrator:
Complete privileges including user registration, member allocation, task deletion, and full task updating.

Moderator & Standard User: 
Restricted roles matching custom task workflows (e.g., standard users can view, start, and complete tasks, but cannot delete tasks or register new users).

🔑 Secure Custom Authentication:
JWT client-side token decoding without continuous server hits.

GuestRoute and ProtectedRoute route guards.
Auto-invalidation of sessions and redirect-to-login on expiration (401 triggers).
✉️ Contextual Toast Notifications: Rich animations for success, warning, error, and info toasts.
🎨 Sleek, Responsive Styling: Vanilla CSS Modules implementation optimized for both mobile and desktop viewports, with support for transitions, states, and loaders.
The .NET Web Api application has been hosted on Render and Can be accessed through frontend.
# Application Url
https://task-flow-blue-mu.vercel.app/
# Credentials
The Application restricts to only administrators adding new users. These are a already created Standard User Credentials
email: mesimom@gmail.com
password:123456
