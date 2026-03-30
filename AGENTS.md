# Agent Guidelines for jQuery-Gig Repository

## Build/Lint/Test Commands

### Development Setup
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run a single test (if using Jest)
npm test -- -t "test name"

# Run tests in watch mode
npm test -- --watch

# Build for production
npm run build

# Lint code
npm run lint

# Fix lint issues
npm run lint -- --fix
```

### Common npm Scripts (adjust based on actual package.json)
- `npm run dev` - Development mode with hot reload
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests only
- `npm run test:e2e` - Run end-to-end tests
- `npm run preview` - Preview production build locally

## Code Style Guidelines

### JavaScript/ES6+ Standards
- Use ES6+ features (arrow functions, destructuring, spread/rest operators)
- Prefer `const` and `let` over `var`
- Use template literals for string interpolation
- Implement async/await for asynchronous operations instead of callbacks when possible
- Use modules (ES6 imports/exports) for code organization

### TypeScript Guidelines (if applicable)
- Enable strict mode in tsconfig.json
- Define explicit return types for functions
- Use interfaces for object shapes
- Avoid `any` type when possible
- Use type aliases for complex types
- Enforce null/checks with strict null checks

### Import/Export Conventions
- Group imports: built-in modules, third-party libraries, internal modules
- Sort imports alphabetically within groups
- Use named exports for utilities and constants
- Use default export for primary component/function per file
- Avoid wildcard imports (`import * as`) unless necessary
- Use path aliases configured in jsconfig.ts/tsconfig.json for cleaner imports

### Formatting (Prettier/ESLint)
- Indentation: 2 spaces
- Line length: 100 characters
- Semicolons: Required
- Quotes: Single quotes for strings
- Trailing commas: ES5 style (only in multi-line contexts)
- Bracket spacing: No extra spaces in brackets
- Arrow function parentheses: Always include parentheses around parameters

### Naming Conventions
- Variables: camelCase
- Functions: camelCase
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE
- Files: kebab-case
- Private methods/properties: _camelCase (prefix with underscore)
- Boolean variables: starts with is/has/can/should (e.g., isVisible, hasError)

### Error Handling
- Use try/catch for synchronous error handling
- Handle promise rejections with .catch() or try/await
- Create custom error classes for domain-specific errors
- Log errors appropriately (don't use console.log in production)
- Throw meaningful error messages
- Validate inputs at function boundaries
- Use optional chaining (?.) and nullish coalescing (??) for safe property access

### jQuery-Specific Guidelines
- Document ready handler: Use `$(function() { ... })` or `$(document).on('ready', ...)`
- Event delegation: Prefer `.on()` delegated events over direct bindings
- Cache DOM selections: Store jQuery objects in variables when used multiple times
- Chaining: Utilize jQuery chaining for readable code
- Animations: Use CSS classes for animations when possible, fallback to jQuery animate
- AJAX: Prefer `.ajax()` with proper error handling over shortcut methods
- Plugins: Follow jQuery plugin authoring guidelines when creating plugins
- Performance: Avoid expensive selectors, use ID selectors when possible

### Commenting Standards
- Use JSDoc format for function/method documentation
- Include @param, @returns, @throws annotations
- Describe complex algorithms with inline comments
- Keep comments up-to-date with code changes
- Remove commented-out code; use version control instead
- Explain why, not what (unless the what is non-obvious)

### Testing Guidelines
- Unit tests: Test individual functions in isolation
- Integration tests: Test interaction between modules
- Use descriptive test names that explain the behavior being tested
- Follow Arrange-Act-Assert pattern
- Mock external dependencies appropriately
- Test edge cases and error conditions
- Achieve meaningful coverage (focus on critical paths)

### Git Workflow
- Commit messages: Conventional Commits format (feat:, fix:, docs:, etc.)
- Branch naming: feature/, bugfix/, release/, hotfix/
- Pull requests: Include description and link to relevant issues
- Code review: Require approval before merging
- Keep commits atomic and focused

## Additional Guidelines for jQuery Projects

### DOM Manipulation Best Practices
- Minimize DOM reflows by batching changes
- Use document fragments when creating multiple elements
- Prefer textContent over innerHTML when inserting plain text
- Event delegation for dynamically added elements
- Remove event listeners when they're no longer needed to prevent memory leaks

### Performance Optimization
- Cache frequently accessed DOM elements
- Use event delegation instead of attaching handlers to individual elements
- Throttle/dedude resize and scroll event handlers
- Consider using requestAnimationFrame for animations
- Lazy load images and non-critical resources
- Minimize global variables to reduce memory footprint

### Security Considerations
- Sanitize user input before inserting into DOM
- Avoid using innerHTML with user-generated content
- Implement proper CSRF protection for AJAX requests
- Use HTTPS for all API calls
- Validate and validate data on both client and server sides
- Be cautious with eval() and similar functions

### Accessibility (a11y)
- Ensure all interactive elements are keyboard accessible
- Use ARIA attributes when necessary
- Provide meaningful alt text for images
- Ensure sufficient color contrast
- Test with screen readers regularly
- Follow WCAG 2.1 guidelines

### Plugin Development Guidelines
- Follow jQuery plugin authoring best practices
- Use the jQuery UI widget factory for complex plugins
- Provide proper documentation and examples
- Support method chaining where appropriate
- Allow customization through options objects
- Handle destruction and cleanup properly
- Test with different versions of jQuery