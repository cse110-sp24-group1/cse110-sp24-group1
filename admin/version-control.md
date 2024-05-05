# Version Control Guidelines

## Branches

### Main Branch

- Treat as delicate; only merge large sprint changes here.
### Team Branches:

- ```backend1``` (Backend Team 1)
- ```backend2``` (Backend Team 2)
- ```frontend1``` (Frontend Team 1)
- ```frontend2``` (Frontend Team 2)
- WILL BE CHANGED FOR THE PROJECT

## Workflow

1. New Feature Development:
   - DO NOT work directly on the team branches.
   - Create a new branch from your team's branch with the ```format: <YourName>/<FeatureName>.```
2. Pull Requests:
   - Merge your feature branch onto your team branch (not main) for team review.
   - Ensure all changes are agreed upon by your team before merging to the team branch.
3. Integration:
   - Before working on backend, ensure frontend changes are merged to main.
   - Always pull the latest version before starting work.

## Example Workflow

1. Create a new feature branch: ```git checkout -b frontend1/Alice/new-feature```.
2. Work on the feature.
3. Push changes to the feature branch: ```git push origin frontend1/Alice/new-feature```.
4. Create a pull request to merge into ```frontend1```.
5. Once approved, merge ```frontend1/Alice/new-feature``` into ```frontend1```.
6. Only merge ```frontend1``` into ```main``` when ready.

## Notes

- Do not work directly on the main branch.
- Do not merge directly to the main branch from a feature branch.
- Follow naming conventions for branches and pull requests.
- Ensure all changes are tested and reviewed before merging.