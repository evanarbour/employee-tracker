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
        password: 'super-secure-password!'
        
    },
    console.log(`Connected to the company_db database on port ${PORT}.`),
    console.log("\n"),
    console.log("************************************"),
    console.log("*                                  *"),
    console.log("*   EMPLOYEE MANAGEMENT DATABASE   *"),
    console.log("*                                  *"),
    console.log("************************************"),
    console.log("\n")
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
            'Add Department',
            'View Department Budget'
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

            case 'View Department Budget':
                viewDepartmentBudget();
            break;
        };
    });
};


// 
// 
// View All Employees
const viewAllEmployees = () => {
    db.query(`SELECT employee.id, 
            employee.first_name, 
            employee.last_name, 
            roles.title, 
            roles.salary, 
            department.title AS 'department',
            CONCAT(e.first_name, ' ',e.last_name) AS manager FROM employee
            INNER JOIN roles ON roles.id = employee.roles_id 
            INNER JOIN department ON department.id = roles.department_id
            LEFT JOIN employee e ON employee.manager_id = e.id
            ORDER BY employee.id`, 
    (err, res) => {
       if (err) {
           console.log(err);Í
        }
       console.table(res);
       startPrompt();
    });
};

// View All Roles 
const viewAllRoles = () => {
    db.query(`SELECT roles.id, roles.title, roles.salary, department.title AS 'department' FROM roles
            JOIN department ON department.id = roles.department_id
            ORDER BY roles.id`, 
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
    db.query(`SELECT * FROM department`,
    (err, res) => {
        if (err) {
            console.log(err);
            }
        console.table(res);
        startPrompt();
    });
};

// Add Employee

// Because roles are a dynamic component of the CLI - the user can update/add data - we need access via an array

// create roleArray via selectRole()
var roleArray = [];
function selectRole() {
    db.query(`SELECT roles.title FROM roles`, 
    (err, res) => {
        if (err) {
            console.log(err);
            }
        for (var i = 0; i < res.length; i++) {
            roleArray.push(res[i].title);
        }
    })
    return roleArray;
};

const addEmployee = () => {
    db.query(`SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL`, 
    (err, res) => {
        const managerChoices = res.map(({id, first_name, last_name }) => ({name: `${first_name} ${last_name}`, value: id}));
    
    inquirer.prompt([
    {
        name: "firstName",
        type: "input",
        message: "Enter Employee's First Name:"

    }, {

        name: "lastName",
        type: "input", 
        message: "Enter Employee's Last Name:"

    }, {

        name: "role", 
        message: "Please choose Employee's Role:",
        type: "list",
        choices:
            selectRole()
    }, {

        name: 'manager',
        message: "Please Choose Employee's Manager:",
        type: "list", 
        choices: managerChoices
            
    }
    ]).then((val) => {
        let roleId = selectRole().indexOf(val.role) +1
        // let managerId = selectManager().indexOf(val.manager)
        db.query(`INSERT INTO employee SET ?`,
        {
            first_name: val.firstName,
            last_name: val.lastName,
            roles_id: roleId,
            manager_id: val.manager,
        
        })
        console.log('Employee successfully added!')
        startPrompt()
    }).catch((err) => {
        console.log(err)
    })
})
};

// Add Role
const addRole = () => {
    db.query(`SELECT department.title, department.id FROM department`, 
    (err, res) => {
        const departmentChoices = res.map(({ title, id }) => ({ name: title, value: id }));
        inquirer.prompt([
            {
                name: "Title", 
                type: "input",
                message: "Enter name of the new role:"
            }, 
            {
                name: "Salary",
                type: "input", 
                message: "Enter role salary:"
            }, 
            {
                name: "department",
                type: "list",
                message: "Choose department for the role:",
                choices: departmentChoices
            }
        ]).then((res) => {
            db.query(`INSERT INTO roles SET ?`, 
            {
                title: res.Title,
                salary: res.Salary,
                department_id: res.department,
            },
            (err, res) => {
                if (err) console.log(err)
                console.log('Role successfully created!');
                startPrompt();
            }
            )
        });
    });
};

// add Department
const addDepartment = () => {
    inquirer.prompt([
        {
            name: "name", 
            type: "input", 
            message: "Enter department name:",

        }
    ]).then((val) => {

        db.query(`INSERT INTO department SET ?`, 
            {
                title: val.name
            },
            (err, res) => {
                if (err) console.log(err)
                console.log('Department successfully created!');
                startPrompt();
            }
        
        );
    });

};

// update Employee Role
const updateEmployeeRole = () => {
    db.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.title FROM employee 
            JOIN roles ON employee.roles_id = roles.id`, (err, res) => {
                const employeeChoices = res.map(({id, first_name, last_name}) => ({name: `${first_name} ${last_name}`, value: id}));   
                inquirer.prompt([
                    {
                        name: "nameChoice",
                        type: "list",
                        message: "Choose Employee:",
                        choices: employeeChoices
                    },
                    {
                        name: "role", 
                        type: "list", 
                        message: "Enter Employee's new role:",
                        choices: selectRole()
                    }
    ]).then((val) => {
        let roleId = selectRole().indexOf(val.role) +1
        db.query(`UPDATE employee SET roles_id = ${roleId} WHERE id = ${val.nameChoice}`, 
            (err,res) => {
                if (err) console.log(err)
                console.log('Employee update: successful!')
                startPrompt();
            }
                    
        )
     });
    });
};
// view Budget
const viewDepartmentBudget = () => {
    db.query(`SELECT department.id AS id,
            department.title AS department,
            SUM(salary) AS budget
            FROM roles
            JOIN department ON roles.department_id = department.id
            GROUP BY roles.department_id`, 
        (err,res) => {
            if (err) console.log(err)
            console.table(res)
            startPrompt();
            });
};

// initialize CLI prompt
startPrompt();
