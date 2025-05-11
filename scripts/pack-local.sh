#!/bin/bash

#
# file: scripts/pack-local.sh
#

set -e
mkdir -p packages
PACKFILE=$(npm pack --ignore-scripts) # --ignore-scripts ensures that here, pack will not trigger prepack script
mv "$PACKFILE" packages/
echo "📦 Created: packages/$PACKFILE"


