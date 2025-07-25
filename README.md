# 💰 Expensify - Advanced Expense Tracker

A comprehensive, modern expense tracking application built with React, TypeScript, and Firebase. Track your expenses, set budgets, manage recurring payments, split bills with friends, and achieve your financial goals with powerful analytics and insights. Features advanced usability enhancements including real-time form validation, accessibility support, and intuitive user guidance.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-10.8.1-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Material-UI](https://img.shields.io/badge/Material--UI-5.15.13-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_2.1-green?style=for-the-badge&logo=accessibility)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge&logo=pwa)

## ✨ Features

### 🔐 Authentication
- **Google Sign-In**: Secure authentication using Firebase Auth
- **Protected Routes**: Automatic redirection for unauthenticated users
- **User Context**: Global user state management

### 💳 Expense Management
- **Add Expenses**: Quick and detailed expense entry forms
- **Edit & Delete**: Full CRUD operations for expense records
- **Categories**: Predefined categories with smart suggestions
- **Multi-Currency**: Support for multiple currencies
- **Date Tracking**: Automatic date stamps and custom date selection

### 📊 Analytics Dashboard
- **Visual Charts**: Interactive bar charts and doughnut charts using Chart.js
- **Monthly Breakdown**: Category-wise spending analysis
- **Year-over-Year**: Historical spending patterns
- **Real-time Data**: Live updates from Firebase
- **Responsive Design**: Works on all device sizes

### 💰 Budget Management
- **Category Budgets**: Set spending limits by category
- **Progress Tracking**: Visual progress bars with color coding
- **Period-based**: Monthly and yearly budget cycles
- **Overspending Alerts**: Visual indicators for budget limits

### 🔄 Recurring Expenses
- **Automated Tracking**: Manage subscription and recurring payments
- **Frequency Options**: Daily, weekly, monthly, yearly
- **Due Date Tracking**: Never miss a payment
- **Active/Inactive Toggle**: Pause recurring expenses when needed

### 🎯 Financial Goals
- **Goal Types**: Savings, debt reduction, spending limits
- **Progress Tracking**: Visual progress indicators
- **Target Dates**: Set deadlines for your financial goals
- **Currency Support**: Multi-currency goal tracking

### ⚡ Quick Entry
- **Speed Dial**: Floating action button for quick expense entry
- **Smart Suggestions**: AI-powered category suggestions based on expense names
- **Recent Expenses**: Auto-complete from previous entries
- **One-tap Actions**: Quick access to common expense categories

### 🎨 User Experience
- **Dark/Light Theme**: Toggle between themes with Material-UI
- **Responsive Design**: Mobile-first approach
- **Toast Notifications**: User feedback with notistack
- **Loading States**: Smooth loading animations
- **Error Handling**: Graceful error management

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Google Sign-in)
   - Create a Firestore database
   - Get your Firebase configuration

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/
│   ├── add-expense-form/     # Expense entry forms
│   ├── analytics/           # Analytics dashboard
│   ├── auth/               # Authentication components
│   ├── budget/             # Budget management
│   ├── context/            # React context providers
│   ├── delete-expense/     # Expense deletion
│   ├── edit-expense/       # Expense editing
│   ├── expense-card/       # Expense display cards
│   ├── expense-options/    # Expense action options
│   ├── goals/              # Financial goals
│   ├── header/             # Navigation header
│   ├── loader/             # Loading components
│   ├── my-expense/         # Expense listing
│   ├── quick-entry/        # Quick expense entry
│   └── recurring/          # Recurring expenses
├── services/
│   └── expense.service.ts  # Firebase service layer
├── firebase.ts             # Firebase configuration
└── App.tsx                 # Main application component
```

## 🛠️ Technologies Used

### Frontend
- **React 18.2.0**: Modern React with hooks
- **TypeScript 4.9.5**: Type-safe JavaScript
- **Material-UI 5.15.13**: Beautiful UI components
- **React Router 6.22.3**: Client-side routing
- **Chart.js 4.5.0**: Data visualization
- **Day.js 1.11.10**: Date manipulation

### Backend & Services
- **Firebase 10.8.1**: Backend-as-a-Service
- **Firestore**: NoSQL database
- **Firebase Auth**: Authentication service

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **TypeScript ESLint**: TypeScript-specific linting rules

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

## 🎯 Key Features Explained

### Smart Category Suggestions
The app uses AI-powered suggestions to automatically categorize expenses based on their names:
- "Uber ride" → Transportation
- "Netflix subscription" → Entertainment
- "Grocery shopping" → Groceries
- "Restaurant dinner" → Food

### Real-time Analytics
- Live data updates from Firebase
- Interactive charts with hover effects
- Responsive design for all screen sizes
- Theme-aware chart colors

### Budget Tracking
- Visual progress bars with color coding
- Overspending alerts
- Category-wise budget management
- Historical spending analysis

## 🔒 Security Features

- **Firebase Security Rules**: Database access control
- **Protected Routes**: Authentication-based routing
- **Input Validation**: Client and server-side validation
- **Secure Authentication**: Google OAuth integration

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🎨 Theme Support

- **Light Theme**: Clean, professional appearance
- **Dark Theme**: Easy on the eyes for low-light environments
- **Automatic Switching**: Follows system preferences
- **Consistent Styling**: Material-UI design system

## 🚀 Deployment

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Other Platforms
The app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI**: For the beautiful component library
- **Firebase**: For the robust backend services
- **Chart.js**: For the excellent charting capabilities
- **React Community**: For the amazing ecosystem

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information

---

**Happy Expense Tracking! 💰✨**
