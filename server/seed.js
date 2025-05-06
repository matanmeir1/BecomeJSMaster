require('dotenv').config();
const { connectToMongo, getDb, closeConnection } = require('./db');

const codeBlocks = [
  {
    title: "Reverse a String",
    difficulty: "easy",
    template: "// Write your code here",
    solution: `function reverse(str) {
  return str.split('').reverse().join('');
}`,
    hints: [
      "Use the reverse() function",
      "Don't forget to split and join"
    ]
  },
  {
    title: "Check for Palindrome",
    difficulty: "easy",
    template: "// Write your code here",
    solution: `function isPalindrome(str) {
  const reversed = str.split('').reverse().join('');
  return str === reversed;
}`,
    hints: [
      "You can use the same reverse logic from the previous exercise",
      "Compare the original string with the reversed one"
    ]
  },
  {
    title: "Find Max Number in Array",
    difficulty: "easy",
    template: "// Write your code here",
    solution: `function findMax(arr) {
  return Math.max(...arr);
}`,
    hints: [
      "Math.max() can help you find the maximum value",
      "You can use the spread operator (...) to pass array elements as arguments"
    ]
  },
  {
    title: "Capitalize First Letters",
    difficulty: "easy",
    template: "// Write your code here",
    solution: `function capitalize(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}`,
    hints: [
      "Split the string into words first",
      "Use charAt(0) to get the first letter and toUpperCase() to capitalize it"
    ]
  },
  {
    title: "Count Vowels",
    difficulty: "easy",
    template: "// Write your code here",
    solution: `function countVowels(str) {
  const vowels = 'aeiou';
  return str.toLowerCase().split('').filter(char => vowels.includes(char)).length;
}`,
    hints: [
      "Create a string of vowels to check against",
      "Use filter() to count only vowel characters"
    ]
  },
  {
    title: "Find Duplicates",
    difficulty: "medium",
    template: "// Write your code here",
    solution: `function findDuplicates(arr) {
  return arr.filter((item, index) => arr.indexOf(item) !== index);
}`,
    hints: [
      "Use filter() to check if an item appears more than once",
      "indexOf() can help you find the first occurrence of an item"
    ]
  },
  {
    title: "Flatten Array",
    difficulty: "medium",
    template: "// Write your code here",
    solution: `function flattenArray(arr) {
  return arr.flat(Infinity);
}`,
    hints: [
      "The flat() method can help you flatten nested arrays",
      "Use Infinity to flatten arrays of any depth"
    ]
  },
  {
    title: "Check Prime Number",
    difficulty: "medium",
    template: "// Write your code here",
    solution: `function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}`,
    hints: [
      "A prime number is only divisible by 1 and itself",
      "You only need to check divisors up to the square root of the number"
    ]
  },
  {
    title: "Find Missing Number",
    difficulty: "medium",
    template: "// Write your code here",
    solution: `function findMissingNumber(arr) {
  const n = arr.length + 1;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = arr.reduce((sum, num) => sum + num, 0);
  return expectedSum - actualSum;
}`,
    hints: [
      "Use the formula n*(n+1)/2 to find the expected sum",
      "Subtract the actual sum from the expected sum to find the missing number"
    ]
  },
  {
    title: "Check Balanced Parentheses",
    difficulty: "hard",
    template: "// Write your code here",
    solution: `function isBalanced(str) {
  const stack = [];
  const pairs = { '(': ')', '[': ']', '{': '}' };
  
  for (let char of str) {
    if (pairs[char]) {
      stack.push(char);
    } else if (Object.values(pairs).includes(char)) {
      if (pairs[stack.pop()] !== char) return false;
    }
  }
  
  return stack.length === 0;
}`,
    hints: [
      "Use a stack to keep track of opening brackets",
      "When you find a closing bracket, check if it matches the last opening bracket"
    ]
  }
];

async function seed() {
  try {
    await connectToMongo();
    const db = getDb();
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await db.collection('codeblocks').deleteMany({});
    console.log('Cleared existing code blocks');

    // Insert new data
    await db.collection('codeblocks').insertMany(codeBlocks);
    console.log('Seeded code blocks successfully');

    await closeConnection();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed(); 