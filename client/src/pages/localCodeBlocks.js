const codeBlocks = [
    {
      title: "Reverse a String",
      solution: `function reverse(str) {
    return str.split('').reverse().join('');
  }`
    },
    {
      title: "Check for Palindrome",
      solution: `function isPalindrome(str) {
    const reversed = str.split('').reverse().join('');
    return str === reversed;
  }`
    },
    {
      title: "Find Max Number in Array",
      solution: `function findMax(arr) {
    return Math.max(...arr);
  }`
    },
    {
      title: "Capitalize First Letters",
      solution: `function capitalize(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }`
    },
    {
      title: "Count Vowels",
      solution: `function countVowels(str) {
    const vowels = 'aeiou';
    return str.toLowerCase().split('').filter(char => vowels.includes(char)).length;
  }`
    },
    {
      title: "Find Duplicates",
      solution: `function findDuplicates(arr) {
    return arr.filter((item, index) => arr.indexOf(item) !== index);
  }`
    },
    {
      title: "Flatten Array",
      solution: `function flattenArray(arr) {
    return arr.flat(Infinity);
  }`
    },
    {
      title: "Check Prime Number",
      solution: `function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  }`
    },
    {
      title: "Find Missing Number",
      solution: `function findMissingNumber(arr) {
    const n = arr.length + 1;
    const expectedSum = (n * (n + 1)) / 2;
    const actualSum = arr.reduce((sum, num) => sum + num, 0);
    return expectedSum - actualSum;
  }`
    },
    {
      title: "Check Balanced Parentheses",
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
  }`
    }
  ];
  
  export default codeBlocks;
  