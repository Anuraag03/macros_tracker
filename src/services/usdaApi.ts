import type { Food } from '../types';

// USDA API Configuration
// Get API key from environment variable or use default
const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || 'wqq2OeD1D3Ix9v7d4APe5ohOuskRY1ibSrCrKrJw';
const USDA_API_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

interface USDAFoodSearchResult {
  fdcId: number;
  description: string;
  dataType: string;
  foodCategory?: string;
  foodNutrients: Array<{
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    value: number;
  }>;
  servingSize?: number;
  servingSizeUnit?: string;
}

interface USDASearchResponse {
  foods: USDAFoodSearchResult[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

export async function searchUSDAFoods(query: string, pageNumber = 1): Promise<USDASearchResponse> {
  const url = `${USDA_API_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=20&pageNumber=${pageNumber}&dataType=Survey (FNDDS),Foundation,Branded`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching from USDA API:', error);
    throw error;
  }
}

export async function getUSDAFoodDetails(fdcId: number): Promise<USDAFoodSearchResult> {
  const url = `${USDA_API_BASE_URL}/food/${fdcId}?api_key=${USDA_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`USDA API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching food details from USDA API:', error);
    throw error;
  }
}

export function convertUSDAFoodToAppFood(usdaFood: USDAFoodSearchResult): Food {
  const nutrients = usdaFood.foodNutrients;
  
  // Nutrient IDs: Energy=1008, Protein=1003, Carbs=1005, Fat=1004, Fiber=1079, Sugars=2000
  const getNutrientValue = (nutrientId: number): number => {
    const nutrient = nutrients.find(n => n.nutrientId === nutrientId);
    return nutrient ? nutrient.value : 0;
  };

  // Determine category based on nutrient profile
  const protein = getNutrientValue(1003);
  const carbs = getNutrientValue(1005);
  const fat = getNutrientValue(1004);
  
  let category = 'Other';
  if (protein > 15 && protein > carbs && protein > fat) {
    category = 'Protein';
  } else if (carbs > protein && carbs > fat) {
    category = 'Carbs';
  } else if (fat > protein && fat > carbs) {
    category = 'Fats';
  }

  // Try to determine more specific categories
  const desc = usdaFood.description.toLowerCase();
  if (desc.includes('vegetable') || desc.includes('lettuce') || desc.includes('spinach') || 
      desc.includes('broccoli') || desc.includes('carrot') || desc.includes('tomato')) {
    category = 'Vegetables';
  } else if (desc.includes('fruit') || desc.includes('apple') || desc.includes('banana') || 
             desc.includes('orange') || desc.includes('berry')) {
    category = 'Fruits';
  } else if (desc.includes('milk') || desc.includes('cheese') || desc.includes('yogurt') || 
             desc.includes('cream')) {
    category = 'Dairy';
  }

  return {
    id: `usda-${usdaFood.fdcId}`,
    name: usdaFood.description,
    category,
    servingSize: usdaFood.servingSize || 100,
    servingUnit: usdaFood.servingSizeUnit || 'g',
    calories: Math.round(getNutrientValue(1008)),
    protein: Math.round(getNutrientValue(1003) * 10) / 10,
    carbs: Math.round(getNutrientValue(1005) * 10) / 10,
    fat: Math.round(getNutrientValue(1004) * 10) / 10,
    fiber: Math.round(getNutrientValue(1079) * 10) / 10,
    sugar: Math.round(getNutrientValue(2000) * 10) / 10,
  };
}
