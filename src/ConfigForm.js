import React, { useState } from 'react';

export default function ConfigForm({ initialConfig, onSubmit, onDownloadConfig }) {
  const defaultConfig = initialConfig || {
    conversation_structure: { turns: { mean:12.5,std:5.9,min:4,max:55 }, tutor_student_ratio:1.18 },
    vocabulary:{ math_term_frequencies: {} },
    tutor_questions:{ purpose_distribution:{} },
    student_utterances:{ confusion_scores:{mean:3.42,std:1.19,min:1,max:5}, correctness_distribution:{correct_independent:1696,correct_assisted:303,incorrect:254} }
  };
  const [cfg, setCfg] = useState(defaultConfig);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCfg(prev => ({ ...prev, [name]: JSON.parse(value) }));
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => setCfg(JSON.parse(reader.result));
    reader.readAsText(file);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl mb-2">Configuration</h2>
      <input type="file" accept=".json" onChange={handleUpload} />
      {/* Example input: users can add custom JSON editors or form fields here */}
      <div className="mt-2">
        <button
          className="px-4 py-2 bg-green-500 text-white mr-2 rounded"
          onClick={() => onSubmit(cfg)}
        >Generate</button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={onDownloadConfig}
        >Download Config</button>
      </div>
    </div>
  );
}
