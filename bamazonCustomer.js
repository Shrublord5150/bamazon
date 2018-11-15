// require needed packages first
var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require('colors');

// create the connection to "bamazon_db" database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password--hide in gitignore/.env
    password: "root",
    database: "bamazon_db"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // console.log connection threadId
    console.log("connected as id ".green + connection.threadId);
    openStore();
  });

//   The app should then prompt users with two messages. ids, names, and prices of products for sale.
function openStore () {
    console.log("\nHere is what Bamazon has for sale".blue.underline)
    connection.query("SELECT * FROM products", function(err, res) {
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        purchase();
      });

}

function purchase () {
    inquirer
    .prompt([
        // prompt first question
        {   
            name: "ID",
            type: "input",
            message: "What is the ID of the item you would like to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                return true;

                } else {
                    console.log('\nPlease enter a valid ID.');
                    return false;
                }
            }

        },
        // prompt second question
        {
            name: "quantity",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;

                } else{
                    console.log("\nPlease enter a valid number.");
                    return false;
                }
            }

        }
    ]).then(function(answers) {
        // set the first prompt answer to a var i
        let i = answers.ID;
        let numberOrdered = answers.quantity;
        
        connection.query('SELECT * FROM products WHERE item_id = ' + i, function(error, res) {
            if ((res[0].stock_quantity - numberOrdered) > 0) {
                
                console.log("Looks like everything is coming up Milhouse \nYour total cost is: " + colors.cyan(numberOrdered * res[0].price) + ".")
                console.log("Thanks for shopping with Bamazon!")
                connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + numberOrdered + ' WHERE item_id = ' + i)
                continueShopping();
            }
             else {
                    console.log("Sorry, your transaction cannot be completed. \nBamazon only has " + colors.red.underline(res[0].stock_quantity) + " " + (res[0].product_name).cyan + " in stock...")
                    continueShopping();
        }
           
    })

        
    });
}

function continueShopping () {
    inquirer
    .prompt([
        // prompt continue shopping question
        {   
            name: "continue",
            type: "input",
            message: "Would you like to continue shopping [YES] or [NO]?",
            choices: ["YES", "NO"]

        },
        ]).then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.continue.toUpperCase() === "YES") {
            openStore();
            }
            else {
            console.log("Thanks again for shopping with Bamazon! \nWe hope to see you again soon!".blue)
            connection.end();
            }
    });

}