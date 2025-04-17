import './App.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  // State management
  const [data, setData] = useState(null);
  const [aiTools, setAiTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [category, setCategory] = useState('');
  const [department, setDepartment] = useState('');
  const [use, setUse] = useState('');
  const [details, setDetails] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');
  const [selectedTool, setSelectedTool] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stats, setStats] = useState({
    totalTools: 0,
    newThisMonth: 0,
    popularCategory: '',
    averageRating: 0
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [toolsPerPage] = useState(6);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toolToDelete, setToolToDelete] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  
  const tagInputRef = useRef(null);

  // Fetch tools on component mount
  useEffect(() => {
    fetchAiTools();
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Filter tools when search query or active filter changes
  useEffect(() => {
    filterTools();
  }, [searchQuery, activeFilter, aiTools, favorites]);

  // Extract categories and departments for filters
  useEffect(() => {
    if (aiTools.length > 0) {
      const categories = [...new Set(aiTools.map(tool => tool.category).filter(Boolean))];
      const departments = [...new Set(aiTools.map(tool => tool.department).filter(Boolean))];
      
      setCategoryOptions(categories);
      setDepartmentOptions(departments);
      
      // Update stats
      updateStats();
    }
  }, [aiTools]);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const updateStats = () => {
    // Calculate statistics
    const totalTools = aiTools.length;
    
    // Mock new this month count
    const newThisMonth = Math.floor(totalTools * 0.3);
    
    // Find the most popular category
    const categoryCount = {};
    aiTools.forEach(tool => {
      if (tool.category) {
        categoryCount[tool.category] = (categoryCount[tool.category] || 0) + 1;
      }
    });
    
    let popularCategory = '';
    let maxCount = 0;
    
    Object.keys(categoryCount).forEach(category => {
      if (categoryCount[category] > maxCount) {
        maxCount = categoryCount[category];
        popularCategory = category;
      }
    });
    
    // Mock average rating
    const averageRating = (3.5 + Math.random() * 1.5).toFixed(1);
    
    setStats({
      totalTools,
      newThisMonth,
      popularCategory,
      averageRating
    });
  };

  const fetchAiTools = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/ai-tools');
      setAiTools(response.data);
      setFilteredTools(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const filterTools = () => {
    let filtered = [...aiTools];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tool.category && tool.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tool.department && tool.department.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply category/department filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'favorites') {
        filtered = filtered.filter(tool => favorites.includes(tool._id));
      } else if (categoryOptions.includes(activeFilter)) {
        filtered = filtered.filter(tool => tool.category === activeFilter);
      } else if (departmentOptions.includes(activeFilter)) {
        filtered = filtered.filter(tool => tool.department === activeFilter);
      }
    }
    
    setFilteredTools(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !link) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      await axios.post('http://localhost:3000/ai-tools', { 
        name, 
        description, 
        link, 
        category, 
        department, 
        use, 
        details,
        tags
      });
      
      resetForm();
      setIsAdding(false);
      fetchAiTools();
    } catch (error) {
      console.error(error);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setLink('');
    setCategory('');
    setDepartment('');
    setUse('');
    setDetails('');
    setTags([]);
    setCurrentTag('');
  };

  const handleEdit = (id) => {
    const toolToEdit = aiTools.find(tool => tool._id === id);
    setSelectedTool({ 
      _id: toolToEdit._id,
      name: toolToEdit.name,
      description: toolToEdit.description,
      link: toolToEdit.link,
      category: toolToEdit.category || '',
      department: toolToEdit.department || '',
      use: toolToEdit.use || '',
      details: toolToEdit.details || '',
      tags: toolToEdit.tags || []
    });
  };

  const confirmDelete = (id) => {
    setToolToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!toolToDelete) return;
    
    try {
      await axios.delete(`http://localhost:3000/ai-tools/${toolToDelete}`);
      
      // Remove from favorites if it exists
      if (favorites.includes(toolToDelete)) {
        setFavorites(favorites.filter(id => id !== toolToDelete));
      }
      
      setShowDeleteModal(false);
      setToolToDelete(null);
      fetchAiTools();
    } catch (error) {
      console.error(error);
      setShowDeleteModal(false);
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
        details: tool.details,
        tags: tool.tags || []
      });
      
      setAiTools(aiTools.map(aiTool => aiTool._id === tool._id ? tool : aiTool));
      setSelectedTool(null);
      fetchAiTools();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favoriteId => favoriteId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
    tagInputRef.current?.focus();
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !currentTag) {
      setTags(tags.slice(0, -1));
    }
  };

  const cancelEditing = () => {
    setSelectedTool(null);
  };

  const cancelAdding = () => {
    setIsAdding(false);
    resetForm();
  };

  // Get current tools for pagination
  const indexOfLastTool = currentPage * toolsPerPage;
  const indexOfFirstTool = indexOfLastTool - toolsPerPage;
  const currentTools = filteredTools.slice(indexOfFirstTool, indexOfLastTool);
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Render page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="app">
      <div className={`sidebar ${!isMenuOpen ? 'closed' : ''}`}>
        <div className="logo">
          <h1>AI Tools Library</h1>
        </div>
        
        <div className="nav-menu">
          <a href="#" className="nav-item active">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            Documentation
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
            Favorites
          </a>
          <a href="#" className="nav-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </a>
        </div>
        
        {!isAdding && !selectedTool && (
          <button className="add-button" onClick={() => setIsAdding(true)}>
            + Add New Tool
          </button>
        )}
      </div>
      
      <div className="main-content">
        {/* Mobile menu toggle */}
        <button 
          className="sidebar-toggle mobile-only" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        
        {/* Display statistics dashboard */}
        {!isAdding && !selectedTool && (
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Total AI Tools</span>
                <div className="stat-icon purple">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                </div>
              </div>
              <div className="stat-value">{stats.totalTools}</div>
              <div className="stat-description positive">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"></line>
                  <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
                {stats.newThisMonth} new this month
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Popular Category</span>
                <div className="stat-icon green">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
              </div>
              <div className="stat-value">{stats.popularCategory || 'N/A'}</div>
              <div className="stat-description">
                Most used tools category
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Average Rating</span>
                <div className="stat-icon amber">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                  </svg>
                </div>
              </div>
              <div className="stat-value">{stats.averageRating}/5</div>
              <div className="stat-description">
                Based on user feedback
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-title">Favorites</span>
                <div className="stat-icon blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
              </div>
              <div className="stat-value">{favorites.length}</div>
              <div className="stat-description">
                Your favorite tools
              </div>
            </div>
          </div>
        )}
        
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
                    list="categories"
                  />
                  <datalist id="categories">
                    {categoryOptions.map((cat, index) => (
                      <option key={`cat-${index}`} value={cat} />
                    ))}
                  </datalist>
                </div>
                
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="Enter department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    list="departments"
                  />
                  <datalist id="departments">
                    {departmentOptions.map((dept, index) => (
                      <option key={`dept-${index}`} value={dept} />
                    ))}
                  </datalist>
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
                <label>Tags</label>
                <div className="tags-input-container">
                  {tags.map((tag, index) => (
                    <div className="tag" key={index}>
                      {tag}
                      <button 
                        type="button" 
                        className="tag-close" 
                        onClick={() => removeTag(tag)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input
                    ref={tagInputRef}
                    type="text"
                    className="tags-input"
                    placeholder="Add tags..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    onBlur={addTag}
                  />
                </div>
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
                    list="categories-edit"
                  />
                  <datalist id="categories-edit">
                    {categoryOptions.map((cat, index) => (
                      <option key={`cat-edit-${index}`} value={cat} />
                    ))}
                  </datalist>
                </div>
                
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    placeholder="Enter department"
                    value={selectedTool.department}
                    onChange={(e) => setSelectedTool({...selectedTool, department: e.target.value})}
                    list="departments-edit"
                  />
                  <datalist id="departments-edit">
                    {departmentOptions.map((dept, index) => (
                      <option key={`dept-edit-${index}`} value={dept} />
                    ))}
                  </datalist>
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
                <label>Tags</label>
                <div className="tags-input-container">
                  {selectedTool.tags && selectedTool.tags.map((tag, index) => (
                    <div className="tag" key={index}>
                      {tag}
                      <button 
                        type="button" 
                        className="tag-close" 
                        onClick={() => {
                          const newTags = selectedTool.tags.filter(t => t !== tag);
                          setSelectedTool({...selectedTool, tags: newTags});
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    className="tags-input"
                    placeholder="Add tags..."
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (currentTag.trim() && !selectedTool.tags.includes(currentTag.trim())) {
                          setSelectedTool({
                            ...selectedTool, 
                            tags: [...(selectedTool.tags || []), currentTag.trim()]
                          });
                          setCurrentTag('');
                        }
                      }
                    }}
                    onBlur={() => {
                      if (currentTag.trim() && !selectedTool.tags.includes(currentTag.trim())) {
                        setSelectedTool({
                          ...selectedTool, 
                          tags: [...(selectedTool.tags || []), currentTag.trim()]
                        });
                        setCurrentTag('');
                      }
                    }}
                  />
                </div>
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
            {/* Search bar */}
            <div className="search-container">
              <span className="search-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input
                type="text"
                className="search-input"
                placeholder="Search for AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter controls */}
            <div className="filter-controls">
              <button 
                className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                All Tools
              </button>
              {categoryOptions.map((cat) => (
                <button
                  key={cat}
                  className={`filter-button ${activeFilter === cat ? 'active' : ''}`}
                  onClick={() => setActiveFilter(cat)}
                >
                  {cat}
                </button>
              ))}
              <button 
                className={`filter-button ${activeFilter === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveFilter('favorites')}
              >
                Favorites
              </button>
            </div>

            {/* View toggle */}
            <div className="tools-header">
              <h2>AI Tools</h2>
              <div className="view-toggle">
                <button 
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button 
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Tools list */}
            <div className={`tools-list ${viewMode === 'list' ? 'list-view' : ''}`}>
              {isLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                </div>
              ) : currentTools.length > 0 ? (
                currentTools.map((tool) => (
                  <div key={tool._id} className="tool-card">
                    <div className="tool-header">
                      <h3>{tool.name}</h3>
                      <div className="tool-actions">
                        <button 
                          className={`tool-action-button favorite-button ${favorites.includes(tool._id) ? 'active' : ''}`}
                          onClick={() => toggleFavorite(tool._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>
                        <button 
                          className="tool-action-button edit-button"
                          onClick={() => handleEdit(tool._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button 
                          className="tool-action-button delete-button"
                          onClick={() => confirmDelete(tool._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="tool-description">{tool.description}</p>
                    <div className="tool-details">
                      <div className="tool-badges">
                        {tool.category && (
                          <span className="tool-tag category">{tool.category}</span>
                        )}
                        {tool.department && (
                          <span className="tool-tag department">{tool.department}</span>
                        )}
                      </div>
                      {tool.use && (
                        <p className="tool-use">{tool.use}</p>
                      )}
                      <a href={tool.link} target="_blank" rel="noopener noreferrer" className="tool-link">
                        Visit Tool
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-tools">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p>No tools found matching your criteria</p>
                  <button onClick={() => setIsAdding(true)}>Add New Tool</button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {currentTools.length > 0 && (
              <div className="pagination">
                <button 
                  className="page-button"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                {pageNumbers.map(number => (
                  <button
                    key={number}
                    className={`page-button ${currentPage === number ? 'active' : ''}`}
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                ))}
                <button 
                  className="page-button"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="close-button" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this tool? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="submit-button" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;