// enhanced-dual-ai.js
// Context-aware dual AI conversation generation with coherence-focused architecture

/**
 * Context-aware AI agent that maintains conversation history and makes contextual decisions
 */
class ContextAwareAI {
    constructor(role, config) {
        this.role = role; // 'tutor' or 'student'
        this.config = config;
        this.conversationHistory = [];
        this.roleSettings = config.word_count_controls?.[`${role}_utterances`];
        
        // Purpose selection based on role
        this.availablePurposes = this.getAvailablePurposes();
        this.usedPurposes = [];
        
        console.log(`🤖 Created context-aware ${role} AI with purposes:`, this.availablePurposes);
        console.log(`📏 ${role} word count settings:`, this.roleSettings);
    }
    
    /**
     * Gets available purposes for this AI's role
     */
    getAvailablePurposes() {
        const { getPurposeConfiguration } = require('./prompt-engineering');
        const purposeConfig = getPurposeConfiguration(this.config);
        
        if (this.role === 'tutor') {
            return [...purposeConfig.tutorPurposes, ...purposeConfig.customPurposes.tutor.map(p => p.id)];
        } else {
            return [...purposeConfig.studentPurposes, ...purposeConfig.customPurposes.student.map(p => p.id)];
        }
    }
    
    /**
     * Selects an appropriate purpose based on conversation context
     */
    selectContextualPurpose(conversationHistory, lastTurn) {
        // Analyze conversation context to select appropriate purpose
        const availablePurposes = this.availablePurposes.filter(p => 
            !this.usedPurposes.includes(p) || this.usedPurposes.length >= this.availablePurposes.length
        );
        
        if (availablePurposes.length === 0) {
            this.usedPurposes = []; // Reset if all purposes used
            return this.availablePurposes[0];
        }
        
        // Context-aware purpose selection
        if (lastTurn) {
            // Respond to questions
            if (this.containsQuestion(lastTurn.content)) {
                if (this.role === 'tutor') {
                    const preferredPurposes = ['explanation', 'clarification', 'scaffolding'];
                    for (const purpose of preferredPurposes) {
                        if (availablePurposes.includes(purpose)) {
                            return purpose;
                        }
                    }
                } else {
                    const preferredPurposes = ['better_understanding', 'clarification', 'validation_seeking'];
                    for (const purpose of preferredPurposes) {
                        if (availablePurposes.includes(purpose)) {
                            return purpose;
                        }
                    }
                }
            }
            
            // Respond to confusion indicators
            if (this.containsConfusion(lastTurn.content)) {
                if (this.role === 'tutor') {
                    const helpPurposes = ['scaffolding', 'encouragement', 'error_recovery'];
                    for (const purpose of helpPurposes) {
                        if (availablePurposes.includes(purpose)) {
                            return purpose;
                        }
                    }
                } else {
                    const confusionPurposes = ['confusion_expression', 'help_with_problem'];
                    for (const purpose of confusionPurposes) {
                        if (availablePurposes.includes(purpose)) {
                            return purpose;
                        }
                    }
                }
            }
        }
        
        // Default: use first available purpose
        return availablePurposes[0];
    }
    
    /**
     * Detects if content contains a question
     */
    containsQuestion(content) {
        return content.includes('?') || 
               content.toLowerCase().includes('what') ||
               content.toLowerCase().includes('how') ||
               content.toLowerCase().includes('why') ||
               content.toLowerCase().includes('when') ||
               content.toLowerCase().includes('where');
    }
    
    /**
     * Detects confusion indicators in content
     */
    containsConfusion(content) {
        const confusionWords = [
            'confused', 'don\'t understand', 'not sure', 'unclear', 
            'difficult', 'hard', 'lost', 'help', 'stuck'
        ];
        const lowerContent = content.toLowerCase();
        return confusionWords.some(word => lowerContent.includes(word));
    }
    
    /**
     * Generates a contextual prompt for this AI agent
     */
    generateContextualPrompt(conversationHistory, isFirstTurn = false) {
        const { 
            buildPurposeInstructions,
            buildWordCountInstructions,
            getLanguageName
        } = require('./prompt-engineering');
        
        const conversationLanguage = this.config.language || 'english';
        const languageName = getLanguageName(conversationLanguage);
        
        // Determine the purpose for this turn
        const lastTurn = conversationHistory.length > 0 ? conversationHistory[conversationHistory.length - 1] : null;
        const selectedPurpose = this.selectContextualPurpose(conversationHistory, lastTurn);
        this.usedPurposes.push(selectedPurpose);
        
        // Build context-aware system prompt
        const systemPrompt = this.role === 'tutor' 
            ? this.buildTutorContextualPrompt(conversationHistory, selectedPurpose, languageName)
            : this.buildStudentContextualPrompt(conversationHistory, selectedPurpose, languageName);
        
        // Build user prompt with full context
        const userPrompt = this.buildContextualUserPrompt(conversationHistory, selectedPurpose, isFirstTurn, languageName);
        
        return {
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            selectedPurpose
        };
    }
    
    /**
     * Builds context-aware tutor prompt
     */
    buildTutorContextualPrompt(conversationHistory, selectedPurpose, languageName) {
        const { getTutorPurposeDefinition, buildWordCountInstructions } = require('./prompt-engineering');
        const purposeDefinition = getTutorPurposeDefinition(selectedPurpose);
        const wordCountInstructions = buildWordCountInstructions(this.config);
        
        return `You are an expert ${this.config.subject || 'general education'} tutor engaged in an ongoing conversation with a student.

CONVERSATION CONTEXT:
- You are continuing an educational conversation
- Your role is to guide, teach, and support student learning
- Maintain consistency with the previous conversation flow
- Language: All responses must be in ${languageName}

CURRENT TURN PURPOSE: ${selectedPurpose}
${purposeDefinition.description}

${wordCountInstructions}

COHERENCE REQUIREMENTS:
- Read and understand the full conversation history provided
- Directly address what the student said in their last response
- Answer any questions the student asked
- Build naturally on previous exchanges
- Maintain consistent teaching style and personality
- Create logical topic transitions when needed

RESPONSE REQUIREMENTS:
- Target word count: ${this.roleSettings?.target_words || 30} words
- Stay within ${this.roleSettings?.min_words || 15}-${this.roleSettings?.max_words || 50} words
- Use ${this.roleSettings?.style || 'balanced'} communication style
- Include the selected purpose in your response
- Provide educational value appropriate to the context

OUTPUT FORMAT:
Return ONLY a JSON object with this structure:
{
  "content": "your response in ${languageName}",
  "purpose": "${selectedPurpose}",
  "word_count": actual_word_count,
  "addresses_previous": true/false,
  "topic_transition": "none/smooth/new" 
}`;
    }
    
    /**
     * Builds context-aware student prompt
     */
    buildStudentContextualPrompt(conversationHistory, selectedPurpose, languageName) {
        const { getStudentPurposeDefinition, buildWordCountInstructions } = require('./prompt-engineering');
        const purposeDefinition = getStudentPurposeDefinition(selectedPurpose);
        const wordCountInstructions = buildWordCountInstructions(this.config);
        
        return `You are a ${this.config.vocabulary?.complexity || 'intermediate'}-level student learning ${this.config.subject || 'general education'}.

CONVERSATION CONTEXT:
- You are continuing an educational conversation with your tutor
- Your role is to learn, ask questions, and engage authentically
- Show realistic thinking processes and learning patterns
- Language: All responses must be in ${languageName}

CURRENT TURN PURPOSE: ${selectedPurpose}
${purposeDefinition.description}

${wordCountInstructions}

STUDENT CHARACTERISTICS:
- Engagement level: ${this.config.student_utterances?.engagement || 'high'}
- Confusion tendency: ${this.config.student_utterances?.confusion_level || 'realistic'}
- Learning style: Authentic student responses with natural hesitations
- Vocabulary: ${this.config.vocabulary?.complexity || 'intermediate'} level

COHERENCE REQUIREMENTS:
- Read and understand the full conversation history provided
- Respond naturally to what the tutor just said
- Ask follow-up questions when appropriate
- Show your thinking process and learning journey
- Build on previous exchanges in the conversation
- Demonstrate realistic student confusion and breakthroughs

RESPONSE REQUIREMENTS:
- Target word count: ${this.roleSettings?.target_words || 15} words
- Stay within ${this.roleSettings?.min_words || 8}-${this.roleSettings?.max_words || 25} words
- Use ${this.roleSettings?.style || 'natural'} communication style
- Include the selected purpose in your response
- Show authentic student learning behavior

OUTPUT FORMAT:
Return ONLY a JSON object with this structure:
{
  "content": "your response in ${languageName}",
  "purpose": "${selectedPurpose}",
  "word_count": actual_word_count,
  "addresses_previous": true/false,
  "shows_learning": true/false
}`;
    }
    
    /**
     * Builds contextual user prompt with conversation history
     */
    buildContextualUserPrompt(conversationHistory, selectedPurpose, isFirstTurn, languageName) {
        let prompt = `CONVERSATION HISTORY:\n`;
        
        if (conversationHistory.length === 0 || isFirstTurn) {
            prompt += `[This is the beginning of the conversation]\n\n`;
        } else {
            prompt += conversationHistory.map((turn, index) => 
                `Turn ${index + 1} (${turn.role}): "${turn.content}"`
            ).join('\n') + '\n\n';
        }
        
        prompt += `INSTRUCTION:
Continue this conversation as the ${this.role} using the purpose "${selectedPurpose}".
${isFirstTurn ? `You are starting the conversation.` : `Respond naturally to the previous turn while fulfilling your educational purpose.`}

Language: ${languageName}
Subject: ${this.config.subject || 'general education'}

Generate your next response that maintains conversation coherence and educational effectiveness.`;
        
        return prompt;
    }
    
    /**
     * Calls AI with contextual prompt and processes response
     */
    async callAIWithContextualPrompt(prompt, config, callOpenAI) {
        const aiSettings = config.ai_settings;
        
        console.log(`🤖 Calling ${this.role} AI with contextual prompt`);
        console.log(`🎯 Selected purpose: ${prompt.selectedPurpose}`);
        
        try {
            const response = await callOpenAI(prompt.messages, aiSettings);
            
            if (!response.choices || !response.choices[0] || !response.choices[0].message) {
                throw new Error('Invalid OpenAI response structure');
            }
            
            const content = response.choices[0].message.content;
            
            // Parse the JSON response
            let parsedResponse;
            try {
                parsedResponse = JSON.parse(content);
            } catch (parseError) {
                console.warn(`⚠️ Failed to parse ${this.role} response as JSON:`, content);
                // Fallback: create a basic response
                parsedResponse = {
                    content: content,
                    purpose: prompt.selectedPurpose,
                    word_count: this.countWords(content),
                    addresses_previous: true
                };
            }
            
            // Ensure word count is calculated
            if (!parsedResponse.word_count) {
                parsedResponse.word_count = this.countWords(parsedResponse.content);
            }
            
            // Ensure role is set
            parsedResponse.role = this.role;
            
            console.log(`✅ ${this.role} response generated: ${parsedResponse.word_count} words, purpose: ${parsedResponse.purpose}`);
            
            return parsedResponse;
            
        } catch (error) {
            console.error(`💥 Error in ${this.role} AI call:`, error);
            throw error;
        }
    }
    
    /**
     * Helper method to count words
     */
    countWords(text) {
        if (!text || typeof text !== 'string') return 0;
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
}

/**
 * Main function to generate coherent dual AI conversations
 */
async function generateCoherentDualAIConversation(config, callOpenAI = null) {
    console.log('🚀 Starting enhanced coherent dual AI conversation generation...');
    console.log('🎯 Config:', {
        subject: config.subject,
        turns: config.conversation_structure?.turns,
        starter: config.conversation_structure?.starter,
        language: config.language
    });
    
    // Import callOpenAI if not provided (for standalone usage)
    if (!callOpenAI) {
        try {
            const { callOpenAI: importedCallOpenAI } = require('./index');
            callOpenAI = importedCallOpenAI;
            console.log('📥 Imported callOpenAI from index.js');
        } catch (error) {
            console.error('💥 Could not import callOpenAI:', error);
            throw new Error('callOpenAI function is required but not provided and could not be imported');
        }
    }
    
    // Initialize context-aware AI agents
    const tutorAgent = new ContextAwareAI('tutor', config);
    const studentAgent = new ContextAwareAI('student', config);
    
    const maxTurns = config.conversation_structure?.turns || 8;
    const starter = config.conversation_structure?.starter || 'tutor';
    const conversation = [];
    
    // Quality tracking
    let questionsAsked = 0;
    let questionsAnswered = 0;
    let topicProgression = [];
    let currentTopic = null;
    
    try {
        console.log(`🔄 Generating ${maxTurns} turns starting with ${starter}...`);
        
        for (let turnIndex = 0; turnIndex < maxTurns; turnIndex++) {
            const isCurrentTurnTutor = (starter === 'tutor' && turnIndex % 2 === 0) || 
                                     (starter === 'student' && turnIndex % 2 === 1);
            const currentAgent = isCurrentTurnTutor ? tutorAgent : studentAgent;
            const currentRole = isCurrentTurnTutor ? 'tutor' : 'student';
            
            console.log(`🔄 Turn ${turnIndex + 1}/${maxTurns}: ${currentRole}`);
            
            // Generate contextual prompt
            const prompt = currentAgent.generateContextualPrompt(conversation, turnIndex === 0);
            
            // Call AI with contextual awareness
            const response = await currentAgent.callAIWithContextualPrompt(prompt, config, callOpenAI);
            
            // Add to conversation
            conversation.push(response);
            
            // Track quality metrics
            if (currentRole === 'student' && currentAgent.containsQuestion(response.content)) {
                questionsAsked++;
            }
            
            if (turnIndex > 0) {
                const previousTurn = conversation[turnIndex - 1];
                if (currentRole === 'tutor' && currentAgent.containsQuestion(previousTurn.content)) {
                    if (response.addresses_previous !== false) {
                        questionsAnswered++;
                    }
                }
            }
            
            // Track topic progression
            if (response.topic_transition && response.topic_transition !== 'none') {
                topicProgression.push({
                    turn: turnIndex + 1,
                    speaker: currentRole,
                    transition: response.topic_transition,
                    topic: extractMainTopic(response.content, config.subject)
                });
            }
            
            console.log(`✅ Turn ${turnIndex + 1} completed: "${response.content.substring(0, 50)}..."`)
        }
        
        console.log('🔍 Analyzing conversation quality...');
        
        // Calculate quality metrics
        const coherenceScore = calculateCoherenceScore(conversation);
        const questionResponseRate = questionsAsked > 0 ? Math.round((questionsAnswered / questionsAsked) * 100) : 100;
        const purposeFulfillment = analyzePurposeFulfillment(conversation, config);
        
        console.log(`📊 Quality metrics:`);
        console.log(`   - Coherence score: ${coherenceScore}%`);
        console.log(`   - Question response rate: ${questionResponseRate}%`);
        console.log(`   - Purpose fulfillment: ${purposeFulfillment.overall_score}%`);
        console.log(`   - Topic transitions: ${topicProgression.length}`);
        
        return {
            conversation,
            metadata: {
                coherence_score: coherenceScore,
                questions_answered: questionResponseRate,
                topic_progression: topicProgression,
                purpose_fulfillment: purposeFulfillment,
                generation_mode: 'coherent_dual_ai',
                total_questions_asked: questionsAsked,
                total_questions_answered: questionsAnswered,
                conversation_length: conversation.length
            }
        };
        
    } catch (error) {
        console.error('💥 Error in coherent dual AI generation:', error);
        throw error;
    }
}

/**
 * Calculates coherence score based on conversation flow
 */
function calculateCoherenceScore(conversation) {
    if (conversation.length < 2) return 100;
    
    let coherencePoints = 0;
    let totalChecks = 0;
    
    for (let i = 1; i < conversation.length; i++) {
        const currentTurn = conversation[i];
        const previousTurn = conversation[i - 1];
        
        totalChecks++;
        
        // Check if turn addresses previous turn
        if (currentTurn.addresses_previous !== false) {
            coherencePoints++;
        }
        
        // Check for smooth topic transitions
        if (currentTurn.topic_transition === 'smooth' || currentTurn.topic_transition === 'none') {
            coherencePoints++;
            totalChecks++;
        }
        
        // Check for appropriate role behavior
        if (currentTurn.role === 'student' && currentTurn.shows_learning !== false) {
            coherencePoints++;
            totalChecks++;
        }
    }
    
    return Math.round((coherencePoints / Math.max(totalChecks, 1)) * 100);
}

/**
 * Analyzes how well purposes were fulfilled throughout the conversation
 */
function analyzePurposeFulfillment(conversation, config) {
    const tutorPurposes = [];
    const studentPurposes = [];
    
    conversation.forEach(turn => {
        if (turn.purpose) {
            if (turn.role === 'tutor') {
                tutorPurposes.push(turn.purpose);
            } else {
                studentPurposes.push(turn.purpose);
            }
        }
    });
    
    // Calculate variety scores
    const tutorVariety = new Set(tutorPurposes).size;
    const studentVariety = new Set(studentPurposes).size;
    
    // Calculate balance (how evenly purposes are distributed)
    const tutorPurposeDistribution = {};
    tutorPurposes.forEach(p => {
        tutorPurposeDistribution[p] = (tutorPurposeDistribution[p] || 0) + 1;
    });
    
    const studentPurposeDistribution = {};
    studentPurposes.forEach(p => {
        studentPurposeDistribution[p] = (studentPurposeDistribution[p] || 0) + 1;
    });
    
    // Simple balance calculation (could be more sophisticated)
    const varietyScore = Math.round(((tutorVariety + studentVariety) / 8) * 100); // Assuming max 4 purposes per role
    const balanceScore = 80; // Simplified for now
    const overallScore = Math.round((varietyScore + balanceScore) / 2);
    
    return {
        variety_score: varietyScore,
        balance_score: balanceScore,
        overall_score: overallScore,
        tutor_purposes_used: tutorPurposes,
        student_purposes_used: studentPurposes,
        tutor_variety: tutorVariety,
        student_variety: studentVariety
    };
}

/**
 * Extracts the main topic from content
 */
function extractMainTopic(content, subject) {
    // Simple topic extraction (could be enhanced with NLP)
    const words = content.toLowerCase().split(/\s+/);
    const subjectKeywords = {
        'mathematics': ['number', 'equation', 'solve', 'calculate', 'formula', 'graph'],
        'science': ['experiment', 'hypothesis', 'theory', 'observe', 'test', 'evidence'],
        'computer_science': ['code', 'program', 'algorithm', 'function', 'variable', 'loop'],
        'language_arts': ['story', 'character', 'theme', 'author', 'meaning', 'analyze'],
        'history': ['event', 'cause', 'effect', 'period', 'civilization', 'war']
    };
    
    const relevantKeywords = subjectKeywords[subject] || [];
    for (const keyword of relevantKeywords) {
        if (words.includes(keyword)) {
            return keyword;
        }
    }
    
    return subject || 'general';
}

module.exports = {
    generateCoherentDualAIConversation,
    ContextAwareAI,
    calculateCoherenceScore,
    analyzePurposeFulfillment
};