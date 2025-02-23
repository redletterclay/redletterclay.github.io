#!/usr/bin/env just --justfile

# hello is recipe's name
build:
  bundle exec jekyll build
  cp CNAME docs/

serve:
  bundle exec jekyll serve