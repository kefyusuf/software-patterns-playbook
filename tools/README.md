# Tools

This directory is reserved for lightweight documentation support tools such as
index generation or validation helpers.

The repository stays Markdown-first and intentionally avoids generated tooling as
a core dependency. Any tool added here should support the documentation, not
become a requirement for understanding or using the repository.

## Available Helpers

Run the documentation structure check with:

```sh
node tools/validate-docs.mjs
```

The helper checks that required documentation directories exist, Mermaid diagram
sources are present, issue templates use structured controls where expected, and
live contributor-facing files do not drift into empty placeholder text.
