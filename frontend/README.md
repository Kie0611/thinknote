# NoteForge — AI-Powered Notes App

A modern, productivity-focused notes app with AI features. Built with React 18, React Router, Tailwind CSS, and DaisyUI.

## 🗂 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx      # Authenticated page wrapper
│   │   ├── Sidebar.jsx        # Navigation sidebar
│   │   └── Topbar.jsx         # Top navigation bar
│   ├── notes/
│   │   ├── NoteCard.jsx       # Note card (grid + compact)
│   │   ├── NotesList.jsx      # Sidebar note list panel
│   │   └── MarkdownEditor.jsx # Markdown editor with preview
│   ├── ai/
│   │   └── AIPanel.jsx        # AI assistant panel
│   └── ui/
│       ├── FolderModal.jsx    # Create/edit folder modal
│       ├── StatCard.jsx       # Dashboard stat card
│       └── TagChip.jsx        # Colored tag chip
├── context/
│   └── AppContext.jsx         # Global state (notes, folders, etc.)
├── data/
│   └── mockData.js            # Mock notes, folders, flashcards
├── pages/
│   ├── LoginPage.jsx          # Login with OAuth
│   ├── RegisterPage.jsx       # Register with password strength
│   ├── DashboardPage.jsx      # Overview + stats + quick actions
│   ├── NotesPage.jsx          # 3-panel note editor
│   ├── FlashcardsPage.jsx     # Flashcard viewer with SRS
│   └── AIChatPage.jsx         # Full AI chat interface
├── App.jsx                    # Routes
├── main.jsx                   # Entry point
└── index.css                  # Tailwind + custom styles
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#2563eb` (brand-600) |
| Accent  | `#7c3aed` (accent-600) |
| Font (display) | Instrument Serif |
| Font (body) | DM Sans |
| Font (code) | JetBrains Mono |
| Radius | `rounded-xl` (12px), `rounded-2xl` (16px) |

## 📦 Tech Stack

- **React 18** + **React Router v6**
- **Tailwind CSS v3** + **DaisyUI v4**
- **Lucide React** for icons
- Custom DaisyUI theme (`noteforge`)

## 🔌 Backend Integration (MERN)

Replace mock data in `src/data/mockData.js` with API calls.

Suggested endpoints:
```
GET    /api/notes           — list notes
POST   /api/notes           — create note
PUT    /api/notes/:id       — update note
DELETE /api/notes/:id       — delete note
GET    /api/folders         — list folders
POST   /api/folders         — create folder
POST   /api/ai/summarize    — generate summary
POST   /api/ai/flashcards   — generate flashcards
POST   /api/ai/chat         — AI chat message
POST   /api/auth/login      — login
POST   /api/auth/register   — register
```

## 🌐 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/login` | LoginPage | Email/password + OAuth |
| `/register` | RegisterPage | Registration + password strength |
| `/dashboard` | DashboardPage | Stats, recent notes, folders |
| `/notes` | NotesPage | 3-panel editor with AI |
| `/flashcards` | FlashcardsPage | SRS flashcard viewer |
| `/ai-chat` | AIChatPage | Full-page AI chat |
