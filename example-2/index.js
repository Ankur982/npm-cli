const inquirer = require('inquirer');

inquirer
    .prompt([
        /* Pass your questions in here */
        {
            type: "input",
            message: "enter your username",
            name: "username"
        },
        {
            type: "password",
            message: "enter your password",
            mask: "*",
            name: "password"
        },
    ])
    .then((userDetails) => {
        // Use user feedback for... whatever!!
        console.log('welcome back', userDetails.username)

        inquirer.prompt([
            {
                type: "confirm",
                name: "for Delivery",
                message: "Do you want to pizza to be delivered",
                dafault: true
            },
            {
                type: "input",
                name: "phone",
                message: "What is your phone number?",
                validate(value) {
                    const pass = value.length === 10;
                    if (pass) {
                        return true
                    }
                    return "Please enter a valid phone number"
                }
            },

            {

                type: "input",
                name: "gty",
                message: "How many pizza do you want to",
                validate(value){
                    let valid = !isNaN(parseInt(value))

                    return valid || "Please enter a number"
                },
                filter(value){
                    return parseInt(value)
                }

            },
            {
                type: "list",
                name: "toppings",
                message: "Please select your pizza toppings",
                choices: [
                    "panner",
                    "chicken",
                    "corn and cheese"
                ]
            },
            {
                type: "list",
                name: "size",
                message: "Please select your pizza size",
                choices: [
                    "L",
                    "M",
                    "S"
                ]
            }

        ])
        .then(answers=>{
            console.log("Order details are:")
            console.log(answers)
            console.log("username: ", userDetails.username)
        })
    })

    

    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
        } else {
            // Something else went wrong
        }
    });