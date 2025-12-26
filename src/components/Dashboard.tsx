import React from 'react';
import type { MacroGoals, DailyLog, FoodEntry } from '../types';
import './Dashboard.css';

interface DashboardProps {
  goals: MacroGoals;
  dailyLog: DailyLog;
  onDeleteEntry: (entryId: string) => void;
  onAddFood: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  goals,
  dailyLog,
  onDeleteEntry,
  onAddFood,
}) => {
  const calculatePercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage < 80) return '#667eea';
    if (percentage < 100) return '#ffa726';
    return '#ef5350';
  };

  const remaining = {
    calories: Math.max(0, goals.calories - dailyLog.totalCalories),
    protein: Math.max(0, goals.protein - dailyLog.totalProtein),
    carbs: Math.max(0, goals.carbs - dailyLog.totalCarbs),
    fat: Math.max(0, goals.fat - dailyLog.totalFat),
  };

  const groupedEntries = dailyLog.entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  const mealTypes: Array<'breakfast' | 'lunch' | 'dinner' | 'snack'> = [
    'breakfast',
    'lunch',
    'dinner',
    'snack',
  ];

  const calculateMealTotals = (entries: FoodEntry[]) => {
    return entries.reduce(
      (acc, entry) => ({
        calories:
          acc.calories + entry.food.calories * entry.servings,
        protein:
          acc.protein + entry.food.protein * entry.servings,
        carbs: acc.carbs + entry.food.carbs * entry.servings,
        fat: acc.fat + entry.food.fat * entry.servings,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Today's Macros</h1>
        <p className="date">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
      </div>

      <div className="macro-overview">
        <div className="macro-card calories-card">
          <div className="macro-card-header">
            <h3>Calories</h3>
            <span className="remaining">{remaining.calories} left</span>
          </div>
          <div className="macro-progress">
            <div
              className="macro-progress-bar"
              style={{
                width: `${calculatePercentage(
                  dailyLog.totalCalories,
                  goals.calories
                )}%`,
                background: getProgressColor(
                  dailyLog.totalCalories,
                  goals.calories
                ),
              }}
            />
          </div>
          <div className="macro-numbers">
            <span className="current">{Math.round(dailyLog.totalCalories)}</span>
            <span className="goal">/ {goals.calories}</span>
          </div>
        </div>

        <div className="macro-card protein-card">
          <div className="macro-card-header">
            <h3>Protein</h3>
            <span className="remaining">{Math.round(remaining.protein)}g left</span>
          </div>
          <div className="macro-progress">
            <div
              className="macro-progress-bar"
              style={{
                width: `${calculatePercentage(
                  dailyLog.totalProtein,
                  goals.protein
                )}%`,
                background: getProgressColor(
                  dailyLog.totalProtein,
                  goals.protein
                ),
              }}
            />
          </div>
          <div className="macro-numbers">
            <span className="current">{Math.round(dailyLog.totalProtein)}g</span>
            <span className="goal">/ {goals.protein}g</span>
          </div>
        </div>

        <div className="macro-card carbs-card">
          <div className="macro-card-header">
            <h3>Carbs</h3>
            <span className="remaining">{Math.round(remaining.carbs)}g left</span>
          </div>
          <div className="macro-progress">
            <div
              className="macro-progress-bar"
              style={{
                width: `${calculatePercentage(
                  dailyLog.totalCarbs,
                  goals.carbs
                )}%`,
                background: getProgressColor(
                  dailyLog.totalCarbs,
                  goals.carbs
                ),
              }}
            />
          </div>
          <div className="macro-numbers">
            <span className="current">{Math.round(dailyLog.totalCarbs)}g</span>
            <span className="goal">/ {goals.carbs}g</span>
          </div>
        </div>

        <div className="macro-card fat-card">
          <div className="macro-card-header">
            <h3>Fat</h3>
            <span className="remaining">{Math.round(remaining.fat)}g left</span>
          </div>
          <div className="macro-progress">
            <div
              className="macro-progress-bar"
              style={{
                width: `${calculatePercentage(
                  dailyLog.totalFat,
                  goals.fat
                )}%`,
                background: getProgressColor(dailyLog.totalFat, goals.fat),
              }}
            />
          </div>
          <div className="macro-numbers">
            <span className="current">{Math.round(dailyLog.totalFat)}g</span>
            <span className="goal">/ {goals.fat}g</span>
          </div>
        </div>
      </div>

      <div className="meals-section">
        <div className="section-header">
          <h2>Today's Meals</h2>
          <button className="add-meal-btn" onClick={onAddFood}>
            + Add Food
          </button>
        </div>

        {mealTypes.map((mealType) => {
          const entries = groupedEntries[mealType] || [];
          const totals = calculateMealTotals(entries);

          return (
            <div key={mealType} className="meal-section">
              <div className="meal-header">
                <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                {entries.length > 0 && (
                  <span className="meal-total">
                    {Math.round(totals.calories)} cal
                  </span>
                )}
              </div>

              {entries.length === 0 ? (
                <div className="empty-meal">
                  <p>No food added yet</p>
                </div>
              ) : (
                <div className="meal-entries">
                  {entries.map((entry) => (
                    <div key={entry.id} className="food-entry">
                      <div className="entry-info">
                        <h4>{entry.food.name}</h4>
                        <p>
                          {entry.servings} × {entry.food.servingSize}{' '}
                          {entry.food.servingUnit}
                        </p>
                      </div>
                      <div className="entry-macros">
                        <span>{Math.round(entry.food.calories * entry.servings)} cal</span>
                        <span>P: {Math.round(entry.food.protein * entry.servings)}g</span>
                        <span>C: {Math.round(entry.food.carbs * entry.servings)}g</span>
                        <span>F: {Math.round(entry.food.fat * entry.servings)}g</span>
                      </div>
                      <button
                        className="delete-btn"
                        onClick={() => onDeleteEntry(entry.id)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
