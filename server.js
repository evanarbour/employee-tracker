// modules needed
const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const PORT = process.env.PORT || 3001;

// create connection of database and server.js
const db = mysql.createConnection(
    {
        host: 'localhost',
        database: 'company_db',
        user: 'root',
        password: 'Tiber121!'
        
    },
    console.log(`Connected to the company_db database on port ${PORT}.`)
);

// initial prompt 
const startPrompt = () => {
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

// View All Employees
const viewAllEmployees = () => {
    db.query(`SELECT employee.id, 
            employee.first_name, 
            employee.last_name, 
            roles.title, 
            roles.salary, 
            department.title AS 'department'
            FROM employee, roles, department
            WHERE department.id = roles.department_id 
            AND roles.id = employee.roles_id`, 
    (err, res) => {
       if (err) {
           console.log(err);
        }
       console.table(res);
       startPrompt();
    });
};

// View All Roles 
const viewAllRoles = () => {
    db.query(`SELECT employee.first_name, 
            employee.last_name, 
            roles.title AS role FROM employee 
            JOIN roles ON employee.roles_id = roles.id`, 
    (err, res) => {
        if (err) {
            console.log(err);
         }
        console.table(res);
        startPrompt();
    });
};
// View All Departments
const viewAllDepartments = () => {
    db.query(`SELECT employee.first_name,
            employee.last_name, 
            department.title AS department FROM employee
            JOIN roles on employee.roles_id = roles.id
            JOIN department on roles.department_id = department.id`,
    (err, res) => {
        if (err) {
            console.log(err);
            }
        console.table(res);
        startPrompt();
    });
};


// initialize CLI prompt
startPrompt();
