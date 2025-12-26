// User Profile Types
export interface UserProfile {
  height: number; // in cm
  weight: number; // in kg
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
  goal: 'lose' | 'maintain' | 'gain';
  location: string;
  foodPreferences: string[];
  dietaryRestrictions: string[];
}

export interface MacroGoals {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
}

// Food Types
export interface Food {
  id: string;
  name: string;
  category: string;
  servingSize: number; // in grams
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
}

export interface FoodEntry {
  id: string;
  food: Food;
  servings: number;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface DailyLog {
  date: string;
  entries: FoodEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}
