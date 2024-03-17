const express = require('express');
const { validationResult } = require('express-validator');
const app = express();

// Function to calculate mean
function calculateMean(numbers) {
  const sum = numbers.reduce((acc, num) => acc + parseFloat(num), 0);
  return sum / numbers.length;
}

// Function to calculate median
function calculateMedian(numbers) {
  const sortedNumbers = numbers.map(num => parseFloat(num)).sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedNumbers.length / 2);

  if (sortedNumbers.length % 2 === 0) {
    return (sortedNumbers[middleIndex - 1] + sortedNumbers[middleIndex]) / 2;
  } else {
    return sortedNumbers[middleIndex];
  }
}

// Function to calculate mode
function calculateMode(numbers) {
  const frequencyMap = {};
  numbers.forEach(num => {
    const key = parseFloat(num);
    frequencyMap[key] = (frequencyMap[key] || 0) + 1;
  });

  let mode;
  let maxFrequency = 0;

  Object.keys(frequencyMap).forEach(key => {
    const frequency = frequencyMap[key];
    if (frequency > maxFrequency) {
      mode = parseFloat(key);
      maxFrequency = frequency;
    }
  });

  return mode;
}

// Validation middleware
const validateInput = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

// Route for mean calculation
app.get('/mean', [
  // Validation check for nums parameter
  express-validator.query('nums').notEmpty().withMessage('nums are required'),
  // Validation check for each number in nums
  express-validator.query('nums').custom(nums => {
    const numbers = nums.split(',');
    const invalidNumbers = numbers.filter(num => isNaN(parseFloat(num)));
    if (invalidNumbers.length > 0) {
      throw new Error(`${invalidNumbers.join(', ')} is not a number`);
    }
    return true;
  }),
  validateInput,
], (req, res) => {
  const nums = req.query.nums.split(',');
  const mean = calculateMean(nums);
  res.send(`Mean: ${mean}`);
});

// Route for median calculation
app.get('/median', [
  express-validator.query('nums').notEmpty().withMessage('nums are required'),
  express-validator.query('nums').custom(nums => {
    const numbers = nums.split(',');
    const invalidNumbers = numbers.filter(num => isNaN(parseFloat(num)));
    if (invalidNumbers.length > 0) {
      throw new Error(`${invalidNumbers.join(', ')} is not a number`);
    }
    return true;
  }),
  validateInput,
], (req, res) => {
  const nums = req.query.nums.split(',');
  const median = calculateMedian(nums);
  res.send(`Median: ${median}`);
});

// Route for mode calculation
app.get('/mode', [
  express-validator.query('nums').notEmpty().withMessage('nums are required'),
  express-validator.query('nums').custom(nums => {
    const numbers = nums.split(',');
    const invalidNumbers = numbers.filter(num => isNaN(parseFloat(num)));
    if (invalidNumbers.length > 0) {
      throw new Error(`${invalidNumbers.join(', ')} is not a number`);
    }
    return true;
  }),
  validateInput,
], (req, res) => {
  const nums = req.query.nums.split(',');
  const mode = calculateMode(nums);
  res.send(`Mode: ${mode}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});