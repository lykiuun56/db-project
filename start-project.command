#!/bin/bash

chmod +x start-project.command


# Navigate to the project directory
cd "$(dirname "$0")"

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Run the project
npm run start


