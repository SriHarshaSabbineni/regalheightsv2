const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'src', 'posts');
const outputFile = path.join(__dirname, 'blog_urls.csv');

try {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    
    let allData = [];
    
    for (const file of files) {
        const fullPath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        
        // Extract date using a simple regex
        const dateMatch = fileContent.match(/^date:\s*(.+)$/m);
        let postDate = dateMatch ? dateMatch[1].trim() : '';
        if (postDate.startsWith('"') && postDate.endsWith('"')) {
            postDate = postDate.slice(1, -1);
        }
        
        const filenameWithoutExt = file.replace('.md', '');
        const url = `https://regalheights.co.uk/posts/${filenameWithoutExt}/`;
        
        allData.push({
            filename: file,
            post_date: postDate,
            url: url
        });
    }
    
    let csvContent = 'blog file name,post date,url\n';
    
    for (const row of allData) {
        csvContent += `"${row.filename}","${row.post_date}","${row.url}"\n`;
    }
    
    fs.writeFileSync(outputFile, csvContent, 'utf8');
    console.log(`Successfully generated ${outputFile} with ${allData.length} records.`);
    
} catch (err) {
    console.error('Error generating CSV:', err);
}
