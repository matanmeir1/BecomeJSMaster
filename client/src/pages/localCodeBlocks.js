const codeBlocks = [
    {
      id: "1",
      solution: `function reverse(str) {
    return str.split('').reverse().join('');
  }`
    },
    {
      id: "2",
      solution: `function isPalindrome(str) {
    const reversed = str.split('').reverse().join('');
    return str === reversed;
  }`
    },
    {
      id: "3",
      solution: `function findMax(arr) {
    return Math.max(...arr);
  }`
    },
    {
      id: "4",
      solution: `function capitalize(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }`
    },
    {
      id: "5",
      solution: `function countVowels(str) {
    return (str.match(/[aeiou]/gi) || []).length;
  }`
    },
    {
      id: "6",
      solution: `function fizzBuzz(n) {
    for (let i = 1; i <= n; i++) {
      let out = '';
      if (i % 3 === 0) out += 'Fizz';
      if (i % 5 === 0) out += 'Buzz';
      console.log(out || i);
    }
  }`
    },
    {
      id: "7",
      solution: `function removeDuplicates(arr) {
    return [...new Set(arr)];
  }`
    },
    {
      id: "8",
      solution: `async function fetchData(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  }`
    },
    {
      id: "9",
      solution: `function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }`
    },
    {
      id: "10",
      solution: `class MyPromise {
    constructor(fn) {
      this.success = null;
      fn(this.resolve.bind(this));
    }
  
    then(cb) {
      this.success = cb;
    }
  
    resolve(value) {
      if (this.success) {
        this.success(value);
      }
    }
  }`
    }
  ];
  
  export default codeBlocks;
  