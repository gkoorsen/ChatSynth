import React from 'react';

export default function ConversationViewer({ conversation, conversationIndex, totalConversations }) {
  if (!conversation || conversation.length === 0) {
    return (
      <div className="w-3-4 bg-white p-4 rounded h-96 overflow-auto flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">💬</div>
          <div>No conversation selected</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-3-4 bg-white p-4 rounded h-96 overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h3 className="text-lg font-medium">
          Conversation {conversationIndex + 1} of {totalConversations}
        </h3>
        <div className="text-sm text-gray-500">
          {conversation.length} turns
        </div>
      </div>

      {/* Conversation */}
      <div className="space-y-3">
        {conversation.map((turn, i) => (
          <div 
            key={i} 
            className={`p-3 rounded-lg ${
              turn.role === 'tutor' 
                ? 'bg-blue-50 border-l-4 border-blue-500 ml-0 mr-8' 
                : 'bg-green-50 border-l-4 border-green-500 ml-8 mr-0'
            }`}
          >
            <div className="flex items-center mb-1">
              <span className={`text-sm font-semibold ${
                turn.role === 'tutor' ? 'text-blue-700' : 'text-green-700'
              }`}>
                {turn.role === 'tutor' ? '👨‍🏫 Tutor' : '👨‍🎓 Student'}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                Turn {i + 1}
              </span>
            </div>
            <div className="text-gray-800 leading-relaxed">
              {turn.message}
            </div>
          </div>
        ))}
      </div>

      {/* Conversation Stats */}
      <div className="mt-4 pt-3 border-t text-xs text-gray-500">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Tutor turns:</strong> {conversation.filter(t => t.role === 'tutor').length}
          </div>
          <div>
            <strong>Student turns:</strong> {conversation.filter(t => t.role === 'student').length}
          </div>
        </div>
      </div>
    </div>
  );
}