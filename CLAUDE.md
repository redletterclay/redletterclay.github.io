# Claude Code Notes — Red Letter Clay

## Lexical RichText Field Rules
- When any field is changed to Lexical `richText`, update ALL seed/data scripts that write to that field.
- In Lexical node objects, always use `as const` on `format` and `direction` fields — e.g. `format: '' as const`, `direction: 'ltr' as const`. Without `as const`, TypeScript widens `''` to `string`, which fails Payload's strict union type check and breaks the build.

## JSX Editing Rules
- Always read the file and check for existing `className`, props, and attributes before editing JSX elements.
- Never add a prop (especially `className`) without first confirming it doesn't already exist on that element.
- When adding a class to a JSX element that already has `className`, merge them into a single `className` string.
