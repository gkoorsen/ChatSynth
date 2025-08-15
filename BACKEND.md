# ChatSynth Backend API

This document describes the backend API that ChatSynth requires to function. You can implement this API using AWS Lambda, Express.js, or any other backend technology.

## API Endpoints

### POST /generate

Generates educational conversations using AI models.

#### Request Body

```json
{
  "generationMode": "single_ai" | "dual_ai",
  "conversation_count": 1,
  "subject": "mathematics",
  "conversation_structure": {
    "turns": 8,
    "starter": "tutor",
    "purpose": "Educational tutoring session...",
    "tutor_student_ratio": "1:1",
    "conversation_starter": "tutor"
  },
  "vocabulary": {
    "complexity": "intermediate",
    "domain_specific": true,
    "subject": "mathematics"
  },
  "tutor_questions": {
    "frequency": "moderate",
    "type": "scaffolding",
    "purpose_distribution": {
      "assessment": 1,
      "guidance": 1,
      "clarification": 1
    }
  },
  "student_utterances": {
    "engagement": "high",
    "confusion_level": "realistic",
    "confusion_scores": {
      "mean": 3,
      "std": 1,
      "min": 1,
      "max": 5
    },
    "correctness_distribution": {
      "correct_independent": 0.3,
      "correct_assisted": 0.5,
      "incorrect": 0.2
    }
  },
  "ai_settings": {
    "model": "gpt-4o",
    "temperature": 0.7,
    "max_completion_tokens": 2000,
    "api_key": "sk-..."
  }
}
```

#### Synchronous Response (single_ai mode)

```json
{
  "conversation": [
    {
      "role": "tutor",
      "content": "Hello! Today we're going to work on algebra. What would you like to practice?",
      "purpose": "greeting"
    },
    {
      "role": "student",
      "content": "I'm struggling with solving linear equations.",
      "purpose": "help_with_problem"
    }
  ],
  "metadata": {
    "generated_at": "2025-01-15T10:30:00Z",
    "total_turns": 8,
    "subject": "mathematics",
    "model": "gpt-4o"
  }
}
```

### POST /generate?mode=async

Starts an asynchronous conversation generation job (for dual_ai mode).

#### Response

```json
{
  "jobId": "job-12345-abc",
  "status": "queued",
  "message": "Job queued for processing"
}
```

### GET /generate?mode=status&jobId={jobId}

Checks the status of an asynchronous job.

#### Response

```json
{
  "jobId": "job-12345-abc",
  "status": "completed",
  "conversation": [...],
  "metadata": {...}
}
```

#### Possible Status Values

- `queued` - Job is waiting to be processed
- `processing` - Job is currently being processed
- `completed` - Job completed successfully
- `failed` - Job failed with error

## Implementation Examples

### AWS Lambda with Node.js

```javascript
const { OpenAI } = require('openai');

exports.handler = async (event) => {
    const { httpMethod, queryStringParameters, body } = event;
    
    if (httpMethod === 'POST') {
        const config = JSON.parse(body);
        
        if (queryStringParameters?.mode === 'async') {
            // Start async job
            return await startAsyncJob(config);
        } else {
            // Synchronous generation
            return await generateConversation(config);
        }
    } else if (httpMethod === 'GET' && queryStringParameters?.mode === 'status') {
        // Check job status
        return await checkJobStatus(queryStringParameters.jobId);
    }
    
    return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request' })
    };
};

async function generateConversation(config) {
    const openai = new OpenAI({
        apiKey: config.ai_settings.api_key
    });
    
    // Your conversation generation logic here
    const conversation = await createEducationalConversation(openai, config);
    
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            conversation,
            metadata: {
                generated_at: new Date().toISOString(),
                total_turns: conversation.length,
                subject: config.subject,
                model: config.ai_settings.model
            }
        })
    };
}
```

### Express.js Implementation

```javascript
const express = require('express');
const { OpenAI } = require('openai');
const app = express();

app.use(express.json());
app.use(cors());

app.post('/generate', async (req, res) => {
    try {
        const config = req.body;
        
        if (req.query.mode === 'async') {
            const jobId = await startAsyncJob(config);
            res.json({ jobId, status: 'queued' });
        } else {
            const result = await generateConversation(config);
            res.json(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/generate', async (req, res) => {
    if (req.query.mode === 'status' && req.query.jobId) {
        const status = await checkJobStatus(req.query.jobId);
        res.json(status);
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

app.listen(3001, () => {
    console.log('ChatSynth API running on port 3001');
});
```

## OpenAI Integration

### Prompt Engineering

The backend should construct educational conversation prompts based on the configuration. Example:

```javascript
function buildPrompt(config) {
    return `Generate a ${config.subject} tutoring conversation with the following parameters:
    
    - Number of turns: ${config.conversation_structure.turns}
    - Starting role: ${config.conversation_structure.starter}
    - Vocabulary level: ${config.vocabulary.complexity}
    - Student engagement: ${config.student_utterances.engagement}
    - Question type: ${config.tutor_questions.type}
    
    Purpose: ${config.conversation_structure.purpose}
    
    Return the conversation as a JSON array with objects containing:
    - role: "tutor" or "student"
    - content: the actual message
    - purpose: the educational purpose of this turn
    
    Make the conversation realistic and educationally valuable.`;
}
```

### Model-Specific Handling

```javascript
async function callOpenAI(prompt, aiSettings) {
    const isO3Mini = aiSettings.model === 'o3-mini';
    
    const params = {
        model: aiSettings.model,
        messages: [{ role: 'user', content: prompt }],
        [isO3Mini ? 'max_completion_tokens' : 'max_tokens']: aiSettings.max_completion_tokens || aiSettings.max_tokens
    };
    
    if (isO3Mini) {
        params.reasoning_effort = aiSettings.reasoning_effort || 'medium';
    } else {
        params.temperature = aiSettings.temperature || 0.7;
        params.top_p = aiSettings.top_p || 1.0;
        params.frequency_penalty = aiSettings.frequency_penalty || 0.0;
        params.presence_penalty = aiSettings.presence_penalty || 0.0;
    }
    
    const response = await openai.chat.completions.create(params);
    return response.choices[0].message.content;
}
```

## Security Considerations

1. **API Key Handling**: Never log or store API keys permanently
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Input Validation**: Validate all input parameters
4. **CORS**: Configure CORS appropriately for your domain
5. **Error Handling**: Don't expose internal errors to clients

## Error Responses

```json
{
    "error": "Invalid configuration",
    "details": "Missing required field: subject",
    "code": "VALIDATION_ERROR"
}
```

## Testing

Use tools like Postman or curl to test your API:

```bash
curl -X POST https://your-api.com/generate \
  -H "Content-Type: application/json" \
  -d '{
    "generationMode": "single_ai",
    "subject": "mathematics",
    "conversation_structure": {
      "turns": 4,
      "starter": "tutor"
    },
    "ai_settings": {
      "model": "gpt-4o",
      "api_key": "your-api-key"
    }
  }'
```
