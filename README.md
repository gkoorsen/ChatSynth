# ChatSynth - AI-Powered Educational Conversation Generator

ChatSynth is an open-source educational tool that generates realistic tutoring conversations using AI models. It supports both single AI and dual AI conversation generation modes, with customizable parameters for educational scenarios.

## Features

- **Multiple AI Models**: Support for GPT-4o and O3-mini with model-specific optimizations
- **Dual Generation Modes**: Single AI (synchronous) and Dual AI (asynchronous) conversation generation
- **Educational Presets**: Pre-configured settings for Mathematics, Science, Language Arts, History, Computer Science, and more
- **Advanced Customization**: Fine-tune conversation parameters, vocabulary complexity, student engagement levels, and tutor questioning strategies
- **Export Capabilities**: Download conversations as JSON or copy to clipboard
- **Responsive Design**: Modern, accessible interface built with React and Tailwind CSS

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Create React App** - Build tooling and development setup

### Backend
- **AWS Lambda** - Serverless conversation generation
- **AWS API Gateway** - REST API endpoints
- **OpenAI API** - GPT-4o and O3-mini integration

### Deployment
- **AWS Amplify** - Frontend hosting and CI/CD
- **AWS Lambda** - Backend serverless functions

## Prerequisites

Before running ChatSynth, you'll need:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/api-keys)
4. **AWS Account** (for deployment)

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/chatsynth.git
   cd chatsynth
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API endpoint
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

6. **Add your OpenAI API Key**
   When prompted, enter your OpenAI API key. It will be stored securely in your browser.

### Using ChatSynth

1. **Choose a Preset**: Select from educational presets like "Mathematics Tutoring" or "Science Discovery Learning"
2. **Configure Settings**: Adjust conversation parameters, AI model, and generation settings
3. **Generate Conversations**: Click generate to create realistic educational conversations
4. **Export Results**: Download as JSON or copy to clipboard for use in your educational projects

## Architecture

ChatSynth follows a serverless architecture:

```
Frontend (React) → API Gateway → Lambda Function → OpenAI API
     ↓
  AWS Amplify
```

### Frontend Components
- `App.js` - Main application logic and state management
- `LandingPage.js` - UI components and user interactions
- Configuration system with preset management
- Progress tracking and error handling

### Backend (Lambda Function)
- Conversation generation with OpenAI API
- Support for both synchronous and asynchronous processing
- Configurable parameters for educational scenarios
- Error handling and response formatting

## Configuration

### AI Models
- **GPT-4o**: Balanced performance for general educational conversations
- **O3-mini**: Advanced reasoning capabilities for STEM subjects

### Generation Modes
- **Single AI**: Direct conversation generation (faster)
- **Dual AI**: Asynchronous processing for complex conversations

### Educational Parameters
- Conversation turns (4-20)
- Vocabulary complexity (Beginner/Intermediate/Advanced)
- Student engagement levels
- Tutor questioning strategies
- Subject-specific configurations

## Deployment

### Frontend (AWS Amplify)

1. **Connect your repository to AWS Amplify**
2. **Configure build settings** (uses included `amplify.yml`)
3. **Set environment variables** in Amplify Console:
   ```
   REACT_APP_LAMBDA_ENDPOINT=https://your-api-gateway-url.amazonaws.com/prod/generate
   REACT_APP_ENV=production
   ```
4. **Deploy automatically** on git push

### Backend (AWS Lambda)

The Lambda function code is not included in this repository for security reasons, but the frontend is configured to work with the API structure documented in [BACKEND.md](BACKEND.md).

Required API endpoints:
```javascript
POST /generate                    // Synchronous conversation generation
POST /generate?mode=async        // Start asynchronous job
GET /generate?mode=status&jobId=... // Check job status
```

## Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Quick Contributing Steps

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Add tests** if applicable
5. **Commit your changes** (`git commit -m 'Add amazing feature'`)
6. **Push to the branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request**

### Development Guidelines

- Follow React best practices
- Use semantic commit messages
- Add JSDoc comments for complex functions
- Ensure responsive design compatibility
- Test across different browsers

## API Reference

### Configuration Object Structure

```javascript
{
  generationMode: 'single_ai' | 'dual_ai',
  conversation_count: number,
  subject: string,
  conversation_structure: {
    turns: number,
    starter: 'tutor' | 'student',
    purpose: string
  },
  vocabulary: {
    complexity: 'beginner' | 'intermediate' | 'advanced',
    domain_specific: boolean
  },
  // ... additional parameters
}
```

### AI Settings

```javascript
{
  model: 'gpt-4o' | 'o3-mini',
  temperature: number, // GPT-4o only
  max_completion_tokens: number,
  reasoning_effort: 'low' | 'medium' | 'high', // O3-mini only
  api_key: string
}
```

## Security and Privacy

- API keys are stored locally in browser cookies
- No conversation data is permanently stored on servers
- All communication uses HTTPS
- OpenAI API guidelines are followed for educational content
- Environment variables keep sensitive configuration secure

## Documentation

- [Backend API Documentation](BACKEND.md) - Complete API reference and implementation guide
- [Contributing Guidelines](CONTRIBUTING.md) - How to contribute to the project
- [Environment Setup](docs/environment-setup.md) - Detailed environment configuration
- [Deployment Guide](docs/deployment.md) - Step-by-step deployment instructions

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for providing the AI models
- AWS for serverless infrastructure
- The educational technology community for inspiration
- Contributors and testers who help improve ChatSynth

## Support

- **Issues**: Report bugs or request features via [GitHub Issues](https://github.com/yourusername/chatsynth/issues)
- **Discussions**: Join the conversation in [GitHub Discussions](https://github.com/yourusername/chatsynth/discussions)
- **Documentation**: Check our [documentation](docs/) for detailed guides
- **Email**: contact@yourdomain.com

## Roadmap

- Additional AI model support (Claude, Gemini)
- Real-time collaboration features
- Advanced analytics and insights
- Mobile app development
- Integration with Learning Management Systems
- Multi-language support
- Automated testing suite
- Performance optimizations

## Getting Help

If you encounter issues:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/yourusername/chatsynth/issues)
3. Create a new issue with detailed information
4. Join our community discussions

---

**ChatSynth** - Made for educators and students worldwide
