const fs = require('fs');

let ret = [];

try {
  // read contents of the file
  const data = fs.readFileSync('handle.txt', 'UTF-8');

  // split the contents by new line
  const lines = data.split(/\r?\n/);

  // print all lines
  lines.forEach((line) => {
    ret.push({
      label: line.replace(/<option value=".+">|<\/option>/g, ''),
      value: line.replace(/<option value="|">.+<\/option>/g, ''),
    });
  });
  fs.writeFileSync('ret.json', JSON.stringify(ret));
} catch (err) {
  console.error(err);
}
