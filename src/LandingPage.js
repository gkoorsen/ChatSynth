import React, { useState } from 'react';

const LandingPage = ({ onGenerate, isGenerating, progress, currentConversation, conversations, error, onDownload, onCopy }) => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Purpose control state
  const [purposeMode, setPurposeMode] = useState('auto'); // 'auto', 'guided', 'custom'
  const [selectedTutorPurposes, setSelectedTutorPurposes] = useState([]);
  const [selectedStudentPurposes, setSelectedStudentPurposes] = useState([]);
  const [customPurposes, setCustomPurposes] = useState({ tutor: [], student: [] });
  const [showCustomPurposeDialog, setShowCustomPurposeDialog] = useState(false);
  const [newCustomPurpose, setNewCustomPurpose] = useState({ role: 'tutor', name: '', description: '' });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customTopic, setCustomTopic] = useState('');
  const [config, setConfig] = useState({
    generationMode: 'single_ai',
    conversation_count: 1,
    subject: 'mathematics',
    conversation_structure: {
      turns: 8,
      starter: 'tutor',
      purpose: 'Educational tutoring session focusing on student understanding and skill development',
      tutor_student_ratio: "1:1",
      conversation_starter: 'tutor'
    },
    vocabulary: {
      complexity: 'intermediate',
      domain_specific: true,
      subject: 'general'
    },
    // Word count controls
    word_count_controls: {
      tutor_utterances: {
        min_words: 15,
        max_words: 50,
        target_words: 30,
        style: 'balanced'
      },
      student_utterances: {
        min_words: 8,
        max_words: 25,
        target_words: 15,
        style: 'natural'
      },
      enforce_limits: true,
      allow_variation: true
    },
    tutor_questions: {
      frequency: 'moderate',
      type: 'scaffolding',
      purpose_distribution: {
        assessment: 1,
        guidance: 1,
        clarification: 1
      }
    },
    student_utterances: {
      engagement: 'high',
      confusion_level: 'realistic',
      confusion_scores: {
        mean: 3,
        std: 1,
        min: 1,
        max: 5
      },
      correctness_distribution: {
        correct_independent: 0.3,
        correct_assisted: 0.5,
        incorrect: 0.2
      }
    },
    student_purposes: {
      purpose_weights: {
        better_understanding: 0.3,
        clarification: 0.3,
        practice: 0.2,
        validation: 0.1,
        help_with_problem: 0.1
      },
      custom_purposes: []
    },
    tutor_purposes: {
      purpose_weights: {
        scaffolding: 0.3,
        explanation: 0.3,
        assessment: 0.2,
        encouragement: 0.1,
        guided_discovery: 0.1
      },
      custom_purposes: []
    },
    response_format: 'json',
    include_metadata: true,
    language: 'english'
  });

  // Cookie helpers
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const setCookie = (name, value, days = 30) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  };

  const [apiKey, setApiKey] = useState(() => getCookie('openai_api_key') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(() => !getCookie('openai_api_key'));

  const [aiSettings, setAiSettings] = useState({
    model: 'gpt-4o',
    temperature: 0.7,
    max_completion_tokens: 2000,
    reasoning_effort: 'medium',
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  });

  // Helper function to check if model is O3-mini
  const isO3Mini = (model) => model === 'o3-mini';

  // Purpose taxonomy
  const tutorPurposes = [
    {
      id: 'scaffolding',
      name: 'Scaffolding Support',
      description: 'Break down complex concepts into manageable steps',
      category: 'Support',
      icon: '🏗️'
    },
    {
      id: 'socratic_questioning',
      name: 'Socratic Questioning',
      description: 'Guide discovery through strategic questions',
      category: 'Discovery',
      icon: '🤔'
    },
    {
      id: 'assessment',
      name: 'Understanding Checks',
      description: 'Verify student comprehension throughout',
      category: 'Assessment',
      icon: '✅'
    },
    {
      id: 'encouragement',
      name: 'Encouragement & Motivation',
      description: 'Build confidence and maintain engagement',
      category: 'Support',
      icon: '💪'
    },
    {
      id: 'guided_discovery',
      name: 'Guided Discovery',
      description: 'Lead students to insights through exploration',
      category: 'Discovery',
      icon: '🔍'
    },
    {
      id: 'error_recovery',
      name: 'Error Analysis',
      description: 'Turn mistakes into learning opportunities',
      category: 'Support',
      icon: '🔄'
    },
    {
      id: 'explanation',
      name: 'Clear Explanation',
      description: 'Provide direct, clear explanations when needed',
      category: 'Instruction',
      icon: '💡'
    },
    {
      id: 'real_world_connection',
      name: 'Real-World Connections',
      description: 'Link concepts to practical applications',
      category: 'Engagement',
      icon: '🌍'
    },
    {
      id: 'metacognitive_prompting',
      name: 'Thinking About Thinking',
      description: 'Help students reflect on their learning process',
      category: 'Metacognition',
      icon: '🧠'
    }
  ];

  const studentPurposes = [
    {
      id: 'better_understanding',
      name: 'Seeking Understanding',
      description: 'Working to comprehend concepts clearly',
      category: 'Learning',
      icon: '💡'
    },
    {
      id: 'confusion_expression',
      name: 'Expressing Confusion',
      description: 'Honestly sharing when concepts are unclear',
      category: 'Authentic',
      icon: '😕'
    },
    {
      id: 'hypothesis_testing',
      name: 'Testing Ideas',
      description: 'Proposing and exploring potential solutions',
      category: 'Discovery',
      icon: '🧪'
    },
    {
      id: 'validation_seeking',
      name: 'Seeking Validation',
      description: 'Checking if understanding is correct',
      category: 'Confidence',
      icon: '✋'
    },
    {
      id: 'help_with_problem',
      name: 'Requesting Help',
      description: 'Asking for assistance with specific challenges',
      category: 'Support',
      icon: '🆘'
    },
    {
      id: 'practice_application',
      name: 'Applying Knowledge',
      description: 'Attempting to use newly learned concepts',
      category: 'Application',
      icon: '⚡'
    },
    {
      id: 'clarification',
      name: 'Seeking Clarification',
      description: 'Asking for clarification when something is unclear',
      category: 'Understanding',
      icon: '❓'
    },
    {
      id: 'practice',
      name: 'Practice & Repetition',
      description: 'Engaging in practice to reinforce learning',
      category: 'Application',
      icon: '🎯'
    },
    {
      id: 'reflection',
      name: 'Self-Reflection',
      description: 'Thinking about learning process and progress',
      category: 'Metacognition',
      icon: '🪞'
    },
    {
      id: 'curiosity_extension',
      name: 'Extending Curiosity',
      description: 'Asking questions beyond the immediate topic',
      category: 'Engagement',
      icon: '🚀'
    }
  ];

  // Purpose templates
  const purposeTemplates = [
    {
      id: 'struggling_student',
      name: 'Struggling Student Support',
      description: 'Extra scaffolding and encouragement for students who need more help',
      tutorPurposes: ['scaffolding', 'encouragement', 'error_recovery', 'assessment'],
      studentPurposes: ['confusion_expression', 'help_with_problem', 'validation_seeking', 'better_understanding'],
      icon: '🤝'
    },
    {
      id: 'advanced_inquiry',
      name: 'Advanced Inquiry Learning',
      description: 'Socratic method and independent discovery for advanced learners',
      tutorPurposes: ['socratic_questioning', 'guided_discovery', 'metacognitive_prompting', 'real_world_connection'],
      studentPurposes: ['hypothesis_testing', 'curiosity_extension', 'reflection', 'practice_application'],
      icon: '🎓'
    },
    {
      id: 'stem_problem_solving',
      name: 'STEM Problem Solving',
      description: 'Step-by-step reasoning and error analysis for math/science',
      tutorPurposes: ['scaffolding', 'socratic_questioning', 'error_recovery', 'assessment'],
      studentPurposes: ['hypothesis_testing', 'confusion_expression', 'practice_application', 'better_understanding'],
      icon: '🔬'
    },
    {
      id: 'discussion_based',
      name: 'Discussion-Based Learning',
      description: 'Open dialogue and critical thinking for humanities',
      tutorPurposes: ['socratic_questioning', 'guided_discovery', 'real_world_connection', 'encouragement'],
      studentPurposes: ['hypothesis_testing', 'curiosity_extension', 'better_understanding', 'reflection'],
      icon: '💬'
    },
    {
      id: 'confidence_building',
      name: 'Confidence Building',
      description: 'Positive reinforcement and gradual challenge increase',
      tutorPurposes: ['encouragement', 'scaffolding', 'assessment', 'real_world_connection'],
      studentPurposes: ['validation_seeking', 'practice_application', 'better_understanding', 'curiosity_extension'],
      icon: '⭐'
    }
  ];

  // Presets
  const presets = [
    {
      id: 'math_basic',
      title: 'Mathematics Tutoring',
      description: 'Basic algebra and arithmetic problem-solving sessions',
      mode: 'Single AI',
      complexity: 'Beginner',
      popular: true,
      config: {
        generationMode: 'single_ai',
        subject: 'mathematics',
        conversation_structure: {
          turns: 8,
          starter: 'tutor',
          purpose: 'Mathematics tutoring focusing on algebra and problem-solving with step-by-step guidance',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'intermediate',
          domain_specific: true,
          subject: 'mathematics'
        },
        tutor_questions: {
          frequency: 'high',
          type: 'scaffolding',
          purpose_distribution: { assessment: 2, guidance: 3, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'moderate',
          confusion_scores: { mean: 3, std: 1, min: 1, max: 5 },
          correctness_distribution: { correct_independent: 0.2, correct_assisted: 0.6, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.4, clarification: 0.3, practice: 0.2, validation: 0.05, help_with_problem: 0.05 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.4, explanation: 0.3, assessment: 0.2, encouragement: 0.05, guided_discovery: 0.05 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.6,
        max_completion_tokens: 1800,
        reasoning_effort: 'medium',
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'math_o3',
      title: 'Advanced Math Reasoning (O3-mini)',
      description: 'Complex mathematical problem-solving with advanced reasoning',
      mode: 'Single AI',
      complexity: 'Advanced',
      popular: true,
      config: {
        generationMode: 'single_ai',
        subject: 'mathematics',
        conversation_structure: {
          turns: 10,
          starter: 'tutor',
          purpose: 'Advanced mathematics tutoring with deep reasoning and complex problem-solving',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'mathematics'
        },
        tutor_questions: {
          frequency: 'high',
          type: 'socratic',
          purpose_distribution: { assessment: 3, guidance: 2, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'challenging',
          confusion_scores: { mean: 4, std: 1, min: 2, max: 5 },
          correctness_distribution: { correct_independent: 0.1, correct_assisted: 0.7, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.5, clarification: 0.3, practice: 0.1, validation: 0.05, help_with_problem: 0.05 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.3, explanation: 0.4, assessment: 0.2, encouragement: 0.05, guided_discovery: 0.05 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'o3-mini',
        reasoning_effort: 'high',
        max_completion_tokens: 2500,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'science_discovery',
      title: 'Science Discovery Learning',
      description: 'Inquiry-based science exploration and hypothesis testing',
      mode: 'Dual AI',
      complexity: 'Intermediate',
      popular: true,
      config: {
        generationMode: 'dual_ai',
        conversation_count: 2,
        subject: 'science',
        conversation_structure: {
          turns: 10,
          starter: 'student',
          purpose: 'Science discovery learning with inquiry-based approach and hypothesis testing',
          tutor_student_ratio: "1:1",
          conversation_starter: 'student'
        },
        vocabulary: {
          complexity: 'intermediate',
          domain_specific: true,
          subject: 'science'
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'socratic',
          purpose_distribution: { assessment: 1, guidance: 2, clarification: 2 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'realistic',
          confusion_scores: { mean: 3, std: 1.5, min: 1, max: 5 },
          correctness_distribution: { correct_independent: 0.3, correct_assisted: 0.4, incorrect: 0.3 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.3, clarification: 0.2, practice: 0.3, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.2, explanation: 0.2, assessment: 0.1, encouragement: 0.2, guided_discovery: 0.3 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.8,
        max_completion_tokens: 2200,
        reasoning_effort: 'medium',
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'language_arts',
      title: 'Language Arts Discussion',
      description: 'Reading comprehension and literary analysis conversations',
      mode: 'Single AI',
      complexity: 'Intermediate',
      popular: false,
      config: {
        generationMode: 'single_ai',
        subject: 'language arts',
        conversation_structure: {
          turns: 12,
          starter: 'tutor',
          purpose: 'Language arts discussion focusing on reading comprehension and literary analysis',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'language arts'
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'analytical',
          purpose_distribution: { assessment: 1, guidance: 2, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'low',
          confusion_scores: { mean: 2, std: 1, min: 1, max: 4 },
          correctness_distribution: { correct_independent: 0.4, correct_assisted: 0.4, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.4, clarification: 0.2, practice: 0.2, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.2, explanation: 0.3, assessment: 0.3, encouragement: 0.1, guided_discovery: 0.1 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.7,
        max_completion_tokens: 2000,
        reasoning_effort: 'medium',
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'history_analysis',
      title: 'Historical Analysis',
      description: 'Critical thinking about historical events and contexts',
      mode: 'Dual AI',
      complexity: 'Advanced',
      popular: false,
      config: {
        generationMode: 'dual_ai',
        conversation_count: 2,
        subject: 'history',
        conversation_structure: {
          turns: 10,
          starter: 'tutor',
          purpose: 'Historical analysis with critical thinking emphasis and contextual understanding',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'history'
        },
        tutor_questions: {
          frequency: 'high',
          type: 'analytical',
          purpose_distribution: { assessment: 2, guidance: 1, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'moderate',
          confusion_scores: { mean: 3, std: 1, min: 2, max: 5 },
          correctness_distribution: { correct_independent: 0.3, correct_assisted: 0.5, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.4, clarification: 0.3, practice: 0.1, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.2, explanation: 0.3, assessment: 0.3, encouragement: 0.1, guided_discovery: 0.1 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'o3-mini',
        reasoning_effort: 'high',
        max_completion_tokens: 2400,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'coding_tutor',
      title: 'Programming Tutor',
      description: 'Code review and programming concept explanation',
      mode: 'Single AI',
      complexity: 'Advanced',
      popular: true,
      config: {
        generationMode: 'single_ai',
        subject: 'computer_science',
        conversation_structure: {
          turns: 10,
          starter: 'tutor',
          purpose: 'Programming tutoring session with code examples and debugging practice',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'advanced',
          domain_specific: true,
          subject: 'computer_science'
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'problem_solving',
          purpose_distribution: { assessment: 2, guidance: 2, clarification: 1 }
        },
        student_utterances: {
          engagement: 'high',
          confusion_level: 'challenging',
          confusion_scores: { mean: 4, std: 1, min: 2, max: 5 },
          correctness_distribution: { correct_independent: 0.2, correct_assisted: 0.6, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.35, clarification: 0.25, practice: 0.2, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.35, explanation: 0.35, assessment: 0.2, encouragement: 0.05, guided_discovery: 0.05 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'o3-mini',
        reasoning_effort: 'high',
        max_completion_tokens: 2800,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    },
    {
      id: 'custom_topic',
      title: 'Custom Topic Exploration',
      description: 'Flexible conversation generation for any educational topic',
      mode: 'Single AI',
      complexity: 'Beginner',
      popular: false,
      config: {
        generationMode: 'single_ai',
        subject: 'general',
        conversation_structure: {
          turns: 8,
          starter: 'tutor',
          purpose: 'Custom topic exploration with adaptive approach and flexible learning goals',
          tutor_student_ratio: "1:1",
          conversation_starter: 'tutor'
        },
        vocabulary: {
          complexity: 'intermediate',
          domain_specific: false,
          subject: 'general'
        },
        tutor_questions: {
          frequency: 'moderate',
          type: 'exploratory',
          purpose_distribution: { assessment: 1, guidance: 2, clarification: 1 }
        },
        student_utterances: {
          engagement: 'moderate',
          confusion_level: 'realistic',
          confusion_scores: { mean: 3, std: 1, min: 1, max: 5 },
          correctness_distribution: { correct_independent: 0.3, correct_assisted: 0.5, incorrect: 0.2 }
        },
        student_purposes: {
          purpose_weights: { better_understanding: 0.3, clarification: 0.3, practice: 0.2, validation: 0.1, help_with_problem: 0.1 },
          custom_purposes: []
        },
        tutor_purposes: {
          purpose_weights: { scaffolding: 0.3, explanation: 0.3, assessment: 0.2, encouragement: 0.1, guided_discovery: 0.1 },
          custom_purposes: []
        },
        response_format: 'json',
        include_metadata: true,
        language: 'english'
      },
      aiSettings: {
        model: 'gpt-4o',
        temperature: 0.7,
        max_completion_tokens: 2000,
        reasoning_effort: 'medium',
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      }
    }
  ];

  // Helper functions
  const getAutoSuggestedPurposes = () => {
    const suggestions = { tutor: [], student: [] };
    
    // Based on vocabulary complexity
    if (config.vocabulary?.complexity === 'beginner') {
      suggestions.tutor.push('scaffolding', 'encouragement', 'assessment');
      suggestions.student.push('confusion_expression', 'help_with_problem', 'validation_seeking');
    } else if (config.vocabulary?.complexity === 'advanced') {
      suggestions.tutor.push('socratic_questioning', 'guided_discovery', 'metacognitive_prompting');
      suggestions.student.push('hypothesis_testing', 'reflection', 'curiosity_extension');
    } else {
      suggestions.tutor.push('scaffolding', 'guided_discovery', 'assessment');
      suggestions.student.push('better_understanding', 'practice_application', 'clarification');
    }
    
    // Based on question type
    if (config.tutor_questions?.type === 'socratic') {
      suggestions.tutor.push('socratic_questioning', 'guided_discovery');
      suggestions.student.push('hypothesis_testing', 'better_understanding');
    } else if (config.tutor_questions?.type === 'scaffolding') {
      suggestions.tutor.push('scaffolding', 'assessment');
      suggestions.student.push('practice_application', 'validation_seeking');
    } else if (config.tutor_questions?.type === 'analytical') {
      suggestions.tutor.push('socratic_questioning', 'real_world_connection');
      suggestions.student.push('hypothesis_testing', 'reflection');
    }
    
    // Based on subject
    if (config.subject === 'mathematics' || config.subject === 'computer_science') {
      suggestions.tutor.push('error_recovery', 'scaffolding');
      suggestions.student.push('hypothesis_testing', 'confusion_expression');
    } else if (config.subject === 'science') {
      suggestions.tutor.push('guided_discovery', 'socratic_questioning');
      suggestions.student.push('hypothesis_testing', 'curiosity_extension');
    } else if (config.subject === 'language arts' || config.subject === 'history') {
      suggestions.tutor.push('real_world_connection', 'guided_discovery');
      suggestions.student.push('reflection', 'curiosity_extension');
    }
    
    // Based on engagement level
    if (config.student_utterances?.engagement === 'low') {
      suggestions.tutor.push('encouragement', 'real_world_connection');
      suggestions.student.push('curiosity_extension', 'validation_seeking');
    } else if (config.student_utterances?.engagement === 'high') {
      suggestions.tutor.push('socratic_questioning', 'guided_discovery');
      suggestions.student.push('hypothesis_testing', 'curiosity_extension');
    }
    
    // Always include core purposes
    suggestions.tutor.push('assessment');
    suggestions.student.push('better_understanding');
    
    // Remove duplicates and limit to reasonable number
    suggestions.tutor = [...new Set(suggestions.tutor)].slice(0, 6);
    suggestions.student = [...new Set(suggestions.student)].slice(0, 5);
    
    return suggestions;
  };

  const applyTemplate = (template) => {
    setSelectedTutorPurposes(template.tutorPurposes);
    setSelectedStudentPurposes(template.studentPurposes);
    setSelectedTemplate(template.id); // Add this line
    setPurposeMode('guided');
  };

  const toggleTutorPurpose = (purposeId) => {
    setSelectedTutorPurposes(prev => 
      prev.includes(purposeId) 
        ? prev.filter(id => id !== purposeId)
        : [...prev, purposeId]
    );
  };

  const toggleStudentPurpose = (purposeId) => {
    setSelectedStudentPurposes(prev => 
      prev.includes(purposeId) 
        ? prev.filter(id => id !== purposeId)
        : [...prev, purposeId]
    );
  };

  const addCustomPurpose = () => {
    if (!newCustomPurpose.name.trim() || !newCustomPurpose.description.trim()) {
      alert('Please provide both name and description for the custom purpose.');
      return;
    }

    const customPurpose = {
      id: `custom_${Date.now()}`,
      name: newCustomPurpose.name,
      description: newCustomPurpose.description,
      category: 'Custom',
      icon: '⭐',
      isCustom: true
    };
    
    setCustomPurposes(prev => ({
      ...prev,
      [newCustomPurpose.role]: [...prev[newCustomPurpose.role], customPurpose]
    }));
    
    // Auto-select the new custom purpose
    if (newCustomPurpose.role === 'tutor') {
      setSelectedTutorPurposes(prev => [...prev, customPurpose.id]);
    } else {
      setSelectedStudentPurposes(prev => [...prev, customPurpose.id]);
    }

    // Reset form
    setNewCustomPurpose({ role: 'tutor', name: '', description: '' });
    setShowCustomPurposeDialog(false);
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.id);
    setConfig(preset.config);
    setAiSettings(preset.aiSettings);
    // Reset purpose mode to auto when selecting preset
    setPurposeMode('auto');
    setSelectedTutorPurposes([]);
    setSelectedStudentPurposes([]);
    setSelectedTemplate(null); // Add this line
  };

  const handleConfigChange = (path, value) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      // Validate word count settings if they were modified
      if (path.startsWith('word_count_controls')) {
        const validation = validateWordCountSettings(newConfig);
        if (!validation.isValid) {
          console.warn('Word count validation issues:', validation.issues);
        }
      }
      
      return newConfig;
    });
  };

  const handleAiSettingChange = (key, value) => {
    setAiSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      if (key === 'model') {
        if (isO3Mini(value)) {
          const { temperature, top_p, frequency_penalty, presence_penalty, max_tokens, ...o3Settings } = newSettings;
          return {
            ...o3Settings,
            max_completion_tokens: o3Settings.max_completion_tokens || o3Settings.max_tokens || 2000,
            reasoning_effort: o3Settings.reasoning_effort || 'medium'
          };
        } else {
          const { max_completion_tokens, ...standardSettings } = newSettings;
          return {
            ...standardSettings,
            max_tokens: max_completion_tokens || standardSettings.max_tokens || 2000,
            temperature: standardSettings.temperature || 0.7,
            top_p: standardSettings.top_p || 1.0,
            frequency_penalty: standardSettings.frequency_penalty || 0.0,
            presence_penalty: standardSettings.presence_penalty || 0.0
          };
        }
      }
      
      return newSettings;
    });
  };

  const handleApiKeyChange = (value) => {
    setApiKey(value);
    if (value.trim()) {
      setCookie('openai_api_key', value.trim());
      setShowApiKeyInput(false);
    }
  };

  const handleApiKeyToggle = () => {
    setShowApiKeyInput(!showApiKeyInput);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      alert('Please provide your OpenAI API key before generating conversations.');
      setShowApiKeyInput(true);
      return;
    }
    
    // Validate custom topic if selected
    if (config.subject === 'custom' && !customTopic.trim()) {
      alert('Please enter a custom topic for your conversation.');
      return;
    }
    
    // Build enhanced config with purpose control and custom topic handling
    const enhancedConfig = {
      ...config,
      // Use custom topic if selected, otherwise use the selected subject
      subject: config.subject === 'custom' ? customTopic.trim() : config.subject,
      custom_topic: config.subject === 'custom' ? customTopic.trim() : null,
      purpose_control: {
        mode: purposeMode,
        selected_tutor_purposes: purposeMode === 'auto' ? getAutoSuggestedPurposes().tutor : selectedTutorPurposes,
        selected_student_purposes: purposeMode === 'auto' ? getAutoSuggestedPurposes().student : selectedStudentPurposes,
        custom_purposes: customPurposes,
        auto_suggestions: purposeMode === 'auto' ? getAutoSuggestedPurposes() : null
      }
    };
    
    onGenerate(enhancedConfig, { ...aiSettings, api_key: apiKey.trim() });
  };

  const validateWordCountSettings = (config) => {
    const tutorSettings = config.word_count_controls?.tutor_utterances;
    const studentSettings = config.word_count_controls?.student_utterances;
    
    const issues = [];
    
    if (tutorSettings) {
      if (tutorSettings.min_words >= tutorSettings.max_words) {
        issues.push('Tutor minimum words must be less than maximum words');
      }
      if (tutorSettings.target_words < tutorSettings.min_words || tutorSettings.target_words > tutorSettings.max_words) {
        issues.push('Tutor target words must be between minimum and maximum');
      }
    }
    
    if (studentSettings) {
      if (studentSettings.min_words >= studentSettings.max_words) {
        issues.push('Student minimum words must be less than maximum words');
      }
      if (studentSettings.target_words < studentSettings.min_words || studentSettings.target_words > studentSettings.max_words) {
        issues.push('Student target words must be between minimum and maximum');
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  };

  const getConversationsArray = () => {
    if (!conversations || !Array.isArray(conversations)) {
      return [];
    }
    return conversations;
  };

  const getConversationContent = (conversation) => {
    if (!conversation) return [];
    
    if (conversation.conversation && Array.isArray(conversation.conversation)) {
      return conversation.conversation;
    }
    
    if (Array.isArray(conversation)) {
      return conversation;
    }
    
    return [];
  };

  const generateEducationalSummary = (config, purposes) => {
    const vocabLevel = config.vocabulary?.complexity || 'intermediate';
    const engagement = config.student_utterances?.engagement || 'high';
    const questionType = config.tutor_questions?.type || 'scaffolding';
    const subject = config.subject || 'general';
    
    let summary = `This conversation will feature ${vocabLevel}-level ${subject} content with ${engagement} student engagement. `;
    
    if (purposes.tutor.includes('scaffolding')) {
      summary += "The tutor will break down complex concepts into manageable steps. ";
    }
    
    if (purposes.tutor.includes('socratic_questioning')) {
      summary += "Strategic questioning will guide the student to discover insights independently. ";
    }
    
    if (purposes.student.includes('hypothesis_testing')) {
      summary += "The student will actively propose and test ideas. ";
    } else if (purposes.student.includes('validation_seeking')) {
      summary += "The student will seek confirmation and guidance when uncertain. ";
    }
    
    if (questionType === 'socratic') {
      summary += "Expect deep, thought-provoking dialogue that promotes critical thinking.";
    } else if (questionType === 'scaffolding') {
      summary += "Expect structured, supportive guidance with clear learning progression.";
    } else {
      summary += "Expect a balanced approach tailored to student needs.";
    }
    
    return summary;
  };

  // Word Count Components
  const WordCountComplianceIndicator = ({ turn, settings, allowVariation }) => {
    const roleSettings = turn.role === 'tutor' ? settings.tutor_utterances : settings.student_utterances;
    
    if (!roleSettings || !turn.word_count) return null;
    
    const { min_words, max_words, target_words } = roleSettings;
    const actualWords = turn.word_count;
    
    // Calculate effective limits with variation if allowed
    let effectiveMin = min_words;
    let effectiveMax = max_words;
    
    if (allowVariation && target_words) {
      const variation = Math.round(target_words * 0.2);
      effectiveMin = Math.max(1, min_words - variation);
      effectiveMax = max_words + variation;
    }
    
    // Determine compliance status
    let status = 'compliant';
    let statusColor = 'text-green-600';
    let statusIcon = '✅';
    
    if (actualWords < effectiveMin) {
      status = 'too-short';
      statusColor = 'text-red-600';
      statusIcon = '📉';
    } else if (actualWords > effectiveMax) {
      status = 'too-long';
      statusColor = 'text-red-600';
      statusIcon = '📈';
    } else if (actualWords < min_words || actualWords > max_words) {
      status = 'acceptable-variation';
      statusColor = 'text-amber-600';
      statusIcon = '⚠️';
    }
    
    return (
      <div className={`text-xs ${statusColor} flex items-center space-x-1`} title={`Target: ${target_words}, Range: ${effectiveMin}-${effectiveMax}`}>
        <span>{statusIcon}</span>
        {status === 'compliant' && <span>Within target</span>}
        {status === 'acceptable-variation' && <span>Acceptable variation</span>}
        {status === 'too-short' && <span>Too short</span>}
        {status === 'too-long' && <span>Too long</span>}
      </div>
    );
  };

  const ConversationSummary = ({ conversations, config }) => {
    if (!conversations || conversations.length === 0) return null;
    
    const totalConversations = conversations.length;
    const wordCountEnabled = config.word_count_controls?.enforce_limits;
    
    // Calculate overall statistics
    let totalTurns = 0;
    let totalTutorWords = 0;
    let totalStudentWords = 0;
    let tutorTurns = 0;
    let studentTurns = 0;
    let wordCountViolations = 0;
    
    conversations.forEach(convData => {
      const conv = getConversationContent(convData);
      totalTurns += conv.length;
      
      conv.forEach(turn => {
        if (turn.role === 'tutor') {
          tutorTurns++;
          if (turn.word_count) totalTutorWords += turn.word_count;
        } else {
          studentTurns++;
          if (turn.word_count) totalStudentWords += turn.word_count;
        }
      });
      
      // Count violations from metadata
      if (convData.metadata?.word_count_statistics) {
        wordCountViolations += (convData.metadata.word_count_statistics.tutor?.violations || 0);
        wordCountViolations += (convData.metadata.word_count_statistics.student?.violations || 0);
      }
    });
    
    const avgTutorWords = tutorTurns > 0 ? Math.round(totalTutorWords / tutorTurns) : 0;
    const avgStudentWords = studentTurns > 0 ? Math.round(totalStudentWords / studentTurns) : 0;
    
    return (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-3">Generation Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-700">{totalConversations}</div>
            <div className="text-blue-600">Conversations</div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-700">{totalTurns}</div>
            <div className="text-blue-600">Total Turns</div>
          </div>
          
          {wordCountEnabled && (
            <>
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-700">{avgTutorWords}</div>
                <div className="text-blue-600">Avg Tutor Words</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-blue-700">{avgStudentWords}</div>
                <div className="text-blue-600">Avg Student Words</div>
              </div>
            </>
          )}
        </div>
        
        {wordCountEnabled && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Word Count Compliance:</span>
              <span className={`text-sm font-medium ${wordCountViolations === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                {wordCountViolations === 0 ? '✅ Perfect' : `⚠️ ${wordCountViolations} violations`}
              </span>
            </div>
            
            {config.word_count_controls && (
              <div className="mt-2 text-xs text-blue-600">
                <div>Target: Tutor {config.word_count_controls.tutor_utterances?.target_words || 30} words, Student {config.word_count_controls.student_utterances?.target_words || 15} words</div>
                <div>
                  Ranges: Tutor {config.word_count_controls.tutor_utterances?.min_words || 15}-{config.word_count_controls.tutor_utterances?.max_words || 50}, 
                  Student {config.word_count_controls.student_utterances?.min_words || 8}-{config.word_count_controls.student_utterances?.max_words || 25}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const ErrorDisplayWithWordCount = ({ error, config }) => {
    const isWordCountRelated = error && (
      error.includes('word count') || 
      error.includes('too short') || 
      error.includes('too long') ||
      error.includes('word limit')
    );
    
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Generation Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            
            {isWordCountRelated && config.word_count_controls?.enforce_limits && (
              <div className="mt-3 p-3 bg-red-100 border border-red-200 rounded">
                <h4 className="text-sm font-medium text-red-800 mb-2">Word Count Settings:</h4>
                <div className="text-xs text-red-700 space-y-1">
                  <div>Tutor: {config.word_count_controls.tutor_utterances?.min_words}-{config.word_count_controls.tutor_utterances?.max_words} words (target: {config.word_count_controls.tutor_utterances?.target_words})</div>
                  <div>Student: {config.word_count_controls.student_utterances?.min_words}-{config.word_count_controls.student_utterances?.max_words} words (target: {config.word_count_controls.student_utterances?.target_words})</div>
                  <div className="mt-2 font-medium">Try adjusting word count limits or disabling word count control if the error persists.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced download and copy functions
  const calculateComplianceRate = (wordCountStats) => {
    if (!wordCountStats) return null;
    
    const totalResponses = (wordCountStats.tutor?.count || 0) + (wordCountStats.student?.count || 0);
    const totalViolations = (wordCountStats.tutor?.violations || 0) + (wordCountStats.student?.violations || 0);
    
    if (totalResponses === 0) return null;
    
    return Math.round(((totalResponses - totalViolations) / totalResponses) * 100);
  };

  const downloadConversationsWithWordCount = () => {
    const enhancedData = {
      metadata: {
        generated_at: new Date().toISOString(),
        total_conversations: conversations.length,
        word_count_enabled: config.word_count_controls?.enforce_limits || false,
        word_count_settings: config.word_count_controls || null,
        purpose_control_mode: purposeMode,
        export_version: '2.1_with_word_counts'
      },
      conversations: conversations.map(conv => ({
        ...conv,
        word_count_analysis: conv.metadata?.word_count_statistics ? {
          tutor_average: conv.metadata.word_count_statistics.tutor?.average,
          student_average: conv.metadata.word_count_statistics.student?.average,
          total_violations: (conv.metadata.word_count_statistics.tutor?.violations || 0) + 
                           (conv.metadata.word_count_statistics.student?.violations || 0),
          compliance_rate: calculateComplianceRate(conv.metadata.word_count_statistics)
        } : null
      }))
    };
    
    const dataStr = JSON.stringify(enhancedData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chatsynth_conversations_with_word_counts_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const copyToClipboardWithWordCount = (conversations) => {
    let copyText = "ChatSynth Conversation Export\n";
    copyText += "=".repeat(50) + "\n\n";
    
    if (config.word_count_controls?.enforce_limits) {
      copyText += "Word Count Controls: ENABLED\n";
      copyText += `Tutor Target: ${config.word_count_controls.tutor_utterances?.target_words || 30} words\n`;
      copyText += `Student Target: ${config.word_count_controls.student_utterances?.target_words || 15} words\n\n`;
    }
    
    conversations.forEach((convData, index) => {
      const conv = getConversationContent(convData);
      copyText += `Conversation ${index + 1}:\n`;
      copyText += "-".repeat(20) + "\n";
      
      // Add word count summary if available
      if (convData.metadata?.word_count_statistics) {
        const stats = convData.metadata.word_count_statistics;
        copyText += `Word Count Summary:\n`;
        copyText += `  Tutor: ${stats.tutor?.average || 'N/A'} avg words (${stats.tutor?.violations || 0} violations)\n`;
        copyText += `  Student: ${stats.student?.average || 'N/A'} avg words (${stats.student?.violations || 0} violations)\n\n`;
      }
      
      conv.forEach((turn, turnIndex) => {
        copyText += `${turn.role.toUpperCase()}: ${turn.content}`;
        if (turn.word_count) {
          copyText += ` [${turn.word_count} words]`;
        }
        if (turn.purpose) {
          copyText += ` (${turn.purpose})`;
        }
        copyText += "\n\n";
      });
      
      copyText += "\n";
    });
    
    navigator.clipboard.writeText(copyText).then(() => {
      alert('Conversations with word count data copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm">
                <img 
                  src="/favicon.png" 
                  alt="ChatSynth Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ChatSynth</h1>
                <p className="text-sm text-gray-600">AI-Powered Educational Conversations</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {isGenerating ? `Generating... ${progress}%` : 'Ready'}
              </div>
              {!showApiKeyInput && (
                <button
                  onClick={handleApiKeyToggle}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0a2 2 0 01-2 2m2-2a2 2 0 002-2m0 0a2 2 0 00-2-2m-4 6V9a2 2 0 00-2-2V5a2 2 0 10-4 0v2a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2z" />
                  </svg>
                  <span>API Key</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Input Section */}
        {showApiKeyInput && (
          <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">OpenAI API Key Required</h3>
                <p className="text-sm text-yellow-700 mt-1 mb-4">
                  Please enter your OpenAI API key to generate conversations. Your key will be stored securely in your browser and never shared.
                </p>
                <div className="flex items-center space-x-3">
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleApiKeyChange(apiKey)}
                    disabled={!apiKey.trim()}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      apiKey.trim()
                        ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Save Key
                  </button>
                  {apiKey && (
                    <button
                      onClick={() => setShowApiKeyInput(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <p className="text-xs text-yellow-600 mt-2">
                  Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-800">OpenAI Platform</a>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Presets */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose a Preset</h2>
              <div className="space-y-3">
                {presets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedPreset === preset.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-gray-900">{preset.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                            {preset.mode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Configuration */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Configuration */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Configuration</h2>
                
                <div className="space-y-4">
                  {/* Generation Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Generation Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleConfigChange('generationMode', 'single_ai')}
                        className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                          config.generationMode === 'single_ai'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Single AI
                      </button>
                      <button
                        type="button"
                        onClick={() => handleConfigChange('generationMode', 'dual_ai')}
                        className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                          config.generationMode === 'dual_ai'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Dual AI
                      </button>
                    </div>
                  </div>

                  {/* Conversation Count */}
                  {config.generationMode === 'dual_ai' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Conversations
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={config.conversation_count}
                        onChange={(e) => handleConfigChange('conversation_count', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}

                  {/* Subject */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <select
                      value={config.subject}
                      onChange={(e) => handleConfigChange('subject', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="mathematics">Mathematics</option>
                      <option value="science">Science</option>
                      <option value="language_learning">Language Learning</option>
                      <option value="language_arts">Language Arts</option>
                      <option value="computer_science">Computer Science</option>
                      <option value="history">History</option>
                      <option value="philosophy">Philosophy</option>
                      <option value="general">General</option>
                      <option value="custom">Custom Topic</option>
                    </select>
                  </div>

                  {/* Custom Topic Input */}
                  {config.subject === 'custom' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Topic
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Quantum Physics, Medieval Literature, Data Structures..."
                        value={customTopic}
                        onChange={(e) => setCustomTopic(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the specific topic or subject area for your conversation
                      </p>
                    </div>
                  )}

                  {/* Conversation Turns */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conversation Turns: {config.conversation_structure.turns}
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="20"
                      value={config.conversation_structure.turns}
                      onChange={(e) => handleConfigChange('conversation_structure.turns', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Educational Purpose Control */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Educational Purpose Control</h2>
                
                {/* Purpose Mode Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purpose Selection Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPurposeMode('auto');
                          setSelectedTemplate(null);
                        }}
                        className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                          purposeMode === 'auto'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Auto-Select
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPurposeMode('guided');
                          setSelectedTemplate(null);
                        }}
                        className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                          purposeMode === 'guided'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Templates
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPurposeMode('custom');
                          setSelectedTemplate(null);
                        }}
                        className={`p-3 text-sm font-medium rounded-lg border-2 transition-colors ${
                          purposeMode === 'custom'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        Custom
                      </button>
                    </div>
</div>

                {/* Auto Mode - Enhanced Explanation */}
                {purposeMode === 'auto' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1">
                          <h3 className="text-sm font-medium text-blue-800">Smart Purpose Selection</h3>
                          <p className="text-sm text-blue-700 mt-1">
                            Based on your configuration, we'll automatically choose the best educational approaches for your conversation.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Selected Purposes Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Tutor Purposes */}
                      <div className="bg-blue-25 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          Tutor Will Use ({getAutoSuggestedPurposes().tutor.length} approaches)
                        </h4>
                        <div className="space-y-2">
                          {getAutoSuggestedPurposes().tutor.map(purposeId => {
                            const purpose = tutorPurposes.find(p => p.id === purposeId);
                            return purpose ? (
                              <div key={purposeId} className="flex items-start">
                                <span className="text-sm mr-2">{purpose.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900">{purpose.name}</div>
                                  <div className="text-xs text-gray-600">{purpose.description}</div>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>

                      {/* Student Purposes */}
                      <div className="bg-green-25 border border-green-200 rounded-lg p-4">
                        <h4 className="font-medium text-green-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                          Student Will Show ({getAutoSuggestedPurposes().student.length} behaviors)
                        </h4>
                        <div className="space-y-2">
                          {getAutoSuggestedPurposes().student.map(purposeId => {
                            const purpose = studentPurposes.find(p => p.id === purposeId);
                            return purpose ? (
                              <div key={purposeId} className="flex items-start">
                                <span className="text-sm mr-2">{purpose.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900">{purpose.name}</div>
                                  <div className="text-xs text-gray-600">{purpose.description}</div>
                                </div>
                              </div>
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Educational Rationale */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <h4 className="font-medium text-amber-900 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                        Educational Approach Summary
                      </h4>
                      <p className="text-sm text-amber-800">
                        {generateEducationalSummary(config, getAutoSuggestedPurposes())}
                      </p>
                    </div>
                  </div>
                )}

                {/* Template Mode - Show Templates */}
                {purposeMode === 'guided' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 mb-3">Choose a pre-designed template for common educational scenarios:</p>
                    
                    {/* Template Selection */}
                    <div className="space-y-3">
                      {purposeTemplates.map((template) => (
                        <div
                          key={template.id}
                          onClick={() => applyTemplate(template)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                            selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50 shadow-md'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                          }`}
                        >
                          <div className="flex items-start">
                            <span className="text-2xl mr-3">{template.icon}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">{template.name}</h4>
                                {selectedTemplate === template.id && (
                                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                                    Selected
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                              <div className="mt-2 text-xs text-gray-500">
                                <div><strong>Tutor:</strong> {template.tutorPurposes.slice(0, 3).join(', ')}{template.tutorPurposes.length > 3 ? '...' : ''}</div>
                                <div><strong>Student:</strong> {template.studentPurposes.slice(0, 3).join(', ')}{template.studentPurposes.length > 3 ? '...' : ''}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                
                    {/* Selected Template Purposes Display */}
                    {selectedTemplate && (
                      <div className="mt-6 border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          Applied Template Purposes
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Selected Tutor Purposes */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h5 className="font-medium text-blue-900 mb-3 flex items-center">
                              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                              Tutor Approaches ({selectedTutorPurposes.length})
                            </h5>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {selectedTutorPurposes.map(purposeId => {
                                const purpose = tutorPurposes.find(p => p.id === purposeId);
                                return purpose ? (
                                  <div key={purposeId} className="flex items-start">
                                    <span className="text-sm mr-2">{purpose.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-gray-900">{purpose.name}</div>
                                      <div className="text-xs text-gray-600">{purpose.description}</div>
                                    </div>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                
                          {/* Selected Student Purposes */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h5 className="font-medium text-green-900 mb-3 flex items-center">
                              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                              Student Behaviors ({selectedStudentPurposes.length})
                            </h5>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {selectedStudentPurposes.map(purposeId => {
                                const purpose = studentPurposes.find(p => p.id === purposeId);
                                return purpose ? (
                                  <div key={purposeId} className="flex items-start">
                                    <span className="text-sm mr-2">{purpose.icon}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-gray-900">{purpose.name}</div>
                                      <div className="text-xs text-gray-600">{purpose.description}</div>
                                    </div>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                
                        {/* Template Actions */}
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Template applied! You can now generate conversations or switch to Custom mode to modify purposes.
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTemplate(null);
                              setSelectedTutorPurposes([]);
                              setSelectedStudentPurposes([]);
                            }}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Clear Selection
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Mode - Purpose Selection */}
                {purposeMode === 'custom' && (
                  <div className="space-y-4">
                    {/* Tutor Purposes */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Tutor Teaching Purposes</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                        {tutorPurposes.concat(customPurposes.tutor).map((purpose) => (
                          <label key={purpose.id} className="flex items-start p-2 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedTutorPurposes.includes(purpose.id)}
                              onChange={() => toggleTutorPurpose(purpose.id)}
                              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <span className="mr-2">{purpose.icon}</span>
                                <span className="font-medium text-sm text-gray-900">{purpose.name}</span>
                                {purpose.isCustom && (
                                  <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Custom</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{purpose.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Student Purposes */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Student Learning Purposes</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                        {studentPurposes.concat(customPurposes.student).map((purpose) => (
                          <label key={purpose.id} className="flex items-start p-2 border border-gray-100 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedStudentPurposes.includes(purpose.id)}
                              onChange={() => toggleStudentPurpose(purpose.id)}
                              className="mt-1 mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <span className="mr-2">{purpose.icon}</span>
                                <span className="font-medium text-sm text-gray-900">{purpose.name}</span>
                                {purpose.isCustom && (
                                  <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Custom</span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{purpose.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Add Custom Purpose */}
                    <div className="border-t border-gray-200 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowCustomPurposeDialog(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        + Add Custom Purpose
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Settings</h2>
                
                <div className="space-y-4">
                  {/* Model Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
                    <select
                      value={aiSettings.model}
                      onChange={(e) => handleAiSettingChange('model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="gpt-4o">GPT-4o (Balanced)</option>
                      <option value="o3-mini">O3-mini (Advanced Reasoning)</option>
                    </select>
                  </div>

                  {/* Model-specific parameters */}
                  {isO3Mini(aiSettings.model) ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reasoning Effort
                        </label>
                        <select
                          value={aiSettings.reasoning_effort}
                          onChange={(e) => handleAiSettingChange('reasoning_effort', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="low">Low (Faster, Less Reasoning)</option>
                          <option value="medium">Medium (Balanced)</option>
                          <option value="high">High (Slower, More Reasoning)</option>
                        </select>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">O3-mini Reasoning Model</h3>
                            <p className="text-sm text-blue-700 mt-1">
                              O3-mini is optimized for STEM reasoning tasks. It does not support temperature, top_p, frequency_penalty, or presence_penalty parameters.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temperature: {aiSettings.temperature}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={aiSettings.temperature}
                        onChange={(e) => handleAiSettingChange('temperature', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  )}

                  {/* Max Completion Tokens */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Tokens: {aiSettings.max_completion_tokens || aiSettings.max_tokens}
                    </label>
                    <input
                      type="range"
                      min="500"
                      max="4000"
                      step="100"
                      value={aiSettings.max_completion_tokens || aiSettings.max_tokens}
                      onChange={(e) => {
                        const paramName = isO3Mini(aiSettings.model) ? 'max_completion_tokens' : 'max_tokens';
                        handleAiSettingChange(paramName, parseInt(e.target.value));
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h2 className="text-xl font-semibold text-gray-900">Advanced Settings</h2>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showAdvanced && (
                  <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                    {/* Vocabulary Complexity */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vocabulary Complexity</label>
                      <select
                        value={config.vocabulary.complexity}
                        onChange={(e) => handleConfigChange('vocabulary.complexity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>

                    {/* Student Engagement */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Student Engagement</label>
                      <select
                        value={config.student_utterances.engagement}
                        onChange={(e) => handleConfigChange('student_utterances.engagement', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="moderate">Moderate</option>
                        <option value="high">High</option>
                        <option value="very_high">Very High</option>
                      </select>
                    </div>

                    {/* Question Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tutor Question Type</label>
                      <select
                        value={config.tutor_questions.type}
                        onChange={(e) => handleConfigChange('tutor_questions.type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="scaffolding">Scaffolding</option>
                        <option value="socratic">Socratic</option>
                        <option value="inquiry_based">Inquiry Based</option>
                        <option value="analytical">Analytical</option>
                        <option value="problem_solving">Problem Solving</option>
                        <option value="conversational">Conversational</option>
                        <option value="exploratory">Exploratory</option>
                      </select>
                    </div>

                    {/* Word Count Controls */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Word Count Controls</h3>
                      
                      {/* Enable Word Count Control */}
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="enforce_word_limits"
                          checked={config.word_count_controls?.enforce_limits !== false}
                          onChange={(e) => handleConfigChange('word_count_controls.enforce_limits', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="enforce_word_limits" className="ml-2 block text-sm text-gray-700">
                          Control utterance length (recommended for consistent conversations)
                        </label>
                      </div>
                    
                      {config.word_count_controls?.enforce_limits !== false && (
                        <div className="space-y-6 border border-gray-200 rounded-lg p-4">
                          
                          {/* Tutor Word Count Controls */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-3">Tutor Utterance Length</h4>
                            
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-blue-700 mb-1">Min Words</label>
                                <input
                                  type="number"
                                  min="5"
                                  max="100"
                                  value={config.word_count_controls?.tutor_utterances?.min_words || 15}
                                  onChange={(e) => handleConfigChange('word_count_controls.tutor_utterances.min_words', parseInt(e.target.value))}
                                  className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-blue-700 mb-1">Target Words</label>
                                <input
                                  type="number"
                                  min="10"
                                  max="150"
                                  value={config.word_count_controls?.tutor_utterances?.target_words || 30}
                                  onChange={(e) => handleConfigChange('word_count_controls.tutor_utterances.target_words', parseInt(e.target.value))}
                                  className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-blue-700 mb-1">Max Words</label>
                                <input
                                  type="number"
                                  min="20"
                                  max="200"
                                  value={config.word_count_controls?.tutor_utterances?.max_words || 50}
                                  onChange={(e) => handleConfigChange('word_count_controls.tutor_utterances.max_words', parseInt(e.target.value))}
                                  className="w-full px-2 py-1 text-sm border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                    
                          {/* Student Word Count Controls */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-900 mb-3">Student Utterance Length</h4>
                            
                            <div className="grid grid-cols-3 gap-4 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-green-700 mb-1">Min Words</label>
                                <input
                                  type="number"
                                  min="3"
                                  max="50"
                                  value={config.word_count_controls?.student_utterances?.min_words || 8}
                                  onChange={(e) => handleConfigChange('word_count_controls.student_utterances.min_words', parseInt(e.target.value))}
                                  className="w-full px-2 py-1 text-sm border border-green-300 rounded focus:ring-1 focus:ring-green-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-green-700 mb-1">Target Words</label>
                                <input
                                  type="number"
                                  min="5"
                                  max="75"
                                  value={config.word_count_controls?.student_utterances?.target_words || 15}
                                  onChange={(e) => handleConfigChange('word_count_controls.student_utterances.target_words', parseInt(e.target.value))}
                                  className="w-full px-2 py-1 text-sm border border-green-300 rounded focus:ring-1 focus:ring-green-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-green-700 mb-1">Max Words</label>
                                <input
                                  type="number"
                                  min="10"
                                  max="100"
                                  value={config.word_count_controls?.student_utterances?.max_words || 25}
                                  onChange={(e) => handleConfigChange('word_count_controls.student_utterances.max_words', parseInt(e.target.value))}
                                  className="w-full px-2 py-1 text-sm border border-green-300 rounded focus:ring-1 focus:ring-green-500"
                                />
                              </div>
                            </div>
                          </div>
                    
                          {/* Quick Presets */}
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-900 mb-3">Quick Presets</h4>
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  handleConfigChange('word_count_controls.tutor_utterances', { min_words: 10, target_words: 20, max_words: 30, style: 'concise' });
                                  handleConfigChange('word_count_controls.student_utterances', { min_words: 5, target_words: 10, max_words: 15, style: 'brief' });
                                }}
                                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                              >
                                Short & Sweet
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleConfigChange('word_count_controls.tutor_utterances', { min_words: 15, target_words: 30, max_words: 50, style: 'balanced' });
                                  handleConfigChange('word_count_controls.student_utterances', { min_words: 8, target_words: 15, max_words: 25, style: 'natural' });
                                }}
                                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                              >
                                Balanced
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  handleConfigChange('word_count_controls.tutor_utterances', { min_words: 25, target_words: 50, max_words: 80, style: 'detailed' });
                                  handleConfigChange('word_count_controls.student_utterances', { min_words: 12, target_words: 25, max_words: 40, style: 'elaborate' });
                                }}
                                className="px-3 py-2 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                              >
                                Detailed
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isGenerating || !apiKey.trim()}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 ${
                  isGenerating || !apiKey.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {!apiKey.trim() ? (
                  'Please provide API key first'
                ) : isGenerating ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating with {purposeMode} purposes... {progress}%</span>
                  </div>
                ) : (
                  `Generate with ${purposeMode === 'auto' ? 'Auto-Selected' : purposeMode === 'guided' ? 'Template' : 'Custom'} Purposes`
                )}
              </button>
            </form>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Generated Conversations</h2>
                {getConversationsArray().length > 0 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={downloadConversationsWithWordCount}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => copyToClipboardWithWordCount(getConversationsArray())}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <ErrorDisplayWithWordCount error={error} config={config} />
              )}

              {/* Progress Bar */}
              {isGenerating && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>
                      Generating conversation {currentConversation}
                      {config.word_count_controls?.enforce_limits && (
                        <span className="ml-2 text-blue-600">
                          (with word count limits)
                        </span>
                      )}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  
                  {config.word_count_controls?.enforce_limits && (
                    <div className="mt-2 text-xs text-gray-500">
                      Target: Tutor {config.word_count_controls.tutor_utterances?.target_words || 30} words, 
                      Student {config.word_count_controls.student_utterances?.target_words || 15} words per response
                    </div>
                  )}
                </div>
              )}

              {/* Conversations Display */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {getConversationsArray().length === 0 && !isGenerating && (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>No conversations generated yet.</p>
                    <p className="text-sm">Select a preset and configure purposes to start.</p>
                  </div>
                )}

                {getConversationsArray().map((conversationData, index) => {
                  const conversationContent = getConversationContent(conversationData);
                  const metadata = conversationData.metadata;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900">
                          Conversation {conversationData.id || index + 1}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>{metadata?.total_turns || conversationContent.length} turns</span>
                          {metadata?.word_count_enabled && (
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              Word Count Controlled
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Enhanced Metadata display with word count information */}
                      {metadata && (
                        <div className="mb-3 p-3 bg-gray-50 rounded text-xs">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <span><strong>Subject:</strong> {metadata.subject}</span>
                            <span><strong>Mode:</strong> {metadata.generation_mode}</span>
                            <span><strong>Model:</strong> {metadata.model}</span>
                            <span><strong>Generated:</strong> {new Date(metadata.generated_at).toLocaleDateString()}</span>
                          </div>
                          
                          {/* Purpose Control Information */}
                          {metadata.purpose_control_mode && (
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="grid grid-cols-1 gap-1">
                                <span><strong>Purpose Mode:</strong> {metadata.purpose_control_mode}</span>
                                {metadata.purpose_compliance !== undefined && (
                                  <span>
                                    <strong>Purpose Compliance:</strong> 
                                    <span className={`ml-1 ${metadata.purpose_compliance ? 'text-green-600' : 'text-red-600'}`}>
                                      {metadata.purpose_compliance ? '✅ Passed' : '❌ Issues Found'}
                                    </span>
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Word Count Information */}
                          {metadata.word_count_enabled && metadata.word_count_statistics && (
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="mb-2">
                                <strong>Word Count Analysis:</strong>
                                <span className={`ml-2 ${metadata.word_count_compliance ? 'text-green-600' : 'text-amber-600'}`}>
                                  {metadata.word_count_compliance ? '✅ All within limits' : '⚠️ Some violations'}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                {/* Tutor Word Count Stats */}
                                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                  <div className="font-medium text-blue-900 text-xs mb-1">Tutor Stats</div>
                                  <div className="space-y-1 text-xs">
                                    <div>Average: {metadata.word_count_statistics.tutor?.average || 'N/A'} words</div>
                                    <div>Responses: {metadata.word_count_statistics.tutor?.count || 0}</div>
                                    {metadata.word_count_statistics.tutor?.violations > 0 && (
                                      <div className="text-red-600">
                                        Violations: {metadata.word_count_statistics.tutor.violations}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Student Word Count Stats */}
                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                  <div className="font-medium text-green-900 text-xs mb-1">Student Stats</div>
                                  <div className="space-y-1 text-xs">
                                    <div>Average: {metadata.word_count_statistics.student?.average || 'N/A'} words</div>
                                    <div>Responses: {metadata.word_count_statistics.student?.count || 0}</div>
                                    {metadata.word_count_statistics.student?.violations > 0 && (
                                      <div className="text-red-600">
                                        Violations: {metadata.word_count_statistics.student.violations}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Word Count Settings Display */}
                              {metadata.word_count_settings && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <div className="text-xs text-gray-600">
                                    <strong>Target Settings:</strong>
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                      <div>
                                        Tutor: {metadata.word_count_settings.tutor_utterances?.min_words}-{metadata.word_count_settings.tutor_utterances?.max_words} 
                                        (target: {metadata.word_count_settings.tutor_utterances?.target_words})
                                      </div>
                                      <div>
                                        Student: {metadata.word_count_settings.student_utterances?.min_words}-{metadata.word_count_settings.student_utterances?.max_words} 
                                        (target: {metadata.word_count_settings.student_utterances?.target_words})
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Enhanced Coherence Metrics for Dual AI */}
                          {metadata.coherence_score && (
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="mb-2">
                                <strong>Conversation Quality Metrics:</strong>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                <div className="bg-purple-50 border border-purple-200 rounded p-2">
                                  <div className="font-medium text-purple-900 text-xs mb-1">Coherence</div>
                                  <div className="text-lg font-bold text-purple-600">
                                    {metadata.coherence_score}%
                                  </div>
                                  <div className="text-xs text-purple-600">
                                    {metadata.coherence_score >= 80 ? '🎉 Excellent' : 
                                     metadata.coherence_score >= 60 ? '✅ Good' : '⚠️ Needs Work'}
                                  </div>
                                </div>
                                
                                <div className="bg-indigo-50 border border-indigo-200 rounded p-2">
                                  <div className="font-medium text-indigo-900 text-xs mb-1">Question Response</div>
                                  <div className="text-lg font-bold text-indigo-600">
                                    {metadata.question_response_rate}%
                                  </div>
                                  <div className="text-xs text-indigo-600">
                                    {metadata.questions_answered_count || 0}/{metadata.questions_asked || 0} answered
                                  </div>
                                </div>
                              </div>
                              
                              {/* Purpose Fulfillment */}
                              {metadata.purpose_fulfillment && (
                                <div className="grid grid-cols-1 gap-2 mb-2">
                                  <div className="bg-amber-50 border border-amber-200 rounded p-2">
                                    <div className="font-medium text-amber-900 text-xs mb-1">Purpose Fulfillment</div>
                                    <div className="text-sm">
                                      <div className="flex justify-between">
                                        <span>Variety:</span>
                                        <span className="font-medium">{metadata.purpose_fulfillment.variety_score}%</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span>Balance:</span>
                                        <span className="font-medium">{metadata.purpose_fulfillment.balance_score}%</span>
                                      </div>
                                      <div className="flex justify-between border-t border-amber-200 pt-1 mt-1">
                                        <span className="font-medium">Overall:</span>
                                        <span className="font-bold text-amber-600">{metadata.purpose_fulfillment.overall_score}%</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Topic Progression */}
                              {metadata.topic_progression && metadata.topic_progression.length > 0 && (
                                <div className="bg-gray-50 border border-gray-200 rounded p-2">
                                  <div className="font-medium text-gray-900 text-xs mb-2">Topic Flow</div>
                                  <div className="text-xs text-gray-600">
                                    {metadata.topic_progression.map((transition, idx) => (
                                      <span key={idx}>
                                        {transition.topic}
                                        {idx < metadata.topic_progression.length - 1 && ' → '}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {metadata.topic_progression.length} topic transition{metadata.topic_progression.length !== 1 ? 's' : ''}
                                  </div>
                                </div>
                              )}
                              
                              {/* Generation Mode Badge */}
                              {metadata.generation_mode === 'coherent_dual_ai' && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    ✨ Enhanced Coherent AI
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {/* Existing metadata */}
                          {metadata.techniques_used && (
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <span><strong>Techniques:</strong> {metadata.techniques_used.join(', ')}</span>
                            </div>
                          )}
                          
                          {metadata.prompt_version && (
                            <div className="mt-1">
                              <span><strong>Engine:</strong> {metadata.prompt_version}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Enhanced conversation turns display with word count */}
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {conversationContent.length > 0 ? (
                          conversationContent.map((turn, turnIndex) => (
                            <div
                              key={turnIndex}
                              className={`p-3 rounded-lg ${
                                turn.role === 'tutor'
                                  ? 'bg-blue-50 border-l-4 border-blue-400'
                                  : 'bg-green-50 border-l-4 border-green-400'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-2">
                                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                    turn.role === 'tutor'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}>
                                    {turn.role === 'tutor' ? 'Tutor' : 'Student'}
                                  </span>
                                  
                                  {/* Word count display */}
                                  {turn.word_count && metadata?.word_count_enabled && (
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                      {turn.word_count} words
                                    </span>
                                  )}
                                  
                                  {/* Purpose display */}
                                  {turn.purpose && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {turn.purpose.replace(/_/g, ' ')}
                                    </span>
                                  )}
                                </div>
                                
                                {/* Word count compliance indicator */}
                                {turn.word_count && metadata?.word_count_enabled && metadata?.word_count_settings && (
                                  <WordCountComplianceIndicator 
                                    turn={turn} 
                                    settings={metadata.word_count_settings} 
                                    allowVariation={metadata.word_count_settings.allow_variation}
                                  />
                                )}
                              </div>
                              <p className="text-sm text-gray-700">{turn.content}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-4 text-gray-500 text-sm">
                            No conversation content available
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Conversation Summary */}
              {getConversationsArray().length > 0 && (
                <ConversationSummary conversations={getConversationsArray()} config={config} />
              )}
            </div>
          </div>
        </div>

        {/* Custom Purpose Dialog */}
        {showCustomPurposeDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Custom Purpose</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={newCustomPurpose.role}
                    onChange={(e) => setNewCustomPurpose(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="tutor">Tutor</option>
                    <option value="student">Student</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Purpose Name</label>
                  <input
                    type="text"
                    value={newCustomPurpose.name}
                    onChange={(e) => setNewCustomPurpose(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Creative Inspiration"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newCustomPurpose.description}
                    onChange={(e) => setNewCustomPurpose(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this purpose should achieve..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCustomPurposeDialog(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={addCustomPurpose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Purpose
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
