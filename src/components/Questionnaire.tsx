import React, { useState } from 'react';
import type { UserProfile } from '../types';
import './Questionnaire.css';

interface QuestionnaireProps {
  onComplete: (profile: UserProfile) => void;
  onUseDefaults: () => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ onComplete, onUseDefaults }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    foodPreferences: [],
    dietaryRestrictions: [],
  });

  const foodOptions = [
    'Chicken',
    'Beef',
    'Pork',
    'Fish',
    'Seafood',
    'Eggs',
    'Dairy',
    'Tofu',
    'Legumes',
    'Nuts',
    'Fruits',
    'Vegetables',
    'Grains',
    'Rice',
    'Pasta',
  ];

  const dietaryOptions = [
    'None',
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Halal',
    'Kosher',
    'Low-Carb',
    'Keto',
  ];

  const handleNext = () => {
    if (step < 9) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleUseDefaults = () => {
    onUseDefaults();
  };

  const handleCustomSetup = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    if (
      profile.height &&
      profile.weight &&
      profile.age &&
      profile.gender &&
      profile.activityLevel &&
      profile.goal &&
      profile.location
    ) {
      onComplete(profile as UserProfile);
    }
  };

  const toggleSelection = (array: string[], value: string) => {
    if (array.includes(value)) {
      return array.filter((item) => item !== value);
    }
    return [...array, value];
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return profile.age && profile.age > 0;
      case 2:
        return profile.gender;
      case 3:
        return profile.height && profile.height > 0;
      case 4:
        return profile.weight && profile.weight > 0;
      case 5:
        return profile.activityLevel;
      case 6:
        return profile.goal;
      case 7:
        return profile.location && profile.location.length > 0;
      case 8:
      case 9:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="questionnaire">
      <div className="questionnaire-container">
        {step > 0 && (
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(step / 9) * 100}%` }}
            />
          </div>
        )}

        <h2>Let's Get Your Profile Set Up</h2>
        {step > 0 && (
          <p className="step-indicator">
            Step {step} of 9
          </p>
        )}

        <div className="question-content">
          {step === 0 && (
            <div className="question default-option">
              <h3>Choose Your Setup Method</h3>
              <p className="default-description">
                You can use our recommended default values or customize your own macro goals.
              </p>
              
              <div className="default-values-box">
                <h4>Default Macro Goals</h4>
                <div className="default-values-grid">
                  <div className="default-value-item">
                    <span className="value">1813</span>
                    <span className="label">Calories</span>
                  </div>
                  <div className="default-value-item">
                    <span className="value">162g</span>
                    <span className="label">Protein</span>
                  </div>
                  <div className="default-value-item">
                    <span className="value">165g</span>
                    <span className="label">Carbs</span>
                  </div>
                  <div className="default-value-item">
                    <span className="value">56g</span>
                    <span className="label">Fats</span>
                  </div>
                </div>
              </div>

              <div className="setup-options">
                <button
                  className="use-defaults-btn"
                  onClick={handleUseDefaults}
                >
                  Use Default Values
                </button>
                <button
                  className="custom-setup-btn"
                  onClick={handleCustomSetup}
                >
                  Customize My Goals
                </button>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="question">
              <label htmlFor="age">How old are you?</label>
              <input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={profile.age || ''}
                onChange={(e) =>
                  setProfile({ ...profile, age: parseInt(e.target.value) })
                }
                min="1"
                max="120"
              />
              <span className="unit">years</span>
            </div>
          )}

          {step === 2 && (
            <div className="question">
              <label>What's your gender?</label>
              <div className="button-group">
                <button
                  className={profile.gender === 'male' ? 'active' : ''}
                  onClick={() => setProfile({ ...profile, gender: 'male' })}
                >
                  Male
                </button>
                <button
                  className={profile.gender === 'female' ? 'active' : ''}
                  onClick={() => setProfile({ ...profile, gender: 'female' })}
                >
                  Female
                </button>
                <button
                  className={profile.gender === 'other' ? 'active' : ''}
                  onClick={() => setProfile({ ...profile, gender: 'other' })}
                >
                  Other
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="question">
              <label htmlFor="height">What's your height?</label>
              <input
                id="height"
                type="number"
                placeholder="Enter your height"
                value={profile.height || ''}
                onChange={(e) =>
                  setProfile({ ...profile, height: parseInt(e.target.value) })
                }
                min="1"
                max="300"
              />
              <span className="unit">cm</span>
            </div>
          )}

          {step === 4 && (
            <div className="question">
              <label htmlFor="weight">What's your current weight?</label>
              <input
                id="weight"
                type="number"
                placeholder="Enter your weight"
                value={profile.weight || ''}
                onChange={(e) =>
                  setProfile({ ...profile, weight: parseFloat(e.target.value) })
                }
                min="1"
                max="500"
                step="0.1"
              />
              <span className="unit">kg</span>
            </div>
          )}

          {step === 5 && (
            <div className="question">
              <label>What's your activity level?</label>
              <div className="button-group vertical">
                <button
                  className={profile.activityLevel === 'sedentary' ? 'active' : ''}
                  onClick={() =>
                    setProfile({ ...profile, activityLevel: 'sedentary' })
                  }
                >
                  <strong>Sedentary</strong>
                  <small>Little or no exercise</small>
                </button>
                <button
                  className={profile.activityLevel === 'light' ? 'active' : ''}
                  onClick={() =>
                    setProfile({ ...profile, activityLevel: 'light' })
                  }
                >
                  <strong>Light</strong>
                  <small>Exercise 1-3 days/week</small>
                </button>
                <button
                  className={profile.activityLevel === 'moderate' ? 'active' : ''}
                  onClick={() =>
                    setProfile({ ...profile, activityLevel: 'moderate' })
                  }
                >
                  <strong>Moderate</strong>
                  <small>Exercise 3-5 days/week</small>
                </button>
                <button
                  className={
                    profile.activityLevel === 'very_active' ? 'active' : ''
                  }
                  onClick={() =>
                    setProfile({ ...profile, activityLevel: 'very_active' })
                  }
                >
                  <strong>Very Active</strong>
                  <small>Hard exercise 6-7 days/week</small>
                </button>
                <button
                  className={
                    profile.activityLevel === 'extra_active' ? 'active' : ''
                  }
                  onClick={() =>
                    setProfile({ ...profile, activityLevel: 'extra_active' })
                  }
                >
                  <strong>Extra Active</strong>
                  <small>Very hard exercise & physical job</small>
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="question">
              <label>What's your goal?</label>
              <div className="button-group">
                <button
                  className={profile.goal === 'lose' ? 'active' : ''}
                  onClick={() => setProfile({ ...profile, goal: 'lose' })}
                >
                  <strong>Lose Weight</strong>
                  <small>-0.5kg/week</small>
                </button>
                <button
                  className={profile.goal === 'maintain' ? 'active' : ''}
                  onClick={() => setProfile({ ...profile, goal: 'maintain' })}
                >
                  <strong>Maintain</strong>
                  <small>Stay current</small>
                </button>
                <button
                  className={profile.goal === 'gain' ? 'active' : ''}
                  onClick={() => setProfile({ ...profile, goal: 'gain' })}
                >
                  <strong>Gain Weight</strong>
                  <small>Build muscle</small>
                </button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="question">
              <label htmlFor="location">Where are you located?</label>
              <input
                id="location"
                type="text"
                placeholder="Enter your city/country"
                value={profile.location || ''}
                onChange={(e) =>
                  setProfile({ ...profile, location: e.target.value })
                }
              />
            </div>
          )}

          {step === 8 && (
            <div className="question">
              <label>What foods do you prefer?</label>
              <small className="hint">Select all that apply</small>
              <div className="checkbox-grid">
                {foodOptions.map((food) => (
                  <label key={food} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profile.foodPreferences?.includes(food)}
                      onChange={() =>
                        setProfile({
                          ...profile,
                          foodPreferences: toggleSelection(
                            profile.foodPreferences || [],
                            food
                          ),
                        })
                      }
                    />
                    {food}
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="question">
              <label>Any dietary restrictions?</label>
              <small className="hint">Select all that apply</small>
              <div className="checkbox-grid">
                {dietaryOptions.map((restriction) => (
                  <label key={restriction} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profile.dietaryRestrictions?.includes(
                        restriction
                      )}
                      onChange={() =>
                        setProfile({
                          ...profile,
                          dietaryRestrictions: toggleSelection(
                            profile.dietaryRestrictions || [],
                            restriction
                          ),
                        })
                      }
                    />
                    {restriction}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="navigation-buttons">
          {step > 1 && (
            <button className="btn-secondary" onClick={handlePrevious}>
              Previous
            </button>
          )}
          {step < 9 ? (
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              Next
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={!isStepValid()}
            >
              Complete Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;
