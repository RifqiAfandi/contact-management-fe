# Contact Management System - Frontend

A modern, responsive React frontend application for contact and inventory management system with role-based dashboards, real-time data visualization, and intuitive point-of-sale interface.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [User Roles & Features](#user-roles--features)
- [Components Overview](#components-overview)
- [Styling & Design](#styling--design)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [AI Development Assistance](#ai-development-assistance)
- [Contributing](#contributing)

## ✨ Features

### Core Modules

- **Authentication System** - Secure login with role-based access control
- **Admin Dashboard** - Comprehensive management interface with analytics
- **Cashier Point of Sale** - Intuitive transaction processing system
- **Warehouse Management** - Inventory tracking with expiration monitoring
- **Real-time Analytics** - Live data visualization and reporting
- **Responsive Design** - Mobile-first approach with cross-device compatibility

### Key Capabilities

- 🎯 **Role-Based Access Control** - Admin, Cashier, and Warehouse user types
- 📊 **Interactive Dashboards** - Real-time charts and statistical data
- 🛒 **Advanced POS System** - Cart management, payment processing, receipt generation
- 📦 **Inventory Management** - Stock tracking, expiration alerts, monthly filtering
- 📱 **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX** - Clean design with smooth animations and transitions
- 📈 **Data Visualization** - Charts, graphs, and statistical representations
- 🔍 **Advanced Search & Filtering** - Smart search with multiple filter options
- 📄 **Receipt System** - Digital receipt generation and printing capabilities
- 🌙 **Professional Theming** - Consistent design system across all modules

## 🛠️ Tech Stack

- **Frontend Framework:** React 19.1.0
- **Build Tool:** Vite 6.3.5
- **Routing:** React Router DOM 7.6.0
- **UI Components:** Ant Design 5.25.4, Material-UI 7.1.0
- **Styling:** Tailwind CSS 4.1.7, CSS Modules, Emotion
- **Icons:** Lucide React, React Icons, Material-UI Icons
- **HTTP Client:** Axios 1.9.0
- **Date Management:** Day.js 1.11.13
- **Animations:** Framer Motion 12.12.2
- **Utilities:** Lodash Debounce 4.0.8
- **Development:** ESLint, PostCSS, Autoprefixer

## 📁 Project Structure

```
contact-management-fe/
├── public/
│   ├── vite.svg                    # Vite logo
│   └── index.html                  # Main HTML template
├── src/
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # Application entry point
│   ├── index.css                   # Global styles
│   ├── theme.css                   # Design system variables
│   ├── assets/                     # Static assets
│   │   └── react.svg
│   ├── components/                 # Shared components
│   │   ├── AuthRedirect.jsx        # Authentication redirection
│   │   └── ProtectedRoute.jsx      # Route protection
│   ├── features/                   # Feature-based modules
│   │   ├── adminDashboard/         # Admin management interface
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminDashboard.css
│   │   │   ├── components/         # Dashboard components
│   │   │   ├── constants/          # Dashboard constants
│   │   │   └── utils/              # Dashboard utilities
│   │   ├── cashierPage/            # Point of Sale system
│   │   │   ├── CashierPage.jsx
│   │   │   ├── CashierPage.css
│   │   │   ├── components/         # POS components
│   │   │   ├── constants/          # POS configuration
│   │   │   ├── hooks/              # POS custom hooks
│   │   │   └── utils/              # POS utilities
│   │   ├── loginPage/              # Authentication module
│   │   │   ├── LoginPage.jsx
│   │   │   ├── components/
│   │   │   ├── constants/
│   │   │   └── utils/
│   │   └── warehousePage/          # Inventory management
│   │       ├── WarehousePage.jsx
│   │       ├── WarehousePage.css
│   │       ├── components/         # Warehouse components
│   │       ├── constants/          # Warehouse configuration
│   │       ├── hooks/              # Warehouse custom hooks
│   │       └── utils/              # Warehouse utilities
│   ├── styles/
│   │   └── theme.js                # Theme configuration
│   └── utils/
│       └── authUtils.js            # Authentication utilities
├── eslint.config.js                # ESLint configuration
├── vite.config.js                  # Vite configuration
└── package.json                    # Dependencies and scripts
```

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/RifqiAfandi/contact-management.git
   cd contact-management-fe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Backend API Configuration
VITE_API_BASE_URL=http://localhost:5000

# Application Configuration
VITE_APP_TITLE=Contact Management System
VITE_APP_VERSION=1.0.0

# ImageKit Configuration (if using image uploads)
VITE_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
```

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

The application will start on `http://localhost:5173`

## 👥 User Roles & Features

### 🔑 Admin Dashboard

- **User Management** - Create, update, delete user accounts
- **Product Management** - Complete CRUD operations for products
- **Inventory Overview** - Stock monitoring and management
- **Financial Reports** - Monthly revenue and expense analytics
- **Low Stock Alerts** - Automatic notifications for items running low
- **System Statistics** - Comprehensive dashboard with key metrics

### 🛒 Cashier Point of Sale

- **Product Catalog** - Browse and search product inventory
- **Shopping Cart** - Add, remove, and modify item quantities
- **Payment Processing** - Support for Cash, Card, and QRIS payments
- **Receipt Generation** - Digital receipt with print capabilities
- **Transaction History** - View and track sales transactions
- **Real-time Inventory** - Live stock updates during sales

### 📦 Warehouse Management

- **Inventory Tracking** - Monitor stock levels and expiration dates
- **Monthly Filtering** - View inventory by specific months
- **Status Monitoring** - Track items by status (Good, Expiring, Expired, Used)
- **Stock Analytics** - Statistical overview of inventory health
- **Item Management** - Add, edit, and delete inventory items
- **Smart Notifications** - Alerts for expiring or expired items

## 🧩 Components Overview

### Shared Components

- **AuthRedirect** - Handles authentication-based redirects
- **ProtectedRoute** - Route protection based on user roles
- **Header Components** - Consistent navigation across modules
- **Loading States** - Professional loading indicators
- **Error Boundaries** - Graceful error handling

### Admin Dashboard Components

- **StatsGrid** - Statistical data visualization
- **UserTable** - User management interface
- **ProductTable** - Product management with CRUD operations
- **StockTable** - Inventory overview with filtering
- **FinancialReport** - Revenue and expense analytics
- **LowStockNotification** - Automated alert system

### Cashier Components

- **ProductGrid** - Product display with categories
- **CartManagement** - Shopping cart functionality
- **PaymentMethods** - Payment option selection
- **ReceiptModal** - Digital receipt generation
- **SearchBox** - Product search functionality
- **CategoryFilter** - Product filtering by category

### Warehouse Components

- **InventoryList** - Dynamic inventory display
- **StatsGrid** - Inventory statistics overview
- **MonthFilter** - Monthly data filtering
- **StatusFilter** - Filter by item status
- **ItemModal** - Add/edit inventory items
- **SortControls** - Data sorting options

## 🎨 Styling & Design

### Design System

- **CSS Variables** - Consistent theming across components
- **Modular CSS** - Component-specific styling
- **Responsive Design** - Mobile-first approach
- **Color Palette** - Professional business color scheme
- **Typography** - Clean, readable font hierarchy

### Key Features

- **Smooth Animations** - Framer Motion powered transitions
- **Hover Effects** - Interactive feedback for better UX
- **Loading States** - Skeleton screens and spinners
- **Error States** - User-friendly error messages
- **Empty States** - Helpful guidance when no data exists

## 🔌 API Integration

### HTTP Client Configuration

- **Axios Setup** - Centralized API configuration
- **Request Interceptors** - Automatic token attachment
- **Response Handling** - Standardized error processing
- **Authentication Flow** - Token-based authentication

### API Endpoints

- **Authentication** - Login, logout, user management
- **Products** - CRUD operations for product catalog
- **Inventory** - Stock management and tracking
- **Transactions** - Sales processing and history
- **Reports** - Financial and inventory analytics

## 🔐 Authentication

### Security Features

- **JWT Tokens** - Secure authentication tokens
- **Role-Based Access** - Route protection by user role
- **Session Management** - Automatic token refresh and logout
- **Secure Storage** - Safe token storage in localStorage

### User Flow

1. **Login** - Username/password authentication
2. **Role Detection** - Automatic role-based redirection
3. **Protected Routes** - Access control based on permissions
4. **Session Expiry** - Automatic logout on token expiration

## 🤖 AI Development Assistance

This project was developed with significant assistance from **GitHub Copilot**, Microsoft's AI-powered coding assistant. The AI collaboration enhanced development efficiency and code quality throughout the entire project lifecycle.

### 🚀 How GitHub Copilot Helped

**Code Generation & Acceleration**

- Intelligent code completion and suggestions for React components
- Rapid scaffolding of dashboard layouts and UI components
- Automated generation of common patterns like forms, tables, and modals
- Smart CSS and styling suggestions for responsive design

**Architecture & Best Practices**

- Modern React patterns including hooks and functional components
- Efficient state management implementations
- Clean component structure and organization
- Professional error handling and loading states

**Feature Development**

- Authentication system with role-based access control
- Complex dashboard components with data visualization
- Point-of-sale system with cart management and payment processing
- Inventory management with filtering and search capabilities
- Responsive design patterns for mobile and desktop compatibility

**Code Quality & Optimization**

- Performance optimization techniques and React best practices
- Consistent code formatting and naming conventions
- Comprehensive error handling and validation patterns
- Accessibility improvements and semantic HTML structure

### 💡 AI-Enhanced Development Process

- **Rapid Prototyping** - Quick iteration on UI/UX concepts and layouts
- **Problem Solving** - Efficient debugging and issue resolution
- **Documentation** - Auto-generated code comments and function descriptions
- **Testing Patterns** - Implementation of robust testing strategies
- **API Integration** - Streamlined backend communication and data handling

> **Note**: While GitHub Copilot provided extensive assistance in code generation and problem-solving, all implementations were carefully reviewed, tested, and customized to meet specific project requirements and business logic.

## 📱 Responsive Breakpoints

```css
/* Mobile First Design */
@media (max-width: 480px) {
  /* Mobile phones */
}
@media (max-width: 768px) {
  /* Tablets */
}
@media (max-width: 1024px) {
  /* Small laptops */
}
@media (max-width: 1440px) {
  /* Desktop */
}
@media (min-width: 1441px) {
  /* Large screens */
}
```

## 🚀 Performance Optimizations

- **Code Splitting** - Lazy loading for better performance
- **Image Optimization** - Efficient image loading and caching
- **Bundle Optimization** - Tree shaking and minification
- **Debounced Search** - Optimized search functionality
- **Memoization** - React optimization techniques

## 🔧 Development Tools

- **Vite** - Fast build tool with HMR
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **Hot Reload** - Instant feedback during development

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

This project was developed with the invaluable assistance of **GitHub Copilot**, Microsoft's AI-powered development assistant. The AI collaboration significantly accelerated development time, improved code quality, and enabled the implementation of modern best practices throughout the application.

**Special Thanks:**

- **GitHub Copilot** for intelligent code suggestions, rapid development assistance, and problem-solving support
- **Microsoft** for providing cutting-edge AI development tools that enhance developer productivity
- **React Community** for excellent documentation, ecosystem, and open-source contributions
- **Open Source Contributors** for the amazing libraries and frameworks that power this application

---

**Contact Management System Frontend** - Built with ❤️ using React, modern web technologies, and AI-assisted development.

_Developed with GitHub Copilot - Empowering developers through AI collaboration_
