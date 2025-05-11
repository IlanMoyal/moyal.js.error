#!/bin/bash

#
# file: scripts/pack-preview.sh
#

set -e

# Clear old preview and prepare
rm -rf packages/preview
mkdir -p packages/preview

# Extract the latest packed .tgz
LATEST=$(ls -t packages/*.tgz | head -n 1)
tar -xzf "$LATEST" -C packages/preview
echo "📂 Preview extracted to: packages/preview"

# Display the folder structure
if command -v tree &> /dev/null; then
  tree packages/preview
else
  echo "(ℹ️ 'tree' not installed. Using fallback: 'find')"
  find packages/preview
fi
