import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AIToolDetailsPage = () => {
  const [tool, setTool] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchTool = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/ai-tools/${id}`);
        setTool(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTool();
  }, [id]);

  if (!tool) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ai-tool-details">
      <div className="ai-tool-details-header">
        <div className="ai-tool-details-header-left">
          <h2>{tool.name}</h2>
        </div>
        <div className="ai-tool-details-header-right">
          <a 
            href={tool.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="read-more-button"
          >
            Visit Website
          </a>
        </div>
      </div>
      
      <div className="tool-details-content">
        <p><strong>Description:</strong> {tool.description}</p>
        <div className="tool-metadata">
          <p>
            <span className="metadata-label">Category:</span> 
            <span className="department-label">{tool.category}</span>
          </p>
          <p>
            <span className="metadata-label">Department:</span> 
            <span className="department-label">{tool.department}</span>
          </p>
          <p><strong>Use:</strong> {tool.use}</p>
          {tool.details && (
            <p><strong>Additional Details:</strong> {tool.details}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIToolDetailsPage;
