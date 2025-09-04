const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const https = require('https');

// Import enhanced prompt engineering functions WITH PURPOSE AND WORD COUNT CONTROL
const { 
    buildMasterEducationalPrompt, 
    getRecommendedTechniques,
    buildDualAIPrompts,
    generateConversationWithPurposes,
    getPurposeConfiguration,
    validateEducationalQualityWithPurposes,
    countWords
} = require('./prompt-engineering');

// Initialize DynamoDB client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'ChatSynthJobs';

exports.handler = async (event, context) => {
    // This part is critical to allow the background process to run after the initial response is sent.
    context.callbackWaitsForEmptyEventLoop = false;

    console.log('📊 Lambda context info:');
    console.log('- Remaining time:', context.getRemainingTimeInMillis(), 'ms');
    console.log('- Memory limit:', context.memoryLimitInMB, 'MB');
    console.log('Event received:', JSON.stringify(event, null, 2));

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'CORS preflight successful' })
        };
    }

    try {
        const method = event.httpMethod;
        const queryParams = event.queryStringParameters || {};

        if (method === 'GET' && queryParams.mode === 'status' && queryParams.jobId) {
            return await checkJobStatus(queryParams.jobId, headers);
        }

        if (method === 'POST') {
            let requestBody;
            try {
                requestBody = JSON.parse(event.body);
            } catch (parseError) {
                console.error('Error parsing request body:', parseError);
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid JSON in request body' })
                };
            }

            const mode = queryParams.mode || requestBody.mode;

            if (mode === 'async') {
                // The handler will now correctly return a response right after this call.
                return await createAsyncJob(requestBody, headers);
            }

            // Direct mode for very fast jobs (use with caution)
            return await generateConversationDirect(requestBody, headers);
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('Handler error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};

// PURPOSE AND WORD COUNT CONTROLLED conversation generation
async function generateConversation(config) {
    console.log('🚀 Starting PURPOSE AND WORD COUNT CONTROLLED conversation generation');
    console.log('📋 Full config received:', JSON.stringify(config, null, 2));
    console.log('🎯 Purpose control config:', config.purpose_control);
    console.log('📏 Word count control config:', config.word_count_controls);

    const aiSettings = config.ai_settings || {
        model: 'gpt-4o',
        temperature: 0.7,
        max_completion_tokens: 3000
    };

    console.log('🤖 Using AI settings:', JSON.stringify(aiSettings, null, 2));

    try {
        // ✨ PURPOSE AND WORD COUNT CONTROL SYSTEM ✨
        
        // Step 1: Get purpose configuration from frontend
        const purposeConfig = getPurposeConfiguration(config);
        console.log('🎯 Purpose configuration determined:', purposeConfig);
        
        // Step 2: Log word count settings
        if (config.word_count_controls?.enforce_limits) {
            console.log('📏 Word count controls enabled:');
            console.log(`   - Tutor: ${config.word_count_controls.tutor_utterances?.min_words}-${config.word_count_controls.tutor_utterances?.max_words} words (target: ${config.word_count_controls.tutor_utterances?.target_words})`);
            console.log(`   - Student: ${config.word_count_controls.student_utterances?.min_words}-${config.word_count_controls.student_utterances?.max_words} words (target: ${config.word_count_controls.student_utterances?.target_words})`);
            console.log(`   - Variation allowed: ${config.word_count_controls.allow_variation ? 'Yes' : 'No'}`);
        } else {
            console.log('📏 Word count controls disabled - using natural conversation flow');
        }
        
        // Step 3: Auto-select techniques (can still be overridden by user)
        const recommendedTechniques = getRecommendedTechniques(config);
        const selectedTechniques = config.prompt_techniques || recommendedTechniques;
        console.log('🎯 Using techniques:', selectedTechniques);
        
        // Step 4: Build sophisticated prompt with PURPOSE AND WORD COUNT CONTROL
        const promptData = buildMasterEducationalPrompt(config, aiSettings, selectedTechniques);
        console.log('📝 Purpose and word count controlled prompt system activated');
        console.log('📝 Prompt preview (first 500 chars):', promptData.messages[0].content.substring(0, 500));
        
        // Step 5: Call OpenAI with purpose and word count controlled prompt
        console.log('📤 Sending purpose and word count controlled request to OpenAI...');
        const openaiResponse = await callOpenAI(promptData.messages, aiSettings);
        
        console.log('📥 OpenAI response received');
        
        if (!openaiResponse.choices || !openaiResponse.choices[0] || !openaiResponse.choices[0].message) {
            console.error('❌ Unexpected OpenAI response structure:', openaiResponse);
            throw new Error('Invalid OpenAI response structure');
        }
        
        const rawContent = openaiResponse.choices[0].message.content;
        const finishReason = openaiResponse.choices[0].finish_reason;
        
        console.log('📝 Content length:', rawContent ? rawContent.length : 0);
        console.log('🏁 Finish reason:', finishReason);
        console.log('💰 Token usage:', JSON.stringify(openaiResponse.usage || {}, null, 2));

        // Check if response was truncated
        if (finishReason === 'length') {
            console.warn('⚠️ Response was truncated due to token limit!');
            throw new Error('Response was truncated due to token limit. Try reducing conversation turns or increasing max_completion_tokens.');
        }

        // Enhanced JSON parsing
        let conversationData;
        try {
            console.log('🔄 Attempting direct JSON parse...');
            conversationData = JSON.parse(rawContent);
            console.log('✅ Direct JSON parse successful');
        } catch (parseError) {
            console.error('❌ Direct JSON parse failed:', parseError.message);
            console.log('🔄 Attempting enhanced JSON extraction...');
            
            conversationData = extractJsonFromResponse(rawContent);
            
            if (!conversationData) {
                console.error('❌ Failed to extract valid JSON from response');
                console.log('Raw content that failed to parse:', rawContent.substring(0, 1000));
                throw new Error(`JSON Parse Error: ${parseError.message}. Enhanced extraction also failed.`);
            }
            console.log('✅ Enhanced JSON extraction successful');
        }

        // Validate conversation structure
        const conversation = conversationData.conversation;
        
        if (!conversation || !Array.isArray(conversation)) {
            console.error('❌ No valid conversation array found');
            throw new Error('OpenAI response missing conversation array');
        }

        if (conversation.length === 0) {
            throw new Error('Generated conversation is empty');
        }

        // Enhanced validation - check purpose compliance AND word count compliance
        const qualityCheck = validateEducationalQualityWithPurposes(conversation, config);

        // Validate each turn and add word count if missing
        for (let i = 0; i < conversation.length; i++) {
            const turn = conversation[i];
            if (!turn.role || !turn.content) {
                throw new Error(`Conversation turn ${i} missing role or content`);
            }
            if (!['tutor', 'student'].includes(turn.role)) {
                throw new Error(`Invalid role "${turn.role}" at turn ${i}`);
            }
            
            // Add word count if not present
            if (!turn.word_count) {
                turn.word_count = countWords(turn.content);
                console.log(`📏 Added word count for turn ${i} (${turn.role}): ${turn.word_count} words`);
            }
        }

        console.log(`✅ Successfully generated PURPOSE AND WORD COUNT CONTROLLED conversation with ${conversation.length} turns`);
        console.log('📊 Purpose distribution:', qualityCheck.purposeDistribution);
        console.log('📏 Word count statistics:', qualityCheck.wordCountStats);
        console.log('📊 Educational techniques applied:', selectedTechniques);
        
        // Enhanced metadata with word count information
        const enhancedMetadata = {
            purpose_control_mode: purposeConfig.mode,
            selected_tutor_purposes: purposeConfig.tutorPurposes,
            selected_student_purposes: purposeConfig.studentPurposes,
            custom_purposes_count: {
                tutor: purposeConfig.customPurposes.tutor.length,
                student: purposeConfig.customPurposes.student.length
            },
            purpose_distribution: qualityCheck.purposeDistribution,
            purpose_compliance: qualityCheck.passed,
            validation_issues: qualityCheck.issues,
            
            // NEW: Word count metadata
            word_count_enabled: config.word_count_controls?.enforce_limits || false,
            word_count_settings: config.word_count_controls || null,
            word_count_statistics: qualityCheck.wordCountStats,
            word_count_compliance: qualityCheck.wordCountStats ? 
                (qualityCheck.wordCountStats.tutor.violations === 0 && 
                 qualityCheck.wordCountStats.student.violations === 0) : null,
            
            techniques_used: selectedTechniques,
            prompt_version: '2.1_purpose_and_word_controlled',
            educational_validation: qualityCheck.passed ? 'passed' : 'issues_detected',
            token_usage: openaiResponse.usage
        };
        
        // Return conversation with enhanced metadata
        return {
            conversation,
            enhancedMetadata
        };

    } catch (error) {
        console.error('💥 Error in purpose and word count controlled generateConversation:', error);
        throw error;
    }
}

// Enhanced dual AI conversation generation with coherence and word count controls
async function generateDualAIConversation(config) {
    console.log('🤝 Starting enhanced coherent dual AI conversation generation...');
    console.log('🎯 Purpose control config for dual AI:', config.purpose_control);
    console.log('📏 Word count control config for dual AI:', config.word_count_controls);
    
    const USE_ENHANCED_DUAL_AI = process.env.USE_ENHANCED_DUAL_AI !== 'false'; // Default to true
    
    if (USE_ENHANCED_DUAL_AI) {
        console.log('🚀 Using enhanced coherent dual AI system...');
        try {
            const { generateCoherentDualAIConversation } = require('./enhanced-dual-ai');
            const result = await generateCoherentDualAIConversation(config, callOpenAI);
            
            // Validate and enhance the conversation
            const qualityCheck = validateEducationalQualityWithPurposes(result.conversation, config);
            
            return {
                conversation: result.conversation,
                enhancedMetadata: {
                    generation_mode: 'coherent_dual_ai',
                    coherence_score: result.metadata.coherence_score,
                    question_response_rate: result.metadata.questions_answered,
                    topic_progression: result.metadata.topic_progression,
                    purpose_fulfillment: result.metadata.purpose_fulfillment,
                    purpose_control_mode: config.purpose_control?.mode || 'auto',
                    purpose_distribution: qualityCheck.purposeDistribution,
                    purpose_compliance: qualityCheck.passed,
                    word_count_enabled: config.word_count_controls?.enforce_limits || false,
                    word_count_statistics: qualityCheck.wordCountStats,
                    word_count_compliance: qualityCheck.wordCountStats ? 
                        (qualityCheck.wordCountStats.tutor.violations === 0 && 
                         qualityCheck.wordCountStats.student.violations === 0) : null,
                    prompt_version: '3.0_coherent_dual_ai',
                    total_turns: result.conversation.length,
                    questions_asked: result.metadata.total_questions_asked,
                    questions_answered_count: result.metadata.total_questions_answered
                }
            };
            
        } catch (error) {
            console.error('💥 Enhanced coherent dual AI failed, falling back to legacy system:', error);
            // Fall through to legacy system
        }
    }
    
    // Legacy dual AI system (fallback)
    console.log('🔄 Using legacy dual AI system...');
    const aiSettings = config.ai_settings;
    
    // Build separate prompts for tutor and student AI with PURPOSE AND WORD COUNT CONTROL
    const dualPrompts = buildDualAIPrompts(config, aiSettings);
    console.log('📝 Purpose and word count controlled dual AI prompts generated');
    
    try {
        // Generate tutor conversation
        console.log('👨‍🏫 Generating purpose and word count controlled tutor AI conversation...');
        const tutorResponse = await callOpenAI(dualPrompts.tutorPrompt.messages, aiSettings);
        const tutorConversation = JSON.parse(tutorResponse.choices[0].message.content).conversation;
        
        // Generate student conversation  
        console.log('👨‍🎓 Generating purpose and word count controlled student AI conversation...');
        const studentResponse = await callOpenAI(dualPrompts.studentPrompt.messages, aiSettings);
        const studentConversation = JSON.parse(studentResponse.choices[0].message.content).conversation;
        
        // Weave conversations together
        const weavedConversation = weaveConversations(tutorConversation, studentConversation, config);
        
        // Add word counts if missing and validate
        weavedConversation.forEach((turn, index) => {
            if (!turn.word_count) {
                turn.word_count = countWords(turn.content);
                console.log(`📏 Added word count for woven turn ${index} (${turn.role}): ${turn.word_count} words`);
            }
        });
        
        // Validate purpose compliance and word count for the woven conversation
        const qualityCheck = validateEducationalQualityWithPurposes(weavedConversation, config);
        
        console.log(`✅ Legacy dual AI conversation generated with ${weavedConversation.length} turns`);
        console.log('📊 Purpose distribution in dual AI:', qualityCheck.purposeDistribution);
        console.log('📏 Word count statistics in dual AI:', qualityCheck.wordCountStats);
        
        return {
            conversation: weavedConversation,
            enhancedMetadata: {
                generation_mode: 'legacy_dual_ai_purpose_and_word_controlled',
                purpose_control_mode: config.purpose_control?.mode || 'auto',
                purpose_distribution: qualityCheck.purposeDistribution,
                purpose_compliance: qualityCheck.passed,
                word_count_enabled: config.word_count_controls?.enforce_limits || false,
                word_count_statistics: qualityCheck.wordCountStats,
                word_count_compliance: qualityCheck.wordCountStats ? 
                    (qualityCheck.wordCountStats.tutor.violations === 0 && 
                     qualityCheck.wordCountStats.student.violations === 0) : null,
                prompt_version: '2.1_purpose_and_word_controlled',
                tutor_turns: tutorConversation.length,
                student_turns: studentConversation.length,
                weaved_turns: weavedConversation.length
            }
        };
        
    } catch (error) {
        console.error('💥 Error in purpose and word count controlled dual AI generation:', error);
        throw error;
    }
}

// Helper function to weave dual AI conversations
function weaveConversations(tutorConversation, studentConversation, config) {
    const weavedConversation = [];
    const starter = config.conversation_structure?.starter || 'tutor';
    const maxTurns = config.conversation_structure?.turns || 8;
    
    let tutorIndex = 0;
    let studentIndex = 0;
    let currentSpeaker = starter;
    
    for (let i = 0; i < maxTurns && (tutorIndex < tutorConversation.length || studentIndex < studentConversation.length); i++) {
        if (currentSpeaker === 'tutor' && tutorIndex < tutorConversation.length) {
            weavedConversation.push(tutorConversation[tutorIndex]);
            tutorIndex++;
            currentSpeaker = 'student';
        } else if (currentSpeaker === 'student' && studentIndex < studentConversation.length) {
            weavedConversation.push(studentConversation[studentIndex]);
            studentIndex++;
            currentSpeaker = 'tutor';
        } else {
            // Fallback: use whichever conversation has remaining turns
            if (tutorIndex < tutorConversation.length) {
                weavedConversation.push(tutorConversation[tutorIndex]);
                tutorIndex++;
            } else if (studentIndex < studentConversation.length) {
                weavedConversation.push(studentConversation[studentIndex]);
                studentIndex++;
            }
        }
    }
    
    return weavedConversation;
}

// Enhanced direct conversation generation with word count controls
async function generateConversationDirect(config, headers) {
    console.log('🚀 Generating PURPOSE AND WORD COUNT CONTROLLED conversation directly');
    console.log('📋 Direct generation config:', JSON.stringify(config, null, 2));
    console.log('🎯 Purpose control in direct generation:', config.purpose_control);
    console.log('📏 Word count control in direct generation:', config.word_count_controls);

    try {
        // Check if this should use dual AI mode
        if (config.generationMode === 'dual_ai') {
            console.log('🤝 Using purpose and word count controlled dual AI mode for direct generation');
            const result = await generateDualAIConversation(config);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    conversation: result.conversation,
                    metadata: {
                        generated_at: new Date().toISOString(),
                        total_turns: result.conversation.length,
                        generation_mode: 'dual_ai_purpose_and_word_controlled',
                        model: config.ai_settings?.model || 'gpt-4o',
                        ...result.enhancedMetadata
                    }
                })
            };
        } else {
            // Single AI mode with PURPOSE AND WORD COUNT CONTROL
            const result = await generateConversation(config);
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    conversation: result.conversation || result, // Handle both formats
                    metadata: {
                        generated_at: new Date().toISOString(),
                        total_turns: (result.conversation || result).length,
                        generation_mode: 'single_ai_purpose_and_word_controlled',
                        model: config.ai_settings?.model || 'gpt-4o',
                        ...(result.enhancedMetadata || {})
                    }
                })
            };
        }

    } catch (error) {
        console.error('💥 Error in purpose and word count controlled direct conversation generation:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to generate purpose and word count controlled conversation',
                details: error.message,
                errorType: 'purpose_and_word_controlled_generation_error'
            })
        };
    }
}

async function processAsyncJobImmediate(jobId, config) {
    console.log('🎯 ENTERED processAsyncJobImmediate for:', jobId);
    console.log('📊 Lambda memory usage:', process.memoryUsage());
    console.log('📋 Config summary:', { 
        subject: config.subject, 
        model: config.ai_settings?.model,
        generationMode: config.generationMode,
        turns: config.conversation_structure?.turns,
        apiKeyPresent: !!config.ai_settings?.api_key,
        purposeMode: config.purpose_control?.mode
    });
    console.log('🎯 Purpose control in async job:', config.purpose_control);
    console.log('📏 Word count control in async job:', config.word_count_controls);

    try {
        console.log('🔄 Step 1: Updating job status to processing...');
        await updateJobStatus(jobId, 'processing', 25, 'Initializing purpose and word count controlled conversation generation...');
        console.log('✅ Job status updated to processing');
        
        console.log('🔄 Step 2: Validating configuration...');
        if (!config.ai_settings?.api_key) {
            throw new Error('No API key provided in configuration');
        }
        if (!config.ai_settings?.model) {
            throw new Error('No AI model specified in configuration');
        }
        console.log('✅ Configuration validation passed');
        
        console.log('🔄 Step 3: Updating progress to prompt engineering phase...');
        await updateJobStatus(jobId, 'processing', 50, 'Applying purpose control, word count limits, and advanced prompt engineering...');
        console.log('✅ Progress updated to 50%');
        
        console.log('🔄 Step 4: Starting PURPOSE AND WORD COUNT CONTROLLED generation...');
        console.log('🤖 Using model:', config.ai_settings.model);
        console.log('🎯 Generation mode:', config.generationMode);
        
        // Use PURPOSE AND WORD COUNT CONTROLLED generation
        let result;
        const startTime = Date.now();
        
        if (config.generationMode === 'dual_ai') {
            console.log('🤝 Using purpose and word count controlled dual AI mode...');
            result = await generateDualAIConversation(config);
        } else {
            console.log('🤖 Using purpose and word count controlled single AI mode...');
            result = await generateConversation(config);
        }
        
        const endTime = Date.now();
        const processingTime = (endTime - startTime) / 1000;
        console.log(`⏱️ Generation completed in ${processingTime} seconds`);
        
        const conversation = result.conversation || result;
        
        console.log('🔄 Step 5: Validating generated conversation...');
        if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
            throw new Error('Purpose and word count controlled generation produced empty or invalid conversation');
        }
        console.log(`✅ Generated conversation with ${conversation.length} turns`);
        
        // Log conversation summary
        const tutorTurns = conversation.filter(t => t.role === 'tutor').length;
        const studentTurns = conversation.filter(t => t.role === 'student').length;
        console.log(`📊 Conversation summary: ${tutorTurns} tutor turns, ${studentTurns} student turns`);
        
        // Log word count compliance if enabled
        if (result.enhancedMetadata?.word_count_statistics) {
            const stats = result.enhancedMetadata.word_count_statistics;
            console.log('📏 Word count compliance:', {
                tutorViolations: stats.tutor?.violations || 0,
                studentViolations: stats.student?.violations || 0,
                tutorAverage: stats.tutor?.average,
                studentAverage: stats.student?.average
            });
        }

        console.log('🔄 Step 6: Completing job with enhanced metadata...');
        // Complete with enhanced metadata including word count information
        await updateJobStatus(
            jobId, 
            'completed', 
            100, 
            'Purpose and word count controlled conversation completed successfully!', 
            null, 
            conversation,
            {
                ...result.enhancedMetadata || {},
                processingTimeSeconds: processingTime,
                completedAt: new Date().toISOString(),
                memoryUsage: process.memoryUsage()
            }
        );
        
        console.log('✅ Purpose and word count controlled async job completed successfully:', jobId);
        console.log('📊 Final memory usage:', process.memoryUsage());

    } catch (error) {
        console.error('💥 CRITICAL ERROR in purpose and word count controlled async processing:', error);
        console.error('📚 Full error stack:', error.stack);
        console.error('🔍 Error details:', {
            name: error.name,
            message: error.message,
            jobId: jobId,
            model: config.ai_settings?.model,
            generationMode: config.generationMode,
            timestamp: new Date().toISOString()
        });
        console.error('📊 Memory usage at error:', process.memoryUsage());
        
        try {
            await updateJobStatus(
                jobId, 
                'failed', 
                0, 
                `Purpose and word count controlled generation failed: ${error.message}`, 
                error.stack
            );
            console.log('✅ Job status updated to failed');
        } catch (updateError) {
            console.error('💀 DOUBLE FAILURE: Could not update job status to failed:', updateError);
        }
    }
}

async function updateJobStatus(jobId, status, progress, message, errorDetails = null, conversation = null, enhancedMetadata = {}) {
    console.log(`🔄 Updating job ${jobId} status to: ${status} (${progress}%) - ${message}`);
    
    try {
        const updateParams = {
            TableName: TABLE_NAME,
            Key: { jobId: jobId },
            UpdateExpression: 'SET #status = :status, progress = :progress, updatedAt = :updatedAt, message = :message',
            ExpressionAttributeNames: { '#status': 'status' },
            ExpressionAttributeValues: {
                ':status': status,
                ':progress': progress,
                ':updatedAt': new Date().toISOString(),
                ':message': message
            }
        };

        if (errorDetails) {
            console.log(`❌ Adding error details to job ${jobId}`);
            updateParams.UpdateExpression += ', error = :error, errorDetails = :errorDetails';
            updateParams.ExpressionAttributeValues[':error'] = message;
            updateParams.ExpressionAttributeValues[':errorDetails'] = errorDetails;
        }

        if (conversation) {
            console.log(`💬 Adding conversation to job ${jobId} (${conversation.length} turns)`);
            updateParams.UpdateExpression += ', conversation = :conversation';
            updateParams.ExpressionAttributeValues[':conversation'] = conversation;
        }

        // Add enhanced metadata including word count information
        if (Object.keys(enhancedMetadata).length > 0) {
            console.log(`📊 Adding enhanced metadata to job ${jobId}`);
            updateParams.UpdateExpression += ', enhancedMetadata = :enhancedMetadata';
            updateParams.ExpressionAttributeValues[':enhancedMetadata'] = enhancedMetadata;
            
            // Log purpose control and word count information
            if (enhancedMetadata.purpose_control_mode) {
                console.log(`📊 Purpose control mode: ${enhancedMetadata.purpose_control_mode}`);
                console.log(`📊 Purpose distribution:`, enhancedMetadata.purpose_distribution);
            }
            
            if (enhancedMetadata.word_count_enabled) {
                console.log(`📏 Word count control enabled: ${enhancedMetadata.word_count_enabled}`);
                console.log(`📏 Word count statistics:`, enhancedMetadata.word_count_statistics);
                console.log(`📏 Word count compliance: ${enhancedMetadata.word_count_compliance}`);
            }
            
            if (enhancedMetadata.processingTimeSeconds) {
                console.log(`⏱️ Processing time: ${enhancedMetadata.processingTimeSeconds} seconds`);
            }
        }

        console.log(`💾 Writing to DynamoDB for job ${jobId}...`);
        await docClient.send(new UpdateCommand(updateParams));
        console.log(`✅ Job ${jobId} status successfully updated to: ${status} (${progress}%)`);
        
    } catch (error) {
        console.error(`💥 CRITICAL: Failed to update job ${jobId} status:`, error);
        console.error(`📚 DynamoDB update error stack:`, error.stack);
        console.error(`🔍 Update error details:`, {
            jobId,
            status,
            progress,
            message,
            tableName: TABLE_NAME,
            errorName: error.name
        });
        throw error;
    }
}

async function checkJobStatus(jobId, headers) {
    console.log('📊 Checking status for purpose and word count controlled job:', jobId);
    
    try {
        console.log('🔍 Querying DynamoDB for job:', jobId);
        const result = await docClient.send(new GetCommand({
            TableName: TABLE_NAME,
            Key: { jobId: jobId }
        }));

        if (!result.Item) {
            console.log('❌ Job not found in database:', jobId);
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ 
                    error: 'Job not found',
                    jobId,
                    timestamp: new Date().toISOString()
                })
            };
        }

        const job = result.Item;
        console.log('📊 Job found with status:', job.status);
        console.log('📊 Job progress:', job.progress);
        console.log('📊 Last updated:', job.updatedAt);
        
        // Check if job is stuck
        if (job.status === 'processing' && job.updatedAt) {
            const lastUpdate = new Date(job.updatedAt);
            const now = new Date();
            const timeSinceUpdate = (now - lastUpdate) / 1000; // seconds
            
            if (timeSinceUpdate > 300) { // 5 minutes
                console.warn(`⚠️ Job ${jobId} appears stuck - no update for ${Math.round(timeSinceUpdate)} seconds`);
            }
        }

        // Log purpose control and word count information if available
        if (job.enhancedMetadata?.purpose_control_mode) {
            console.log('🎯 Purpose control mode:', job.enhancedMetadata.purpose_control_mode);
            console.log('🎯 Purpose distribution:', job.enhancedMetadata.purpose_distribution);
        }
        
        if (job.enhancedMetadata?.word_count_enabled) {
            console.log('📏 Word count control enabled:', job.enhancedMetadata.word_count_enabled);
            console.log('📏 Word count statistics:', job.enhancedMetadata.word_count_statistics);
        }

        console.log('✅ Returning job status for:', jobId);
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                jobId: job.jobId,
                status: job.status,
                progress: job.progress || 0,
                message: job.message || '',
                conversation: job.conversation || [],
                error: job.error || null,
                createdAt: job.createdAt,
                updatedAt: job.updatedAt,
                enhancedMetadata: job.enhancedMetadata || {}, // Include enhanced metadata with word count info
                debug: {
                    conversationLength: job.conversation ? job.conversation.length : 0,
                    hasError: !!job.error,
                    configPresent: !!job.config,
                    timestamp: new Date().toISOString()
                }
            })
        };

    } catch (error) {
        console.error('💥 CRITICAL: Error checking purpose and word count controlled job status:', error);
        console.error('📚 Status check error stack:', error.stack);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to check job status',
                details: error.message,
                jobId,
                timestamp: new Date().toISOString()
            })
        };
    }
}

async function createAsyncJob(config, headers) {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log('🚀 Creating TRUE ASYNC job:', jobId);

    try {
        const jobRecord = {
            jobId: jobId,
            status: 'queued',
            progress: 0,
            config, // Storing config for the background process
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            message: 'Job has been queued for processing.',
            enhancedMetadata: {
                prompt_version: '2.1_purpose_and_word_controlled',
                purpose_control_mode: config.purpose_control?.mode || 'auto',
                word_count_enabled: config.word_count_controls?.enforce_limits || false,
            }
        };

        await docClient.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: jobRecord
        }));

        console.log('✅ Job record created in database. Firing off background processing...');

        // *** THIS IS THE KEY CHANGE ***
        // We do NOT `await` this function. We fire it and forget.
        // The Lambda runtime will handle its execution in the background.
        processAsyncJobImmediate(jobId, config).catch(err => {
            // Add robust error handling in case the async process fails early
            console.error(`💥 BACKGROUND PROCESSING FAILED for job ${jobId}:`, err);
            updateJobStatus(jobId, 'failed', 0, `Background processing error: ${err.message}`, err.stack);
        });

        // Immediately return a 202 response to the client
        return {
            statusCode: 202, // 'Accepted' is the correct code for starting an async job
            headers,
            body: JSON.stringify({
                jobId,
                status: 'queued',
                message: `Job accepted. Use mode=status&jobId=${jobId} to check progress.`,
                statusUrl: `/generate?mode=status&jobId=${jobId}`
            })
        };

    } catch (error) {
        console.error('💥 Error creating async job:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to create async job',
                details: error.message
            })
        };
    }
}

// Enhanced JSON extraction function (unchanged from your original)
function extractJsonFromResponse(rawContent) {
    console.log('Attempting to extract JSON from response...');
    
    try {
        // Method 1: Look for JSON object between triple backticks
        const codeBlockMatch = rawContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
        if (codeBlockMatch) {
            console.log('Found JSON in code block');
            return JSON.parse(codeBlockMatch[1]);
        }

        // Method 2: Look for JSON object starting with { and ending with }
        const jsonMatch = rawContent.match(/\{[\s\S]*"conversation"[\s\S]*\}/);
        if (jsonMatch) {
            console.log('Found JSON object in response');
            return JSON.parse(jsonMatch[0]);
        }

        // Method 3: Try to find the conversation array directly
        const conversationMatch = rawContent.match(/"conversation"\s*:\s*\[([\s\S]*?)\]/);
        if (conversationMatch) {
            console.log('Found conversation array in response');
            const conversationArrayStr = `[${conversationMatch[1]}]`;
            const conversationArray = JSON.parse(conversationArrayStr);
            return { conversation: conversationArray };
        }

        // Method 4: Clean and attempt parse
        const cleanedContent = rawContent.trim();
        const firstBrace = cleanedContent.indexOf('{');
        const lastBrace = cleanedContent.lastIndexOf('}');
        
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            const jsonStr = cleanedContent.substring(firstBrace, lastBrace + 1);
            console.log('Attempting to parse cleaned JSON:', jsonStr.substring(0, 200) + '...');
            return JSON.parse(jsonStr);
        }

        console.log('❌ No valid JSON found in response');
        return null;

    } catch (error) {
        console.error('Error during JSON extraction:', error);
        return null;
    }
}

// Enhanced OpenAI API call function (unchanged from your original - it's already well implemented)
function callOpenAI(messages, aiSettings) {
    return new Promise((resolve, reject) => {
        
        const apiKey = aiSettings.api_key || process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            reject(new Error('No OpenAI API key provided'));
            return;
        }
        
        console.log('🔑 Using API key:', apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'None provided');
        
        const requestData = {
            model: aiSettings.model,
            messages: messages,
            response_format: { type: "json_object" }
        };

        if (aiSettings.model === 'o3-mini') {
            console.log('🧠 Using O3-mini specific parameters with increased limits');
            
            const tokenLimit = Math.max(
                aiSettings.max_completion_tokens || 4000,
                aiSettings.max_tokens || 4000,
                4000
            );
            
            requestData.max_completion_tokens = tokenLimit;
            requestData.reasoning_effort = aiSettings.reasoning_effort || 'medium';
            
            console.log('🧠 O3-mini parameters:', {
                model: requestData.model,
                max_completion_tokens: requestData.max_completion_tokens,
                reasoning_effort: requestData.reasoning_effort,
                response_format: requestData.response_format
            });
            
        } else {
            console.log('🤖 Using standard GPT parameters');
            
            requestData.max_tokens = aiSettings.max_tokens || aiSettings.max_completion_tokens || 3000;
            
            if (aiSettings.temperature !== undefined) {
                requestData.temperature = aiSettings.temperature;
            }
            if (aiSettings.top_p !== undefined) {
                requestData.top_p = aiSettings.top_p;
            }
            if (aiSettings.frequency_penalty !== undefined) {
                requestData.frequency_penalty = aiSettings.frequency_penalty;
            }
            if (aiSettings.presence_penalty !== undefined) {
                requestData.presence_penalty = aiSettings.presence_penalty;
            }
            
            console.log('🤖 GPT parameters:', {
                model: requestData.model,
                max_tokens: requestData.max_tokens,
                temperature: requestData.temperature,
                response_format: requestData.response_format
            });
        }

        console.log('📤 Final request data for OpenAI:');
        console.log(JSON.stringify(requestData, null, 2));
        
        const data = JSON.stringify(requestData);

        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': Buffer.byteLength(data)
            }
        };

        console.log('🌐 Making HTTPS request to OpenAI API...');

        const req = https.request(options, (res) => {
            let responseData = '';
            
            console.log('📥 Response started, status:', res.statusCode);
            
            res.on('data', (chunk) => {
                responseData += chunk;
                console.log('📥 Received chunk, total length so far:', responseData.length);
            });
            
            res.on('end', () => {
                console.log('📥 Response complete');
                console.log('📊 Final response status:', res.statusCode);
                console.log('📊 Final response length:', responseData.length);
                
                if (res.statusCode !== 200) {
                    console.error('❌ OpenAI API error response:', responseData);
                    reject(new Error(`OpenAI API returned status ${res.statusCode}: ${responseData}`));
                    return;
                }
                
                try {
                    console.log('🔄 Parsing HTTP response as JSON...');
                    const response = JSON.parse(responseData);
                    console.log('✅ HTTP response parsed successfully');
                    
                    // Log response metadata for debugging
                    if (response.usage) {
                        console.log('💰 Token usage:', JSON.stringify(response.usage, null, 2));
                    }
                    if (response.choices && response.choices[0]) {
                        console.log('🏁 Finish reason:', response.choices[0].finish_reason);
                    }
                    
                    resolve(response);
                } catch (parseError) {
                    console.error('❌ Failed to parse HTTP response as JSON:', parseError);
                    console.error('📊 Parse error details:', parseError.message);
                    reject(new Error('Invalid JSON response from OpenAI API'));
                }
            });
        });

        req.on('error', (error) => {
            console.error('💥 HTTPS request error:', error);
            reject(new Error(`Network error calling OpenAI API: ${error.message}`));
        });

        console.log('📤 Writing request data...');
        req.write(data);
        console.log('📤 Ending request...');
        req.end();
    });
}

// Export callOpenAI function for use by enhanced-dual-ai module
module.exports = {
    callOpenAI
};
