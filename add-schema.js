const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function insertSchema(file, schemaObj) {
    const filePath = path.join(srcDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if schema already exists
    if (content.includes('application/ld+json')) return;

    const schemaStr = `\n    <script type="application/ld+json">\n    ${JSON.stringify(schemaObj, null, 4).replace(/\n/g, '\n    ')}\n    </script>\n`;
    
    content = content.replace('</head>', schemaStr + '</head>');
    fs.writeFileSync(filePath, content);
    console.log('Added schema to ' + file);
}

// LocalBusiness / RealEstateAgent Schema
const baseSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "Regal Heights",
  "image": "https://regalheights.co.uk/regal_heights_logo_square.jpeg",
  "url": "https://regalheights.co.uk",
  "telephone": "+447879991235",
  "email": "info@regalheights.co.uk",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Royal Victoria",
    "addressLocality": "London",
    "addressCountry": "UK"
  }
};

insertSchema('index.html', baseSchema);
insertSchema('about.html', baseSchema);
insertSchema('dubai.html', baseSchema);
insertSchema('property-sales.html', baseSchema);

// Accommodation / Offer Schema for London
const londonSchema = {
    ...baseSchema,
    "description": "Premium luxury short-let accommodations and serviced apartments in Royal Victoria, East London."
};
insertSchema('london.html', londonSchema);

// Article schema for post-layout
const layoutPath = path.join(srcDir, '_includes', 'post-layout.html');
let layoutContent = fs.readFileSync(layoutPath, 'utf8');
if (!layoutContent.includes('application/ld+json')) {
    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "{{ title }}",
      "image": [
        "https://regalheights.co.uk{{ image }}"
       ],
      "datePublished": "{{ date }}",
      "author": [{
          "@type": "Organization",
          "name": "Regal Heights",
          "url": "https://regalheights.co.uk"
        }]
    };
    const schemaStr = `\n    <script type="application/ld+json">\n    ${JSON.stringify(articleSchema, null, 4).replace(/\n/g, '\n    ')}\n    </script>\n`;
    layoutContent = layoutContent.replace('</head>', schemaStr + '</head>');
    fs.writeFileSync(layoutPath, layoutContent);
    console.log('Added schema to post-layout.html');
}
