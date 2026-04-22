Auth feature structure

- `app/(auth)/*`: Expo Router route layer.
- `src/features/auth/screens/*`: screen composition for each auth flow.
- `src/features/auth/components/*`: reusable auth UI blocks.
- `src/theme/*`: shared tokens for colors, spacing, radius and typography.

Current scope is design-first only:

- login
- register
- forgot-password
- reset-password

Suggested next steps:

- add form schema validation
- add auth API service layer
- add session storage and route guard
- replace placeholder actions with real use cases
