# Plannit - Smart Macro Tracker

A modern, intuitive macro tracking application built with React and TypeScript.

## Features

- **Personalized Questionnaire**: Collect user info (height, weight, age, activity level, goals)
- **Smart Macro Calculation**: Uses Mifflin-St Jeor equation and evidence-based macro ratios
- **Comprehensive Food Database**: 40+ foods with verified USDA nutritional data
- **Easy Food Tracking**: Search, filter, and log meals throughout the day
- **Visual Dashboard**: Progress bars, daily summaries, and meal-by-meal breakdown
- **Local Storage**: Data persists between sessions

## Tech Stack

- React 19
- TypeScript
- Vite
- CSS3 (Custom styling, no frameworks)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:5173

### Build

```bash
npm run build
```

## Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and your app will be deployed!

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect the Vite framework
6. Click "Deploy"

## Configuration

The app includes a vercel.json configuration that tells Vercel:
- Build command: npm run build
- Output directory: dist
- Framework: vite

## License

MIT
