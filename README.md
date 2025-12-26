# Plannit - Smart Macro Tracker

A modern, intuitive macro tracking application built with React and TypeScript.

## Features

- **Personalized Questionnaire**: Collect user info (height, weight, age, activity level, goals)
- **Default Macro Option**: Quick start with preset macro goals (1813 cal, 162g protein, 165g carbs, 56g fat)
- **Smart Macro Calculation**: Uses Mifflin-St Jeor equation and evidence-based macro ratios
- **USDA Food Database Integration**: Search 300,000+ foods from the USDA FoodData Central database
- **Local Food Database**: 120+ verified foods for quick offline access
- **Custom Food Creation**: Add your own foods with manual macro entry
- **Easy Food Tracking**: Search, filter, and log meals throughout the day
- **Visual Dashboard**: Progress bars, daily summaries, and meal-by-meal breakdown
- **Local Storage**: Data persists between sessions

## Tech Stack

- React 19
- TypeScript
- Vite
- USDA FoodData Central API
- CSS3 (Custom styling, no frameworks)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- USDA API Key (free - get one at https://fdc.nal.usda.gov/api-key-signup.html)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

3. Add your USDA API key to the `.env` file:
```
VITE_USDA_API_KEY=your_api_key_here
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

## USDA API Integration

The app integrates with the USDA FoodData Central API, giving users access to:
- 300,000+ food items
- Real-time search results
- Verified nutritional data
- Brand name foods
- Restaurant items

**Search Modes:**
- **Local Database**: Fast, offline access to 120+ common foods
- **USDA Database**: Search the entire USDA database (requires internet)

## Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Add your USDA API key as an environment variable:
```bash
vercel env add VITE_USDA_API_KEY
```

3. Deploy:
```bash
vercel
```

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable:
   - Key: `VITE_USDA_API_KEY`
   - Value: Your USDA API key
6. Click "Deploy"

## Configuration

The app includes a vercel.json configuration that tells Vercel:
- Build command: npm run build
- Output directory: dist
- Framework: vite

## License

MIT
