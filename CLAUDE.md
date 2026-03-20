# Claude Code Notes — Red Letter Clay

## JSX Editing Rules
- Always read the file and check for existing `className`, props, and attributes before editing JSX elements.
- Never add a prop (especially `className`) without first confirming it doesn't already exist on that element.
- When adding a class to a JSX element that already has `className`, merge them into a single `className` string.
