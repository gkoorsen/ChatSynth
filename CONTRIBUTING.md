# Contributing to ChatSynth

Thank you for your interest in contributing to ChatSynth! This document provides guidelines and information for contributors.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct:

- **Be respectful** and inclusive
- **Be collaborative** and constructive
- **Be mindful** of your words and actions
- **Be patient** with newcomers and questions
- **Focus on what's best** for the community and education

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- OpenAI API key for testing
- Basic understanding of React and JavaScript

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/chatsynth.git
   cd chatsynth
   ```
3. **Add the original repository** as upstream:
   ```bash
   git remote add upstream https://github.com/originalowner/chatsynth.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Start the development server**:
   ```bash
   npm start
   ```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title** and description
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node version)
- **Console errors** if any

### Suggesting Features

Feature suggestions are welcome! Please:

- **Check existing feature requests** first
- **Provide clear use cases** for the feature
- **Explain the educational value** of the feature
- **Consider implementation complexity**
- **Be open to discussion** and iteration

### Pull Requests

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly

4. **Commit your changes** with clear messages:
   ```bash
   git commit -m "feat: add support for custom conversation templates"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Testing notes

## Coding Standards

### JavaScript/React

- Use **functional components** with hooks
- Follow **ES6+ standards**
- Use **camelCase** for variables and functions
- Use **PascalCase** for components
- Include **JSDoc comments** for complex functions
- Keep components **small and focused**

### Code Style

```javascript
// Good
const handleSubmit = async (formData) => {
  try {
    const result = await generateConversation(formData);
    setConversations(result);
  } catch (error) {
    setError(error.message);
  }
};

// Component structure
const MyComponent = ({ prop1, prop2 }) => {
  const [state, setState] = useState(defaultValue);
  
  const handleAction = useCallback(() => {
    // Handle action
  }, [dependencies]);
  
  return (
    <div className="component-wrapper">
      {/* Component content */}
    </div>
  );
};

export default MyComponent;
```

### CSS/Styling

- Use **Tailwind CSS** utility classes
- Follow **responsive design** principles
- Ensure **accessibility** compliance
- Use **semantic HTML** elements
- Test with **screen readers**

### File Organization

```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── constants/          # Application constants
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Testing

### Manual Testing

- Test on **multiple browsers** (Chrome, Firefox, Safari, Edge)
- Verify **responsive design** on different screen sizes
- Check **accessibility** with screen readers
- Test **error scenarios** and edge cases
- Validate **API integration** with real data

### Automated Testing (Future)

We plan to add automated testing. Contributions welcome for:
- Unit tests with Jest
- Integration tests with React Testing Library
- End-to-end tests with Cypress

## Documentation

When contributing, please update relevant documentation:

- **Code comments** for complex logic
- **README.md** for new features
- **API documentation** for backend changes
- **Component documentation** for UI changes

### Documentation Style

- Use **clear, concise language**
- Include **examples** where helpful
- Keep **up-to-date** with code changes
- Consider **different skill levels**

## Architecture Guidelines

### Frontend Architecture

- **Component-based** design with React
- **State management** with React hooks
- **API communication** through fetch
- **Error handling** with try-catch and user feedback
- **Progressive enhancement** approach

### Backend Integration

- **RESTful API** design
- **Async/await** for asynchronous operations
- **Error propagation** with meaningful messages
- **Security** considerations for API keys

## Deployment Considerations

### Frontend (AWS Amplify)

- Ensure **build success** with `npm run build`
- Test **environment variables** if needed
- Verify **routing** works correctly
- Check **performance** metrics

### Backend (AWS Lambda)

- Follow **serverless** best practices
- Handle **cold starts** appropriately
- Implement **proper error handling**
- Consider **cost optimization**

## Review Process

### For Contributors

1. **Self-review** your code before submitting
2. **Test thoroughly** in different scenarios
3. **Write clear commit messages**
4. **Respond promptly** to feedback
5. **Be open** to suggestions and changes

### For Reviewers

1. **Be constructive** and helpful
2. **Focus on code quality** and standards
3. **Consider educational impact**
4. **Test the changes** when possible
5. **Provide clear feedback**

## Priority Areas

We especially welcome contributions in these areas:

### High Priority
- **Accessibility improvements**
- **Performance optimizations**
- **Bug fixes**
- **Documentation enhancements**

### Medium Priority
- **New educational presets**
- **Additional AI model support**
- **UI/UX improvements**
- **Internationalization**

### Low Priority
- **Advanced analytics**
- **Export format options**
- **Theme customization**
- **Mobile app development**

## Commit Message Format

Use semantic commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```
feat(ui): add dark mode support
fix(api): handle network timeout errors
docs(readme): update installation instructions
style(components): improve button hover effects
```

## Getting Help

If you need help or have questions:

- **GitHub Discussions** for general questions
- **GitHub Issues** for bug reports and feature requests
- **Discord/Slack** (if available) for real-time chat
- **Email** for sensitive or detailed discussions

## Recognition

All contributors will be:

- **Listed** in the README.md contributors section
- **Credited** in release notes for significant contributions
- **Invited** to join the core team for exceptional contributions
- **Thanked** publicly for their efforts

Thank you for helping make ChatSynth better for educators and students worldwide!
