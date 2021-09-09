INSERT INTO department (title)
VALUES ("Engineering"),
       ("Finance"), 
       ("Legal"),
       ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES ("Sales Lead", 100000, 4),
       ("Salesperson", 80000, 4), 
       ("Lead Engineer", 150000, 1), 
       ("Software Engineer", 120000, 1),
       ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Legal Team Lead", 250000, 3), 
       ("Lawyer", 190000, 3);

INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Morgan", "Freeman", 1, null),
       ("Alexa", "Chung", 2, 1),
       ("Maria", "Sharapova", 3, null),
       ("Jude", "Law", 4, 3),
       ("Freddie", "Mercury", 5, null),
       ("Eva", "Longoria", 6, 5),
       ("Tom", "Hiddleston", 7, null),
       ("Paul", "Rudd", 8, 7);
