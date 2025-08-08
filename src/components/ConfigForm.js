import React, { useState } from 'react';
import ConfigViewer from './ConfigViewer';

export default function ConfigForm({ initialConfig, onSubmit, onDownloadConfig, loading }) {
  const defaultConfig = {
    conversation_structure: { 
      turns: { mean: 12.5, std: 5.9, min: 4, max: 55 }, 
      tutor_student_ratio: 1.18 
    },
    subject: "mathematics", // New field
    numberOfConversations: 3, // Default to 3 conversations
    vocabulary: { 
      term_frequencies: {
        "concept": 0.15,
        "example": 0.12,
        "problem": 0.10,
        "solution": 0.08,
        "method": 0.07,
        "practice": 0.09,
        "understand": 0.06,
        "explain": 0.05,
        "step": 0.04,
        "process": 0.03
      }
    },
    tutor_questions: { 
      purpose_distribution: {
        "assessment": 0.3,
        "guidance": 0.4,
        "clarification": 0.2,
        "encouragement": 0.1
      }
    },
    student_utterances: { 
      confusion_scores: { mean: 3.42, std: 1.19, min: 1, max: 5 }, 
      correctness_distribution: {
        correct_independent: 1696,
        correct_assisted: 303,
        incorrect: 254
      }
    }
  };

  const [cfg, setCfg] = useState(initialConfig || defaultConfig);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorParams, setGeneratorParams] = useState({
    subject: 'mathematics',
    difficulty: 'medium',
    topic: 'algebra',
    studentLevel: 'high_school',
    conversationStyle: 'supportive'
  });

  // Subject-specific vocabularies
  const subjectVocabularies = {
    mathematics: {
      algebra: {
        "variable": 0.15, "equation": 0.14, "coefficient": 0.12, "polynomial": 0.10,
        "linear": 0.08, "quadratic": 0.08, "factor": 0.07, "solve": 0.06,
        "expression": 0.05, "term": 0.05, "constant": 0.04, "simplify": 0.03
      },
      calculus: {
        "derivative": 0.18, "integral": 0.15, "limit": 0.12, "function": 0.10,
        "continuous": 0.08, "differential": 0.07, "optimization": 0.06,
        "chain_rule": 0.05, "fundamental_theorem": 0.04, "convergence": 0.04
      },
      geometry: {
        "triangle": 0.15, "angle": 0.12, "circle": 0.10, "polygon": 0.08,
        "perimeter": 0.08, "area": 0.08, "volume": 0.07, "theorem": 0.06,
        "congruent": 0.05, "similar": 0.05, "parallel": 0.04, "proof": 0.04
      }
    },
    science: {
      physics: {
        "force": 0.15, "energy": 0.12, "motion": 0.10, "velocity": 0.08,
        "acceleration": 0.08, "mass": 0.07, "gravity": 0.06, "momentum": 0.05,
        "wave": 0.05, "frequency": 0.04, "amplitude": 0.04, "experiment": 0.06
      },
      chemistry: {
        "atom": 0.15, "molecule": 0.12, "element": 0.10, "compound": 0.08,
        "reaction": 0.08, "bond": 0.07, "electron": 0.06, "proton": 0.05,
        "periodic_table": 0.05, "acid": 0.04, "base": 0.04, "solution": 0.06
      },
      biology: {
        "cell": 0.15, "organism": 0.12, "evolution": 0.10, "gene": 0.08,
        "DNA": 0.08, "protein": 0.07, "ecosystem": 0.06, "species": 0.05,
        "adaptation": 0.05, "photosynthesis": 0.04, "respiration": 0.04, "membrane": 0.06
      }
    },
    language: {
      grammar: {
        "sentence": 0.15, "verb": 0.12, "noun": 0.10, "adjective": 0.08,
        "subject": 0.08, "predicate": 0.07, "clause": 0.06, "phrase": 0.05,
        "tense": 0.05, "pronoun": 0.04, "adverb": 0.04, "punctuation": 0.06
      },
      literature: {
        "character": 0.15, "theme": 0.12, "plot": 0.10, "setting": 0.08,
        "metaphor": 0.08, "symbolism": 0.07, "narrator": 0.06, "conflict": 0.05,
        "dialogue": 0.05, "imagery": 0.04, "tone": 0.04, "analysis": 0.06
      },
      writing: {
        "paragraph": 0.15, "thesis": 0.12, "argument": 0.10, "evidence": 0.08,
        "structure": 0.08, "introduction": 0.07, "conclusion": 0.06, "transition": 0.05,
        "revision": 0.05, "draft": 0.04, "brainstorm": 0.04, "outline": 0.06
      }
    },
    history: {
      ancient: {
        "civilization": 0.15, "empire": 0.12, "culture": 0.10, "society": 0.08,
        "trade": 0.08, "government": 0.07, "religion": 0.06, "artifact": 0.05,
        "timeline": 0.05, "dynasty": 0.04, "conquest": 0.04, "legacy": 0.06
      },
      modern: {
        "revolution": 0.15, "democracy": 0.12, "industrialization": 0.10, "war": 0.08,
        "treaty": 0.08, "nationalism": 0.07, "colonialism": 0.06, "reform": 0.05,
        "movement": 0.05, "ideology": 0.04, "propaganda": 0.04, "diplomacy": 0.06
      }
    }
  };

  // Get available topics for selected subject
  const getTopicsForSubject = (subject) => {
    return Object.keys(subjectVocabularies[subject] || {});
  };

  const generateCustomConfig = () => {
    const { subject, difficulty, topic, studentLevel, conversationStyle } = generatorParams;
    
    // Base configuration
    let newConfig = { ...defaultConfig };
    newConfig.subject = subject;
    newConfig.numberOfConversations = cfg.numberOfConversations || 3;
    
    // Adjust conversation structure based on difficulty
    if (difficulty === 'easy') {
      newConfig.conversation_structure.turns = { mean: 8.0, std: 3.0, min: 4, max: 20 };
      newConfig.conversation_structure.tutor_student_ratio = 1.8;
    } else if (difficulty === 'hard') {
      newConfig.conversation_structure.turns = { mean: 20.0, std: 8.0, min: 10, max: 80 };
      newConfig.conversation_structure.tutor_student_ratio = 0.8;
    }
    
    // Set vocabulary based on subject and topic
    if (subjectVocabularies[subject] && subjectVocabularies[subject][topic]) {
      newConfig.vocabulary.term_frequencies = subjectVocabularies[subject][topic];
    } else {
      // Fallback to generic terms
      newConfig.vocabulary.term_frequencies = {
        "concept": 0.20, "example": 0.15, "principle": 0.12, "theory": 0.10,
        "practice": 0.08, "method": 0.07, "process": 0.06, "application": 0.05,
        "understanding": 0.05, "analysis": 0.04, "evaluation": 0.04, "synthesis": 0.04
      };
    }
    
    // Adjust student performance based on level
    if (studentLevel === 'elementary') {
      newConfig.student_utterances.confusion_scores = { mean: 2.5, std: 1.0, min: 1, max: 4 };
      newConfig.student_utterances.correctness_distribution = {
        correct_independent: 1500, correct_assisted: 400, incorrect: 100
      };
    } else if (studentLevel === 'college') {
      newConfig.student_utterances.confusion_scores = { mean: 4.0, std: 1.3, min: 2, max: 5 };
      newConfig.student_utterances.correctness_distribution = {
        correct_independent: 900, correct_assisted: 300, incorrect: 800
      };
    }
    
    // Adjust tutor questions based on conversation style
    if (conversationStyle === 'challenging') {
      newConfig.tutor_questions.purpose_distribution = {
        "assessment": 0.5, "guidance": 0.3, "clarification": 0.15, "encouragement": 0.05
      };
    } else if (conversationStyle === 'encouraging') {
      newConfig.tutor_questions.purpose_distribution = {
        "encouragement": 0.4, "guidance": 0.4, "assessment": 0.15, "clarification": 0.05
      };
    }
    
    setCfg(newConfig);
    setShowGenerator(false);
  };

  const presetConfigs = {
    math_elementary: {
      subject: "mathematics",
      numberOfConversations: 3,
      conversation_structure: { turns: { mean: 8.0, std: 3.0, min: 4, max: 20 }, tutor_student_ratio: 1.5 },
      vocabulary: { term_frequencies: subjectVocabularies.mathematics.algebra },
      tutor_questions: { purpose_distribution: { "guidance": 0.5, "encouragement": 0.2, "assessment": 0.2, "clarification": 0.1 }},
      student_utterances: { confusion_scores: { mean: 2.5, std: 1.0, min: 1, max: 5 }, correctness_distribution: { correct_independent: 1200, correct_assisted: 600, incorrect: 200 }}
    },
    science_physics: {
      subject: "science",
      numberOfConversations: 3,
      conversation_structure: { turns: { mean: 15.0, std: 6.0, min: 6, max: 40 }, tutor_student_ratio: 1.2 },
      vocabulary: { term_frequencies: subjectVocabularies.science.physics },
      tutor_questions: { purpose_distribution: { "assessment": 0.3, "guidance": 0.4, "clarification": 0.2, "encouragement": 0.1 }},
      student_utterances: { confusion_scores: { mean: 3.8, std: 1.2, min: 1, max: 5 }, correctness_distribution: { correct_independent: 1000, correct_assisted: 500, incorrect: 500 }}
    },
    language_grammar: {
      subject: "language",
      numberOfConversations: 3,
      conversation_structure: { turns: { mean: 10.0, std: 4.0, min: 5, max: 25 }, tutor_student_ratio: 1.4 },
      vocabulary: { term_frequencies: subjectVocabularies.language.grammar },
      tutor_questions: { purpose_distribution: { "guidance": 0.45, "assessment": 0.25, "clarification": 0.2, "encouragement": 0.1 }},
      student_utterances: { confusion_scores: { mean: 3.2, std: 1.1, min: 1, max: 5 }, correctness_distribution: { correct_independent: 1300, correct_assisted: 400, incorrect: 300 }}
    },
    history_ancient: {
      subject: "history",
      numberOfConversations: 3,
      conversation_structure: { turns: { mean: 14.0, std: 5.0, min: 6, max: 35 }, tutor_student_ratio: 1.1 },
      vocabulary: { term_frequencies: subjectVocabularies.history.ancient },
      tutor_questions: { purpose_distribution: { "assessment": 0.35, "guidance": 0.35, "clarification": 0.2, "encouragement": 0.1 }},
      student_utterances: { confusion_scores: { mean: 3.5, std: 1.3, min: 1, max: 5 }, correctness_distribution: { correct_independent: 1100, correct_assisted: 400, incorrect: 500 }}
    }
  };

  const loadPreset = (presetName) => {
    setCfg(presetConfigs[presetName]);
  };

  // ... rest of component with updated presets

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-4">Multi-Subject Configuration Manager</h2>
      
      {/* Subject Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Subject Area</label>
        <select
          className="w-full p-2 border rounded"
          value={generatorParams.subject}
          onChange={(e) => setGeneratorParams(prev => ({
            ...prev, 
            subject: e.target.value,
            topic: getTopicsForSubject(e.target.value)[0] || ''
          }))}
        >
          <option value="mathematics">Mathematics</option>
          <option value="science">Science</option>
          <option value="language">Language Arts</option>
          <option value="history">History</option>
          <option value="custom">Custom Subject</option>
        </select>
      </div>

      {/* Number of Conversations */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Number of Conversations to Generate</label>
        <input
          type="number"
          min="1"
          max="10"
          className="w-full p-2 border rounded"
          value={cfg.numberOfConversations || 3}
          onChange={(e) => setCfg(prev => ({
            ...prev,
            numberOfConversations: parseInt(e.target.value) || 3
          }))}
        />
        <p className="text-xs text-gray-600 mt-1">
          Recommended: 1-5 conversations (more conversations take longer to generate)
        </p>
      </div>

      {/* Subject-Specific Presets */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Subject Presets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            className="px-3 py-2 bg-blue-600 text-black rounded text-sm hover:bg-blue-700"
            onClick={() => loadPreset('math_elementary')}
            disabled={loading}
          >
            Elementary Math
          </button>
          <button
            className="px-3 py-2 bg-green-600 text-black rounded text-sm hover:bg-green-700"
            onClick={() => loadPreset('science_physics')}
            disabled={loading}
          >
            Physics
          </button>
          <button
            className="px-3 py-2 bg-purple-600 text-black rounded text-sm hover:bg-purple-700"
            onClick={() => loadPreset('language_grammar')}
            disabled={loading}
          >
            Grammar/Writing
          </button>
          <button
            className="px-3 py-2 bg-red-600 text-black rounded text-sm hover:bg-red-700"
            onClick={() => loadPreset('history_ancient')}
            disabled={loading}
          >
            Ancient History
          </button>
        </div>
      </div>

      {/* Custom Configuration Generator */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-indigo-500 text-black rounded"
          onClick={() => setShowGenerator(!showGenerator)}
          disabled={loading}
        >
          {showGenerator ? 'Hide' : 'Show'} Custom Configuration Generator
        </button>
      </div>

      {showGenerator && (
        <div className="mb-4 p-4 bg-gray-50 rounded border">
          <h3 className="text-lg font-medium mb-3">Generate Custom Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <select
                className="w-full p-2 border rounded"
                value={generatorParams.subject}
                onChange={(e) => setGeneratorParams(prev => ({
                  ...prev, 
                  subject: e.target.value,
                  topic: getTopicsForSubject(e.target.value)[0] || ''
                }))}
              >
                <option value="mathematics">Mathematics</option>
                <option value="science">Science</option>
                <option value="language">Language Arts</option>
                <option value="history">History</option>
                <option value="custom">Custom Subject</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Topic</label>
              <select
                className="w-full p-2 border rounded"
                value={generatorParams.topic}
                onChange={(e) => setGeneratorParams(prev => ({...prev, topic: e.target.value}))}
              >
                {getTopicsForSubject(generatorParams.subject).map(topic => (
                  <option key={topic} value={topic}>
                    {topic.charAt(0).toUpperCase() + topic.slice(1).replace('_', ' ')}
                  </option>
                ))}
                {generatorParams.subject === 'custom' && (
                  <option value="general">General Topic</option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Difficulty Level</label>
              <select
                className="w-full p-2 border rounded"
                value={generatorParams.difficulty}
                onChange={(e) => setGeneratorParams(prev => ({...prev, difficulty: e.target.value}))}
              >
                <option value="easy">Easy - Simple concepts, more guidance</option>
                <option value="medium">Medium - Balanced challenge</option>
                <option value="hard">Hard - Complex problems, less guidance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Student Level</label>
              <select
                className="w-full p-2 border rounded"
                value={generatorParams.studentLevel}
                onChange={(e) => setGeneratorParams(prev => ({...prev, studentLevel: e.target.value}))}
              >
                <option value="elementary">Elementary - Basic concepts</option>
                <option value="middle_school">Middle School - Intermediate</option>
                <option value="high_school">High School - Standard curriculum</option>
                <option value="college">College - Advanced topics</option>
                <option value="graduate">Graduate - Expert level</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Conversation Style</label>
              <select
                className="w-full p-2 border rounded"
                value={generatorParams.conversationStyle}
                onChange={(e) => setGeneratorParams(prev => ({...prev, conversationStyle: e.target.value}))}
              >
                <option value="supportive">Supportive - Encouraging, patient</option>
                <option value="challenging">Challenging - More assessment, rigorous</option>
                <option value="encouraging">Very Encouraging - Lots of praise</option>
                <option value="socratic">Socratic - Question-based learning</option>
                <option value="collaborative">Collaborative - Working together</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              className="px-4 py-2 bg-purple-600 text-black rounded"
              onClick={generateCustomConfig}
              disabled={loading}
            >
              Generate {generatorParams.subject.charAt(0).toUpperCase() + generatorParams.subject.slice(1)} Configuration
            </button>
          </div>
        </div>
      )}

      {/* File Management */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Upload Existing Configuration</label>
        <input 
          type="file" 
          accept=".json" 
          onChange={handleUpload} 
          disabled={loading}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Configuration Preview */}
      <div className="mb-4">
        <ConfigViewer config={cfg} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 text-black rounded ${loading ? 'bg-gray-400' : 'bg-green-600'}`}
          onClick={() => onSubmit(cfg)}
          disabled={loading}
        >
          {loading ? 'Generating Conversations...' : 'Generate Conversations'}
        </button>
        
        <button
          className="px-4 py-2 bg-blue-600 text-black rounded"
          onClick={() => downloadJSON(cfg, 'config.json')}
          disabled={loading}
        >
          Download Configuration
        </button>
        
        <button
          className="px-4 py-2 bg-gray-600 text-black rounded"
          onClick={() => downloadJSON(cfg, `${cfg.subject || 'math'}-config-${Date.now()}.json`)}
          disabled={loading}
        >
          Save as New Configuration
        </button>
      </div>

      {/* Raw JSON Editor */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-800">
          Advanced: Edit Raw JSON Configuration
        </summary>
        <div className="mt-2">
          <textarea
            className="w-full h-40 p-2 border rounded text-xs font-mono"
            value={JSON.stringify(cfg, null, 2)}
            onChange={(e) => {
              try {
                const newConfig = JSON.parse(e.target.value);
                setCfg(newConfig);
              } catch (error) {
                console.log('Invalid JSON during editing');
              }
            }}
            disabled={loading}
          />
        </div>
      </details>
    </div>
  );

  // Helper functions
  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const uploadedConfig = JSON.parse(reader.result);
        setCfg(uploadedConfig);
      } catch (error) {
        console.error('Invalid JSON file:', error);
        alert('Invalid JSON file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }

  function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  }
}
