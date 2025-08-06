import React, { useState } from 'react';

export default function ConfigForm({ initialConfig, onSubmit, onDownloadConfig, loading }) {
  const defaultConfig = {
    conversation_structure: { 
      turns: { mean: 12.5, std: 5.9, min: 4, max: 55 }, 
      tutor_student_ratio: 1.18 
    },
    vocabulary: { 
      math_term_frequencies: {
        "algebra": 0.15,
        "equation": 0.12,
        "variable": 0.10,
        "coefficient": 0.08,
        "polynomial": 0.07,
        "function": 0.09,
        "derivative": 0.06,
        "integral": 0.05,
        "matrix": 0.04,
        "logarithm": 0.03,
        "trigonometry": 0.04,
        "calculus": 0.05,
        "geometry": 0.06,
        "statistics": 0.04,
        "probability": 0.02
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
    difficulty: 'medium',
    mathTopic: 'algebra',
    studentLevel: 'high_school',
    conversationStyle: 'supportive',
    vocabularyComplexity: 'moderate'
  });

  const presetConfigs = {
    elementary: {
      conversation_structure: { 
        turns: { mean: 8.0, std: 3.0, min: 4, max: 20 }, 
        tutor_student_ratio: 1.5 
      },
      vocabulary: { 
        math_term_frequencies: {
          "addition": 0.20,
          "subtraction": 0.18,
          "multiplication": 0.15,
          "division": 0.12,
          "number": 0.10,
          "counting": 0.08,
          "fraction": 0.07,
          "decimal": 0.05,
          "shape": 0.03,
          "measurement": 0.02
        }
      },
      tutor_questions: { 
        purpose_distribution: {
          "assessment": 0.2,
          "guidance": 0.5,
          "encouragement": 0.2,
          "clarification": 0.1
        }
      },
      student_utterances: { 
        confusion_scores: { mean: 2.5, std: 1.0, min: 1, max: 5 }, 
        correctness_distribution: {
          correct_independent: 1200,
          correct_assisted: 600,
          incorrect: 200
        }
      }
    },
    
    advanced: {
      conversation_structure: { 
        turns: { mean: 18.0, std: 8.0, min: 8, max: 80 }, 
        tutor_student_ratio: 0.9 
      },
      vocabulary: { 
        math_term_frequencies: {
          "differential": 0.12,
          "integral": 0.11,
          "derivative": 0.10,
          "theorem": 0.09,
          "proof": 0.08,
          "manifold": 0.07,
          "topology": 0.06,
          "eigenvalue": 0.05,
          "matrix": 0.08,
          "vector": 0.07,
          "transformation": 0.06,
          "optimization": 0.05,
          "convergence": 0.04,
          "asymptotic": 0.02
        }
      },
      tutor_questions: { 
        purpose_distribution: {
          "assessment": 0.4,
          "guidance": 0.3,
          "clarification": 0.25,
          "encouragement": 0.05
        }
      },
      student_utterances: { 
        confusion_scores: { mean: 4.2, std: 1.5, min: 2, max: 5 }, 
        correctness_distribution: {
          correct_independent: 800,
          correct_assisted: 400,
          incorrect: 800
        }
      }
    },

    struggling: {
      conversation_structure: { 
        turns: { mean: 15.0, std: 6.0, min: 6, max: 40 }, 
        tutor_student_ratio: 2.0 
      },
      vocabulary: { 
        math_term_frequencies: {
          "basic": 0.15,
          "simple": 0.12,
          "number": 0.12,
          "addition": 0.10,
          "equation": 0.08,
          "step": 0.08,
          "example": 0.07,
          "practice": 0.06,
          "help": 0.05,
          "understand": 0.05,
          "explain": 0.04,
          "show": 0.04,
          "try": 0.04
        }
      },
      tutor_questions: { 
        purpose_distribution: {
          "guidance": 0.5,
          "encouragement": 0.3,
          "clarification": 0.15,
          "assessment": 0.05
        }
      },
      student_utterances: { 
        confusion_scores: { mean: 4.5, std: 0.8, min: 3, max: 5 }, 
        correctness_distribution: {
          correct_independent: 300,
          correct_assisted: 700,
          incorrect: 1000
        }
      }
    }
  };

  const generateCustomConfig = () => {
    const { difficulty, mathTopic, studentLevel, conversationStyle, vocabularyComplexity } = generatorParams;
    
    // Base configuration
    let newConfig = { ...defaultConfig };
    
    // Adjust conversation structure based on difficulty
    if (difficulty === 'easy') {
      newConfig.conversation_structure.turns = { mean: 8.0, std: 3.0, min: 4, max: 20 };
      newConfig.conversation_structure.tutor_student_ratio = 1.8;
    } else if (difficulty === 'hard') {
      newConfig.conversation_structure.turns = { mean: 20.0, std: 8.0, min: 10, max: 80 };
      newConfig.conversation_structure.tutor_student_ratio = 0.8;
    }
    
    // Adjust vocabulary based on math topic
    const topicVocabulary = {
      algebra: {
        "variable": 0.15, "equation": 0.14, "coefficient": 0.12, "polynomial": 0.10,
        "linear": 0.08, "quadratic": 0.08, "factor": 0.07, "solve": 0.06,
        "expression": 0.05, "term": 0.05, "constant": 0.04, "simplify": 0.03,
        "substitute": 0.03
      },
      calculus: {
        "derivative": 0.18, "integral": 0.15, "limit": 0.12, "function": 0.10,
        "continuous": 0.08, "differential": 0.07, "optimization": 0.06,
        "chain_rule": 0.05, "fundamental_theorem": 0.04, "convergence": 0.04,
        "taylor_series": 0.03, "critical_point": 0.03, "concavity": 0.03,
        "inflection": 0.02
      },
      geometry: {
        "triangle": 0.15, "angle": 0.12, "circle": 0.10, "polygon": 0.08,
        "perimeter": 0.08, "area": 0.08, "volume": 0.07, "theorem": 0.06,
        "congruent": 0.05, "similar": 0.05, "parallel": 0.04, "perpendicular": 0.04,
        "coordinate": 0.04, "proof": 0.04
      },
      statistics: {
        "mean": 0.15, "median": 0.12, "mode": 0.10, "standard_deviation": 0.08,
        "probability": 0.08, "distribution": 0.07, "sample": 0.06, "population": 0.06,
        "correlation": 0.05, "regression": 0.05, "hypothesis": 0.04, "confidence": 0.04,
        "variance": 0.04, "outlier": 0.03, "normal": 0.03
      }
    };
    
    if (topicVocabulary[mathTopic]) {
      newConfig.vocabulary.math_term_frequencies = topicVocabulary[mathTopic];
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

  const loadPreset = (presetName) => {
    setCfg(presetConfigs[presetName]);
  };

  const handleUpload = (e) => {
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
  };

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const resetToDefault = () => {
    setCfg(defaultConfig);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-4">Configuration Manager</h2>
      
      {/* Preset Configurations */}
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Quick Start Presets</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            onClick={() => loadPreset('elementary')}
            disabled={loading}
          >
            Elementary Level
          </button>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            onClick={resetToDefault}
            disabled={loading}
          >
            Default (High School)
          </button>
          <button
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
            onClick={() => loadPreset('advanced')}
            disabled={loading}
          >
            Advanced/College
          </button>
          <button
            className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
            onClick={() => loadPreset('struggling')}
            disabled={loading}
          >
            Struggling Students
          </button>
        </div>
      </div>

      {/* Custom Configuration Generator */}
      <div className="mb-4">
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded"
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
              <label className="block text-sm font-medium mb-1">Math Topic Focus</label>
              <select
                className="w-full p-2 border rounded"
                value={generatorParams.mathTopic}
                onChange={(e) => setGeneratorParams(prev => ({...prev, mathTopic: e.target.value}))}
              >
                <option value="algebra">Algebra - Variables, equations</option>
                <option value="calculus">Calculus - Derivatives, integrals</option>
                <option value="geometry">Geometry - Shapes, proofs</option>
                <option value="statistics">Statistics - Data analysis</option>
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
                <option value="high_school">High School - Standard curriculum</option>
                <option value="college">College - Advanced topics</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Conversation Style</label>
              <select
                className="w-full p-2 border rounded"
                value={generatorParams.conversationStyle}
                onChange={(e) => setGeneratorParams(prev => ({...prev, conversationStyle: e.target.value}))}
              >
                <option value="supportive">Supportive - Encouraging, patient</option>
                <option value="challenging">Challenging - More assessment</option>
                <option value="encouraging">Very Encouraging - Lots of praise</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button
              className="px-4 py-2 bg-purple-600 text-white rounded"
              onClick={generateCustomConfig}
              disabled={loading}
            >
              Generate Custom Configuration
            </button>
          </div>
        </div>
      )}

      {/* File Upload */}
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
        <h3 className="text-lg font-medium mb-2">Current Configuration Preview</h3>
        <div className="bg-gray-100 p-3 rounded text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Conversation Length:</strong>
              <br />Mean: {cfg.conversation_structure.turns.mean} turns
              <br />Range: {cfg.conversation_structure.turns.min}-{cfg.conversation_structure.turns.max}
            </div>
            <div>
              <strong>Student Confusion:</strong>
              <br />Average: {cfg.student_utterances.confusion_scores.mean}/5
              <br />Range: {cfg.student_utterances.confusion_scores.min}-{cfg.student_utterances.confusion_scores.max}
            </div>
            <div>
              <strong>Vocabulary Terms:</strong>
              <br />{Object.keys(cfg.vocabulary.math_term_frequencies).length} terms
              <br />Top: {Object.keys(cfg.vocabulary.math_term_frequencies).slice(0, 3).join(', ') || 'None specified'}
            </div>
            <div>
              <strong>Tutor Style:</strong>
              <br />Guidance: {((cfg.tutor_questions.purpose_distribution.guidance || 0) * 100).toFixed(0)}%
              <br />Assessment: {((cfg.tutor_questions.purpose_distribution.assessment || 0) * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-green-600'}`}
          onClick={() => onSubmit(cfg)}
          disabled={loading}
        >
          {loading ? 'Generating Conversations...' : 'Generate Conversations'}
        </button>
        
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => downloadJSON(cfg, 'config.json')}
          disabled={loading}
        >
          Download Configuration
        </button>
        
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded"
          onClick={() => downloadJSON(cfg, `config-${Date.now()}.json`)}
          disabled={loading}
        >
          Save as New Configuration
        </button>
        
        <button
          className="px-4 py-2 bg-yellow-600 text-white rounded"
          onClick={resetToDefault}
          disabled={loading}
        >
          Reset to Default
        </button>
      </div>

      {/* Configuration Editor (Advanced) */}
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
                // Invalid JSON, don't update
                console.log('Invalid JSON during editing');
              }
            }}
            disabled={loading}
          />
          <p className="text-xs text-gray-600 mt-1">
            Edit the JSON directly. Invalid JSON will be ignored.
          </p>
        </div>
      </details>
    </div>
  );
}
