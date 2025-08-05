import React from 'react';

export default function ConversationViewer({ conversation }) {
  return (
    <div className="w-3/4 bg-white p-4 rounded h-96 overflow-auto">
      {conversation.map((turn, i) => (
        <div key={i} className="mb-2">
          <strong>{turn.role}:</strong> {turn.message}
        </div>
      ))}
    </div>
  );
}
