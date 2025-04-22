#!/bin/sh

echo "Current directory: $(pwd)"
echo "Contents of current directory:"
ls -la

echo "Contents of dist directory:"
ls -la dist

echo "Contents of dist/src directory:"
ls -la dist/src

echo "Starting application..."
node dist/src/main.js 