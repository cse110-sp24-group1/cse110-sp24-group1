# Use of 'simplemde' API for Markdown integration.

## Status

What is the status, such as proposed, accepted, rejected, deprecated, superseded, etc.?

- [ ] Propose
- [x] Accepted
- [ ] Rejected
- [ ] Deprecated
- [ ] Superseded

## Context

We originally wanted to use 'markdown-it' API, but we found a better API that also integrates a toolbar that assists with Markdown functionality. The API allows for extensive configurability as well for the editor itself and the visual UI of the text area. This makes it really simple to configure to our projects needs. Lastly, the integration of the editor itself was seamless and was easy to utilize after adding the CDN and style sheets provided. 
![API](https://github.com/sparksuite/simplemde-markdown-editor?tab=readme-ov-file)

## Decision

Our decision is that the new API is much more feasible for the scope of our project, and fits our goals perfectly because it can be implemented and configured in a simple and short amount of time, allowing for seamless markdown integration for users with side-by-side viewability. 

## Consequences

The consequences are that it's a little difficult the edit the CSS of the editor and requires some extensive knowledge of manipulating parent-child styles and overriding the CSS of the linked CSS file provided.
