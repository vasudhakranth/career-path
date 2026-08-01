import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SkillsHubPage.css';
import { getSkills } from '../services/api';

const carouselSlides = [
  { title: 'Learn New Skills', desc: 'Step-by-step masterclasses curated by industry veterans.' },
  { title: 'Practice Coding', desc: 'Write, run, and optimize your code using our ultra-fast built-in compiler.' },
  { title: 'Build Projects', desc: 'Construct production-grade software to anchor your technical portfolio.' },
  { title: 'Prepare for Interviews', desc: 'Crack FAANG-level engineering interviews with specialized tracks.' },
  { title: 'Become Job Ready', desc: 'Bridge the gap between academic theory and active workforce roles.' }
];

const getSkillMeta = (skillName, index) => {
  const skillMap = {
    Python: { level: 'Beginner', learners: '15,420', time: '25 Hours', icon: '🐍' },
    JavaScript: { level: 'Intermediate', learners: '12,890', time: '30 Hours', icon: '🟨' },
    React: { level: 'Advanced', learners: '18,110', time: '28 Hours', icon: '⚛️' },
    SQL: { level: 'Beginner', learners: '9,650', time: '14 Hours', icon: '🛢️' },
    HTML: { level: 'Beginner', learners: '8,420', time: '12 Hours', icon: '🌐' },
    CSS: { level: 'Intermediate', learners: '10,300', time: '16 Hours', icon: '🎨' },
  };

  const fallback = {
    level: index % 2 === 0 ? 'Beginner' : 'Intermediate',
    learners: `${(14000 + index * 720).toLocaleString()}`,
    time: `${12 + index * 4} Hours`,
    icon: ['⚡', '💡', '🔧', '🧠', '🚀', '📦'][index % 6]
  };

  return skillMap[skillName] || fallback;
};

export default function SkillsHub() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await getSkills();
        const catalog = response.data || [];
        setSkills(catalog);
      } catch (err) {
        console.error('Failed to load skills catalog', err);
        setError('Unable to load the learning catalog right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  const filteredSkills = skills.filter((skill) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return `${skill.skill_name} ${skill.category} ${skill.description}`.toLowerCase().includes(query);
  });

  const handleNavigateToLearning = (skillName) => {
    navigate(`/skill-learning/${encodeURIComponent(skillName)}`);
  };

  const handleScrollSkills = (direction) => {
    const container = document.getElementById('skillNavTrack');
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="skills-hub-container">
      <section className="search-section">
        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search skills, technologies, frameworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="main-search-input"
          />
        </div>
      </section>

      <section className="skill-nav-section">
        <button className="nav-arrow left" onClick={() => handleScrollSkills('left')}>‹</button>
        <div className="skill-nav-track" id="skillNavTrack">
          {loading ? (
            <button className="skill-chip">Loading skills…</button>
          ) : filteredSkills.length ? (
            filteredSkills.map((skill, index) => (
              <button
                key={skill.id || skill.skill_name}
                className="skill-chip"
                onClick={() => handleNavigateToLearning(skill.skill_name)}
              >
                {skill.skill_name}
              </button>
            ))
          ) : (
            <button className="skill-chip">No matching skills</button>
          )}
        </div>
        <button className="nav-arrow right" onClick={() => handleScrollSkills('right')}>›</button>
      </section>

      <section className="hero-grid">
        <div className="hero-banner">
          <h1 className="hero-title">Master In-Demand Skills with <span className="gradient-text">EduMind</span></h1>
          <p className="hero-subtitle">
            Learn technical skills step by step through interactive lessons, coding practice, quizzes, projects, videos, and AI guidance—all in one unified ecosystem.
          </p>
          <div className="hero-cta-group">
            <button className="btn btn-primary" onClick={() => handleNavigateToLearning(filteredSkills[0]?.skill_name || 'Python')}>Start Learning</button>
            <button className="btn btn-secondary" onClick={() => navigate('/roadmaps')}>Explore Roadmaps</button>
          </div>
        </div>

        <div className="carousel-wrapper">
          <div className="carousel-slide-card">
            <div className="carousel-content-fade">
              <span className="carousel-badge">Feature Spotlights</span>
              <h3 className="carousel-slide-title">{carouselSlides[currentSlide].title}</h3>
              <p className="carousel-slide-desc">{carouselSlides[currentSlide].desc}</p>
            </div>
            <div className="carousel-dots">
              {carouselSlides.map((_, idx) => (
                <span
                  key={idx}
                  className={`dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-heading">Trending Technical Skills</h2>
        {error ? (
          <p className="empty-state">{error}</p>
        ) : (
          <div className="skills-grid">
            {filteredSkills.length ? (
              filteredSkills.slice(0, 6).map((skill, index) => {
                const meta = getSkillMeta(skill.skill_name, index);
                return (
                  <div key={skill.id || skill.skill_name} className="premium-skill-card">
                    <div className="card-header">
                      <span className="skill-avatar">{meta.icon}</span>
                      <span className={`difficulty-badge ${meta.level.toLowerCase()}`}>{meta.level}</span>
                    </div>
                    <h3 className="skill-card-name">{skill.skill_name}</h3>
                    <p className="skill-card-description">{skill.description || skill.category}</p>
                    <div className="skill-meta">
                      <span>👥 {meta.learners} Users</span>
                      <span>⏱️ {meta.time}</span>
                    </div>
                    <button className="card-action-btn" onClick={() => handleNavigateToLearning(skill.skill_name)}>
                      Start Learning ➔
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">No skills match your search yet.</div>
            )}
          </div>
        )}
      </section>

      <footer className="hub-footer">
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms & Conditions</a>
          <a href="#help">Help Center</a>
        </div>
        <div className="footer-socials">
          <a href="#twitter" aria-label="Twitter">🐦</a>
          <a href="#github" aria-label="GitHub">🐙</a>
          <a href="#linkedin" aria-label="LinkedIn">💼</a>
        </div>
        <p className="footer-copyright">© 2026 EduMind Platform. Empowering tomorrow's engineers.</p>
      </footer>
    </div>
  );
}