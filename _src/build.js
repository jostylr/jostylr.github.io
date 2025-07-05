#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'fs';
import { marked } from 'marked';
import path from 'path';

// Configure marked for better HTML output
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
});

async function buildHTML() {
  try {
    // Read the markdown file
    const markdownPath = path.join(__dirname, 'index.md');
    const templatePath = path.join(__dirname, 'template.html');
    const outputPath = path.join(__dirname, '..', 'index.html');

    console.log('📖 Reading markdown file...');
    const markdownContent = readFileSync(markdownPath, 'utf8');

    console.log('📄 Reading HTML template...');
    const templateContent = readFileSync(templatePath, 'utf8');

    console.log('⚙️  Converting markdown to HTML...');
    const htmlContent = marked(markdownContent);

    // Extract title from the first h1 in the markdown
    const titleMatch = markdownContent.match(/^# (.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'jostylr';

    // Create intro paragraph from the first paragraph after the title
    const introMatch = markdownContent.match(/^# .+\n\n(.+)$/m);
    const intro = introMatch ? `<div class="intro">${introMatch[1]}</div>` : '';

    // Process the HTML content to add intro class and structure
    let processedHTML = htmlContent;

    // Add intro class to the welcome paragraph
    processedHTML = processedHTML.replace(
      /<p>Welcome to the wide world of jostylr[^<]*<\/p>/,
      intro
    );

    // Add section classes for better styling
    processedHTML = processedHTML.replace(
      /<h2>/g,
      '</div><div class="section"><h2>'
    );

    // Add papers class to the papers section
    processedHTML = processedHTML.replace(
      /<h3>Papers<\/h3>/,
      '<div class="papers"><h3>Papers</h3>'
    );

    // Close the papers div at the end
    processedHTML = processedHTML.replace(
      /(<li>.*?PhD thesis.*?<\/li>)/s,
      '$1</div>'
    );

    // Wrap everything in a section div and close it
    processedHTML = '<div class="section">' + processedHTML + '</div>';

    console.log('🔧 Applying template...');
    const finalHTML = templateContent
      .replace('{{title}}', title)
      .replace('{{content}}', processedHTML);

    console.log('💾 Writing output file...');
    writeFileSync(outputPath, finalHTML, 'utf8');

    console.log('✅ Successfully built index.html!');
    console.log(`📍 Output: ${outputPath}`);

  } catch (error) {
    console.error('❌ Error building HTML:', error.message);
    process.exit(1);
  }
}

// Run the build
buildHTML();
