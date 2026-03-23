export const mockFolders = [
  { id: 1, name: 'School', emoji: '📚', count: 12, color: 'blue' },
  { id: 2, name: 'Work', emoji: '💼', count: 8, color: 'violet' },
  { id: 3, name: 'Projects', emoji: '🚀', count: 5, color: 'emerald' },
  { id: 4, name: 'Research', emoji: '🔬', count: 3, color: 'amber' },
]

export const mockTags = [
  { id: 1, name: 'biology', color: 'blue' },
  { id: 2, name: 'exam', color: 'emerald' },
  { id: 3, name: 'meeting', color: 'pink' },
  { id: 4, name: 'important', color: 'violet' },
  { id: 5, name: 'research', color: 'amber' },
  { id: 6, name: 'cs', color: 'cyan' },
]

export const tagColorMap = {
  blue:    { bg: 'bg-blue-100',   text: 'text-blue-700' },
  emerald: { bg: 'bg-emerald-100',text: 'text-emerald-700' },
  pink:    { bg: 'bg-pink-100',   text: 'text-pink-700' },
  violet:  { bg: 'bg-violet-100', text: 'text-violet-700' },
  amber:   { bg: 'bg-amber-100',  text: 'text-amber-700' },
  cyan:    { bg: 'bg-cyan-100',   text: 'text-cyan-700' },
}

export const mockNotes = [
  {
    id: 1,
    title: 'Photosynthesis Notes',
    emoji: '🌱',
    folder: 1,
    tags: ['biology', 'exam'],
    tagColors: ['blue', 'emerald'],
    preview: 'Photosynthesis is the process plants use to convert light energy into chemical energy...',
    content: `# Photosynthesis

Photosynthesis is the process plants use to convert **light energy** into **chemical energy** that can be stored and later released to fuel the plant's activities.

## Core Requirements
- Sunlight (photons)
- Water (H₂O) — absorbed through roots
- Carbon dioxide (CO₂) — taken in through stomata

## The Equation
\`6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\`

## Two Main Stages
1. **Light-dependent reactions** (in thylakoids) — produce ATP and NADPH
2. **Calvin cycle** (in stroma) — uses ATP/NADPH to fix CO₂ into glucose

The two main stages are the *light-dependent reactions* (in thylakoids) and the *Calvin cycle* (in the stroma).`,
    date: 'Today',
    wordCount: 1234,
    readTime: 8,
    hasSummary: true,
    flashcardCount: 8,
    updatedAt: new Date(),
  },
  {
    id: 2,
    title: 'Database Overview',
    emoji: '🗄️',
    folder: 1,
    tags: ['cs', 'important'],
    tagColors: ['cyan', 'violet'],
    preview: 'SQL vs NoSQL databases, ACID properties, indexing strategies for large-scale systems...',
    content: `# Database Overview

## SQL vs NoSQL
SQL databases are relational with fixed schemas. NoSQL offers flexible schemas.

## ACID Properties
- **Atomicity**: All or nothing
- **Consistency**: Valid state transitions
- **Isolation**: Concurrent transactions
- **Durability**: Committed data persists`,
    date: 'Yesterday',
    wordCount: 890,
    readTime: 6,
    hasSummary: true,
    flashcardCount: 12,
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: 3,
    title: 'Project Plan Q4',
    emoji: '📋',
    folder: 2,
    tags: ['meeting', 'work'],
    tagColors: ['pink', 'emerald'],
    preview: 'Q4 roadmap including feature launches, team milestones, and sprint planning notes...',
    content: `# Project Plan Q4

## Milestones
- Sprint 1: Auth + onboarding
- Sprint 2: Core notes CRUD
- Sprint 3: AI features
- Sprint 4: Polish + launch`,
    date: '2d ago',
    wordCount: 560,
    readTime: 4,
    hasSummary: false,
    flashcardCount: 5,
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: 4,
    title: 'Chloroplast Structure',
    emoji: '🔬',
    folder: 1,
    tags: ['biology'],
    tagColors: ['blue'],
    preview: 'Thylakoid membranes, stroma, grana stacks and their functional roles...',
    content: `# Chloroplast Structure

## Key Components
- **Outer membrane**: permeable to small molecules
- **Inner membrane**: controls ion/metabolite transport
- **Stroma**: aqueous interior, site of Calvin cycle
- **Thylakoids**: membrane system for light reactions
- **Grana**: stacked thylakoids`,
    date: '3d ago',
    wordCount: 720,
    readTime: 5,
    hasSummary: false,
    flashcardCount: 6,
    updatedAt: new Date(Date.now() - 259200000),
  },
  {
    id: 5,
    title: 'Organic Chemistry Ch.4',
    emoji: '⚗️',
    folder: 1,
    tags: ['exam', 'research'],
    tagColors: ['emerald', 'amber'],
    preview: 'Alkanes, alkenes, alkynes, functional groups and naming conventions...',
    content: `# Organic Chemistry Ch.4

## Hydrocarbons
- Alkanes: single bonds (CₙH₂ₙ₊₂)
- Alkenes: double bonds (CₙH₂ₙ)
- Alkynes: triple bonds (CₙH₂ₙ₋₂)`,
    date: '4d ago',
    wordCount: 980,
    readTime: 7,
    hasSummary: true,
    flashcardCount: 14,
    updatedAt: new Date(Date.now() - 345600000),
  },
]

export const mockFlashcards = [
  { id: 1, question: 'What are the two main stages of photosynthesis?', answer: '1. Light-dependent reactions (in thylakoids)\n2. Calvin cycle (in stroma)', noteTitle: 'Photosynthesis Notes' },
  { id: 2, question: 'What is the chemical equation for photosynthesis?', answer: '6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂', noteTitle: 'Photosynthesis Notes' },
  { id: 3, question: 'Where does the Calvin cycle occur?', answer: 'In the stroma of the chloroplast', noteTitle: 'Photosynthesis Notes' },
  { id: 4, question: 'What does ATP stand for?', answer: 'Adenosine Triphosphate — the primary energy currency of cells', noteTitle: 'Photosynthesis Notes' },
  { id: 5, question: 'What are the ACID properties in databases?', answer: 'Atomicity, Consistency, Isolation, Durability', noteTitle: 'Database Overview' },
  { id: 6, question: 'What is the difference between SQL and NoSQL?', answer: 'SQL is relational with fixed schemas; NoSQL is flexible and schema-less', noteTitle: 'Database Overview' },
  { id: 7, question: 'What is an alkane?', answer: 'A hydrocarbon with only single C-C bonds. General formula: CₙH₂ₙ₊₂', noteTitle: 'Organic Chemistry Ch.4' },
  { id: 8, question: 'What are thylakoids?', answer: 'Flattened membrane sacs inside chloroplasts where light-dependent reactions occur', noteTitle: 'Photosynthesis Notes' },
]

export const mockStats = {
  totalNotes: 47,
  aiSummaries: 23,
  flashcards: 156,
  streak: 12,
}

export const mockChatMessages = [
  { id: 1, role: 'ai', content: '👋 Hi Alex! I\'ve loaded your **Photosynthesis Notes** and **Chloroplast Structure** as context. Ask me anything!' },
  { id: 2, role: 'user', content: 'Explain photosynthesis simply.' },
  { id: 3, role: 'ai', content: 'Photosynthesis is how plants make their own food! 🌿\n\nPlants capture **sunlight** and use it to convert CO₂ and water into glucose (sugar) + oxygen.\n\nThis happens in two stages — the **light reactions** (thylakoids) and the **Calvin cycle** (stroma).' },
]
