import React, { useState } from 'react';
import type { Food } from '../types';
import { foodDatabase } from '../data/foodDatabase';
import './FoodSearch.css';

interface FoodSearchProps {
  onSelectFood: (food: Food, servings: number, mealType: string) => void;
}

const FoodSearch: React.FC<FoodSearchProps> = ({ onSelectFood }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState('breakfast');

  const categories = [
    'All',
    'Protein',
    'Carbs',
    'Vegetables',
    'Fruits',
    'Fats',
    'Dairy',
  ];

  const filteredFoods = foodDatabase.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddFood = () => {
    if (selectedFood) {
      onSelectFood(selectedFood, servings, mealType);
      setSelectedFood(null);
      setServings(1);
      setSearchTerm('');
    }
  };

  const calculateNutrition = (food: Food, servings: number) => {
    return {
      calories: Math.round(food.calories * servings),
      protein: Math.round(food.protein * servings * 10) / 10,
      carbs: Math.round(food.carbs * servings * 10) / 10,
      fat: Math.round(food.fat * servings * 10) / 10,
    };
  };

  return (
    <div className="food-search">
      <div className="search-header">
        <input
          type="text"
          placeholder="Search for food..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="category-filters">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              selectedCategory === category ? 'active' : ''
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="food-list">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className={`food-item ${
              selectedFood?.id === food.id ? 'selected' : ''
            }`}
            onClick={() => setSelectedFood(food)}
          >
            <div className="food-info">
              <h4>{food.name}</h4>
              <p className="serving-info">
                {food.servingSize} {food.servingUnit}
              </p>
            </div>
            <div className="food-macros">
              <span className="macro-badge calories">
                {food.calories} cal
              </span>
              <span className="macro-badge protein">P: {food.protein}g</span>
              <span className="macro-badge carbs">C: {food.carbs}g</span>
              <span className="macro-badge fat">F: {food.fat}g</span>
            </div>
          </div>
        ))}
      </div>

      {selectedFood && (
        <div className="food-detail-panel">
          <div className="detail-header">
            <h3>{selectedFood.name}</h3>
            <button
              className="close-btn"
              onClick={() => setSelectedFood(null)}
            >
              ×
            </button>
          </div>

          <div className="serving-controls">
            <label>Number of servings:</label>
            <div className="serving-input-group">
              <button
                onClick={() => setServings(Math.max(0.25, servings - 0.25))}
              >
                -
              </button>
              <input
                type="number"
                value={servings}
                onChange={(e) =>
                  setServings(Math.max(0.1, parseFloat(e.target.value) || 0))
                }
                step="0.25"
                min="0.1"
              />
              <button onClick={() => setServings(servings + 0.25)}>+</button>
            </div>
            <span className="serving-amount">
              ({Math.round(selectedFood.servingSize * servings)}{' '}
              {selectedFood.servingUnit})
            </span>
          </div>

          <div className="meal-type-selector">
            <label>Meal type:</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div className="nutrition-preview">
            <h4>Nutrition Preview</h4>
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="nutrition-label">Calories</span>
                <span className="nutrition-value">
                  {calculateNutrition(selectedFood, servings).calories}
                </span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Protein</span>
                <span className="nutrition-value">
                  {calculateNutrition(selectedFood, servings).protein}g
                </span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Carbs</span>
                <span className="nutrition-value">
                  {calculateNutrition(selectedFood, servings).carbs}g
                </span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-label">Fat</span>
                <span className="nutrition-value">
                  {calculateNutrition(selectedFood, servings).fat}g
                </span>
              </div>
            </div>
          </div>

          <button className="add-food-btn" onClick={handleAddFood}>
            Add to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodSearch;
