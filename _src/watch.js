#!/usr/bin/env bun

import { watch } from 'fs';
import { spawn } from 'child_process';
import path from 'path';

const srcDir = __dirname;
const buildScript = path.join(srcDir, 'build.js');

console.log('👀 Watching _src directory for changes...');
console.log(`📁 Directory: ${srcDir}`);

let isBuilding = false;
let buildTimeout;

function runBuild() {
  if (isBuilding) {
    console.log('⏳ Build already in progress, skipping...');
    return;
  }

  isBuilding = true;
  console.log('\n🔄 Changes detected, rebuilding...');

  const buildProcess = spawn('bun', [buildScript], {
    stdio: 'inherit',
    cwd: path.dirname(srcDir)
  });

  buildProcess.on('close', (code) => {
    isBuilding = false;
    if (code === 0) {
      console.log('✅ Build completed successfully!');
    } else {
      console.log(`❌ Build failed with code ${code}`);
    }
    console.log('👀 Watching for changes...\n');
  });

  buildProcess.on('error', (error) => {
    isBuilding = false;
    console.error('❌ Build error:', error.message);
    console.log('👀 Watching for changes...\n');
  });
}

// Initial build
runBuild();

// Watch for changes in the _src directory
const watcher = watch(srcDir, { recursive: true }, (eventType, filename) => {
  if (filename) {
    console.log(`📝 ${eventType}: ${filename}`);

    // Debounce rapid changes
    clearTimeout(buildTimeout);
    buildTimeout = setTimeout(() => {
      runBuild();
    }, 100);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping watcher...');
  watcher.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping watcher...');
  watcher.close();
  process.exit(0);
});

console.log('✅ Watcher started. Press Ctrl+C to stop.');
