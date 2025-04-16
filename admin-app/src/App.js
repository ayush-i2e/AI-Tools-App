import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState(null);
  const [aiTools, setAiTools] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [use, setUse] = useState('');
  const [details, setDetails] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !link) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await axios.post('http://localhost:3000/ai-tools', { name, description, link, category, department, use, details });
      setName('');
      setDescription('');
      setLink('');
      setCategory('');
      setDepartment('');
      setUse('');
      setDetails('');
      setIsAdding(false);
      fetchAiTools();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    const toolToEdit = aiTools.find(tool => tool._id === id);
    setSelectedTool({ 
      _id: toolToEdit._id,
      name: toolToEdit.name,
      description: toolToEdit.description,
      link: toolToEdit.link,
      category: toolToEdit.category,
      department: toolToEdit.department,
      use: toolToEdit.use,
      details: toolToEdit.details,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tool?')) {
      try {
        await axios.delete(`http://localhost:3000/ai-tools/${id}`);
        console.log("Deleted tool with id: ", id)
        fetchAiTools();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSave = async (tool) => {
    try {
      await axios.put(`http://localhost:3000/ai-tools/${tool._id}`, {
        name: tool.name,
        description: tool.description,
        link: tool.link,
        category: tool.category,
        department: tool.department,
        use: tool.use,
        details: tool.details
      });
      console.log("Saved tool with id: ", tool._id);
      setAiTools(aiTools.map(aiTool => aiTool._id === tool._id ? tool : aiTool));
      setSelectedTool(null);
    } catch (error) {
      console.error(error);
    }
  };

  const cancelEditing = () => {
    setSelectedTool(null);
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setName('');
    setDescription('');
    setLink('');
    setCategory('');
    setDepartment('');
    setUse('');
    setDetails('');
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="logo">
          <h1>AI Tools Library</h1>
        </div>
        {!isAdding && !selectedTool && (
          <button className="add-button" onClick={() => setIsAdding(true)}>
            + Add New Tool
          </button>
        )}
      </div>
      
      <div className="main-content">
        {isAdding && (
          <div className="form-container">
            <div className="form-header">
              <h2>Add New AI Tool</h2>
              <button className="cancel-button" onClick={cancelAdding}>Cancel</button>
            </div>
            <form className="tool-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tool Name*</label>
                <input
                  type="text"
                  placeholder="Enter tool name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description*</label>
                <textarea
                  placeholder="Enter tool description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Link*</label>
                <input
                  type="text"
                  placeholder="Enter tool URL"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="Enter category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="Enter department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Use Case</label>
                <input
                  type="text"
                  placeholder="Enter use case"
                  value={use}
                  onChange={(e) => setUse(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label>Additional Details</label>
                <textarea
                  placeholder="Enter additional details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>
              
              <button type="submit" className="submit-button">Add Tool</button>
            </form>
          </div>
        )}

        {selectedTool && (
          <div className="form-container">
            <div className="form-header">
              <h2>Edit AI Tool</h2>
              <button className="cancel-button" onClick={cancelEditing}>Cancel</button>
            </div>
            <form className="tool-form" onSubmit={(e) => {
              e.preventDefault();
              handleSave(selectedTool);
            }}>
              <div className="form-group">
                <label>Tool Name*</label>
                <input
                  type="text"
                  placeholder="Enter tool name"
                  value={selectedTool.name}
                  onChange={(e) => setSelectedTool({...selectedTool, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description*</label>
                <textarea
                  placeholder="Enter tool description"
                  value={selectedTool.description}
                  onChange={(e) => setSelectedTool({...selectedTool, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Link*</label>
                <input
                  type="text"
                  placeholder="Enter tool URL"
                  value={selectedTool.link}
                  onChange={(e) => setSelectedTool({...selectedTool, link: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    placeholder="Enter category"
                    value={selectedTool.category}
                    onChange={(e) => setSelectedTool({...selectedTool, category: e.target.value})}
                  />
                </div>
                
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="Enter department"
                    value={selectedTool.department}
                    onChange={(e) => setSelectedTool({...selectedTool, department: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Use Case</label>
                <input
                  type="text"
                  placeholder="Enter use case"
                  value={selectedTool.use}
                  onChange={(e) => setSelectedTool({...selectedTool, use: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Additional Details</label>
                <textarea
                  placeholder="Enter additional details"
                  value={selectedTool.details}
                  onChange={(e) => setSelectedTool({...selectedTool, details: e.target.value})}
                />
              </div>
              
              <button type="submit" className="submit-button">Save Changes</button>
            </form>
          </div>
        )}

        {!isAdding && !selectedTool && (
          <div className="tools-list-container">
            <h2>AI Tools Collection</h2>
            {aiTools.length === 0 ? (
              <div className="no-tools">
                <p>No AI tools added yet. Add your first tool!</p>
              </div>
            ) : (
              <div className="tools-list">
                {aiTools
                  .filter(tool => tool.name && tool.department && tool.link)
                  .map((tool) => (
                    <div key={tool._id} className="tool-card">
                      <div className="tool-header">
                        <h3>{tool.name}</h3>
                        <div className="tool-actions">
                          <button className="edit-button" onClick={() => handleEdit(tool._id)}>Edit</button>
                          <button className="delete-button" onClick={() => handleDelete(tool._id)}>Delete</button>
                        </div>
                      </div>
                      <p className="tool-description">{tool.description}</p>
                      <div className="tool-details">
                        {tool.category && <span className="tool-tag category">{tool.category}</span>}
                        {tool.department && <span className="tool-tag department">{tool.department}</span>}
                        {tool.use && (
                          <div className="tool-use">
                            <strong>Use Case:</strong> {tool.use}
                          </div>
                        )}
                        {tool.link && (
                          <a href={tool.link} target="_blank" rel="noopener noreferrer" className="tool-link">
                            Visit Tool
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;