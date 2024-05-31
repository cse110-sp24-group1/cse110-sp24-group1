# Using Arrays in Local Storage

## Status

- [ ] Propose
- [x] Accepted
- [ ] Rejected
- [ ] Deprecated
- [ ] Superseded

## Context

We need a method for storing data in localStorage for our Journal. Folders and notes will need to be stored. Functions should be able to be called from frontend in order to allow the UI to retrieve what data it needs.


## Decision

Chosen option: Array storage.
Store notes in an array in localStorage, and folders in a separate array in localStorage.

## Consequences: 

### Pros:
* Simplicity: Can treat notes and folders as a collection, easier to implement
* Size: Few localStorage keys used
* Compatability: Arrays are easily parsed by JSON

### Cons:
* Performance: Have to search through the entire array to retreive an item, updating a note requires rewriting the entire array


### Alternatives Considered:

* Individual Storage: Store each note and folder in its own key in localStorage.
  * Pros:
    * Performance: Allows direct access to specific items
    * Scalability: Can just add more complex files to localStorage by key
  * Cons:
    * Complexity: More difficult to implement
    * Size: Fills up potential localStorage keys

## More Information

A particular issue we noticed running with individual storage was nested folders. Full data structures may have been needed to keep track of folders, creating uncessary complexity. Arrays proved to be much simpler to implement.

While potential issues arise when dealing with very large datasets, we determined that at the scale and complexity of data we are working with, arrays are sufficient. 