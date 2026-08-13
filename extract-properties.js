const fs = require('fs');
const content = fs.readFileSync('src/london.html', 'utf-8');

const startIndex = content.indexOf('const propertyDatabase = [');
const endIndex = content.indexOf('];', startIndex) + 2;

if (startIndex !== -1 && endIndex !== -1) {
    let propsContent = content.substring(startIndex, endIndex);
    propsContent = propsContent.replace('const propertyDatabase = ', 'module.exports = ');
    
    if (!fs.existsSync('src/_data')) {
        fs.mkdirSync('src/_data');
    }
    
    fs.writeFileSync('src/_data/properties.js', propsContent, 'utf-8');
    console.log('Successfully extracted properties.js');
} else {
    console.error('Could not find propertyDatabase array');
}
