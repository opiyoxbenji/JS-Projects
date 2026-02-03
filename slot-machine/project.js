// Slot Machine Game

// Give the user their winnings
// Play again or quit

const prompt = require('prompt-sync')();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
	A: 2,
	B: 4,
	C: 6,
	D: 8,
};

const SYMBOLS_VALUES = {
	A: 5,
	B: 4,
	C: 3,
	D: 2,
};

// Deposit some money
const deposit = () => {
	while (true) {
		const depositAmount = prompt('Enter deposit amount: ');
		const numberDeposited = parseFloat(depositAmount);

		if (isNaN(numberDeposited) || numberDeposited <= 0) {
			console.log('Invalid deposit amount, please try again.');
			return deposit();
		} else {
			console.log(`You have deposited $${numberDeposited.toFixed(2)}`);
			return numberDeposited;
		}
	}
};

// Determin number of lines to bet on
const getNumberOfLines = () => {
	while (true) {
		const lines = prompt('Enter number of lines to bet on (1-3): ');
		const numberOfLines = parseInt(lines);

		if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
			console.log('Invalid number of lines, please try again.');
		} else {
			return numberOfLines;
		}
	}
};

// Collect a bet amount
const getBet = (balance, lines) => {
	while (true) {
		const bet = prompt('Enter bet per line: ');
		const betAmount = parseFloat(bet);

		if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance / lines) {
			console.log('Invalid bet amount, please try again.');
		} else {
			return betAmount;
		}
	}
};

// Spin the slot machine
const spin = () => {
	const symbols = [];
	for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
		for (let i = 0; i < count; i++) {
			symbols.push(symbol);
		}
	}
	const reels = [];
	for (let i = 0; i < COLS; i++) {
		reels.push([]);
		const reelSymbols = [...symbols];
		for (let j = 0; j < ROWS; j++) {
			const randomIndex = Math.floor(Math.random() * reelSymbols.length);
			reels[i].push(reelSymbols[randomIndex]);
			reelSymbols.splice(randomIndex, 1);
		}
	}
	return reels;
};

// Check if the user won
const transpose = reels => {
	const rows = [];
	for (let i = 0; i < ROWS; i++) {
		rows.push([]);
		for (let j = 0; j < COLS; j++) {
			rows[i].push(reels[j][i]);
		}
	}
	return rows;
};

const printRows = (rows) => {
   for (const row of rows) {
       let rowString = '';
       for (const [i, symbol] of row.entries()) {
           rowString += symbol;
           if (i != row.length - 1) {
               rowString += ' | ';
           }
       }
       console.log(rowString);
   }
}

const getWinnings = (rows, bet, lines) => {
   let winnings = 0;
   for (let row = 0; row < lines; row++) {
       const symbols = rows[row];
       let allSame = true;
       for (const symbol of symbols) {
           if (symbol != symbols[0]) {
               allSame = false;
               break;
           }
       }
       if (allSame) {
           winnings += bet * SYMBOLS_VALUES[symbols[0]];
       }
   }
   return winnings;
}

let balance = deposit();
const numberOfLines = getNumberOfLines();
const bet = getBet(balance);
const reels = spin();
const rows = transpose(reels);
console.log(reels);
console.log(rows);
printRows(rows);
const winnings = getWinnings(rows, bet, numberOfLines);
balance += winnings;
console.log(`You won $${winnings.toFixed(2)}. Your balance is $${balance.toFixed(2)}.`);