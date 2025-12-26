import { useState, useEffect } from 'react';
import type { UserProfile, MacroGoals, DailyLog, FoodEntry, Food } from './types';
import { calculateUserMacros } from './utils/calculations';
import Questionnaire from './components/Questionnaire';
import Dashboard from './components/Dashboard';
import FoodSearch from './components/FoodSearch';
import './App.css';

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [macroGoals, setMacroGoals] = useState<MacroGoals | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyLog>({
    date: new Date().toISOString().split('T')[0],
    entries: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
  });
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [customFoods, setCustomFoods] = useState<Food[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedGoals = localStorage.getItem('macroGoals');
    const savedLog = localStorage.getItem('dailyLog');
    const savedCustomFoods = localStorage.getItem('customFoods');

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    if (savedGoals) {
      setMacroGoals(JSON.parse(savedGoals));
    }
    if (savedLog) {
      const log = JSON.parse(savedLog);
      // Check if it's from today, otherwise reset
      if (log.date === new Date().toISOString().split('T')[0]) {
        setDailyLog(log);
      }
    }
    if (savedCustomFoods) {
      setCustomFoods(JSON.parse(savedCustomFoods));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (macroGoals) {
      localStorage.setItem('macroGoals', JSON.stringify(macroGoals));
    }
  }, [macroGoals]);

  useEffect(() => {
    localStorage.setItem('dailyLog', JSON.stringify(dailyLog));
  }, [dailyLog]);

  useEffect(() => {
    localStorage.setItem('customFoods', JSON.stringify(customFoods));
  }, [customFoods]);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    const goals = calculateUserMacros(profile);
    setMacroGoals(goals);
  };

  const handleAddFood = (food: Food, servings: number, mealType: string) => {
    const newEntry: FoodEntry = {
      id: `${Date.now()}-${Math.random()}`,
      food,
      servings,
      date: dailyLog.date,
      mealType: mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
    };

    const updatedEntries = [...dailyLog.entries, newEntry];
    const totals = updatedEntries.reduce(
      (acc, entry) => ({
        totalCalories: acc.totalCalories + entry.food.calories * entry.servings,
        totalProtein: acc.totalProtein + entry.food.protein * entry.servings,
        totalCarbs: acc.totalCarbs + entry.food.carbs * entry.servings,
        totalFat: acc.totalFat + entry.food.fat * entry.servings,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );

    setDailyLog({
      ...dailyLog,
      entries: updatedEntries,
      ...totals,
    });

    setShowFoodSearch(false);
  };

  const handleDeleteEntry = (entryId: string) => {
    const updatedEntries = dailyLog.entries.filter((e) => e.id !== entryId);
    const totals = updatedEntries.reduce(
      (acc, entry) => ({
        totalCalories: acc.totalCalories + entry.food.calories * entry.servings,
        totalProtein: acc.totalProtein + entry.food.protein * entry.servings,
        totalCarbs: acc.totalCarbs + entry.food.carbs * entry.servings,
        totalFat: acc.totalFat + entry.food.fat * entry.servings,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );

    setDailyLog({
      ...dailyLog,
      entries: updatedEntries,
      ...totals,
    });
  };

  const handleAddCustomFood = (food: Food) => {
    setCustomFoods([...customFoods, food]);
  };

  const handleResetProfile = () => {
    if (confirm('Are you sure you want to reset your profile? This will clear all data.')) {
      localStorage.clear();
      setUserProfile(null);
      setMacroGoals(null);
      setDailyLog({
        date: new Date().toISOString().split('T')[0],
        entries: [],
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
      });
    }
  };

  // Show questionnaire if no profile
  if (!userProfile || !macroGoals) {
    return <Questionnaire onComplete={handleProfileComplete} />;
  }

  return (
    <div className="app">
      {!showFoodSearch ? (
        <>
          <nav className="app-nav">
            <h1>Plannit</h1>
            <button className="reset-btn" onClick={handleResetProfile}>
              Reset Profile
            </button>
          </nav>
          <Dashboard
            goals={macroGoals}
            dailyLog={dailyLog}
            onDeleteEntry={handleDeleteEntry}
            onAddFood={() => setShowFoodSearch(true)}
          />
        </>
      ) : (
        <div className="food-search-view">
          <div className="food-search-header">
            <button
              className="back-btn"
              onClick={() => setShowFoodSearch(false)}
            >
              ← Back
            </button>
            <h2>Add Food</h2>
          </div>
          <FoodSearch 
            onSelectFood={handleAddFood}
            customFoods={customFoods}
            onAddCustomFood={handleAddCustomFood}
          />
        </div>
      )}
    </div>
  );
}

export default App;
