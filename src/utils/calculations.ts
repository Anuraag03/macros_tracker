import type { UserProfile, MacroGoals } from '../types';

// Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation
export const calculateBMR = (profile: UserProfile): number => {
  const { weight, height, age, gender } = profile;
  
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === 'female') {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  } else {
    // For 'other', use average of male and female
    const male = 10 * weight + 6.25 * height - 5 * age + 5;
    const female = 10 * weight + 6.25 * height - 5 * age - 161;
    return (male + female) / 2;
  }
};

// Calculate Total Daily Energy Expenditure (TDEE)
export const calculateTDEE = (bmr: number, activityLevel: string): number => {
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise 1-3 days/week
    moderate: 1.55, // Moderate exercise 3-5 days/week
    very_active: 1.725, // Hard exercise 6-7 days/week
    extra_active: 1.9, // Very hard exercise & physical job
  };

  return bmr * (activityMultipliers[activityLevel] || 1.2);
};

// Calculate calorie goal based on user's goal
export const calculateCalorieGoal = (
  tdee: number, 
  goal: string
): number => {
  switch (goal) {
    case 'lose':
      // Conservative deficit: 15-20% below TDEE or 500 cal, whichever is smaller
      const deficitPercent = Math.min(tdee * 0.20, 500);
      return Math.round(tdee - deficitPercent);
    case 'gain':
      // Lean bulk: 5-10% surplus, capped at 300-500 cal
      const surplusPercent = Math.min(tdee * 0.10, 500);
      return Math.round(tdee + Math.max(250, surplusPercent));
    case 'maintain':
    default:
      return Math.round(tdee);
  }
};

// Calculate macro goals based on total calories, weight, and goal
export const calculateMacros = (
  calories: number,
  weight: number,
  goal: string
): MacroGoals => {
  let proteinGrams: number;
  let fatPercentage: number;

  switch (goal) {
    case 'lose':
      // Moderate-high protein to preserve muscle during deficit (1.8-2.0g/kg)
      proteinGrams = Math.round(weight * 1.8);
      // Moderate fat for hormonal health (25-30% of calories)
      fatPercentage = 0.28;
      break;
    case 'gain':
      // Optimal protein for muscle building (1.6-1.8g/kg)
      proteinGrams = Math.round(weight * 1.6);
      // Higher fat to support anabolic processes (25-30% of calories)
      fatPercentage = 0.28;
      break;
    case 'maintain':
    default:
      // Moderate protein for maintenance (1.4-1.6g/kg)
      proteinGrams = Math.round(weight * 1.4);
      // Balanced fat intake (25-30% of calories)
      fatPercentage = 0.27;
      break;
  }

  // Ensure minimum protein (0.8g/kg) and maximum (2.5g/kg)
  proteinGrams = Math.max(Math.round(weight * 0.8), Math.min(proteinGrams, Math.round(weight * 2.5)));
  const proteinCalories = proteinGrams * 4;

  // Calculate fat grams from percentage
  const fatCalories = calories * fatPercentage;
  const fatGrams = Math.round(fatCalories / 9);

  // Remaining calories go to carbs
  const carbCalories = Math.max(0, calories - proteinCalories - (fatGrams * 9));
  const carbGrams = Math.round(carbCalories / 4);

  return {
    calories,
    protein: proteinGrams,
    carbs: carbGrams,
    fat: fatGrams,
  };
};

// Main function to calculate all macro goals
export const calculateUserMacros = (profile: UserProfile): MacroGoals => {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const calorieGoal = calculateCalorieGoal(tdee, profile.goal);
  return calculateMacros(calorieGoal, profile.weight, profile.goal);
};
