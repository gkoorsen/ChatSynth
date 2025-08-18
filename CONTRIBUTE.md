# Contributing to ChatSynth

Thank you for your interest in contributing to ChatSynth! This document provides comprehensive guidelines for contributors, whether you're a developer, educator, or researcher.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Educational Contributions](#educational-contributions)
- [Issue Reporting](#issue-reporting)
- [Community Guidelines](#community-guidelines)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. By participating in this project, you agree to abide by our community standards:

### Our Standards

**Positive Behavior:**
- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community and education
- Show empathy towards other community members

**Unacceptable Behavior:**
- Harassment, discrimination, or unwelcome conduct
- Personal attacks or derogatory comments
- Public or private harassment
- Publishing others' private information without permission
- Conduct that would be inappropriate in a professional setting

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Technical Skills**: Basic knowledge of React, JavaScript, and AWS (for backend contributions)
- **Educational Background**: Understanding of tutoring, pedagogy, or educational research (for educational contributions)
- **Development Environment**: Node.js 16+, Git, and a code editor
- **AWS Account**: Required for testing backend changes (optional for frontend-only contributions)

### Types of Contributions

We welcome several types of contributions:

1. **Code Contributions**: Bug fixes, new features, performance improvements
2. **Educational Expertise**: Improving pedagogical approaches and conversation quality
3. **Documentation**: README updates, code comments, user guides
4. **Testing**: Writing tests, reporting bugs, validating fixes
5. **Design**: UI/UX improvements, accessibility enhancements
6. **Research**: Educational effectiveness studies, use case documentation

## Development Setup

### Local Environment Setup

1. **Fork and Clone**
   ```bash
   git fork https://github.com/originalowner/chatsynth.git
   git clone https://github.com/yourusername/chatsynth.git
   cd chatsynth
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your `.env.local`:
   ```
   REACT_APP_LAMBDA_ENDPOINT=your-test-endpoint
   REACT_APP_ENV=development
   REACT_APP_DEBUG_MODE=true
   ```

4. **Start Development Server**
   ```bash
   npm start
   ```

5. **Verify Setup**
   - Open `http://localhost:3000`
   - Test basic functionality with your OpenAI API key
   - Ensure console shows no critical errors

### Backend Development Setup

For Lambda function development:

1. **Navigate to Lambda Directory**
   ```bash
   cd lambda/
   ```

2. **Install Lambda Dependencies**
   ```bash
   npm install
   ```

3. **Local Testing Setup**
   ```bash
   # Create test file
   node test-local.js
   ```

4. **AWS Configuration**
   - Configure AWS CLI with appropriate permissions
   - Set up DynamoDB table for job tracking
   - Deploy test Lambda function

## Contributing Guidelines

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for new features
- **feature/**: New features (`feature/word-count-controls`)
- **bugfix/**: Bug fixes (`bugfix/api-timeout-handling`)
- **docs/**: Documentation updates (`docs/installation-guide`)

### Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow coding standards
   - Write tests for new functionality
   - Update documentation as needed

3. **Test Thoroughly**
   ```bash
   npm test
   npm run build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add word count validation system"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Pull Request Process

### Pre-submission Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] New features include appropriate tests
- [ ] Documentation updated for user-facing changes
- [ ] Educational impact considered and documented
- [ ] Performance impact assessed
- [ ] Accessibility guidelines followed

### PR Description Template

```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update
- [ ] Educational improvement

## Educational Impact
Describe how this change affects educational outcomes:
- Impact on conversation quality
- Changes to pedagogical approaches
- New educational use cases enabled

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Educational effectiveness validated

## Screenshots (if applicable)
Include before/after screenshots for UI changes.

## Additional Notes
Any additional information for reviewers.
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs tests and builds
2. **Code Review**: At least one maintainer reviews code quality
3. **Educational Review**: Educational experts review pedagogical impact
4. **Final Approval**: Maintainer approves and merges

## Coding Standards

### JavaScript/React Standards

```javascript
// Use functional components with hooks
const ConversationGenerator = ({ config, onGenerate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleSubmit = useCallback(async (formData) => {
    try {
      setIsGenerating(true);
      const result = await generateConversation(formData);
      onGenerate(result);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [onGenerate]);
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Component content */}
    </form>
  );
};

export default ConversationGenerator;
```

### Code Style Guidelines

**General Principles:**
- Use descriptive variable and function names
- Prefer const over let, avoid var
- Use template literals for string interpolation
- Handle errors gracefully with try-catch blocks
- Add JSDoc comments for complex functions

**React Specific:**
- Use functional components with hooks
- Implement proper prop validation
- Use useCallback for event handlers
- Avoid direct DOM manipulation
- Keep components focused and reusable

**CSS/Styling:**
- Use Tailwind utility classes consistently
- Follow responsive design principles
- Ensure accessibility compliance (WCAG 2.1)
- Test with screen readers
- Maintain consistent spacing and typography

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components
│   ├── forms/          # Form-specific components
│   └── educational/    # Education-specific components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── constants/          # Application constants
├── types/              # TypeScript type definitions
└── styles/             # Global styles and themes

lambda/
├── index.js            # Main Lambda handler
├── prompt-engineering.js  # Educational prompt logic
├── package.json        # Lambda dependencies
└── tests/              # Lambda function tests
```

## Testing Guidelines

### Frontend Testing

```javascript
// Example component test
import { render, screen, fireEvent } from '@testing-library/react';
import ConversationGenerator from './ConversationGenerator';

describe('ConversationGenerator', () => {
  test('generates conversation when form is submitted', async () => {
    const mockGenerate = jest.fn();
    render(<ConversationGenerator onGenerate={mockGenerate} />);
    
    fireEvent.click(screen.getByText('Generate'));
    
    expect(mockGenerate).toHaveBeenCalled();
  });
});
```

### Backend Testing

```javascript
// Example Lambda test
const { handler } = require('./index');

describe('Lambda Handler', () => {
  test('generates conversation successfully', async () => {
    const event = {
      httpMethod: 'POST',
      body: JSON.stringify({
        subject: 'mathematics',
        conversation_structure: { turns: 8 }
      })
    };
    
    const result = await handler(event);
    
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toHaveProperty('conversation');
  });
});
```

### Educational Testing

For educational contributions, consider:

- **Conversation Quality**: Validate educational effectiveness
- **Pedagogical Accuracy**: Ensure teaching approaches are sound
- **Diverse Scenarios**: Test across different subjects and levels
- **Accessibility**: Verify conversations work for diverse learners

## Documentation

### Code Documentation

```javascript
/**
 * Generates educational conversations with purpose and word count control
 * @param {Object} config - Conversation configuration
 * @param {string} config.subject - Educational subject
 * @param {Object} config.purpose_control - Purpose selection settings
 * @param {Object} config.word_count_controls - Word count limits
 * @param {Object} aiSettings - AI model configuration
 * @returns {Promise<Object>} Generated conversation with metadata
 */
async function generateConversation(config, aiSettings) {
  // Implementation
}
```

### README Updates

When adding features, update:
- Feature descriptions in README
- Configuration options
- API documentation
- Usage examples

### Educational Documentation

Document the educational rationale for:
- New teaching approaches
- Purpose selection algorithms
- Conversation quality improvements
- Research applications

## Educational Contributions

### Pedagogical Expertise

We especially value contributions from educators and researchers:

**Areas of Focus:**
- Teaching methodology improvements
- Subject-specific conversation patterns
- Student engagement strategies
- Assessment and evaluation methods

**Contribution Types:**
- Review conversation quality
- Suggest new teaching approaches
- Validate educational effectiveness
- Propose research applications

### Educational Review Process

1. **Submit Educational Proposal**: Describe pedagogical improvement
2. **Community Discussion**: Engage with educators and researchers
3. **Implementation Planning**: Work with developers on technical approach
4. **Testing and Validation**: Verify educational effectiveness
5. **Documentation**: Update educational guidelines

## Issue Reporting

### Bug Reports

Use this template for bug reports:

```markdown
**Bug Description**
Clear description of the issue.

**Educational Impact**
How does this bug affect educational use cases?

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error...

**Expected Behavior**
What should happen instead?

**Environment**
- Browser: [e.g., Chrome 91]
- OS: [e.g., macOS 12]
- Node version: [e.g., 16.14]

**Additional Context**
Screenshots, error logs, or other relevant information.
```

### Feature Requests

```markdown
**Feature Summary**
Brief description of the proposed feature.

**Educational Rationale**
Why is this feature important for educational applications?

**Use Cases**
Specific scenarios where this feature would be valuable.

**Proposed Implementation**
Ideas for how this could be implemented.

**Alternatives Considered**
Other approaches that were considered.
```

## Community Guidelines

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and community discussion
- **Pull Request Reviews**: Code-specific feedback and suggestions

### Getting Help

**For Technical Issues:**
- Check existing GitHub issues
- Review documentation and README
- Ask questions in GitHub Discussions

**For Educational Questions:**
- Engage with the educational community
- Share use cases and research applications
- Collaborate on pedagogical improvements

### Recognition

Contributors are recognized through:
- **Contributor List**: Listed in README.md
- **Release Notes**: Credited for significant contributions
- **Community Highlights**: Featured in project updates
- **Collaboration Opportunities**: Invited to join core team

## Specific Contribution Areas

### High Priority
- **Educational Quality**: Improve conversation authenticity and pedagogical value
- **Accessibility**: Ensure the application works for diverse users and use cases
- **Performance**: Optimize generation speed and resource usage
- **Documentation**: Comprehensive guides for users and developers

### Medium Priority
- **New AI Models**: Support for additional language models
- **Export Features**: Enhanced data export and analysis tools
- **Template Library**: Pre-built conversation templates for common scenarios
- **Analytics**: Conversation quality metrics and insights

### Future Opportunities
- **Multi-language Support**: Generate conversations in multiple languages
- **Real-time Collaboration**: Multiple users working on conversations simultaneously
- **Learning Management Integration**: Connect with educational platforms
- **Mobile Applications**: Native mobile apps for conversation generation

## Development Best Practices

### Performance Considerations
- Optimize React rendering with useMemo and useCallback
- Implement proper error boundaries
- Use lazy loading for large components
- Monitor bundle size and performance metrics

### Security Guidelines
- Never commit API keys or sensitive data
- Validate all user inputs
- Use secure communication protocols
- Follow AWS security best practices

### Accessibility Standards
- Ensure keyboard navigation works correctly
- Provide appropriate ARIA labels
- Maintain sufficient color contrast
- Test with screen readers

## Release Process

### Version Numbering
We follow semantic versioning (SemVer):
- **Major (1.0.0)**: Breaking changes
- **Minor (1.1.0)**: New features, backward compatible
- **Patch (1.1.1)**: Bug fixes, backward compatible

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Educational effectiveness validated
- [ ] Performance impact assessed
- [ ] Security review completed
- [ ] Accessibility testing passed

---

Thank you for contributing to ChatSynth! Your involvement helps advance educational technology and research. Together, we can create better tools for learning and teaching.
