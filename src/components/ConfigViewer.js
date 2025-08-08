import React, { useState } from 'react';

export default function ConfigViewer({ config }) {
  const [expandedSections, setExpandedSections] = useState({
    structure: true,
    vocabulary: false,
    tutor: false,
    student: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    return typeof value === 'number' ? value.toFixed(2) : value;
  };

  if (!config) {
    return (
      <div className="bg-gray-50 p-4 rounded border text-center text-gray-500">
        No configuration loaded
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Configuration Overview</h3>
        <p className="text-sm text-gray-600 mt-1">
          Subject: <span className="font-medium capitalize">{config.subject || 'Not specified'}</span>
        </p>
      </div>

      {/* Conversation Structure */}
      <div className="border-b">
        <button
          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex justify-between items-center"
          onClick={() => toggleSection('structure')}
        >
          <span className="font-medium text-gray-700">📊 Conversation Structure</span>
          <span className="text-gray-400">
            {expandedSections.structure ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.structure && (
          <div className="px-4 pb-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Turn Statistics</h4>
                <div className="space-y-1">
                  <div>Average: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{formatNumber(config.conversation_structure?.turns?.mean || 0)} turns</span></div>
                  <div>Standard Dev: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{formatNumber(config.conversation_structure?.turns?.std || 0)}</span></div>
                  <div>Range: <span className="font-mono bg-blue-100 px-2 py-1 rounded">{config.conversation_structure?.turns?.min || 0} - {config.conversation_structure?.turns?.max || 0}</span></div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Interaction Ratio</h4>
                <div>
                  Tutor:Student = <span className="font-mono bg-green-100 px-2 py-1 rounded">{formatNumber(config.conversation_structure?.tutor_student_ratio || 1)}:1</span>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {config.conversation_structure?.tutor_student_ratio > 1 
                    ? "Tutor talks more" 
                    : config.conversation_structure?.tutor_student_ratio < 1 
                    ? "Student talks more" 
                    : "Equal participation"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vocabulary */}
      <div className="border-b">
        <button
          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex justify-between items-center"
          onClick={() => toggleSection('vocabulary')}
        >
          <span className="font-medium text-gray-700">📚 Vocabulary & Terms</span>
          <span className="text-gray-400">
            {expandedSections.vocabulary ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.vocabulary && (
          <div className="px-4 pb-4 bg-gray-50">
            <div className="text-sm">
              <h4 className="font-medium mb-2 text-gray-700">
                Term Frequencies ({Object.keys(config.vocabulary?.term_frequencies || {}).length} terms)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                {Object.entries(config.vocabulary?.term_frequencies || {})
                  .sort(([,a], [,b]) => b - a)
                  .map(([term, frequency]) => (
                    <div key={term} className="flex justify-between items-center bg-white px-2 py-1 rounded border">
                      <span className="capitalize font-medium">{term.replace('_', ' ')}</span>
                      <span className="font-mono text-xs bg-purple-100 px-1 rounded">
                        {formatPercentage(frequency)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tutor Questions */}
      <div className="border-b">
        <button
          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex justify-between items-center"
          onClick={() => toggleSection('tutor')}
        >
          <span className="font-medium text-gray-700">🧑‍🏫 Tutor Question Patterns</span>
          <span className="text-gray-400">
            {expandedSections.tutor ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.tutor && (
          <div className="px-4 pb-4 bg-gray-50">
            <div className="text-sm">
              <h4 className="font-medium mb-2 text-gray-700">Question Purpose Distribution</h4>
              <div className="space-y-2">
                {Object.entries(config.tutor_questions?.purpose_distribution || {}).map(([purpose, percentage]) => (
                  <div key={purpose} className="flex items-center">
                    <div className="w-24 capitalize font-medium">{purpose}:</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 mr-2">
                      <div 
                        className="bg-orange-400 h-4 rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${percentage * 100}%` }}
                      >
                        <span className="text-xs text-white font-medium">
                          {formatPercentage(percentage)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Student Responses */}
      <div>
        <button
          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex justify-between items-center"
          onClick={() => toggleSection('student')}
        >
          <span className="font-medium text-gray-700">🎓 Student Response Patterns</span>
          <span className="text-gray-400">
            {expandedSections.student ? '▼' : '▶'}
          </span>
        </button>
        
        {expandedSections.student && (
          <div className="px-4 pb-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Confusion Levels</h4>
                <div className="space-y-1">
                  <div>Average: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{formatNumber(config.student_utterances?.confusion_scores?.mean || 0)}/5</span></div>
                  <div>Standard Dev: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{formatNumber(config.student_utterances?.confusion_scores?.std || 0)}</span></div>
                  <div>Range: <span className="font-mono bg-yellow-100 px-2 py-1 rounded">{config.student_utterances?.confusion_scores?.min || 0} - {config.student_utterances?.confusion_scores?.max || 0}</span></div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Response Correctness</h4>
                <div className="space-y-1">
                  {Object.entries(config.student_utterances?.correctness_distribution || {}).map(([type, count]) => {
                    const total = Object.values(config.student_utterances?.correctness_distribution || {}).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={type} className="flex justify-between items-center">
                        <span className="capitalize">{type.replace('_', ' ')}</span>
                        <span className="font-mono bg-indigo-100 px-2 py-1 rounded">
                          {count} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}