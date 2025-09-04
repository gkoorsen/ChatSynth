# ChatSynth

An AI-powered educational conversation generator with enhanced dual AI capabilities that creates realistic tutoring dialogues for educational research, training, and curriculum development.

## Overview

ChatSynth generates synthetic educational conversations between tutors and students using advanced AI models. It provides fine-grained control over conversation structure, educational purposes, word count limits, and pedagogical approaches to create authentic tutoring scenarios.

## Features

### Core Capabilities
- **Multiple AI Models**: Support for GPT-4o and O3-mini with model-specific optimizations
- **Dual Generation Modes**: Single AI mode for consistency or Dual AI mode for authentic interaction patterns
- **Educational Purpose Control**: Smart selection of tutoring approaches and student behaviors
- **Word Count Management**: Precise control over utterance length for consistency
- **Advanced Prompt Engineering**: Sophisticated techniques for high-quality conversations

### Educational Controls
- **Subject-Specific Generation**: Optimized for Mathematics, Science, Computer Science, Language Arts, History, and more
- **Vocabulary Complexity**: Adjustable from beginner to advanced levels
- **Engagement Levels**: Configurable student engagement and confusion patterns
- **Teaching Approaches**: Scaffolding, Socratic questioning, inquiry-based learning, and more

### Technical Features
- **Async Processing**: Background job processing for complex generations
- **Real-time Progress**: Live updates during conversation generation
- **Export Options**: JSON download and clipboard copy functionality
- **Responsive Design**: Works on desktop and mobile devices

## Architecture

### Frontend
- **React 18** with functional components and hooks
- **Tailwind CSS** for responsive styling
- **Real-time progress tracking** with WebSocket-like polling
- **Browser-based API key storage** with secure cookie handling

### Backend
- **AWS Lambda** for serverless conversation generation
- **AWS API Gateway** for REST API endpoints
- **AWS DynamoDB** for job status tracking and persistence
- **Advanced prompt engineering** with purpose and word count control

### Deployment
- **AWS Amplify** for frontend hosting and CI/CD
- **Environment-based configuration** for different deployment stages
- **Automatic builds** from Git repository updates

## Quick Start

### Prerequisites
- Node.js 16 or higher
- OpenAI API key
- AWS account for deployment (optional for local development)

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

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your configuration:
   ```
   REACT_APP_LAMBDA_ENDPOINT=your-api-endpoint
   REACT_APP_ENV=development
   REACT_APP_DEBUG_MODE=true
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Using the Application

1. **Enter your OpenAI API key** when prompted
2. **Select a preset** or configure custom settings
3. **Choose educational purposes** (Auto, Template, or Custom)
4. **Configure conversation parameters** (turns, complexity, word count)
5. **Generate conversations** and review results

## Configuration Options

### Generation Modes
- **Single AI**: One model generates both tutor and student responses
- **Dual AI**: Separate models for tutor and student for more authentic interactions

### Educational Purpose Control
- **Auto Mode**: Smart selection based on subject and difficulty
- **Template Mode**: Pre-designed scenarios for common situations
- **Custom Mode**: Full control over specific teaching approaches

### Word Count Controls
- **Tutor Utterances**: Configurable min/max/target word counts
- **Student Utterances**: Separate controls for student responses
- **Style Options**: Concise, balanced, or detailed conversation styles

### Advanced Settings
- **Vocabulary Complexity**: Beginner, intermediate, or advanced
- **Student Engagement**: Low, moderate, high, or very high
- **Question Types**: Scaffolding, Socratic, analytical, problem-solving
- **Confusion Levels**: Realistic difficulty and breakthrough patterns

## API Reference

### Generate Conversation (Synchronous)
```
POST /generate
Content-Type: application/json

{
  "generationMode": "single_ai",
  "subject": "mathematics",
  "conversation_structure": {
    "turns": 8,
    "starter": "tutor"
  },
  "ai_settings": {
    "model": "gpt-4o",
    "temperature": 0.7,
    "api_key": "your-api-key"
  }
}
```

### Generate Conversation (Asynchronous)
```
POST /generate?mode=async
Content-Type: application/json

{
  "generationMode": "dual_ai",
  "conversation_count": 3,
  // ... same parameters as synchronous
}
```

### Check Job Status
```
GET /generate?mode=status&jobId=job_12345
```

## Deployment

### AWS Amplify Deployment

1. **Connect your repository**
   - Link your GitHub repository to AWS Amplify
   - Configure build settings using the included `amplify.yml`

2. **Set environment variables**
   ```
   REACT_APP_LAMBDA_ENDPOINT=https://your-api-gateway-url
   REACT_APP_ENV=production
   ```

3. **Deploy Lambda function**
   - Package the Lambda function code from the `lambda/` directory
   - Deploy to AWS Lambda with appropriate IAM permissions
   - Configure API Gateway endpoints

4. **Configure DynamoDB**
   - Create table named `ChatSynthJobs`
   - Primary key: `jobId` (String)
   - Configure appropriate read/write capacity

### Environment Variables

#### Frontend (.env.local)
```
REACT_APP_LAMBDA_ENDPOINT=https://api.example.com/prod/generate
REACT_APP_ENV=development
REACT_APP_DEBUG_MODE=true
```

#### Lambda Environment
```
OPENAI_API_KEY=optional-fallback-key
```

## Educational Applications

### Research Use Cases
- **Conversation Analysis**: Study tutoring patterns and effectiveness
- **Pedagogical Research**: Analyze different teaching approaches
- **Curriculum Development**: Generate example conversations for training
- **Assessment Creation**: Create realistic scenarios for evaluation

### Training Applications
- **Teacher Training**: Provide examples of effective tutoring conversations
- **AI Tutor Development**: Generate training data for conversational AI systems
- **Educational Content**: Create realistic dialogue for textbooks and courses
- **Simulation Data**: Support educational simulation and gaming applications

## Contributing

We welcome contributions from educators, developers, and researchers. Please see [CONTRIBUTE.md](CONTRIBUTE.md) for detailed guidelines on:

- Code contribution process
- Educational expertise and feedback
- Bug reports and feature requests
- Documentation improvements

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENCE.md) file for details.

## Acknowledgments

- Built with OpenAI's GPT models for high-quality conversation generation
- Designed for educational research and training applications
- Inspired by the need for realistic synthetic educational data

## Support

For questions, issues, or feature requests:

- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share use cases
- **Documentation**: Check this README and contributing guidelines

## Roadmap

### Near Term
- Additional AI model support (Claude, Gemini)
- Enhanced export formats (CSV, XLSX)
- Conversation templates library
- Real-time collaboration features

### Future Plans
- Multi-language conversation generation
- Advanced analytics and insights
- Integration with learning management systems
- Mobile application development

---

Built with passion for education and open source collaboration.
