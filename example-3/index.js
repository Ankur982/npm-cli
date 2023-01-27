const sqlite3 = require('sqlite3').verbose();
const readline = require('readline-sync');

// Connect to the database
const db = new sqlite3.Database('bank.db');

// Function to create an account
function createAccount(code, name) {
    db.run(`INSERT INTO accounts (code, name, balance) VALUES ('${code}', '${name}', 0)`);
    console.log(`Account ${code} (${name}) has been created with a balance of 0.`);
}

// Function to deposit money
function deposit(code, amount) {
    db.run(`UPDATE accounts SET balance = balance + ${amount} WHERE code = '${code}'`);
    console.log(`${amount} has been added to account ${code}.`);
}

// Function to withdraw money
function withdraw(code, amount) {
    db.run(`UPDATE accounts SET balance = balance - ${amount} WHERE code = '${code}'`);
    console.log(`${amount} has been withdrawn from account ${code}.`);
}

// Function to show the balance
function showBalance(code) {
    console.log(code)
    db.get(`SELECT name, balance FROM accounts WHERE code = '${code}'`, (err, row) => {
        if (err) {
            console.log(`Error: ${err.message}`);
        } else {
            console.log(`Account ${code} (${row.name}) has a balance of ${row.balance}.`);
        }
    });
}

// Create the accounts table if it does not exist
db.run(`CREATE TABLE IF NOT EXISTS accounts (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    balance INTEGER NOT NULL
)`);

console.log('Welcome to the CLI Bank Application');

// Main program loop
while (true) {
    let input = readline.question('Enter a command (CREATE, DEPOSIT, WITHDRAW, BALANCE, EXIT): ').split(' ');
    let command = input[0];
    if (command === 'CREATE') {
        let code = input[1];
        let name = input[2];
        createAccount(code, name);
    } else if (command === 'DEPOSIT') {
        let code = input[1];
        let amount = input[2];
        deposit(code, amount);
    } else if (command === 'WITHDRAW') {
        let code = input[1];
        let amount = input[2];
        withdraw(code, amount);
    } else if (command === 'BALANCE') {
        let code = input[1];
        showBalance(code);
    } else if (command === 'EXIT') {
        console.log('Goodbye!');
        break;
    } else {
        console.log('Invalid command');
    }
}

// Close the database connection
db.close();