const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(srcDir, file), 'utf8');
    
    // Check if canonical already exists
    if (content.includes('rel="canonical"')) return;

    // Define canonical path
    let canonicalPath = file === 'index.html' ? '/' : '/' + file.replace('.html', '');
    let canonicalTag = `\n    <link rel="canonical" href="https://regalheights.co.uk${canonicalPath}">\n`;
    
    content = content.replace('</head>', canonicalTag + '</head>');
    fs.writeFileSync(path.join(srcDir, file), content);
    console.log('Added canonical to ' + file);
});

// also for _includes/post-layout.html
const layoutPath = path.join(srcDir, '_includes', 'post-layout.html');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
if (!layoutContent.includes('rel="canonical"')) {
    let tag = `\n    <link rel="canonical" href="https://regalheights.co.uk{{ page.url }}">\n`;
    layoutContent = layoutContent.replace('</head>', tag + '</head>');
    fs.writeFileSync(layoutPath, layoutContent);
    console.log('Added canonical to post-layout.html');
}
