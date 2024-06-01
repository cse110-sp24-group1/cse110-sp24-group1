# Removed the three buttons for Text, Markdown, and Image on Note

## Status

What is the status, such as proposed, accepted, rejected, deprecated, superseded, etc.?

- [ ] Propose
- [ ] Accepted
- [ ] Rejected
- [ ] Deprecated
- [ ] Superseded

## Context

The decision to remove the three buttons for Text, Markdown, and Image was because we wanted a more streamlined and efficient user interface. The existing buttons were redundant given the new API solution we implemented.

## Decision

We decided to use the SimpleMDE API, which integrates Markdown into our textarea with an included toolbar. This toolbar allows for Markdown editing and adding image links, eliminating the need for separate buttons.

## Consequences

The change simplifies the user interface, making it easier for users to format their notes without switching between different modes or dealing with additional buttons. This should enhance the overall user experience and reduce potential confusion.
