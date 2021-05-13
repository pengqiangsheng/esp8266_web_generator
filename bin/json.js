let path = "./config.json";
let fs = require('fs');
let plays = JSON.parse(fs.readFileSync(path));
console.log(plays);