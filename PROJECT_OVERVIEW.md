# Placeholder Planner - Project Overview

## Project Purpose
A winter-themed Angular 20 productivity planner application that allows users to manage tasks and goals across multiple time horizons (daily, weekly, quarterly, and yearly). Built with standalone components and TailwindCSS.

## Technology Stack
- **Framework**: Angular 20 (standalone components)
- **Styling**: TailwindCSS
- **Authentication**: Cookie-based session management (fake login flow)
- **Language**: TypeScript

## Application Structure

### Main Views
The application has four main view modes that users can switch between:
1. **Daily Tasks** (Monday view) - Default view showing daily to-dos
2. **Weekly Goals** - Sidebar always visible, shows weekly goals
3. **Quarterly Goals** (Q1) - Replaces daily view when selected
4. **Yearly Goals** (2026) - Replaces daily view when selected

### Color Scheme by Time Period
- **Daily Tasks**: Indigo (`indigo-*`)
- **Weekly Goals**: Violet (`violet-*`)
- **Quarterly Goals**: Purple (`purple-*`)
- **Yearly Goals**: Violet (`violet-*`)

## Component Architecture

### Dashboard Component (`src/app/components/dashboard/`)
**Role**: Parent container and orchestrator
- Manages view state (`showYearlyGoals`, `showQuarterlyGoals`)
- Stores all data arrays (tasks, weeklyGoals, quarterlyGoals, yearlyGoals)
- Handles view switching between Daily/Quarterly/Yearly
- Manages global tag input closing (clicks anywhere on page)
- Renders top bar with navigation chips and motivational text
- Renders bottom bar

**Key Methods**:
- `toggleYearlyGoals()` - Shows yearly view, hides quarterly
- `toggleQuarterlyGoals()` - Shows quarterly view, hides yearly
- `showDailyTasks()` - Returns to daily view
- `closeAllTagInputs()` - Closes all tag inputs across all components
- `logout()` - Logs out and navigates to login

### Daily Tasks Component (`src/app/components/daily-tasks/`)
**Role**: Manages daily to-dos
- Receives tasks via `@Input() tasks: Task[]`
- Displays in main panel (75% width on large screens)
- Add new to-do functionality
- Checkbox completion tracking
- Tag management (add/remove tags)

**Features**:
- Text input to add new to-dos
- Max 5 tags per task, max 15 characters per tag
- Tag input shows on + button click, hides on outside click
- Indigo color scheme

### Weekly Goals Component (`src/app/components/weekly-goals/`)
**Role**: Manages weekly goals in sidebar
- Receives goals via `@Input() goals: Goal[]`
- Always visible in right sidebar (25% width on large screens)
- Compact layout with smaller text sizes
- Add new goal functionality
- Tag management

**Features**:
- Vertical button layout for compact sidebar
- Same tag system as other components
- Violet color scheme

### Quarterly Goals Component (`src/app/components/quarterly-goals/`)
**Role**: Manages Q1 goals
- Receives goals via `@Input() goals: Goal[]`
- Displays in main panel when Q1 chip is clicked
- Add new goal functionality
- Tag management

**Features**:
- Full-width layout for main panel
- Purple color scheme to differentiate from yearly
- Same interaction patterns as yearly goals

### Yearly Goals Component (`src/app/components/yearly-goals/`)
**Role**: Manages 2026 goals
- Receives goals via `@Input() goals: Goal[]`
- Displays in main panel when 2026 chip is clicked
- Add new goal functionality
- Tag management

**Features**:
- Full-width layout for main panel
- Violet color scheme
- Same interaction patterns as quarterly goals

## Data Models

### Task Interface (`src/app/models/task.interface.ts`)
```typescript
interface Task {
  id: number;
  text: string;
  completed: boolean;
  tags?: string[];
  showTagInput?: boolean;
}
```

### Goal Interface (`src/app/models/task.interface.ts`)
```typescript
interface Goal {
  id: number;
  text: string;
  completed: boolean;
  tags?: string[];
  showTagInput?: boolean;
}
```

## Key Features & Interactions

### Tag System
**Behavior**:
- Click + button on any task/goal to show tag input
- Tag input appears below the item with an input field and "Add" button
- Max 5 tags per item, max 15 characters per tag
- Tag counter shows current/max (e.g., "3/5 tags")
- Tags display as chips with X button to remove
- Clicking anywhere on the page closes all tag inputs (via parent dashboard handler)

**Implementation**:
- `showTagInput` property on each item controls visibility
- `stopPropagation()` prevents clicks inside inputs from closing them
- Dashboard's `closeAllTagInputs()` method closes all inputs across all components
- Each component has its own tag input tracking: `newTaskTagInput`, `newWeeklyTagInput`, etc.

### View Switching
**Top Bar Navigation**:
- "Week of Jan 27" chip → Shows daily tasks view
- "Quarter 1" chip → Shows quarterly goals view (replaces daily)
- "2026 Goals" chip → Shows yearly goals view (replaces daily)
- "Closers get coffee" → Motivational text (not clickable)

**Active State**:
- Active chips have colored background and white text
- Inactive chips have light background

### Event Propagation Pattern
**Critical Implementation Detail**:
- Root dashboard div has `(click)="closeAllTagInputs()"`
- All input areas have `(click)="stopPropagation($event)"` to prevent closing while typing
- + buttons have `(click)="showTagInput(id, $event)"` with stopPropagation to open without closing
- This allows clicking anywhere else on the page to close all tag inputs

## Authentication
- Fake login flow with cookie-based session management
- Login component at `/login`
- Dashboard requires authentication
- AuthService manages session state
- Logout button in top-right of dashboard header

## Layout Structure
```
Dashboard (full screen, winter gradient background)
├── Header (Title + Logout button)
├── Top Bar (Week/Quarter/Year chips + motivational text)
├── Main Content Grid (4 columns on large screens)
│   ├── Main Panel (3 columns - 75%)
│   │   └── Daily Tasks | Quarterly Goals | Yearly Goals (conditionally rendered)
│   └── Sidebar (1 column - 25%)
│       └── Weekly Goals (always visible)
└── Bottom Bar (links/info placeholder)
```

## Mock Data
All data is currently mocked in the DashboardComponent:
- 6 sample daily tasks
- 5 sample weekly goals
- 5 sample quarterly goals
- 5 sample yearly goals

All items start with `tags: []` and `showTagInput: false`.

## Common Patterns Across Components

### Adding Items
1. Text input bound to component property (e.g., `newTask`)
2. Enter key or button click triggers add method
3. Creates new item with `id: array.length + 1`
4. Pushes to array and clears input

### Tag Management
1. + button calls `show*TagInput(id, $event)` with stopPropagation
2. Opens tag input for specific item, closes others
3. Tag input has own stopPropagation to prevent closing
4. Add tag validates length (≤15 chars) and count (≤5 tags)
5. Remove tag uses splice on tags array

### Styling Conventions
- All main panels: `bg-white border-2 rounded-lg shadow-xl p-6 h-full`
- Hover states: `hover:bg-{color}-50` on item containers
- Buttons: Rounded with shadow and hover shadow increase
- Inputs: Border-2 with focus ring

## Future Considerations
- Data persistence (currently all in-memory)
- Backend API integration
- User-specific data
- Real authentication
- Date/calendar integration
- Drag and drop reordering
- Goal/task relationships
- Progress tracking
- Analytics/insights

## Development Notes
- Uses Angular 20 standalone component architecture (no NgModule)
- All components use `imports` array in @Component decorator
- Template syntax uses new control flow (@if, @for)
- TailwindCSS classes for all styling (no component CSS files used except placeholders)
- Event handling pattern prevents tag inputs from interfering with other interactions
