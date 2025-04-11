import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AIToolDetails = () => {
  const [tool, setTool] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchTool();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchTool = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/ai-tools/${id}`);
      setTool(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!tool || !tool.name || !tool.description || !tool.link || !tool.category || !tool.department || !tool.use) {
    return (
      <div className="loading-animation-container">
        <div className="loading-animation">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-tool-details">
      <h2>{tool.name}</h2>
      <p>Description: {tool.description}</p>
      <p>Category: {tool.category}</p>
      <p>Department: {tool.department}</p>
      <p>Use: {tool.use}</p>
      <a href={tool.link} target="_blank" rel="noopener noreferrer">
        Visit Website
      </a>
      <div className="know-more-container">
        <button 
          className="know-more-button"
          onClick={() => window.open(
            `/tool-details/${tool._id}?name=${encodeURIComponent(tool.name)}&description=${encodeURIComponent(tool.description)}&link=${encodeURIComponent(tool.link)}&category=${encodeURIComponent(tool.category || '')}&department=${encodeURIComponent(tool.department || '')}&use=${encodeURIComponent(tool.use || '')}&details=${encodeURIComponent(tool.details || '')}`, 
            '_blank'
          )}
        >
          Know More
        </button>
      </div>
    </div>
  );
};

export default AIToolDetails;