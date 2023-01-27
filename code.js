// 1st way

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let accounts = {};

rl.question('Enter command: ', (input) => {
    let inputArr = input.split(' ');
    let command = inputArr[0].toUpperCase();
    let code = inputArr[1];
    let name, amount;

    switch(command) {
        case 'CREATE':
            name = inputArr[2];
            accounts[code] = {
                name: name,
                balance: 0
            };
            console.log(`Account ${code} has been created for ${name} with a balance of $0.`);
            break;
        case 'DEPOSIT':
            amount = parseFloat(inputArr[2]);
            if (accounts[code]) {
                accounts[code].balance += amount;
                console.log(`$ ${amount} has been deposited to ${accounts[code].name}'s account.`);
            } else {
                console.log(`Account ${code} does not exist.`);
            }
            break;
        case 'WITHDRAW':
            amount = parseFloat(inputArr[2]);
            if (accounts[code]) {
                if (amount > accounts[code].balance) {
                    console.log(`Insufficient balance to withdraw $ ${amount} from ${accounts[code].name}'s account.`);
                } else {
                    accounts[code].balance -= amount;
                    console.log(`$ ${amount} has been withdrawn from ${accounts[code].name}'s account.`);
                }
            } else {
                console.log(`Account ${code} does not exist.`);
            }
            break;
        case 'BALANCE':
            if (accounts[code]) {
                console.log(`${accounts[code].name}'s account balance is $ ${accounts[code].balance}.`);
            } else {
                console.log(`Account ${code} does not exist.`);
            }
            break;
        default:
            console.log('Invalid command.');
    }
    rl.close();
});

//This code uses the readline module to accept input from the command line, and a switch statement to handle the different commands (CREATE, DEPOSIT, WITHDRAW, BALANCE). A global variable "accounts" is used to store the account information (account number, account holder name, and balance). The code also checks for invalid commands and insufficient balance when withdrawing funds.

// Note: Here the data is stored in memory and not stored in any persistent data source like a database.


//way 2 

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


// This code is an example of how you could implement the requirements using JavaScript and the sqlite3 library for storing data in a local SQLite database. It uses the readline-sync library to prompt the user for input and the sqlite3 library to interact with the database.



//way-3

// Here is an example of a simple JavaScript CLI bank application that uses a NoSQL database (MongoDB) to store and retrieve account data:

const mongoose = require('mongoose');
const readline = require('readline');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/bank', { useNewUrlParser: true });

// Define Account schema
const accountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
});

// Compile model from schema
const Account = mongoose.model('Account', accountSchema);

// Initialize readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to handle user commands
function handleCommand(line) {
    const parts = line.split(' ');
    const command = parts[0];
    const code = parts[1];
    const name = parts[2];
    const amount = parts[3];

    switch (command) {
        case 'CREATE':
            // Create new account
            const newAccount = new Account({ code, name });
            newAccount.save((err) => {
                if (err) {
                    console.log(`Error creating account: ${err}`);
                } else {
                    console.log(`Account ${code} created for ${name} with initial balance of 0.`);
                }
            });
            break;
        case 'DEPOSIT':
            // Deposit amount to account
            Account.findOneAndUpdate({ code }, { $inc: { balance: amount } }, (err) => {
                if (err) {
                    console.log(`Error depositing amount: ${err}`);
                } else {
                    console.log(`Deposited ${amount} to account ${code}.`);
                }
            });
            break;
        case 'WITHDRAW':
            // Withdraw amount from account
            Account.findOne({ code }, (err, account) => {
                if (err) {
                    console.log(`Error withdrawing amount: ${err}`);
                } else if (!account) {
                    console.log(`Account ${code} not found.`);
                } else if (account.balance < amount) {
                    console.log(`Insufficient balance in account ${code}.`);
                } else {
                    Account.findOneAndUpdate({ code }, { $inc: { balance: -amount } }, (err) => {
                        if (err) {
                            console.log(`Error withdrawing amount: ${err}`);
                        } else {
                            console.log(`Withdrew ${amount} from account ${code}.`);
                        }
                    });
                }
            });
            break;
        case 'BALANCE':
            // Show account balance
            Account.findOne({ code }, (err, account) => {
                if (err) {
                    console.log(`Error showing balance: ${err}`);
                }