import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AIToolList = () => {
  const [aiTools, setAiTools] = useState([]);

  useEffect(() => {
    fetchAiTools();
  }, []);

  const fetchAiTools = async () => {
    try {
      const response = await axios.get('http://localhost:3000/ai-tools');
      setAiTools(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>AI Tools</h2>
      {aiTools.length > 0 ? (
        <ul className="ai-tool-list">
          {aiTools
            .filter(tool => tool.name && tool.description && tool.link)
            .map((tool) => (
              <li key={tool._id}>
                <a href={tool.link} target="_blank" rel="noopener noreferrer">
                  {tool.name}
                </a>
                <p>{tool.category}</p>
                <p>{tool.department}</p>
                <button className="read-more-button" onClick={() => window.open(`/tool/${tool._id}?name=${encodeURIComponent(tool.name)}&description=${encodeURIComponent(tool.description)}&link=${encodeURIComponent(tool.link)}&category=${encodeURIComponent(tool.category || '')}&department=${encodeURIComponent(tool.department || '')}&use=${encodeURIComponent(tool.use || '')}`, '_blank')}>Read More</button>
              </li>
            ))}
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default AIToolList;
