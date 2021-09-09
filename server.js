// modules needed
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// create connection of database and server.js
const db = mysql.createConnection(
    {
        host: 'localhost',
        port: 3001,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    },
    console.log('Connected to the company_db database.')
);

// initial prompt 
function startPrompt() {
    inquirer.prompt([
    {
        type: 'list', 
        message: 'What would you like to do?',
        name: 'initial',
        choices: [
            'View All Employees', 
            'Add Employee', 
            'Update Employee Role', 
            'View All Roles', 
            'Add Role', 
            'View All Departments', 
            'Add Department'
        ]
    }]).then((val) => {
        // using a switch statement to handle the different outcomes based on user input
        switch (val.initial) {
            case 'View All Employees':
                viewAllEmployees();
            break;

            case 'Add Employee':
                addEmployee();
            break;

            case 'Update Employee Role':
                updateEmployeeRole();
            break;

            case 'View All Roles':
                viewAllRoles();
            break;

            case 'Add Role':
                addRole();
            break;

            case 'View All Departments':
                viewAllDepartments();
            break;

            case 'Add Department':
                addDepartment();
            break;
        };
    });
};

// 



startPrompt();
