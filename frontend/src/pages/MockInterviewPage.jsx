import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MockInterviewPage.css';

// Mock Data for Interview Roles
const interviewRoles = [
  { id: 1, name: 'Software Engineer', icon: '💻', description: 'Full-stack development & system design', difficulty: 'Intermediate', duration: '60 mins', questions: 25 },
  { id: 2, name: 'Frontend Developer', icon: '🎨', description: 'React, Vue, Angular & UI/UX', difficulty: 'Intermediate', duration: '45 mins', questions: 20 },
  { id: 3, name: 'Backend Developer', icon: '⚙️', description: 'APIs, Databases & Server Architecture', difficulty: 'Advanced', duration: '50 mins', questions: 22 },
  { id: 4, name: 'Full Stack Developer', icon: '🔗', description: 'Frontend + Backend Integration', difficulty: 'Advanced', duration: '90 mins', questions: 35 },
  { id: 5, name: 'AI Engineer', icon: '🤖', description: 'Machine Learning & AI Systems', difficulty: 'Advanced', duration: '60 mins', questions: 28 },
  { id: 6, name: 'Data Scientist', icon: '📊', description: 'Analytics, ML Models & Data Insights', difficulty: 'Advanced', duration: '55 mins', questions: 24 },
  { id: 7, name: 'DevOps Engineer', icon: '🚀', description: 'Infrastructure & Deployment', difficulty: 'Advanced', duration: '50 mins', questions: 21 },
  { id: 8, name: 'Cloud Engineer', icon: '☁️', description: 'AWS, Azure & Cloud Architecture', difficulty: 'Advanced', duration: '55 mins', questions: 23 },
  { id: 9, name: 'QA Engineer', icon: '🧪', description: 'Testing & Quality Assurance', difficulty: 'Intermediate', duration: '45 mins', questions: 18 },
  { id: 10, name: 'Product Manager', icon: '📱', description: 'Strategy & Product Vision', difficulty: 'Intermediate', duration: '50 mins', questions: 20 },
  { id: 11, name: 'Data Analyst', icon: '📈', description: 'Data Analysis & Insights', difficulty: 'Beginner', duration: '45 mins', questions: 19 },
  { id: 12, name: 'Business Analyst', icon: '💼', description: 'Requirements & Process', difficulty: 'Beginner', duration: '45 mins', questions: 17 },
];

const hrQuestions = [
  'Tell me about yourself.',
  'Why should we hire you?',
  'What are your strengths?',
  'What are your weaknesses?',
  'Describe a challenge you faced.',
  'Why do you want this role?',
  'Where do you see yourself in five years?',
  'What is your greatest achievement?',
  'How do you handle stress?',
  'Why are you leaving your current job?',
];

const technicalQuestions = [
  'Explain RESTful APIs.',
  'What is the difference between SQL and NoSQL?',
  'Describe the MVC architecture.',
  'What is caching and why is it important?',
  'Explain the concept of microservices.',
  'What is OAuth and how does it work?',
  'Describe the CI/CD pipeline.',
  'What is containerization?',
  'Explain database normalization.',
  'What are design patterns? Give examples.',
];

const codingQuestions = [
  'Reverse a linked list.',
  'Find the longest substring without repeating characters.',
  'Implement binary search.',
  'Merge two sorted arrays.',
  'Check if a string is a palindrome.',
  'Find the missing number in an array.',
  'Implement a LRU cache.',
  'Find duplicates in an array.',
  'Implement a stack using queues.',
  'Serialize and deserialize a binary tree.',
];

export default function MockInterviewPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRound, setExpandedRound] = useState(null);

  // Resume upload state (so startInterview can tailor questions)
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeStatus, setResumeStatus] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  const filteredRoles = interviewRoles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const uploadResumeForCandidate = async () => {
    // Resume is optional. Only upload if user selected a file.
    if (!resumeFile) {
      setResumeStatus('');
      return true;
    }

    const token = localStorage.getItem('edumind_token');
    if (!token) {
      setResumeStatus('Please login first to upload resume');
      return false;
    }

    try {
      setUploadingResume(true);
      setResumeStatus('Uploading resume...');

      const formData = new FormData();
      formData.append('resume_file', resumeFile);

      // Axios interceptor will automatically add Authorization header
      const res = await api.post('/resume/upload', formData);

      setResumeStatus('Resume uploaded successfully.');
      return res.data;
    } catch (e) {
      console.error('Resume upload error:', e);
      let detail = 'Upload failed';
      if (e?.response?.data?.detail) {
        detail = typeof e.response.data.detail === 'string' ? e.response.data.detail : JSON.stringify(e.response.data.detail);
      } else if (e?.response?.data) {
        detail = typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data);
      } else if (e?.message) {
        detail = e.message;
      }
      console.error('Extracted detail:', detail);
      setResumeStatus(`Resume upload failed: ${detail}`);
      return false;
    } finally {
      setUploadingResume(false);
    }
  };

  const startInterview = async (role) => {
    // Resume is optional, but if user selected one we upload it before starting.
    const uploadOk = await uploadResumeForCandidate();
    if (uploadOk === false) return;

    navigate(`/interview-session/${role.id}`, {
      state: {
        role,
        resumeUploaded: Boolean(resumeFile),
      },
    });
  };

  return (
    <div className="mock-interview-container">
      {/* Hero Section */}
      <section className="interview-hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Practice Interviews with Your AI Interviewer</h1>
            <p className="hero-subtitle">
              Prepare for HR, Technical, and Coding interviews with realistic AI-powered interview simulations.
              Improve your confidence, communication, and technical knowledge before attending real company interviews.
            </p>

            {/* Resume upload (missing before) */}
            <div className="resume-upload-block" style={{ marginTop: 18 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="resume-file-input"
                />

                <button
                  className="btn btn-primary"
                  disabled={uploadingResume}
                  onClick={async () => {
                    await uploadResumeForCandidate();
                  }}
                >
                  {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                </button>
              </div>
              {resumeStatus ? (
                <div className="resume-upload-status" style={{ marginTop: 8, fontSize: 13, color: '#4f46e5' }}>
                  {resumeStatus}
                </div>
              ) : null}

              <div style={{ marginTop: 6, fontSize: 12, color: '#64748b' }}>
                (Optional) Upload your resume to tailor the AI interviewer questions.
              </div>
            </div>

            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => startInterview(interviewRoles[0])}>
                Start Interview Now
              </button>
              <button className="btn btn-secondary">View Previous Reports</button>
            </div>
          </div>

          <div className="hero-illustration">
            <div className="illustration-placeholder">
              <span className="illus-icon">🎥</span>
              <span className="illus-icon">🤖</span>
              <span className="illus-icon">💻</span>
            </div>
          </div>
        </div>
      </section>

      {/* Role Search Section */}
      <section className="search-section interview-search">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search your target role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </section>

      {/* Popular Interview Roles */}
      <section className="roles-section">
        <h2 className="section-title">Popular Interview Roles</h2>
        <div className="roles-grid">
          {filteredRoles.map((role) => (
            <div key={role.id} className="role-card glass">
              <div className="card-header">
                <span className="role-icon">{role.icon}</span>
                <span className={`difficulty-badge ${role.difficulty.toLowerCase()}`}>{role.difficulty}</span>
              </div>
              <h3 className="role-name">{role.name}</h3>
              <p className="role-description">{role.description}</p>
              <div className="role-meta">
                <span>⏱️ {role.duration}</span>
                <span>❓ {role.questions} Q</span>
              </div>
              <button className="btn btn-start" onClick={() => startInterview(role)}>
                Start Interview ➔
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Most Asked Questions Section */}
      <section className="qa-section">
        <h2 className="section-title">Most Asked Questions</h2>
        <div className="qa-grid">
          <div className="qa-card glass">
            <div className="qa-header">
              <h3 className="qa-title">HR Round</h3>
              <span className="qa-icon">👔</span>
            </div>
            <p className="qa-description">
              Behavioral and situational questions to assess your soft skills, communication, and cultural fit.
            </p>
            <div className="qa-stats">
              <span className="stat-badge">{hrQuestions.length} Questions</span>
              <span className="stat-badge">Beginner Friendly</span>
            </div>
            <button
              className="btn btn-explore"
              onClick={() => setExpandedRound(expandedRound === 'hr' ? null : 'hr')}
            >
              {expandedRound === 'hr' ? 'Hide Questions' : 'Explore Questions'}
            </button>
            {expandedRound === 'hr' && (
              <div className="qa-list">
                {hrQuestions.map((q, idx) => (
                  <div key={idx} className="qa-item">
                    <span className="qa-number">{idx + 1}</span>
                    <span className="qa-text">{q}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="qa-card glass">
            <div className="qa-header">
              <h3 className="qa-title">Technical Round</h3>
              <span className="qa-icon">⚙️</span>
            </div>
            <p className="qa-description">
              Deep technical questions on system design, architecture, databases, and core concepts.
            </p>
            <div className="qa-stats">
              <span className="stat-badge">{technicalQuestions.length} Questions</span>
              <span className="stat-badge">Intermediate</span>
            </div>
            <button
              className="btn btn-explore"
              onClick={() => setExpandedRound(expandedRound === 'tech' ? null : 'tech')}
            >
              {expandedRound === 'tech' ? 'Hide Questions' : 'Explore Questions'}
            </button>
            {expandedRound === 'tech' && (
              <div className="qa-list">
                {technicalQuestions.map((q, idx) => (
                  <div key={idx} className="qa-item">
                    <span className="qa-number">{idx + 1}</span>
                    <span className="qa-text">{q}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="qa-card glass">
            <div className="qa-header">
              <h3 className="qa-title">Coding Round</h3>
              <span className="qa-icon">💻</span>
            </div>
            <p className="qa-description">
              Algorithmic problems on data structures, algorithms, and coding problem-solving skills.
            </p>
            <div className="qa-stats">
              <span className="stat-badge">{codingQuestions.length} Questions</span>
              <span className="stat-badge">Advanced</span>
            </div>
            <button
              className="btn btn-explore"
              onClick={() => setExpandedRound(expandedRound === 'coding' ? null : 'coding')}
            >
              {expandedRound === 'coding' ? 'Hide Questions' : 'Explore Questions'}
            </button>
            {expandedRound === 'coding' && (
              <div className="qa-list">
                {codingQuestions.map((q, idx) => (
                  <div key={idx} className="qa-item">
                    <span className="qa-number">{idx + 1}</span>
                    <span className="qa-text">{q}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our Mock Interviews?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <h3>AI-Powered Interviewer</h3>
            <p>Realistic AI avatar that simulates real interview experience</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Detailed Analytics</h3>
            <p>Get comprehensive performance reports with actionable insights</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Role-Based Questions</h3>
            <p>Role-specific questions tailored to your target position</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💡</span>
            <h3>Real-Time Feedback</h3>
            <p>Instant AI feedback and suggestions for improvement</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📹</span>
            <h3>Video Recording</h3>
            <p>Review your performance with video playback</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🎓</span>
            <h3>Learning Resources</h3>
            <p>Access curated courses and materials to improve weak areas</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content glass">
          <h2>Ready to Ace Your Next Interview?</h2>
          <p>Start practicing with our AI interviewer and get hired at your dream company.</p>
          <button className="btn btn-primary btn-lg" onClick={() => startInterview(interviewRoles[0])}>
            Begin Your First Mock Interview
          </button>
        </div>
      </section>
    </div>
  );
}

