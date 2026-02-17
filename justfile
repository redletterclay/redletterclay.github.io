#!/usr/bin/env just --justfile

# hello is recipe's name
build:
  bash build.sh

serve:
  bundle exec jekyll serve