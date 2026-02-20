# NutriTrack

NutriTrack is a high-end, modern Web App for nutrition tracking. It features a Cyber-Noir aesthetic, a dual-tab interface for logging and reviewing meals, and robust local data persistence.

## Features

- **Cyber-Noir Aesthetic**: Deep Obsidian, Electric Purple, and Muted Slate colors with glassmorphism effects.
- **Dashboard View**: 
  - Log meals quickly with Ingredient Name and Quantity.
  - Dynamic Pie Chart visualizing daily Protein, Carbohydrates, Fiber, and Fats.
  - Progress bars tracking daily goals (2000 kcal, 150g Protein, 35g Fiber).
- **History View**: 
  - Sleek calendar interface.
  - Click on past dates to view logged meals and macro breakdowns.
- **Local Data Persistence**: 
  - All logs are directly saved to and retrieved from a local `nutrihistory.json` file on your machine.

## Getting Started

This project is built with Next.js, React, Tailwind CSS, and Recharts.

First, install the dependencies if you haven't already:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How it Works

The application utilizes Next.js API Routes (`src/app/api/history/route.ts`) to read and write directly to `nutrihistory.json` in the root of the project directory. This ensures your data is saved locally on your machine without relying on temporary browser storage or external databases.
