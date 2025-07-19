import { readFile, writeFile } from "fs/promises";
import { marked } from "marked";

import puppeteer from "puppeteer";

const inputFile = "_src/death-begins-me.md";
const outputFile = "death-begins-me.html";

const md = await readFile(inputFile, "utf8");
const htmlContent = marked.parse(md);

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Death Begins Me</title>
  <style>
    body {
      font-family: "Georgia", serif;
      max-width: 700px;
      margin: 4rem auto;
      line-height: 1.6;
      font-size: 18px;
      color: #111;
    }
    h1, h2, h3 {
      font-family: "Times New Roman", serif;
      margin-bottom: 0.5em;
    }
    img {
      display: block;
      margin: 2rem auto;
      max-width: 100%;
    }
    figcaption {
      text-align: center;
      font-style: italic;
      margin-top: 0.5rem;
      font-size: 16px;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
`;

await writeFile(outputFile, html, "utf8");

console.log(`Built ${outputFile}`);
