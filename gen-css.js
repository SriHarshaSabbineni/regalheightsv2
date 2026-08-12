const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

let allStyles = new Set();
let baseCss = '';

files.forEach(file => {
    let content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    let match = content.match(/<style>([\s\S]*?)<\/style>/);
    if (match) {
        let css = match[1];
        // naive combination: just append it if not already there, but it might duplicate a lot.
        // since we just want a master CSS file, let's write it out and we'll manually check it.
        baseCss += '\n/* From ' + file + ' */\n' + css;
    }
});

fs.writeFileSync(path.join(srcDir, 'all_styles_temp.css'), baseCss);
console.log('Combined CSS saved');
