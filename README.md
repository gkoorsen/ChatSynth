# ChatSynth

An AI-powered educational conversation generator with enhanced dual AI capabilities that creates realistic tutoring dialogues for educational research, training, and curriculum development.

## Overview

ChatSynth generates synthetic educational conversations between tutors and students using advanced AI models. It provides fine-grained control over conversation structure, educational purposes, word count limits, and pedagogical approaches to create authentic tutoring scenarios.

## Features

### Core Capabilities
- **Multiple AI Models**: Support for GPT-4o and O3-mini with model-specific optimizations
- **Enhanced Dual AI System**: Context-aware conversation generation with turn-by-turn coherence analysis
- **Conversation Quality Metrics**: Real-time coherence scoring, question response tracking, and topic flow analysis
- **Educational Purpose Control**: Smart selection of tutoring approaches and student behaviors
- **Word Count Management**: Precise control over utterance length for consistency
- **Advanced Prompt Engineering**: Sophisticated techniques for high-quality conversations

### Educational Controls
- **Subject-Specific Generation**: Optimized for Mathematics, Science, Computer Science, Language Arts, History, and more
- **Custom Topic Support**: User-specified subjects with adaptive educational guidance
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

## Enhanced Dual AI System

### Coherence-Focused Architecture
The Enhanced Dual AI System represents a breakthrough in conversation quality, implementing turn-by-turn generation with full context awareness to eliminate common issues like question ignoring and parallel monologues.

### Key Improvements
- **Context-Aware Agents**: Each AI agent maintains full conversation history and makes contextual decisions
- **Question Prioritization**: Automatic detection and prioritized responses to student questions
- **Real-Time Quality Metrics**: Live coherence scoring and conversation flow analysis
- **Topic Progression Tracking**: Monitors natural topic transitions and conversation coherence

### Quality Metrics
- **Coherence Score**: 0-100% rating of overall conversation flow and context awareness
- **Question Response Rate**: Percentage of student questions that receive appropriate responses
- **Purpose Fulfillment**: Analysis of educational goal achievement and variety
- **Topic Flow Visualization**: Visual representation of conversation topic progression

### Expected Performance
- **Question Response Rate**: Improved from ~40% to >80% with enhanced system
- **Coherence Score**: Target >75% for well-configured conversations
- **Natural Flow**: Eliminates abrupt topic changes and maintains context continuity

## Configuration Options

### Generation Modes
- **Single AI**: One model generates both tutor and student responses
- **Enhanced Dual AI**: Context-aware separate models with coherence analysis (recommended)
- **Legacy Dual AI**: Traditional separate models with weaving (fallback mode)

### Educational Purpose Control
- **Auto Mode**: Smart selection based on subject and difficulty
- **Template Mode**: Pre-designed scenarios for common situations
- **Custom Mode**: Full control over specific teaching approaches

### Word Count Controls
- **Tutor Utterances**: Configurable min/max/target word counts
- **Student Utterances**: Separate controls for student responses
- **Style Options**: Concise, balanced, or detailed conversation styles

### Subject and Topic Control
- **Predefined Subjects**: Mathematics, Science, Computer Science, Language Arts, History, Philosophy
- **Custom Topics**: User-specified subjects (e.g., "Quantum Physics", "Medieval Literature", "Data Structures")
- **Adaptive Guidance**: Automatic domain-specific educational approaches for custom topics
- **Subject-Specific Techniques**: Tailored pedagogical methods for different domains

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
  "generationMode": "dual_ai",
  "subject": "Quantum Physics",
  "custom_topic": "Quantum Physics",
  "conversation_structure": {
    "turns": 8,
    "starter": "tutor"
  },
  "purpose_control": {
    "mode": "guided",
    "selected_tutor_purposes": ["explanation", "socratic_questioning"],
    "selected_student_purposes": ["better_understanding", "curiosity_extension"]
  },
  "word_count_controls": {
    "enforce_limits": true,
    "tutor_utterances": { "target_words": 30, "min_words": 20, "max_words": 50 },
    "student_utterances": { "target_words": 15, "min_words": 10, "max_words": 25 }
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

### Enhanced Response Format
Conversations generated with the Enhanced Dual AI System include comprehensive quality metrics:

```json
{
  "conversation": [
    {
      "role": "tutor",
      "content": "Let's explore quantum superposition...",
      "purpose": "explanation",
      "word_count": 28
    }
  ],
  "metadata": {
    "generation_mode": "coherent_dual_ai",
    "coherence_score": 85,
    "question_response_rate": 92,
    "topic_progression": [
      {"turn": 1, "topic": "superposition", "speaker": "tutor"}
    ],
    "purpose_fulfillment": {
      "overall_score": 88,
      "variety_score": 75,
      "balance_score": 90
    },
    "word_count_statistics": {
      "tutor": {"average": 28, "violations": 0},
      "student": {"average": 16, "violations": 0}
    }
  }
}
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

## Recent Updates (2025)

### ✅ Enhanced Dual AI System (v3.0)
- Context-aware conversation generation with turn-by-turn coherence analysis
- Real-time quality metrics including coherence scoring and question response tracking
- Topic progression visualization and purpose fulfillment analytics
- Improved conversation flow with >80% question response rates

### ✅ Custom Topic Support
- User-specified subjects with adaptive educational guidance
- Automatic domain-specific pedagogical approaches for any topic
- Seamless integration with existing purpose control and word count systems

## Roadmap

### Near Term
- Additional AI model support (Claude, Gemini)
- Enhanced export formats (CSV, XLSX) with quality metrics
- Conversation templates library with coherence examples
- Bulk conversation generation with quality analysis

### Future Plans
- Multi-language conversation generation with cultural adaptation
- Advanced NLP analytics for deeper conversation insights
- Integration with learning management systems and educational platforms
- Mobile application with offline conversation review

---

Built with passion for education and open source collaboration.
