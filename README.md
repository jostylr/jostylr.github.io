# jostylr Personal Website

A simple static site generator using Bun and Markdown for my personal website.

## Structure

```
jostylr/
├── _src/
│   ├── index.md          # Main content in Markdown
│   ├── template.html     # HTML template
│   └── build.js          # Build script
├── index.html            # Generated HTML file
├── package.json          # Dependencies and scripts
└── .gitignore           # Git ignore rules
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Git (optional, for version control)

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   bun install
   ```

### Building the Site

To build the site once:
```bash
bun run build
```

To build and watch for changes during development:
```bash
bun run dev
```

This will:
- Build the site initially
- Watch the `_src/` directory for any changes
- Automatically rebuild when files are modified
- Show build progress and results in the terminal

The generated `index.html` will be created in the root directory.

## How It Works

1. **Content**: Write your content in `_src/index.md` using Markdown syntax
2. **Template**: Customize the HTML template in `_src/template.html`
3. **Build**: Run the build script to convert Markdown to HTML using the template
4. **Output**: The final HTML file is generated as `index.html` in the root

## Features

- Clean, responsive design optimized for reading
- Markdown to HTML conversion with GitHub Flavored Markdown support
- Modern CSS styling with pleasant typography and Google Fonts
- Mobile-responsive layout
- Automatic title extraction from Markdown
- Fast builds with Bun
- Live development mode with file watching
- Cursive, right-aligned title styling
- Dark blue link colors for better readability

## Customization

### Content
Edit `_src/index.md` to change the website content. The first `# Header` will be used as the page title.

### Styling
Modify the CSS in `_src/template.html` to customize the appearance.

### Template
The template uses `{{title}}` and `{{content}}` placeholders that get replaced during build.

## Development

The build system includes:
- `_src/build.js` - Main build script using `marked` for Markdown parsing
- `_src/watch.js` - File watcher for development mode
- Built-in Node.js modules for file operations
- Custom CSS for styling with Google Fonts support

## License

MIT


##### Building by Zeddy (Zed + Claude)
