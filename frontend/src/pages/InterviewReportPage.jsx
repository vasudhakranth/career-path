import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './InterviewReportPage.css';

export default function InterviewReportPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock Report Data
  const reportData = {
    overallScore: 78,
    communicationScore: 82,
    technicalScore: 75,
    codingScore: 0,
    confidenceScore: 80,
    problemSolvingScore: 72,
    timeManagementScore: 76,
    interviewDuration: '24:35',
    questionsAnswered: 6,
    totalQuestions: 6,
    date: new Date().toLocaleDateString(),
    role: location.state?.role?.name || 'Software Engineer',
    interviewType: location.state?.interviewType || 'hr'
  };

  const questionsReview = [
    {
      id: 1,
      question: 'Tell me about yourself.',
      userAnswer: 'I am a software engineer with 3 years of experience in full-stack development...',
      idealAnswer: 'You should mention your background, key achievements, relevant experience, and career goals. Include specific examples of projects you\'ve worked on.',
      feedback: 'Good structure and clear communication. Try to be more concise and focus on relevant achievements.',
      confidence: 85,
      score: 80
    },
    {
      id: 2,
      question: 'Why should we hire you?',
      userAnswer: 'I have strong technical skills and experience with modern tech stacks...',
      idealAnswer: 'Explain how your skills align with the role, highlight unique value propositions, mention specific achievements, and show enthusiasm for the company.',
      feedback: 'You mentioned skills but lacked specific examples. Research the company more to show why you\'re interested.',
      confidence: 75,
      score: 72
    },
    {
      id: 3,
      question: 'What are your strengths?',
      userAnswer: 'I am good at problem-solving and learning new technologies quickly...',
      idealAnswer: 'Provide 2-3 strengths with specific examples. Connect them to the role requirements.',
      feedback: 'Generic answer. Provide concrete examples from your projects and experience.',
      confidence: 80,
      score: 78
    },
    {
      id: 4,
      question: 'What are your weaknesses?',
      userAnswer: 'Sometimes I focus too much on perfection...',
      idealAnswer: 'Mention a genuine weakness, show how you\'ve worked to improve it, and connect it to a strength.',
      feedback: 'Good approach. The answer shows self-awareness and growth mindset.',
      confidence: 88,
      score: 85
    },
    {
      id: 5,
      question: 'Describe a challenge you faced.',
      userAnswer: 'We had a performance issue in production...',
      idealAnswer: 'Use STAR method (Situation, Task, Action, Result). Make it relevant to the role.',
      feedback: 'Good use of the STAR method. Add more context about what you learned.',
      confidence: 82,
      score: 80
    },
    {
      id: 6,
      question: 'Why do you want this role?',
      userAnswer: 'I am interested in this company\'s mission and the role aligns with my career goals...',
      idealAnswer: 'Show genuine interest in the company, explain how the role fits your career path, mention specific products/projects.',
      feedback: 'Good, but needs more specific details about the company and role. Show you\'ve done your research.',
      confidence: 78,
      score: 75
    }
  ];

  const recommendations = [
    {
      category: 'Skills to Improve',
      items: [
        'Communication: Practice concise and structured responses',
        'Technical Depth: Dive deeper into system design concepts',
        'Confidence: Work on public speaking and presentation skills'
      ]
    },
    {
      category: 'Topics to Learn',
      items: [
        'Advanced System Design Patterns',
        'Microservices Architecture',
        'Cloud Computing (AWS/Azure)',
        'Behavioral Interview Techniques'
      ]
    },
    {
      category: 'Coding Problems to Practice',
      items: [
        'Leetcode Medium Level Problems (50+ problems)',
        'Graph Algorithms',
        'Dynamic Programming',
        'System Design Questions'
      ]
    },
    {
      category: 'Recommended Courses',
      items: [
        'System Design Interview Masterclass',
        'Behavioral Interview Preparation',
        'Advanced Python/JavaScript',
        'Data Structures Deep Dive'
      ]
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 70) return '#3b82f6';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const renderScore = (score) => {
    if (score === 0) return 'N/A';
    return score;
  };

  return (
    <div className="interview-report-container">
      {/* Header */}
      <header className="report-header glass">
        <div className="header-content">
          <h1 className="report-title">Interview Report</h1>
          <p className="report-subtitle">
            {reportData.role} • {reportData.date}
          </p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">📥 Download PDF</button>
          <button className="btn btn-secondary">📤 Share</button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/skills-hub')}
          >
            Back to Hub
          </button>
        </div>
      </header>

      {/* Overall Score Section */}
      <section className="overall-score-section">
        <div className="score-card glass">
          <div className="score-circle">
            <svg viewBox="0 0 100 100" className="score-ring">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(99, 102, 241, 0.1)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={getScoreColor(reportData.overallScore)}
                strokeWidth="8"
                strokeDasharray={`${(reportData.overallScore / 100) * 282.7} 282.7`}
                strokeLinecap="round"
                className="score-ring-fill"
              />
            </svg>
            <div className="score-content">
              <span className="score-value">{reportData.overallScore}</span>
              <span className="score-label">Overall Score</span>
            </div>
          </div>

          <div className="score-breakdown">
            <div className="breakdown-item">
              <div className="item-header">
                <span className="item-label">Communication</span>
                <span className="item-value">{reportData.communicationScore}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${reportData.communicationScore}%`,
                    background: getScoreColor(reportData.communicationScore)
                  }}
                ></div>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="item-header">
                <span className="item-label">Technical Knowledge</span>
                <span className="item-value">{reportData.technicalScore}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${reportData.technicalScore}%`,
                    background: getScoreColor(reportData.technicalScore)
                  }}
                ></div>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="item-header">
                <span className="item-label">Confidence</span>
                <span className="item-value">{reportData.confidenceScore}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${reportData.confidenceScore}%`,
                    background: getScoreColor(reportData.confidenceScore)
                  }}
                ></div>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="item-header">
                <span className="item-label">Problem Solving</span>
                <span className="item-value">{reportData.problemSolvingScore}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${reportData.problemSolvingScore}%`,
                    background: getScoreColor(reportData.problemSolvingScore)
                  }}
                ></div>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="item-header">
                <span className="item-label">Time Management</span>
                <span className="item-value">{reportData.timeManagementScore}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${reportData.timeManagementScore}%`,
                    background: getScoreColor(reportData.timeManagementScore)
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="interview-stats">
            <div className="stat">
              <span className="stat-icon">⏱️</span>
              <div className="stat-content">
                <span className="stat-label">Duration</span>
                <span className="stat-value">{reportData.interviewDuration}</span>
              </div>
            </div>
            <div className="stat">
              <span className="stat-icon">❓</span>
              <div className="stat-content">
                <span className="stat-label">Questions Answered</span>
                <span className="stat-value">{reportData.questionsAnswered}/{reportData.totalQuestions}</span>
              </div>
            </div>
            <div className="stat">
              <span className="stat-icon">🎯</span>
              <div className="stat-content">
                <span className="stat-label">Performance Level</span>
                <span className="stat-value">
                  {reportData.overallScore >= 80 ? 'Excellent' : reportData.overallScore >= 70 ? 'Good' : 'Fair'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="tabs-section">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            ❓ Questions Review
          </button>
          <button
            className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            💡 AI Recommendations
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <section className="tab-content">
            <div className="overview-grid">
              <div className="overview-card glass">
                <h3>Performance Summary</h3>
                <p>
                  You demonstrated solid communication skills and good understanding of core concepts.
                  Your confidence level was consistent throughout the interview. Focus on deepening technical
                  knowledge and providing more specific examples in your answers.
                </p>
              </div>

              <div className="overview-card glass">
                <h3>Strengths</h3>
                <ul className="strengths-list">
                  <li>✓ Clear and confident communication</li>
                  <li>✓ Good time management</li>
                  <li>✓ Structured problem-solving approach</li>
                  <li>✓ Positive attitude and engagement</li>
                </ul>
              </div>

              <div className="overview-card glass">
                <h3>Areas for Improvement</h3>
                <ul className="improvements-list">
                  <li>• Add more specific examples and metrics</li>
                  <li>• Deepen technical knowledge on core concepts</li>
                  <li>• Research company more thoroughly</li>
                  <li>• Practice handling difficult questions</li>
                </ul>
              </div>

              <div className="overview-card glass">
                <h3>Next Steps</h3>
                <ol className="next-steps-list">
                  <li>Review the AI recommendations section</li>
                  <li>Take recommended courses and practice problems</li>
                  <li>Retake a mock interview in 2 weeks</li>
                  <li>Track your progress with detailed analytics</li>
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* Questions Review Tab */}
        {activeTab === 'questions' && (
          <section className="tab-content questions-content">
            <div className="questions-list">
              {questionsReview.map((item, idx) => (
                <div key={item.id} className="question-review glass">
                  <div className="review-header">
                    <span className="question-number">Q{idx + 1}</span>
                    <h3 className="review-question">{item.question}</h3>
                    <div className="review-scores">
                      <span className="score-badge" style={{ background: getScoreColor(item.score) }}>
                        Score: {item.score}
                      </span>
                      <span className="confidence-badge">
                        Confidence: {item.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className="review-content">
                    <div className="review-subsection">
                      <h4>Your Answer</h4>
                      <p className="review-text">{item.userAnswer}</p>
                    </div>

                    <div className="review-subsection">
                      <h4>Ideal Answer</h4>
                      <p className="review-text ideal">{item.idealAnswer}</p>
                    </div>

                    <div className="review-subsection">
                      <h4>💡 AI Feedback</h4>
                      <p className="review-text feedback">{item.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <section className="tab-content recommendations-content">
            <div className="recommendations-grid">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="recommendation-card glass">
                  <h3>{rec.category}</h3>
                  <ul className="rec-list">
                    {rec.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="cta-card glass">
              <h3>Ready to Improve?</h3>
              <p>
                Start taking courses, practicing problems, and retaking mock interviews to improve your performance.
              </p>
              <div className="cta-buttons">
                <button className="btn btn-primary" onClick={() => navigate('/skills-hub')}>
                  Start Learning
                </button>
                <button className="btn btn-secondary" onClick={() => navigate('/mock-interview')}>
                  Retake Interview
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
