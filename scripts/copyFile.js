const fs = require('fs');
const path = require('path');

const files = ['preload.js', 'plugin.json', 'logo.png'];

files.forEach((file) => {
  if (file === 'plugin.json') {
    const json = fs.readFileSync(file, { encoding: 'utf-8' });
    fs.writeFileSync(
      path.resolve('./', 'dist/' + file),
      json.replace(/"development":\s{\n.+\n.+/gm, ''),
    );
  } else {
    fs.copyFileSync(
      path.resolve('./', file),
      path.resolve('./', 'dist/' + file),
    );
  }
});
