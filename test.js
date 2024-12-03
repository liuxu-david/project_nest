const os = require('os');

const homedir = os.homedir();
const name = os.hostname();

console.log(homedir,name);