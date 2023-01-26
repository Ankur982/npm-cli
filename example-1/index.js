const { Command } = require('commander');
const program = new Command();


program.argument("<name>","name to print")
.argument("[number]","number of time to print", 1)

.action(function(name, number) {
    for(let i=0;i<number;i++) {
        console.log(name)
    }
})

// program.argument("<username>","user login details")
// .argument("[password]","user password for user, if needed", "default")

// .action(function(username, password) {
//     console.log("username",username)
//     console.log("password",password)
// })

program.parse(process.argv);






// const QRCode = require("qrcode");

// QRCode.toString('I am a pony!',{type:'terminal'}, function (err, url) {
//     console.log(url)
//   })
