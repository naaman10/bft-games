# Contributing to BFT Games

Thank you for contributing to the Brighter Futures Games platform!

## Development Workflow

1. Create a new branch for your feature or game
2. Develop and test your changes locally
3. Ensure all linting and type checking passes
4. Create a pull request with a clear description

## Code Style

- Use TypeScript for all new code
- Follow the existing ESLint configuration
- Use functional components with hooks
- Keep components focused and maintainable

## Game Development Guidelines

### Design Principles

1. **Age-Appropriate**: Design games suitable for the target age range
2. **Accessible**: Ensure games work with keyboard navigation
3. **Responsive**: Games should work on desktop and tablet devices
4. **Performance**: Optimize for smooth performance
5. **Educational**: Include learning objectives when appropriate

### Technical Requirements

1. Each game must be a self-contained React component
2. Games should accept the standard `GameProps` interface
3. Include appropriate callbacks for completion and scoring
4. Provide clear visual feedback for all interactions
5. Handle edge cases gracefully

### File Organization

```
src/games/YourGame/
├── YourGame.tsx        # Main game component
├── YourGame.css        # Game-specific styles
├── components/         # Game-specific sub-components (if needed)
├── utils.ts           # Game-specific utilities (if needed)
└── README.md          # Game documentation (optional)
```

## Testing

Before submitting a PR:

1. Test your game in isolation at `/game/your-game-id`
2. Test the game in an iframe context
3. Verify it works on different screen sizes
4. Check TypeScript compilation: `npm run type-check`
5. Run the linter: `npm run lint`

## Pull Request Process

1. Update the README if you're adding a new game
2. Ensure your code follows the project's style guidelines
3. Write a clear PR description explaining your changes
4. Link any related issues

## Questions?

If you have questions about contributing, please reach out to the team.
