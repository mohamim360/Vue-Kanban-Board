# Vue Kanban Board with Authentication & Project Management

A modern, responsive Kanban board application built with Vue 3, featuring user authentication via Clerk and multi-project support.

## Features

### 🔐 Authentication

- **Clerk Integration**: Secure user authentication with sign-in/sign-out
- **User Profile**: Display user information and profile management
- **Protected Routes**: All functionality requires authentication

### 📁 Project Management

- **Multiple Projects**: Create, switch between, and manage multiple projects
- **Project Dropdown**: Easy project selection in the sidebar
- **Project Creation**: Create new projects with custom names and descriptions
- **Project Deletion**: Remove projects with confirmation

### 🎨 Modern UI/UX

- **Responsive Sidebar**: Collapsible sidebar with project management
- **Professional Navbar**: User profile dropdown with settings and sign-out
- **Dark Mode**: Toggle between light and dark themes
- **Modern Design**: Clean, professional interface with smooth animations

### 📋 Kanban Board Features

- **Drag & Drop**: Move tasks between columns seamlessly
- **Task Management**: Add, edit, clone, and delete tasks
- **Priority Levels**: High, Medium, Low priority with visual indicators
- **Due Dates**: Set and track task deadlines
- **User Assignment**: Assign tasks to team members
- **Tags**: Organize tasks with custom tags
- **Search & Filter**: Find tasks quickly with advanced filtering

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory:

   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Setup

The application uses Clerk for authentication. You'll need to:

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Copy your publishable key to the `.env` file
4. Configure your Clerk application settings

## Project Structure

```
src/
├── components/
│   ├── Layout.vue          # Main layout wrapper
│   ├── Sidebar.vue         # Project management sidebar
│   ├── Navbar.vue          # User profile navbar
│   ├── AuthWrapper.vue    # Authentication wrapper
│   ├── AddTaskModal.vue   # Task creation modal
│   ├── EditTaskModal.vue  # Task editing modal
│   └── ToastNotification.vue # Success/error notifications
├── composables/
│   └── useProjects.js     # Project management logic
├── utilits/
│   ├── storage.js         # Local storage utilities
│   ├── helpers.js         # Helper functions
│   └── dateFormatter.js   # Date formatting utilities
└── App.vue               # Main application component
```

## Usage

### Creating Projects

1. Click the "+" button in the sidebar
2. Enter project name and description
3. Click "Create Project"

### Managing Tasks

1. Select a project from the sidebar dropdown
2. Click "Add Task" to create new tasks
3. Drag tasks between columns to update status
4. Click the "⋮" menu on tasks for more options

### User Management

1. Click your profile in the navbar
2. Access profile settings and preferences
3. Sign out when finished

## Technologies Used

- **Vue 3** - Progressive JavaScript framework
- **Clerk** - Authentication and user management
- **Tailwind CSS** - Utility-first CSS framework
- **VueUse** - Vue composition utilities
- **Heroicons** - Beautiful SVG icons
- **TipTap** - Rich text editor

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
