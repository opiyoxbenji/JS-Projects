// Deposit some money
// Determin number of lines to bet on
// Collect a bet amount
// Spin the slot machine
// Check if the user won
// Give the user their winnings
// Play again or quit

const prompt = require('prompt-sync')();

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

deposit();
