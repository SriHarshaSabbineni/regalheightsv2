const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'src', 'posts');
const outputFile = path.join(__dirname, 'blog_posts.csv');

function parseMarkdown(content) {
    // Replace CRLF with LF to ensure consistent splitting
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const lines = normalizedContent.split('\n');
    let inFrontmatter = false;
    let frontmatterStr = '';
    let bodyStr = '';
    let isFirstDashes = true;

    for (let line of lines) {
        if (line.trim() === '---') {
            if (isFirstDashes) {
                inFrontmatter = true;
                isFirstDashes = false;
                continue;
            } else if (inFrontmatter) {
                inFrontmatter = false;
                continue;
            }
        }
        
        if (inFrontmatter) {
            frontmatterStr += line + '\n';
        } else if (!isFirstDashes && !inFrontmatter) {
            bodyStr += line + '\n';
        }
    }

    // Parse simple YAML
    const meta = {};
    const metaLines = frontmatterStr.split('\n');
    for (let mLine of metaLines) {
        if (!mLine.trim()) continue;
        const colonIdx = mLine.indexOf(':');
        if (colonIdx > -1) {
            const key = mLine.substring(0, colonIdx).trim();
            let value = mLine.substring(colonIdx + 1).trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            meta[key] = value;
        }
    }

    return { meta, content: bodyStr.trim() };
}

function escapeCsvField(field) {
    if (field === null || field === undefined) {
        return '';
    }
    const str = String(field);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

try {
    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
    
    // Collect all unique keys from frontmatter
    let allData = [];
    let allKeys = new Set(['filename']);
    
    for (const file of files) {
        const fullPath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(fullPath, 'utf8');
        const parsed = parseMarkdown(fileContent);
        
        const rowData = { filename: file, ...parsed.meta, body_content: parsed.content };
        
        for (const key of Object.keys(rowData)) {
            allKeys.add(key);
        }
        
        allData.push(rowData);
    }
    
    // Convert to Array and make sure 'filename', 'title', 'category' are first, 'body_content' is last.
    let headers = Array.from(allKeys);
    headers = headers.filter(h => h !== 'body_content');
    headers.push('body_content');
    
    let csvContent = headers.map(escapeCsvField).join(',') + '\n';
    
    for (const row of allData) {
        const rowString = headers.map(header => escapeCsvField(row[header])).join(',');
        csvContent += rowString + '\n';
    }
    
    fs.writeFileSync(outputFile, csvContent, 'utf8');
    console.log(`Successfully generated ${outputFile} with ${allData.length} records.`);
    
} catch (err) {
    console.error('Error generating CSV:', err);
}
