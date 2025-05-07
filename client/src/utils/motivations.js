// ───── MOTIVATIONAL PHRASES ─────
const motivations = [
  "Every line of code is a step towards mastery!",
  "Your code today shapes your skills tomorrow!",
  "Debugging is just problem-solving in disguise!",
  "The best code is the code you write with passion!",
  "Every challenge is an opportunity to grow!",
  "Your potential is limitless in the world of code!",
  "Small steps in coding lead to giant leaps in learning!",
  "Every bug you fix makes you a stronger developer!",
  "The code you write today builds your future!",
  "Your journey to coding excellence continues!"
];

// ───── RANDOM SELECTOR FUNCTION ─────
// Returns a random motivational string from the list
export function getRandomMotivation() {
  const randomIndex = Math.floor(Math.random() * motivations.length);
  return motivations[randomIndex];
}
