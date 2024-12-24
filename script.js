// Initial game variables
let xp = 0; // Experience points
let health = 100; // Health of the player
let gold = 50; // Gold the player has
let currentWeapon = 0; // Index for the player's current weapon
let fighting; // The current monster being fought
let monsterHealth; // The health of the monster
let inventory = ["stick"]; // The player's inventory containing the stick initially

// DOM element references for UI interaction
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Array of weapons, each with a name and power
const weapons = [
  { name: "stick", power: 5 },
  { name: "dagger", power: 30 },
  { name: "claw hammer", power: 50 },
  { name: "sword", power: 100 },
];

// Array of monsters with name, level, and health
const monsters = [
  {
    name: "slime",
    level: 2,
    health: 15,
  },
  {
    name: "fanged beast",
    level: 8,
    health: 60,
  },
  {
    name: "dragon",
    level: 20,
    health: 300,
  },
];

// Locations in the game
const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You are in the town square. You see a sign that says "Store".',
  },
  {
    name: "store",
    "button text": [
      "Buy 10 health (10 gold)",
      "Buy weapon (30 gold)",
      "Go to town square",
    ],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
  },
  {
    name: "cave",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the cave. You see some monsters.",
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
  },
  {
    name: "kill monster",
    "button text": [
      "Go to town square",
      "Go to town square",
      "Go to town square",
    ],
    "button functions": [goTown, goTown, goTown],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;",
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the dragon! YOU WIN THE GAME! &#x1F389;",
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
  },
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

// Update the game UI based on the current location
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text; // Set text in the game
}

// Navigate to town square
function goTown() {
  update(locations[0]);
}

// Navigate to the store
function goStore() {
  update(locations[1]);
}

// Navigate to the cave
function goCave() {
  update(locations[2]);
}

// Buy health from the store
function buyHealth() {
  if (gold >= 10) {
    // Check if the player has enough gold
    gold -= 10;
    health += 10; // Increase health
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

// Buy a weapon from the store
function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    // Check if the player can buy a better weapon
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++; // Upgrade to a new weapon
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon); // Add the new weapon to the inventory
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold"; // Option to sell the current weapon
    button2.onclick = sellWeapon;
  }
}

// Sell a weapon from the inventory
function sellWeapon() {
  if (inventory.length > 1) {
    // Ensure the player doesn't sell their only weapon
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

// Start fighting the slime
function fightSlime() {
  fighting = 0; // Set current monster as slime
  goFight(); // Start the fight
}

// Start fighting the fanged beast
function fightBeast() {
  fighting = 1; // Set current monster as fanged beast
  goFight(); // Start the fight
}

// Start fighting the dragon
function fightDragon() {
  fighting = 2; // Set current monster as dragon
  goFight(); // Start the fight
}

// Prepare for a fight by showing monster stats
function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health; // Set the monster's health
  monsterStats.style.display = "block"; // Display monster stats
  monsterName.innerText = monsters[fighting].name; // Set the monster's name
  monsterHealthText.innerText = monsterHealth; // Set the monster's health in the UI
}

// Perform an attack during a fight
function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText +=
    " You attack it with your " + weapons[currentWeapon].name + ".";
  // Subtract health based on the monster's attack value
  health -= getMonsterAttackValue(monsters[fighting].level);

  // Check if the player's attack hits
  if (isMonsterHit()) {
    monsterHealth -=
      weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  } else {
    text.innerText += " You miss."; // Missed attack
  }

  // Update the health and monster's health
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;

  // Check for losing or defeating the monster
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame(); // Win the game if the dragon is defeated
    } else {
      defeatMonster(); // Defeat other monsters
    }
  }

  // Random chance of the weapon breaking
  if (Math.random() <= 0.1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--; // Reduce the weapon index
  }
}

// Calculate the monster's attack value
function getMonsterAttackValue(level) {
  const hit = level * 5 - Math.floor(Math.random() * xp);
  console.log(hit);
  return hit > 0 ? hit : 0; // Ensure the attack value is not negative
}

// Determine if the player's attack hits the monster
function isMonsterHit() {
  return Math.random() > 0.2 || health < 20;
}

// Perform a dodge action
function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

// Handle the case when the player defeats a monster
function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7); // Calculate gold based on monster level
  xp += monsters[fighting].level; // Add XP based on monster level
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]); // Go to the 'kill monster' location
}

// Handle the case when the player loses the game
function lose() {
  update(locations[5]); // Show the 'lose' location
}

// Handle the case when the player wins the game
function winGame() {
  update(locations[6]); // Show the 'win' location
}

// Restart the game after a loss or win
function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown(); // Go to the town square
}

// Handle the easter egg
function easterEgg() {
  update(locations[7]);
}

// Handle picking a number in the secret game
function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

// Function to pick a random number and check if the player wins or loses
function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}
