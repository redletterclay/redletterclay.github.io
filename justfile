#!/usr/bin/env just --justfile

# hello is recipe's name
build:
  bundle exec jekyll build

serve:
  bundle exec jekyll serve