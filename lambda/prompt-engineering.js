// prompt-engineering.js
// PURPOSE-CONTROLLED prompt engineering module with WORD COUNT CONTROLS for ChatSynth Lambda function

/**
 * Main prompt builder that creates sophisticated educational conversation prompts WITH PURPOSE AND WORD COUNT CONTROL
 * @param {Object} config - Configuration object from frontend
 * @param {Object} aiSettings - AI model settings
 * @param {Array} techniques - Array of technique names to apply
 * @returns {Object} - Structured prompt object for the AI model
 */
function buildMasterEducationalPrompt(config, aiSettings, techniques = []) {
    const isO3Mini = aiSettings.model === 'o3-mini';
    
    console.log('🎯 Building master educational prompt with techniques:', techniques);
    console.log('🎯 Purpose control config:', config.purpose_control);
    console.log('📏 Word count control config:', config.word_count_controls);
    
    // Get purpose configuration
    const purposeConfig = getPurposeConfiguration(config);
    console.log('🎯 Final purpose configuration:', purposeConfig);
    
    // Build base prompt with PURPOSE AND WORD COUNT CONTROL
    if (isO3Mini) {
        return buildO3MiniPromptWithPurposesAndWordCount(config, aiSettings, techniques, purposeConfig);
    } else {
        return buildStandardPromptWithPurposesAndWordCount(config, aiSettings, techniques, purposeConfig);
    }
}

/**
 * Enhanced conversation generation with purposes and word count controls - main entry point
 * @param {Object} config - Full configuration including purpose control and word count controls
 * @returns {Object} - Enhanced result with purpose compliance and word count data
 */
function generateConversationWithPurposes(config) {
    console.log('🚀 Starting PURPOSE AND WORD COUNT CONTROLLED conversation generation');
    console.log('📋 Config received:', JSON.stringify(config, null, 2));
    console.log('🎯 Purpose control config:', config.purpose_control);
    console.log('📏 Word count control config:', config.word_count_controls);

    const aiSettings = config.ai_settings || {
        model: 'gpt-4o',
        temperature: 0.7,
        max_completion_tokens: 3000
    };

    console.log('🤖 Using AI settings:', JSON.stringify(aiSettings, null, 2));

    // Get purpose configuration from frontend
    const purposeConfig = getPurposeConfiguration(config);
    console.log('🎯 Purpose configuration determined:', purposeConfig);
    
    // Log word count settings
    if (config.word_count_controls?.enforce_limits) {
        console.log('📏 Word count controls enabled:');
        console.log(`   - Tutor: ${config.word_count_controls.tutor_utterances?.min_words}-${config.word_count_controls.tutor_utterances?.max_words} words (target: ${config.word_count_controls.tutor_utterances?.target_words})`);
        console.log(`   - Student: ${config.word_count_controls.student_utterances?.min_words}-${config.word_count_controls.student_utterances?.max_words} words (target: ${config.word_count_controls.student_utterances?.target_words})`);
        console.log(`   - Variation allowed: ${config.word_count_controls.allow_variation ? 'Yes' : 'No'}`);
    } else {
        console.log('📏 Word count controls disabled - using natural conversation flow');
    }
    
    // Auto-select techniques (can still be overridden by user)
    const recommendedTechniques = getRecommendedTechniques(config);
    const selectedTechniques = config.prompt_techniques || recommendedTechniques;
    console.log('🎯 Using techniques:', selectedTechniques);
    
    // Build sophisticated prompt with PURPOSE AND WORD COUNT CONTROL
    const promptData = buildMasterEducationalPrompt(config, aiSettings, selectedTechniques);
    console.log('📝 Purpose and word count controlled prompt system activated');
    
    // Return the prompt data - the actual OpenAI call will be handled by the Lambda
    return {
        promptData,
        purposeConfig,
        selectedTechniques,
        metadata: {
            purpose_control_mode: purposeConfig.mode,
            selected_tutor_purposes: purposeConfig.tutorPurposes,
            selected_student_purposes: purposeConfig.studentPurposes,
            word_count_enabled: config.word_count_controls?.enforce_limits || false,
            word_count_settings: config.word_count_controls || null,
            techniques_used: selectedTechniques,
            prompt_version: '2.1_purpose_and_word_controlled'
        }
    };
}

/**
 * Determines purpose configuration based on user selection mode
 */
function getPurposeConfiguration(config) {
    const purposeControl = config.purpose_control || { mode: 'auto' };
    
    console.log('📋 Processing purpose control:', purposeControl);
    
    switch (purposeControl.mode) {
        case 'custom':
            return {
                mode: 'custom',
                tutorPurposes: purposeControl.selected_tutor_purposes || [],
                studentPurposes: purposeControl.selected_student_purposes || [],
                customPurposes: purposeControl.custom_purposes || { tutor: [], student: [] }
            };
            
        case 'guided':
            // Templates are applied in frontend, so treat as custom
            return {
                mode: 'guided',
                tutorPurposes: purposeControl.selected_tutor_purposes || [],
                studentPurposes: purposeControl.selected_student_purposes || [],
                customPurposes: purposeControl.custom_purposes || { tutor: [], student: [] }
            };
            
        case 'auto':
        default:
            return {
                mode: 'auto',
                tutorPurposes: getAutoSelectedTutorPurposes(config),
                studentPurposes: getAutoSelectedStudentPurposes(config),
                customPurposes: { tutor: [], student: [] }
            };
    }
}

function getLanguageName(languageCode) {
    const languageMap = {
        'english': 'English',
        'spanish': 'Spanish',
        'french': 'French', 
        'german': 'German',
        'chinese': 'Chinese',
        'japanese': 'Japanese',
        'italian': 'Italian',
        'portuguese': 'Portuguese',
        'russian': 'Russian',
        'arabic': 'Arabic'
    };
    
    return languageMap[languageCode] || 'English';
}

/**
 * Auto-select tutor purposes based on configuration
 */
function getAutoSelectedTutorPurposes(config) {
    const purposes = [];
    
    // Always include these core purposes
    purposes.push('assessment');
    
    // Based on vocabulary complexity
    if (config.vocabulary?.complexity === 'beginner') {
        purposes.push('scaffolding', 'encouragement');
    } else if (config.vocabulary?.complexity === 'advanced') {
        purposes.push('socratic_questioning', 'metacognitive_prompting');
    } else {
        purposes.push('scaffolding', 'guided_discovery');
    }
    
    // Based on question type
    switch (config.tutor_questions?.type) {
        case 'socratic':
            purposes.push('socratic_questioning', 'guided_discovery');
            break;
        case 'scaffolding':
            purposes.push('scaffolding', 'error_recovery');
            break;
        case 'analytical':
            purposes.push('socratic_questioning', 'real_world_connection');
            break;
        case 'problem_solving':
            purposes.push('scaffolding', 'error_recovery');
            break;
        default:
            purposes.push('guided_discovery');
    }
    
    // Based on subject
    if (['mathematics', 'computer_science'].includes(config.subject)) {
        purposes.push('error_recovery');
    } else if (['language_arts', 'history'].includes(config.subject)) {
        purposes.push('real_world_connection');
    } else if (config.subject === 'science') {
        purposes.push('guided_discovery');
    }
    
    // Based on engagement level
    if (config.student_utterances?.engagement === 'low') {
        purposes.push('encouragement', 'real_world_connection');
    }
    
    // Based on confusion level
    if (['challenging', 'high'].includes(config.student_utterances?.confusion_level)) {
        purposes.push('scaffolding', 'encouragement', 'error_recovery');
    }
    
    // Remove duplicates and limit
    return [...new Set(purposes)].slice(0, 6);
}

/**
 * Auto-select student purposes based on configuration
 */
function getAutoSelectedStudentPurposes(config) {
    const purposes = [];
    
    // Always include core learning purpose
    purposes.push('better_understanding');
    
    // Based on engagement level
    switch (config.student_utterances?.engagement) {
        case 'low':
            purposes.push('validation_seeking', 'help_with_problem');
            break;
        case 'high':
        case 'very_high':
            purposes.push('hypothesis_testing', 'curiosity_extension');
            break;
        default:
            purposes.push('practice_application', 'validation_seeking');
    }
    
    // Based on confusion level
    switch (config.student_utterances?.confusion_level) {
        case 'challenging':
            purposes.push('confusion_expression', 'help_with_problem');
            break;
        case 'low':
            purposes.push('practice_application', 'curiosity_extension');
            break;
        default:
            purposes.push('confusion_expression', 'practice_application');
    }
    
    // Based on vocabulary complexity
    if (config.vocabulary?.complexity === 'advanced') {
        purposes.push('reflection', 'hypothesis_testing');
    } else if (config.vocabulary?.complexity === 'beginner') {
        purposes.push('validation_seeking', 'help_with_problem');
    }
    
    // Based on subject
    if (['mathematics', 'computer_science'].includes(config.subject)) {
        purposes.push('hypothesis_testing');
    } else if (['language_arts', 'history'].includes(config.subject)) {
        purposes.push('reflection', 'curiosity_extension');
    }
    
    // Remove duplicates and limit
    return [...new Set(purposes)].slice(0, 5);
}

/**
 * NEW: Builds word count instructions for prompts
 */
function buildWordCountInstructions(config) {
    const wordControls = config.word_count_controls;
    
    if (!wordControls || !wordControls.enforce_limits) {
        return '';
    }
    
    let instructions = '\nWORD COUNT CONTROLS:\n';
    
    // Tutor word count instructions
    const tutorSettings = wordControls.tutor_utterances;
    if (tutorSettings) {
        instructions += `TUTOR RESPONSE LENGTH:\n`;
        instructions += `- Target length: ${tutorSettings.target_words} words per response\n`;
        instructions += `- Acceptable range: ${tutorSettings.min_words}-${tutorSettings.max_words} words\n`;
        instructions += `- Style: ${getTutorStyleDescription(tutorSettings.style)}\n`;
        
        if (wordControls.allow_variation) {
            const variation = Math.round(tutorSettings.target_words * 0.2);
            instructions += `- Natural variation allowed: ±${variation} words for authenticity\n`;
        }
    }
    
    // Student word count instructions
    const studentSettings = wordControls.student_utterances;
    if (studentSettings) {
        instructions += `\nSTUDENT RESPONSE LENGTH:\n`;
        instructions += `- Target length: ${studentSettings.target_words} words per response\n`;
        instructions += `- Acceptable range: ${studentSettings.min_words}-${studentSettings.max_words} words\n`;
        instructions += `- Style: ${getStudentStyleDescription(studentSettings.style)}\n`;
        
        if (wordControls.allow_variation) {
            const variation = Math.round(studentSettings.target_words * 0.2);
            instructions += `- Natural variation allowed: ±${variation} words for authenticity\n`;
        }
    }
    
    instructions += `\nWORD COUNT ENFORCEMENT:\n`;
    instructions += `- Count words carefully in each response\n`;
    instructions += `- Prioritize natural flow while staying within limits\n`;
    instructions += `- Use concise language when approaching upper limits\n`;
    instructions += `- Expand explanations when under minimum requirements\n`;
    
    if (wordControls.allow_variation) {
        instructions += `- Slight variations for natural conversation flow are acceptable\n`;
    } else {
        instructions += `- Strict adherence to word limits is required\n`;
    }
    
    return instructions;
}

/**
 * Helper function to get tutor style descriptions
 */
function getTutorStyleDescription(style) {
    const descriptions = {
        'concise': 'Brief, direct responses that get to the point quickly while maintaining educational value',
        'balanced': 'Moderate detail with clear explanations and appropriate examples',
        'detailed': 'Comprehensive responses with thorough explanations, examples, and context'
    };
    return descriptions[style] || descriptions.balanced;
}

/**
 * Helper function to get student style descriptions
 */
function getStudentStyleDescription(style) {
    const descriptions = {
        'brief': 'Short, sometimes hesitant responses that reflect uncertainty or quick understanding',
        'natural': 'Authentic student responses with natural thinking processes and varied length',
        'elaborate': 'Detailed responses showing thinking aloud, explanation of reasoning, and full engagement'
    };
    return descriptions[style] || descriptions.natural;
}

/**
 * Enhanced O3-mini prompt builder with purposes and word count controls
 */
function buildO3MiniPromptWithPurposesAndWordCount(config, aiSettings, techniques, purposeConfig) {
    const conversationLanguage = config.language || 'english';
    const languageInstruction = conversationLanguage !== 'english' 
        ? `\n\nCRITICAL LANGUAGE REQUIREMENT: The ENTIRE conversation must be conducted in ${getLanguageName(conversationLanguage)}. This includes all tutor explanations, student responses, and any educational content. Do not use English.`
        : '';

    const systemPrompt = `You are an expert educational conversation generator with advanced reasoning capabilities.

REASONING PROCESS:
1. First, analyze the educational context and learning objectives for ${config.subject}
2. Consider the student's likely knowledge state and potential confusion points
3. Plan the conversation flow using the SPECIFIED EDUCATIONAL PURPOSES
4. Calculate appropriate word counts for each role based on requirements
5. Generate each turn with the exact purposes provided by the educator
6. Ensure all content is in ${getLanguageName(conversationLanguage)} and meets word count targets

${buildPurposeInstructions(purposeConfig)}

${buildWordCountInstructions(config)}

CONVERSATION REQUIREMENTS:
- Subject: ${config.subject || 'general education'}
- Turns: ${config.conversation_structure?.turns || 8} (exactly)
- Starting with: ${config.conversation_structure?.starter || 'tutor'}
- Language: ${getLanguageName(conversationLanguage)} (ALL content must be in this language)
- Vocabulary level: ${config.vocabulary?.complexity || 'intermediate'}
- Student engagement: ${config.student_utterances?.engagement || 'high'}

${buildTechniqueInstructions(techniques, config)}

${languageInstruction}

CRITICAL OUTPUT REQUIREMENTS:
Return a JSON object with this EXACT structure:
{
  "conversation": [
    {"role": "tutor", "content": "dialogue in ${getLanguageName(conversationLanguage)}", "purpose": "one_of_specified_tutor_purposes", "word_count": actual_word_count},
    {"role": "student", "content": "response in ${getLanguageName(conversationLanguage)}", "purpose": "one_of_specified_student_purposes", "word_count": actual_word_count}
  ]
}

PURPOSE AND WORD COUNT COMPLIANCE:
- ONLY use purposes from the specified lists above
- Each turn MUST include a purpose from the appropriate role's list
- Each turn MUST include the actual word count in the word_count field
- Target ${config.word_count_controls?.tutor_utterances?.target_words || 30} words for tutor responses
- Target ${config.word_count_controls?.student_utterances?.target_words || 15} words for student responses
- Distribute purposes naturally throughout the conversation
- Prioritize purposes that appear multiple times in the lists`;

    const userPrompt = `Generate the educational conversation now using your reasoning capabilities and the specified purposes.

Purpose Control Mode: ${purposeConfig.mode}
Language: ${getLanguageName(conversationLanguage)}
Word Count Control: ${config.word_count_controls?.enforce_limits ? 'Enabled' : 'Disabled'}
Purpose Distribution: Use the tutor and student purposes provided above strategically throughout the conversation.

Create a realistic, pedagogically sound conversation in ${getLanguageName(conversationLanguage)} that demonstrates the selected educational approaches while maintaining appropriate word count targets.`;

    return {
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ]
    };
}

/**
 * Enhanced standard prompt builder with purposes and word count controls
 */
function buildStandardPromptWithPurposesAndWordCount(config, aiSettings, techniques, purposeConfig) {
    const conversationLanguage = config.language || 'english';
    const languageInstruction = conversationLanguage !== 'english' 
        ? `\n\nIMPORTANT LANGUAGE REQUIREMENT:\nConduct the ENTIRE conversation in ${getLanguageName(conversationLanguage)}. All dialogue, explanations, and interactions must be in ${getLanguageName(conversationLanguage)}. Do not use English unless specifically teaching English as a subject.`
        : '';

    const systemPrompt = `You are an expert educational conversation generator. Create realistic, pedagogically sound tutoring conversations using the SPECIFIC EDUCATIONAL PURPOSES provided by the educator.

${buildPurposeInstructions(purposeConfig)}

${buildWordCountInstructions(config)}

CONVERSATION SPECIFICATIONS:
- Subject: ${config.subject || 'general education'}
- Total turns: ${config.conversation_structure?.turns || 8} (exactly)
- Starting speaker: ${config.conversation_structure?.starter || 'tutor'}
- Language: ${getLanguageName(conversationLanguage)}
- Teaching approach: Based on selected purposes above
- Student characteristics: ${config.student_utterances?.engagement || 'high'} engagement, ${config.student_utterances?.confusion_level || 'realistic'} confusion level
- Educational purpose: ${config.conversation_structure?.purpose || 'Educational tutoring session'}

${buildTechniqueInstructions(techniques, config)}

${getSubjectSpecificGuidance(config.subject)}

${languageInstruction}

PURPOSE COMPLIANCE REQUIREMENTS:
- Use ONLY the purposes specified in the lists above
- Each conversation turn MUST include a purpose from the appropriate role's list
- Distribute purposes naturally - don't use the same purpose consecutively
- Balance the frequency of different purposes throughout the conversation
- Ensure purposes align with the educational content being discussed

WORD COUNT COMPLIANCE:
- Each tutor response should target ${config.word_count_controls?.tutor_utterances?.target_words || 30} words
- Each student response should target ${config.word_count_controls?.student_utterances?.target_words || 15} words
- Stay within the specified word ranges for authentic, controlled conversations
- Count words mentally before finalizing each response
- Adjust complexity and detail based on word count requirements

OUTPUT FORMAT REQUIREMENTS:
Return a valid JSON object with this exact structure:
{
  "conversation": [
    {"role": "tutor", "content": "actual dialogue text in ${getLanguageName(conversationLanguage)}", "purpose": "specified_tutor_purpose", "word_count": actual_word_count},
    {"role": "student", "content": "actual student response in ${getLanguageName(conversationLanguage)}", "purpose": "specified_student_purpose", "word_count": actual_word_count}
  ]
}

QUALITY STANDARDS:
- Each turn should sound natural and conversational in ${getLanguageName(conversationLanguage)}
- Include realistic hesitations, thinking aloud, and partial understanding
- Show authentic confusion and breakthrough moments
- Maintain consistent character voices throughout
- Progress logically toward learning objectives
- Balance speaking time appropriately between tutor and student
- Use appropriate cultural context for ${getLanguageName(conversationLanguage)} speakers
- STRICTLY adhere to word count guidelines while maintaining natural flow

Generate ONLY the JSON object, no additional text or explanation.`;

    const userPrompt = buildDetailedUserPromptWithPurposesAndWordCount(config, purposeConfig);

    return {
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ]
    };
}

/**
 * Builds purpose instructions based on user configuration
 */
function buildPurposeInstructions(purposeConfig) {
    let instructions = `PURPOSE CONTROL MODE: ${purposeConfig.mode}\n\n`;
    
    // Build tutor purpose list
    instructions += `TUTOR PURPOSES TO USE (select from these for tutor turns):\n`;
    purposeConfig.tutorPurposes.forEach(purposeId => {
        const purpose = getTutorPurposeDefinition(purposeId);
        instructions += `- ${purposeId}: ${purpose.description}\n`;
    });
    
    instructions += `\nSTUDENT PURPOSES TO USE (select from these for student turns):\n`;
    purposeConfig.studentPurposes.forEach(purposeId => {
        const purpose = getStudentPurposeDefinition(purposeId);
        instructions += `- ${purposeId}: ${purpose.description}\n`;
    });
    
    // Add custom purposes if any
    if (purposeConfig.customPurposes.tutor.length > 0) {
        instructions += `\nCUSTOM TUTOR PURPOSES:\n`;
        purposeConfig.customPurposes.tutor.forEach(purpose => {
            instructions += `- ${purpose.id}: ${purpose.description}\n`;
        });
    }
    
    if (purposeConfig.customPurposes.student.length > 0) {
        instructions += `\nCUSTOM STUDENT PURPOSES:\n`;
        purposeConfig.customPurposes.student.forEach(purpose => {
            instructions += `- ${purpose.id}: ${purpose.description}\n`;
        });
    }
    
    instructions += `\nIMPORTANT: Use these purposes strategically throughout the conversation. Do not use purposes not listed above.`;
    
    return instructions;
}

/**
 * Get tutor purpose definitions
 */
function getTutorPurposeDefinition(purposeId) {
    const definitions = {
        'scaffolding': {
            description: 'Break down complex concepts into manageable steps, providing structural support for learning'
        },
        'socratic_questioning': {
            description: 'Guide discovery through strategic questions that lead students to insights'
        },
        'assessment': {
            description: 'Check student understanding and comprehension throughout the conversation'
        },
        'encouragement': {
            description: 'Build confidence, provide motivation, and maintain positive learning environment'
        },
        'guided_discovery': {
            description: 'Lead students to discover insights through exploration and investigation'
        },
        'error_recovery': {
            description: 'Turn mistakes into learning opportunities, analyze errors constructively'
        },
        'real_world_connection': {
            description: 'Link abstract concepts to practical applications and real-world examples'
        },
        'metacognitive_prompting': {
            description: 'Help students reflect on their own thinking and learning processes'
        },
        'explanation': {
            description: 'Provide clear, direct explanations of concepts when needed'
        },
        'clarification': {
            description: 'Clear up confusion and ensure student understanding is accurate'
        },
        'instruction': {
            description: 'Give direct teaching and information delivery'
        },
        'feedback': {
            description: 'Provide specific feedback on student responses and progress'
        }
    };
    
    return definitions[purposeId] || { description: 'Educational teaching purpose' };
}

/**
 * Get student purpose definitions
 */
function getStudentPurposeDefinition(purposeId) {
    const definitions = {
        'better_understanding': {
            description: 'Working to comprehend and articulate concepts clearly'
        },
        'confusion_expression': {
            description: 'Honestly sharing when concepts are unclear or confusing'
        },
        'hypothesis_testing': {
            description: 'Proposing and exploring potential solutions or ideas'
        },
        'validation_seeking': {
            description: 'Checking if understanding is correct and seeking confirmation'
        },
        'help_with_problem': {
            description: 'Requesting assistance with specific challenges or difficulties'
        },
        'practice_application': {
            description: 'Attempting to use and apply newly learned concepts'
        },
        'reflection': {
            description: 'Thinking about learning process, progress, and connections'
        },
        'curiosity_extension': {
            description: 'Asking questions that go beyond the immediate topic'
        },
        'clarification': {
            description: 'Asking for clarification when something is unclear'
        },
        'practice': {
            description: 'Engaging in practice and skill development'
        }
    };
    
    return definitions[purposeId] || { description: 'Student learning purpose' };
}

/**
 * Enhanced user prompt with purpose and word count information
 */
function buildDetailedUserPromptWithPurposesAndWordCount(config, purposeConfig) {
    const conversationLanguage = config.language || 'english';
    const wordControls = config.word_count_controls;
    
    let wordCountInfo = '';
    if (wordControls && wordControls.enforce_limits) {
        wordCountInfo = `\nWORD COUNT REQUIREMENTS:
- Tutor responses: ${wordControls.tutor_utterances?.min_words || 15}-${wordControls.tutor_utterances?.max_words || 50} words (target: ${wordControls.tutor_utterances?.target_words || 30})
- Student responses: ${wordControls.student_utterances?.min_words || 8}-${wordControls.student_utterances?.max_words || 25} words (target: ${wordControls.student_utterances?.target_words || 15})
- Style preference: Tutor should be ${wordControls.tutor_utterances?.style || 'balanced'}, Student should be ${wordControls.student_utterances?.style || 'natural'}
${wordControls.allow_variation ? '- Natural variation (±20%) allowed for authentic flow' : '- Strict adherence to word limits required'}`;
    }
    
    return `Create an educational conversation with these specifications:

EDUCATIONAL CONTEXT:
${JSON.stringify({
    subject: config.subject,
    turns: config.conversation_structure?.turns,
    starter: config.conversation_structure?.starter,
    purpose: config.conversation_structure?.purpose,
    vocabulary_complexity: config.vocabulary?.complexity,
    teaching_approach: 'Based on selected purposes',
    student_engagement: config.student_utterances?.engagement,
    confusion_level: config.student_utterances?.confusion_level,
    language: getLanguageName(conversationLanguage)
}, null, 2)}

PURPOSE CONTROL CONFIGURATION:
- Mode: ${purposeConfig.mode}
- Tutor purposes selected: ${purposeConfig.tutorPurposes.join(', ')}
- Student purposes selected: ${purposeConfig.studentPurposes.join(', ')}
${purposeConfig.customPurposes.tutor.length > 0 ? `- Custom tutor purposes: ${purposeConfig.customPurposes.tutor.map(p => p.name).join(', ')}` : ''}
${purposeConfig.customPurposes.student.length > 0 ? `- Custom student purposes: ${purposeConfig.customPurposes.student.map(p => p.name).join(', ')}` : ''}

${wordCountInfo}

LANGUAGE REQUIREMENT: Generate the entire conversation in ${getLanguageName(conversationLanguage)}.

Use the specified purposes strategically to create an authentic educational conversation that demonstrates the selected pedagogical approaches while maintaining appropriate word count targets.`;
}

/**
 * Enhanced conversation validation with purpose checking and word count analysis
 */
function validateEducationalQualityWithPurposes(conversation, config) {
    console.log('🔍 Validating educational quality with purpose compliance and word count...');
    
    const issues = [];
    const purposeConfig = getPurposeConfiguration(config);
    const wordControls = config.word_count_controls;
    const validTutorPurposes = [...purposeConfig.tutorPurposes, ...purposeConfig.customPurposes.tutor.map(p => p.id)];
    const validStudentPurposes = [...purposeConfig.studentPurposes, ...purposeConfig.customPurposes.student.map(p => p.id)];
    
    console.log('🎯 Valid tutor purposes:', validTutorPurposes);
    console.log('🎯 Valid student purposes:', validStudentPurposes);
    console.log('📏 Word count controls:', wordControls);
    
    const wordCountStats = {
        tutor: { total: 0, count: 0, violations: 0, responses: [] },
        student: { total: 0, count: 0, violations: 0, responses: [] }
    };
    
    // Check purpose compliance and word counts
    conversation.forEach((turn, index) => {
        // Purpose validation
        if (turn.role === 'tutor' && turn.purpose && !validTutorPurposes.includes(turn.purpose)) {
            issues.push(`Turn ${index}: Invalid tutor purpose '${turn.purpose}' - not in selected purposes`);
        }
        if (turn.role === 'student' && turn.purpose && !validStudentPurposes.includes(turn.purpose)) {
            issues.push(`Turn ${index}: Invalid student purpose '${turn.purpose}' - not in selected purposes`);
        }
        
        // Word count validation
        if (wordControls && wordControls.enforce_limits) {
            const actualWordCount = turn.word_count || countWords(turn.content);
            const roleSettings = turn.role === 'tutor' ? wordControls.tutor_utterances : wordControls.student_utterances;
            
            if (roleSettings) {
                const minWords = roleSettings.min_words;
                const maxWords = roleSettings.max_words;
                const targetWords = roleSettings.target_words;
                
                // Allow variation if enabled
                let effectiveMin = minWords;
                let effectiveMax = maxWords;
                
                if (wordControls.allow_variation) {
                    const variation = Math.round(targetWords * 0.2);
                    effectiveMin = Math.max(1, minWords - variation);
                    effectiveMax = maxWords + variation;
                }
                
                // Track stats
                wordCountStats[turn.role].total += actualWordCount;
                wordCountStats[turn.role].count++;
                wordCountStats[turn.role].responses.push({
                    turn: index,
                    actual: actualWordCount,
                    target: targetWords,
                    withinRange: actualWordCount >= effectiveMin && actualWordCount <= effectiveMax
                });
                
                // Check violations
                if (actualWordCount < effectiveMin) {
                    issues.push(`Turn ${index}: ${turn.role} response too short (${actualWordCount} words, minimum ${effectiveMin})`);
                    wordCountStats[turn.role].violations++;
                } else if (actualWordCount > effectiveMax) {
                    issues.push(`Turn ${index}: ${turn.role} response too long (${actualWordCount} words, maximum ${effectiveMax})`);
                    wordCountStats[turn.role].violations++;
                }
            }
        }
    });
    
    // Calculate word count averages
    if (wordCountStats.tutor.count > 0) {
        wordCountStats.tutor.average = Math.round(wordCountStats.tutor.total / wordCountStats.tutor.count);
    }
    if (wordCountStats.student.count > 0) {
        wordCountStats.student.average = Math.round(wordCountStats.student.total / wordCountStats.student.count);
    }
    
    // Check purpose distribution
    const tutorPurposes = conversation.filter(t => t.role === 'tutor').map(t => t.purpose);
    const studentPurposes = conversation.filter(t => t.role === 'student').map(t => t.purpose);
    
    const tutorPurposeDistribution = {};
    tutorPurposes.forEach(purpose => {
        if (purpose) {
            tutorPurposeDistribution[purpose] = (tutorPurposeDistribution[purpose] || 0) + 1;
        }
    });
    
    const studentPurposeDistribution = {};
    studentPurposes.forEach(purpose => {
        if (purpose) {
            studentPurposeDistribution[purpose] = (studentPurposeDistribution[purpose] || 0) + 1;
        }
    });
    
    // Check if purposes are used
    if (validTutorPurposes.length > 0 && Object.keys(tutorPurposeDistribution).length === 0) {
        issues.push('No tutor purposes found in conversation despite having selected purposes');
    }
    
    if (validStudentPurposes.length > 0 && Object.keys(studentPurposeDistribution).length === 0) {
        issues.push('No student purposes found in conversation despite having selected purposes');
    }
    
    // Basic educational quality checks (existing validation)
    const tutorTurns = conversation.filter(turn => turn.role === 'tutor');
    const studentTurns = conversation.filter(turn => turn.role === 'student');
    
    if (tutorTurns.length === 0) {
        issues.push('No tutor turns found');
    }
    
    if (studentTurns.length === 0) {
        issues.push('No student turns found');
    }
    
    // Check conversation starter matches config
    const expectedStarter = config.conversation_structure?.starter || 'tutor';
    if (conversation[0] && conversation[0].role !== expectedStarter) {
        issues.push(`Conversation should start with ${expectedStarter} but starts with ${conversation[0].role}`);
    }
    
    // Log results
    if (issues.length > 0) {
        console.warn('⚠️ Educational quality issues detected:', issues);
    } else {
        console.log('✅ Educational quality validation passed');
        console.log('📊 Purpose distribution:', {
            tutor: tutorPurposeDistribution,
            student: studentPurposeDistribution
        });
    }
    
    if (wordControls && wordControls.enforce_limits) {
        console.log('📏 Word count statistics:', wordCountStats);
        
        // Summary log
        if (wordCountStats.tutor.violations === 0 && wordCountStats.student.violations === 0) {
            console.log('✅ All responses within word count limits');
        } else {
            console.warn(`⚠️ Word count violations: ${wordCountStats.tutor.violations} tutor, ${wordCountStats.student.violations} student`);
        }
    }
    
    return {
        passed: issues.length === 0,
        issues,
        purposeDistribution: {
            tutor: tutorPurposeDistribution,
            student: studentPurposeDistribution
        },
        wordCountStats: wordControls && wordControls.enforce_limits ? wordCountStats : null
    };
}

/**
 * Helper function to count words in text
 */
function countWords(text) {
    if (!text || typeof text !== 'string') return 0;
    
    // Remove extra whitespace and split by spaces
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Builds technique-specific instructions
 */
function buildTechniqueInstructions(techniques, config) {
    if (!techniques || techniques.length === 0) {
        return '';
    }

    let instructions = '\nENHANCED TECHNIQUES TO APPLY:\n';

    techniques.forEach(technique => {
        switch (technique) {
            case 'chain_of_thought':
                instructions += `
CHAIN OF THOUGHT REASONING:
- Think through each educational decision step-by-step
- Plan the learning progression before generating each turn
- Consider why each question or response serves the learning objective`;
                break;

            case 'emotional_intelligence':
                instructions += `
EMOTIONAL INTELLIGENCE:
- Recognize and respond to student emotional states (confusion, frustration, excitement)
- Use encouraging language and growth mindset principles
- Acknowledge effort and thinking process, not just correct answers
- Provide appropriate support when student shows difficulty`;
                break;

            case 'adaptive_difficulty':
                instructions += `
ADAPTIVE DIFFICULTY:
- Start at ${config.vocabulary?.complexity || 'intermediate'} level
- Adjust complexity based on student responses within the conversation
- Increase challenge when student shows understanding
- Provide more scaffolding when student struggles`;
                break;

            case 'metacognitive':
                instructions += `
METACOGNITIVE STRATEGIES:
- Ask students about their thinking process: "How did you figure that out?"
- Encourage reflection: "What was challenging about this?"
- Help students recognize their own learning strategies
- Promote transfer: "Where else might you use this approach?"`;
                break;

            case 'assessment_integrated':
                instructions += `
INTEGRATED ASSESSMENT:
- Weave understanding checks naturally into conversation
- Use student responses to gauge comprehension
- Ask for explanations in student's own words
- Probe deeper when responses seem incomplete`;
                break;

            case 'error_recovery':
                instructions += `
ERROR RECOVERY:
- When student makes mistakes, explore their reasoning first
- Address misconceptions through guided discovery
- Use errors as learning opportunities
- Don't immediately correct - help student discover the issue`;
                break;

            case 'progressive_disclosure':
                instructions += `
PROGRESSIVE DISCLOSURE:
- Reveal information strategically, not all at once
- Build complexity gradually throughout the conversation
- Let students discover connections themselves when possible
- Maintain appropriate challenge level`;
                break;

            case 'contextual':
                instructions += `
CONTEXTUAL ADAPTATION:
- Use examples relevant to ${config.subject}
- Adapt language to ${config.vocabulary?.complexity || 'intermediate'} level
- Connect to real-world applications when appropriate
- Use domain-specific terminology appropriately`;
                break;

            case 'closure':
                instructions += `
MEANINGFUL CLOSURE:
- End conversation on a positive learning note
- Help student summarize key insights
- Connect to broader learning goals
- Leave student confident and motivated`;
                break;
        }
    });

    return instructions;
}

/**
 * Gets subject-specific guidance
 */
function getSubjectSpecificGuidance(subject) {
    const guidance = {
        'mathematics': `
MATHEMATICS-SPECIFIC GUIDANCE:
- Use step-by-step problem solving approaches
- Encourage multiple solution methods when appropriate
- Include mathematical reasoning and justification
- Use precise mathematical language
- Connect to real-world applications
- Show work and thinking process clearly`,

        'science': `
SCIENCE-SPECIFIC GUIDANCE:
- Encourage hypothesis formation and testing
- Use scientific method thinking
- Connect to observable phenomena
- Use scientific vocabulary appropriately
- Promote curiosity and wonder about natural world
- Include evidence-based reasoning`,

        'computer_science': `
COMPUTER SCIENCE-SPECIFIC GUIDANCE:
- Emphasize logical thinking and problem decomposition
- Use debugging and iterative thinking
- Connect concepts to real applications
- Include algorithm thinking and pattern recognition
- Encourage experimentation and testing
- Focus on both syntax and conceptual understanding`,

        'language_arts': `
LANGUAGE ARTS-SPECIFIC GUIDANCE:
- Encourage personal interpretation and analysis
- Use textual evidence and close reading
- Develop critical thinking about themes and meaning
- Connect literature to student experiences
- Focus on communication and expression skills
- Include discussion of author's craft and purpose`,

        'history': `
HISTORY-SPECIFIC GUIDANCE:
- Encourage analysis of cause and effect
- Use primary and secondary sources appropriately
- Connect past events to present circumstances
- Develop empathy for historical perspectives
- Focus on evidence-based conclusions
- Include multiple perspectives on events`,

        'general': `
GENERAL EDUCATION GUIDANCE:
- Adapt to the specific learning context
- Use interdisciplinary connections when appropriate
- Focus on transferable thinking skills
- Maintain engagement through variety
- Encourage creative and critical thinking`
    };

    return guidance[subject] || guidance.general;
}

/**
 * Auto-selects appropriate techniques based on configuration
 */
function getRecommendedTechniques(config) {
    console.log('🤖 Auto-selecting techniques based on config...');
    
    const techniques = [];
    
    // Always include these for educational value
    techniques.push('contextual', 'assessment_integrated');
    
    // Model-specific selections
    if (config.ai_settings?.model === 'o3-mini') {
        techniques.push('chain_of_thought', 'metacognitive');
        console.log('🧠 Added O3-mini specific techniques');
    }
    
    // Difficulty-based selections
    if (config.student_utterances?.confusion_level === 'challenging' || 
        config.vocabulary?.complexity === 'beginner') {
        techniques.push('emotional_intelligence', 'adaptive_difficulty', 'error_recovery');
        console.log('🤝 Added support-focused techniques');
    }
    
    // Engagement-based selections
    if (config.student_utterances?.engagement === 'low' || 
        config.student_utterances?.engagement === 'moderate') {
        techniques.push('emotional_intelligence', 'progressive_disclosure');
        console.log('🎯 Added engagement-focused techniques');
    }
    
    // Advanced learner selections
    if (config.vocabulary?.complexity === 'advanced' || 
        config.tutor_questions?.type === 'socratic') {
        techniques.push('metacognitive', 'adaptive_difficulty');
        console.log('🎓 Added advanced learner techniques');
    }
    
    // Subject-specific selections
    if (config.subject === 'mathematics' || config.subject === 'computer_science') {
        techniques.push('chain_of_thought', 'error_recovery');
        console.log('🔢 Added STEM-specific techniques');
    }
    
    // Always include closure for complete conversations
    techniques.push('closure');
    
    // Remove duplicates and limit to reasonable number
    const uniqueTechniques = [...new Set(techniques)].slice(0, 6);
    
    console.log('✅ Recommended techniques:', uniqueTechniques);
    return uniqueTechniques;
}

/**
 * Enhanced dual AI conversation generation with PURPOSE AND WORD COUNT CONTROL
 */
function buildDualAIPrompts(config, aiSettings) {
    console.log('🤝 Building PURPOSE AND WORD COUNT CONTROLLED dual AI prompts...');
    
    const purposeConfig = getPurposeConfiguration(config);
    const baseTutorPrompt = buildTutorPersonaPromptWithPurposes(config, purposeConfig);
    const baseStudentPrompt = buildStudentPersonaPromptWithPurposes(config, purposeConfig);
    
    return {
        tutorPrompt: {
            messages: [
                { role: 'system', content: baseTutorPrompt },
                { role: 'user', content: buildDualAITaskPrompt(config, 'tutor') }
            ]
        },
        studentPrompt: {
            messages: [
                { role: 'system', content: baseStudentPrompt },
                { role: 'user', content: buildDualAITaskPrompt(config, 'student') }
            ]
        }
    };
}

/**
 * Helper function for enhanced dual AI to build contextual prompts
 * This is used by the new context-aware agents
 */
function buildCoherentDualAIPrompts(config, conversationHistory = []) {
    console.log('🎯 Building coherent contextual dual AI prompts...');
    
    const purposeConfig = getPurposeConfiguration(config);
    
    return {
        purposeConfig,
        wordCountInstructions: buildWordCountInstructions(config),
        supportingData: {
            techniques: getRecommendedTechniques(config),
            subjectGuidance: getSubjectSpecificGuidance(config.subject),
            languageName: getLanguageName(config.language || 'english')
        }
    };
}

/**
 * Builds tutor persona for dual AI WITH PURPOSE AND WORD COUNT CONTROL
 */
function buildTutorPersonaPromptWithPurposes(config, purposeConfig) {
    const wordCountInstructions = buildWordCountInstructions(config);
    
    return `You are an experienced ${config.subject || 'general education'} tutor with expertise in ${config.tutor_questions?.type || 'scaffolding'} teaching methods.

TEACHING PHILOSOPHY:
- Focus on student understanding over right answers
- Use ${config.tutor_questions?.type || 'scaffolding'} questioning to guide learning
- Adapt your approach based on student responses
- Encourage growth mindset and learning from mistakes
- Maintain appropriate challenge level for ${config.vocabulary?.complexity || 'intermediate'} students

${buildPurposeInstructions(purposeConfig)}

${wordCountInstructions}

COMMUNICATION STYLE:
- Warm but professional
- Patient with student confusion
- Enthusiastic about ${config.subject}
- Clear and appropriately complex vocabulary
- Responsive to student emotional and cognitive needs
- Maintain target word count of ${config.word_count_controls?.tutor_utterances?.target_words || 30} words per response

CONVERSATION CONTEXT:
- Purpose: ${config.conversation_structure?.purpose || 'Educational tutoring session'}
- Student engagement level: ${config.student_utterances?.engagement || 'high'}
- Expected confusion level: ${config.student_utterances?.confusion_level || 'realistic'}

Generate a JSON response with this structure:
{
  "conversation": [
    {"role": "tutor", "content": "your tutor responses", "purpose": "selected_tutor_purpose", "word_count": actual_word_count}
  ]
}

IMPORTANT: Only use the tutor purposes specified above and maintain appropriate word count targets. You will be having a conversation with a student AI. Respond naturally to what the student says, following your teaching philosophy and using the specified purposes.`;
}

/**
 * Builds student persona for dual AI WITH PURPOSE AND WORD COUNT CONTROL
 */
function buildStudentPersonaPromptWithPurposes(config, purposeConfig) {
    const confusionLevel = config.student_utterances?.confusion_scores?.mean || 3;
    const engagement = config.student_utterances?.engagement || 'high';
    const wordCountInstructions = buildWordCountInstructions(config);
    
    return `You are a ${config.vocabulary?.complexity || 'intermediate'}-level student learning ${config.subject || 'general education'}.

LEARNING CHARACTERISTICS:
- Engagement level: ${engagement}
- Confusion tendency: ${config.student_utterances?.confusion_level || 'realistic'} (avg ${confusionLevel}/5)
- You get things right independently ${Math.round((config.student_utterances?.correctness_distribution?.correct_independent || 0.3) * 100)}% of the time
- You get things right with help ${Math.round((config.student_utterances?.correctness_distribution?.correct_assisted || 0.5) * 100)}% of the time
- You make mistakes ${Math.round((config.student_utterances?.correctness_distribution?.incorrect || 0.2) * 100)}% of the time

PERSONALITY TRAITS:
- Genuinely curious about learning
- Sometimes hesitant to answer if unsure
- Occasionally makes careless mistakes
- Shows realistic confusion and breakthrough moments
- Asks for clarification when needed
- Builds on previous learning in the conversation
- Responds with approximately ${config.word_count_controls?.student_utterances?.target_words || 15} words per response

${buildPurposeInstructions(purposeConfig)}

${wordCountInstructions}

VOCABULARY LEVEL: Use ${config.vocabulary?.complexity || 'intermediate'} level language appropriate for your learning stage.

Generate a JSON response with this structure:
{
  "conversation": [
    {"role": "student", "content": "your student responses", "purpose": "selected_student_purpose", "word_count": actual_word_count}
  ]
}

IMPORTANT: Only use the student purposes specified above and maintain appropriate word count targets. You will be having a conversation with a tutor AI. Respond naturally as a student would, showing your learning process and using the specified purposes.`;
}

/**
 * Builds task-specific prompts for dual AI with word count information
 */
function buildDualAITaskPrompt(config, role) {
    const roleSettings = config.word_count_controls?.[`${role}_utterances`];
    const wordCountInfo = config.word_count_controls?.enforce_limits ? 
        `\nWORD COUNT TARGETS:
- Your responses should target ${roleSettings?.target_words || (role === 'tutor' ? 30 : 15)} words
- Stay within ${roleSettings?.min_words || (role === 'tutor' ? 15 : 8)}-${roleSettings?.max_words || (role === 'tutor' ? 50 : 25)} words per response
- Style: ${roleSettings?.style || (role === 'tutor' ? 'balanced' : 'natural')}
- Include word_count field in your JSON responses` : '';

    const commonContext = `CONVERSATION CONTEXT:
Subject: ${config.subject || 'general education'}
Purpose: ${config.conversation_structure?.purpose || 'Educational tutoring session'}
Total turns planned: ${config.conversation_structure?.turns || 8}
Starting with: ${config.conversation_structure?.starter || 'tutor'}
${wordCountInfo}

This is a ${role === 'tutor' ? 'tutoring' : 'learning'} conversation. Stay in character and respond naturally.`;

    if (role === 'tutor') {
        return `${commonContext}

As the tutor, your goals are:
- Guide the student toward understanding of ${config.subject}
- Use ${config.tutor_questions?.type || 'scaffolding'} methods
- Assess and respond to student understanding
- Maintain appropriate challenge level
- Provide encouragement and feedback
- Use ONLY the specified tutor purposes
- Maintain target word count of ${roleSettings?.target_words || 30} words per response

Generate ${Math.ceil((config.conversation_structure?.turns || 8) / 2)} tutor responses that would work in this conversation.`;
    } else {
        return `${commonContext}

As the student, your goals are:
- Learn the ${config.subject} material being taught
- Ask questions when confused
- Show your thinking process
- Make realistic mistakes and breakthroughs
- Engage authentically with the content
- Use ONLY the specified student purposes
- Maintain target word count of ${roleSettings?.target_words || 15} words per response

Generate ${Math.floor((config.conversation_structure?.turns || 8) / 2)} student responses that would work in this conversation.`;
    }
}

/**
 * Legacy function builders for backward compatibility
 */
function buildO3MiniPrompt(config, aiSettings, techniques = []) {
    console.log('⚠️ Using legacy buildO3MiniPrompt - consider upgrading to purpose-controlled version');
    return buildO3MiniPromptWithPurposesAndWordCount(config, aiSettings, techniques, {
        mode: 'auto',
        tutorPurposes: getAutoSelectedTutorPurposes(config),
        studentPurposes: getAutoSelectedStudentPurposes(config),
        customPurposes: { tutor: [], student: [] }
    });
}

/**
 * Legacy tutor persona builder without purpose control
 */
function buildTutorPersonaPrompt(config) {
    console.log('⚠️ Using legacy buildTutorPersonaPrompt - consider upgrading to purpose-controlled version');
    return buildTutorPersonaPromptWithPurposes(config, {
        mode: 'auto',
        tutorPurposes: getAutoSelectedTutorPurposes(config),
        studentPurposes: getAutoSelectedStudentPurposes(config),
        customPurposes: { tutor: [], student: [] }
    });
}

/**
 * Legacy student persona builder without purpose control
 */
function buildStudentPersonaPrompt(config) {
    console.log('⚠️ Using legacy buildStudentPersonaPrompt - consider upgrading to purpose-controlled version');
    return buildStudentPersonaPromptWithPurposes(config, {
        mode: 'auto',
        tutorPurposes: getAutoSelectedTutorPurposes(config),
        studentPurposes: getAutoSelectedStudentPurposes(config),
        customPurposes: { tutor: [], student: [] }
    });
}

function buildStandardPrompt(config, aiSettings, techniques = []) {
    console.log('⚠️ Using legacy buildStandardPrompt - consider upgrading to purpose-controlled version');
    return buildStandardPromptWithPurposesAndWordCount(config, aiSettings, techniques, {
        mode: 'auto',
        tutorPurposes: getAutoSelectedTutorPurposes(config),
        studentPurposes: getAutoSelectedStudentPurposes(config),
        customPurposes: { tutor: [], student: [] }
    });
}

/**
 * Builds detailed user prompt based on configuration (legacy version)
 */
function buildDetailedUserPrompt(config) {
    console.log('⚠️ Using legacy buildDetailedUserPrompt - consider upgrading to purpose-controlled version');
    return `Create an educational conversation with these detailed specifications:

EDUCATIONAL CONTEXT:
${JSON.stringify({
    subject: config.subject,
    turns: config.conversation_structure?.turns,
    starter: config.conversation_structure?.starter,
    purpose: config.conversation_structure?.purpose,
    vocabulary_complexity: config.vocabulary?.complexity,
    teaching_approach: config.tutor_questions?.type,
    student_engagement: config.student_utterances?.engagement,
    confusion_level: config.student_utterances?.confusion_level
}, null, 2)}

Create a conversation that demonstrates excellent educational practice and natural dialogue flow.`;
}

// Enhanced module exports with both new and legacy functions
module.exports = {
    // PRIMARY API: Enhanced functions with purpose and word count support
    buildMasterEducationalPrompt,
    generateConversationWithPurposes,
    getPurposeConfiguration,
    validateEducationalQualityWithPurposes,
    getAutoSelectedTutorPurposes, 
    getAutoSelectedStudentPurposes,
    buildPurposeInstructions,
    getTutorPurposeDefinition,
    getStudentPurposeDefinition,
    getLanguageName,
    buildO3MiniPromptWithPurposesAndWordCount,
    buildStandardPromptWithPurposesAndWordCount,
    buildTutorPersonaPromptWithPurposes,
    buildStudentPersonaPromptWithPurposes,
    buildDetailedUserPromptWithPurposesAndWordCount,
    
    // Word count specific functions
    buildWordCountInstructions,
    countWords,
    getTutorStyleDescription,
    getStudentStyleDescription,
    
    // Existing functions (maintained for compatibility)
    getRecommendedTechniques,
    buildDualAIPrompts,
    buildCoherentDualAIPrompts, // NEW: For enhanced dual AI system
    buildTechniqueInstructions,
    getSubjectSpecificGuidance,
    buildDetailedUserPrompt,
    buildDualAITaskPrompt,
    
    // Legacy functions (backward compatibility)
    buildO3MiniPrompt,
    buildTutorPersonaPrompt,
    buildStudentPersonaPrompt,
    buildStandardPrompt
};
