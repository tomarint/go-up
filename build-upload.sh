#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
dist_dir="$script_dir/dist"
archive_path="$script_dir/upload.zip"

test -d "$dist_dir"
find "$dist_dir" -name '.DS_Store' -type f -delete
rm -f "$archive_path"

(
  cd "$dist_dir"
  zip -r "$archive_path" ./
)

unzip -l "$archive_path"
