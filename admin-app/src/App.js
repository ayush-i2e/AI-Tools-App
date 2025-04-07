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
      alert('Please fill in all fields');
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
    try {
      await axios.delete(`http://localhost:3000/ai-tools/${id}`);
      console.log("Deleted tool with id: ", id)
      fetchAiTools();
    } catch (error) {
      console.error(error);
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

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ textAlign: 'center' }}>
          <h2 >Add AI Tool</h2>
          <form   onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Use"
              value={use}
              onChange={(e) => setUse(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
            />
            <button type="submit" >Add Tool</button>
          </form>
        </div>

        {selectedTool && (
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSave(selectedTool);
          }}>
            <input
              type="text"
              placeholder="Name"
              value={selectedTool.name}
              onChange={(e) => setSelectedTool({...selectedTool, name: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={selectedTool.description}
              onChange={(e) => setSelectedTool({...selectedTool, description: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Link"
              value={selectedTool.link}
              onChange={(e) => setSelectedTool({...selectedTool, link: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={selectedTool.category}
              onChange={(e) => setSelectedTool({...selectedTool, category: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Department"
              value={selectedTool.department}
              onChange={(e) => setSelectedTool({...selectedTool, department: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Use"
              value={selectedTool.use}
              onChange={(e) => setSelectedTool({...selectedTool, use: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Details"
              value={selectedTool.details}
              onChange={(e) => setSelectedTool({...selectedTool, details: e.target.value})}
              required
            />
            <button type="submit">Save Tool</button>
          </form>
        )}

        <h2 >AI Tools</h2>
        <ul  >
          {aiTools
            .filter(tool => tool.name && tool.department && tool.link)
            .map((tool) => (
              <li key={tool._id} style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>{tool.name}</span>
                  <div>
                    <button onClick={() => handleEdit(tool._id)}>Edit</button>
                    <button onClick={() => handleDelete(tool._id)}>Delete</button>
                  </div>
                </div>
                <p>{tool.description}</p>
              </li>
            ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
