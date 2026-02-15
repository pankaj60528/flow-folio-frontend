# TaskFlow - Task Management Board

A modern task management application with drag-and-drop functionality, built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Static Authentication**: Login with hardcoded credentials
- **Task Board**: Three columns (Todo, Doing, Done) with drag-and-drop
- **Task Management**: Create, edit, delete tasks with full CRUD operations
- **Advanced Features**: 
  - Search by title
  - Filter by priority
  - Sort by due date
  - Activity log tracking
  - Data persistence with localStorage
- **Modern UI**: Dark theme with neon grid effects and orange task cards

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 with TypeScript 5.8.3
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS 3.4.17 with shadcn/ui components
- **State Management**: React Query + Context API
- **Drag & Drop**: @hello-pangea/dnd
- **Form Handling**: React Hook Form with Zod validation
- **Testing**: Vitest with React Testing Library
- **Icons**: Lucide React

## 📋 Requirements Fulfillment

✅ **Static Login Flow**
- Hardcoded credentials: `intern@demo.com` / `intern123`
- Proper error messages and validation
- 'Remember me' functionality
- Protected routes and logout

✅ **Task Board Features**
- Fixed columns: Todo, Doing, Done
- Task fields: Title, Description, Priority, Due Date, Tags, CreatedAt
- Full CRUD operations
- Drag-and-drop across columns
- Search, filter, and sort functionality

✅ **Persistence & Reliability**
- localStorage persistence across refresh
- Safe handling of empty/corrupted storage
- Reset board option with confirmation

✅ **Activity Log**
- Tracks: Task created, edited, moved, deleted
- Displays latest actions with timestamps

✅ **Engineering Quality**
- Clean component architecture
- Form validation
- Comprehensive test coverage (5+ tests)
- Professional project structure

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/pankaj60528/flow-folio-frontend.git
cd flow-folio-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:8080`

### Login Credentials
- **Email**: `intern@demo.com`
- **Password**: `intern123`

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Tests cover:
- localStorage handling
- Login validation
- Task sorting logic
- Data persistence
- Error handling

## 📦 Build & Deploy

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

### Deployment Options

#### Vercel (Recommended)
1. Push to GitHub
2. Connect your repository to Vercel
3. Automatic deployment on every push

#### Netlify
1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings

#### Other Platforms
Any static hosting platform works (GitHub Pages, Surge, etc.)

## 🔧 Configuration

### Environment Variables
No environment variables required - everything runs client-side.

### localStorage Keys
- `taskboard_state`: Main application state
- `auth_state`: Authentication state

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── BoardColumn.tsx # Column component
│   ├── TaskCard.tsx    # Task card component
│   └── TaskDialog.tsx  # Task creation/edit dialog
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication logic
├── hooks/              # Custom hooks
│   └── useBoard.ts     # Board state management
├── pages/              # Page components
│   ├── Board.tsx       # Main task board
│   ├── Login.tsx       # Login page
│   └── NotFound.tsx    # 404 page
├── types/              # TypeScript types
│   └── task.ts         # Task-related types
└── test/               # Test files
    ├── board.test.ts   # Board logic tests
    └── example.test.ts # Example tests
```

## 🎨 Design Features

- **Dark Theme**: Modern dark interface with purple accents
- **Neon Grid Background**: Animated grid pattern for visual appeal
- **Orange Task Cards**: Vibrant orange gradient cards with red accents
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Smooth Animations**: Hover effects, transitions, and micro-interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Open a Pull Request

## 📄 License

This project is for educational purposes as part of a frontend internship assignment.

## 🌐 Live Demo

[https://userfrontend-omega.vercel.app/]

---

**Built by pankaj ruwali for Frontend Internship Assignment**
