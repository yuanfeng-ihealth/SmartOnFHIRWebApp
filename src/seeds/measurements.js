import moment from 'moment';

const Measurements = [
  {
    type: "Blood Glucose",
    date: moment(),
    breakfast: [{reading: 5, unit: 'mmol/L', beforeMeal: true}, {reading: 11, unit: 'mmol/L', beforeMeal: false}],
    // lunch: [{reading: 2.2, unit: 'mmol/L', beforeMeal: true}, {reading: 3.0, unit: 'mmol/L', beforeMeal: false}],
    // dinner: [{reading: 2.4, unit: 'mmol/L', beforeMeal: true}, {reading: 3.1, unit: 'mmol/L', beforeMeal: false}]
  },
  {
    type: "Blood Glucose",
    date: moment().subtract(1, 'days'),
    breakfast: [{reading: 4.9, unit: 'mmol/L', beforeMeal: true}, {reading: 10.3, unit: 'mmol/L', beforeMeal: false}],
    lunch: [{reading: 4.6, unit: 'mmol/L', beforeMeal: true}, {reading: 1.8, unit: 'mmol/L', beforeMeal: false}],
    // dinner: [{reading: 2.4, unit: 'mmol/L', beforeMeal: true}, {reading: 3.1, unit: 'mmol/L', beforeMeal: false}]
  },
  {
    type: "Blood Glucose",
    date: moment().subtract(2, 'days'),
    breakfast: [{reading: 5.2, unit: 'mmol/L', beforeMeal: true}, {reading: 12, unit: 'mmol/L', beforeMeal: false}],
    lunch: [{reading: 5.4, unit: 'mmol/L', beforeMeal: true}, {reading: 11.7, unit: 'mmol/L', beforeMeal: false}],
    dinner: [{reading: 4.6, unit: 'mmol/L', beforeMeal: true}, {reading: 10.8, unit: 'mmol/L', beforeMeal: false}]
  },
  {
    type: "Blood Glucose",
    date: moment().subtract(3, 'days'),
    breakfast: [{reading: 4.4, unit: 'mmol/L', beforeMeal: true}, {reading: 10.8, unit: 'mmol/L', beforeMeal: false}],
    lunch: [{reading: 4.6, unit: 'mmol/L', beforeMeal: true}, {reading: 11.4, unit: 'mmol/L', beforeMeal: false}],
    dinner: [{reading: 4.5, unit: 'mmol/L', beforeMeal: true}, {reading: 11.1, unit: 'mmol/L', beforeMeal: false}]
  },
  {
    type: "Blood Glucose",
    date: moment().subtract(4, 'days'),
    // breakfast: [{reading: 2.5, unit: 'mmol/L', beforeMeal: true}, {reading: 3.2, unit: 'mmol/L', beforeMeal: false}],
    lunch: [{reading: 4.9, unit: 'mmol/L', beforeMeal: true}, {reading: 10.1, unit: 'mmol/L', beforeMeal: false}],
    dinner: [{reading: 5.2, unit: 'mmol/L', beforeMeal: true}, {reading: 10.3, unit: 'mmol/L', beforeMeal: false}]
  },
  {
    type: "Blood Glucose",
    date: moment().subtract(5, 'days'),
    // breakfast: [{reading: 2.5, unit: 'mmol/L', beforeMeal: true}, {reading: 3.2, unit: 'mmol/L', beforeMeal: false}],
      // lunch: [{reading: 2.2, unit: 'mmol/L', beforeMeal: true}, {reading: 3.0, unit: 'mmol/L', beforeMeal: false}],
      dinner: [{reading: 2.4, unit: 'mmol/L', beforeMeal: true}, {reading: 3.1, unit: 'mmol/L', beforeMeal: false}]
  },
  {
    type: "Blood Glucose",
    date: moment().subtract(6, 'days'),
    // breakfast: [{reading: 2.5, unit: 'mmol/L', beforeMeal: true}, {reading: 3.2, unit: 'mmol/L', beforeMeal: false}],
    // lunch: [{reading: 2.2, unit: 'mmol/L', beforeMeal: true}, {reading: 3.0, unit: 'mmol/L', beforeMeal: false}],
    // dinner: [{reading: 2.4, unit: 'mmol/L', beforeMeal: true}, {reading: 3.1, unit: 'mmol/L', beforeMeal: false}]
  },
  {
    type: "Blood Pressure",
    date: moment(),
    // overnight: {systolic: 119, diastolic: 2.5, unit: 'mmHg'},
    // morning: {systolic: 119, diastolic: 2.5, unit: 'mmHg'},
    // afternoon: {systolic: 119, diastolic: 2.5, unit: 'mmHg'},
    // evening: {systolic: 119, diastolic: 2.5, unit: 'mmHg'}
  },
  {
    type: "Blood Pressure",
    date: moment().subtract(1, 'days'),
    // overnight: {systolic: 119, diastolic: 2.5, unit: 'mmHg', beat: 80},
    morning: {systolic: 119, diastolic: 77, unit: 'mmHg', beat: 79},
    // afternoon: {systolic: 119, diastolic: 2.5, unit: 'mmHg', beat: 79},
    evening: {systolic: 121, diastolic: 79, unit: 'mmHg', beat: 84}
  },
  {
    type: "Blood Pressure",
    date: moment().subtract(2, 'days'),
    overnight: {systolic: 118, diastolic: 77, unit: 'mmHg', beat: 76},
    morning: {systolic: 117, diastolic: 80, unit: 'mmHg', beat: 85},
    // afternoon: {systolic: 119, diastolic: 2.5, unit: 'mmHg', beat: 79},
    evening: {systolic: 124, diastolic: 78, unit: 'mmHg', beat: 83}
  },
  {
    type: "Blood Pressure",
    date: moment().subtract(3, 'days'),
    // overnight: {systolic: 119, diastolic: 2.5, unit: 'mmHg', beat: 79},
    morning: {systolic: 125, diastolic: 85, unit: 'mmHg', beat: 95},
    // afternoon: {systolic: 119, diastolic: 2.5, unit: 'mmHg', beat: 79},
    evening: {systolic: 119, diastolic: 74, unit: 'mmHg', beat: 84}
  },
  {
    type: "Blood Pressure",
    date: moment().subtract(4, 'days'),
    // overnight: {systolic: 119, diastolic: 2.5, unit: 'mmHg', beat: 79},
    morning: {systolic: 122, diastolic: 77, unit: 'mmHg', beat: 79},
    afternoon: {systolic: 121, diastolic: 74, unit: 'mmHg', beat: 80},
    evening: {systolic: 117, diastolic: 72, unit: 'mmHg', beat: 82}
  },
  {
    type: "Blood Pressure",
    date: moment().subtract(5, 'days'),
  // overnight: {systolic: 119, diastolic: 2.5, unit: 'mmHg', beat: 79},
    morning: {systolic: 124, diastolic: 74, unit: 'mmHg', beat: 99},
    // afternoon: {systolic: 119, diastolic: 2.5, unit: 'mmHg', beat: 79},
    evening: {systolic: 122, diastolic: 76, unit: 'mmHg', beat: 82}
  },
  {
    type: "Blood Pressure",
    date: moment().subtract(6, 'days'),
    // overnight: {systolic: 119, diastolic: 2.5, unit: 'mmHg', beat: 79},
    morning: {systolic: 126, diastolic: 80, unit: 'mmHg', beat: 84},
    // afternoon: {systolic: 119, diastolic: 2.5, unit: 'mmHg', beat: 79},
    evening: {systolic: 124, diastolic: 77, unit: 'mmHg', beat: 81}
  }
]

export default Measurements;