#!/bin/bash

#
# file: scripts/pack-local.sh
#

set -e

# "comment-json" package is required by initialization scripts
npm install comment-json

# Get the directory of this script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Run init-project.js from the same directory
node "$SCRIPT_DIR/init-project.js"

echo "📦 Project initialized!"


