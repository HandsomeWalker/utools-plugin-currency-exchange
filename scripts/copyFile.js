const fs = require('fs');
const path = require('path');

const files = ['preload.js', 'plugin.json', 'logo.png'];

files.forEach((file) =>
  fs.copyFileSync(path.resolve('./', file), path.resolve('./', 'dist/' + file)),
);
