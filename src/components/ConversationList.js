import React from 'react';

export default function ConversationList({ conversations, selectedIndex, onSelect }) {
  return (
    <ul className="w-1/4 bg-gray-100 p-2 rounded h-96 overflow-auto">
      {conversations.map((c, idx) => (
        <li
          key={idx}
          className={`p-2 cursor-pointer ${idx===selectedIndex?'bg-blue-200':''}`}
          onClick={() => onSelect(idx)}
        >Conversation {idx+1}</li>
      ))}
    </ul>
  );
}
