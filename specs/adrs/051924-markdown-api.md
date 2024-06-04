
# Use of 'markdown-it' API for Markdown integration.

## Status

What is the status, such as proposed, accepted, rejected, deprecated, superseded, etc.?

- [ ] Propose
- [ ] Accepted
- [ ] Rejected
- [x] Deprecated
- [ ] Superseded

## UPDATE 5/31/24

We decided not to use this API because of the lack of features that this API has in comparison to the new one we are considering. The new API offers more robust functionality, better documentation, and more active community support, making it a more suitable choice for our project.

## Context

We want to use markdown as a possible input for developers when they create their journal entries. This allows for ease of use for uploading pictures, code snippets, document styling, and much more. Since we don't have time to develop a Markdown API from scratch, we have to use an online resource called 'markdown-api'. This ADR is aimed towards accepting the use of such API for our purposes and goals.
![API](https://github.com/markdown-it/markdown-it)

## Decision

We have decided that it's feasible to use this specific markdown-api that is open source and available on Github. 

## Consequences

What becomes difficult is exactly knowing how to use the API to it's fullest extent. An example would be configuring the markdown configs to adjust the content to our liking as well as adding additional features on top of our Markdown editor such as syntax highlighting. Another problem is that the API doesn't automatically create a side-by-side panel similar to HackMD, and would have to be manually coded and styled. What becomes easier is being able to actually use the Markdown itself.