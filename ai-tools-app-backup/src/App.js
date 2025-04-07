import React, { useState, useEffect } from 'react';
import './App.css';
import AIToolList from './components/AIToolList';
import AIToolDetails from './components/AIToolDetails';
import AIToolDetailsPage from './components/AIToolDetailsPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';

// Animation component wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={500}
        classNames="page-transition"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/tool/:id" element={<AIToolDetails />} />
          <Route path="/tool-details/:id" element={<AIToolDetailsPage />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

// Home component with parallax effect
const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const parallaxStyle = {
    transform: `translateY(${scrollY * 0.3}px)`,
  };
  
  return (
    <>
      <div className="hero">
        <h1>Discover the Future of AI</h1>
        <p style={parallaxStyle}>
          Explore our curated collection of cutting-edge AI tools 
          to revolutionize your workflow and boost productivity.
        </p>
      </div>
      <AIToolList />
    </>
  );
};

// Navbar with scroll effect
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <h1>AI Tools Explorer</h1>
      <div className="navbar-links">
        <a href="/">Home</a>
        <a href="/categories">Categories</a>
        <a href="/about">About</a>
      </div>
    </nav>
  );
};

function App() {
  // Mouse parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const backgroundStyle = {
    transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
    transition: 'transform 0.1s ease-out',
  };

  return (
    <BrowserRouter>
      <div className="App" style={{ overflow: 'hidden', minHeight: '100vh' }}>
        
        {/* Background elements with parallax effect */}
        <div 
          className="background-elements" 
          style={{
            ...backgroundStyle,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -2,
            pointerEvents: 'none',
          }}
        >
          {/* You can add floating elements here */}
        </div>
        
        <Navbar />
        
        <header className="App-header">
          <AnimatedRoutes />
        </header>
      </div>
    </BrowserRouter>
  );
}

export default App;
