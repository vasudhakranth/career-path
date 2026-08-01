import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import './InterviewSessionPage.css';

export default function InterviewSessionPage() {

  const { roleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [interviewType, setInterviewType] = useState('hr');
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes

  const resumeAiEnabled = Boolean(location.state?.resumeUploaded);

  const [answers, setAnswers] = useState([]);
  const [listening, setListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  const [conversationQueue, setConversationQueue] = useState([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [showAnalysisSuccess, setShowAnalysisSuccess] = useState(false);
  const [resumeKeywords, setResumeKeywords] = useState([]);

  const recognitionRef = useRef(null);

  const cameraRef = useRef(null);
  const previewCameraRef = useRef(null);


  const hrQuestions = [
    'Tell me about yourself.',
    'Why should we hire you?',
    'What are your strengths?',
    'What are your weaknesses?',
    'Describe a challenge you faced.',
    'Why do you want this role?',
  ];

  const technicalQuestions = [
    'Explain RESTful APIs.',
    'What is the difference between SQL and NoSQL?',
    'Describe the MVC architecture.',
    'What is caching and why is it important?',
  ];

  const codingQuestions = [
    'Reverse a linked list.',
    'Find the longest substring without repeating characters.',
    'Implement binary search.',
  ];

  const questionsFromMock = location.state?.selectedQuestions;

  const [tailoredQuestions, setTailoredQuestions] = useState(null);
  const [tailoringLoading, setTailoringLoading] = useState(false);

  const [analyzePhase, setAnalyzePhase] = useState('idle'); // idle | analyzing | done


  // Resume upload (editable in this pre-interview screen too)
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeStatus, setResumeStatus] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  const uploadResumeForCandidate = async () => {
    if (!resumeFile) {
      setResumeStatus('No file chosen');
      return false;
    }

    const token = localStorage.getItem('edumind_token');
    console.log('Token from storage:', token ? 'Present' : 'Missing');
    
    if (!token) {
      setResumeStatus('Please login first to upload resume');
      console.warn('No token found - redirecting to login');
      navigate('/login');
      return false;
    }

    try {
      setUploadingResume(true);
      setResumeStatus('Uploading resume...');

      const formData = new FormData();
      formData.append('resume_file', resumeFile);
      
      // Axios interceptor will automatically add Authorization header
      console.log('Uploading FormData - axios interceptor will add Authorization header');
      const response = await api.post('/resume/upload', formData);
      console.log('Resume upload response status:', response.status);

      setResumeStatus('Resume uploaded successfully.');
      return true;
    } catch (e) {
      console.error('Resume upload error object:', e);
      console.error('Response data:', e?.response?.data);
      let detail = 'Upload failed';
      if (e?.response?.data?.detail) {
        detail = typeof e.response.data.detail === 'string' ? e.response.data.detail : JSON.stringify(e.response.data.detail);
      } else if (e?.response?.data) {
        detail = typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data);
      } else if (e?.response?.statusText) {
        detail = `${e.response.status} ${e.response.statusText}`;
      } else if (e?.message) {
        detail = e.message;
      }
      console.error('Extracted error detail:', detail);
      setResumeStatus(`Resume upload failed: ${detail}`);
      return false;
    } finally {
      setUploadingResume(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // resumeAiEnabled is true only if resume was uploaded before entering this screen.
      // If user uploads here, we rely on the resume AI indicator + backend tailoring call next.
      const shouldTailor = Boolean(resumeAiEnabled) || Boolean(resumeStatus?.includes('uploaded successfully'));
      if (!shouldTailor) return;
      if (Array.isArray(questionsFromMock) && questionsFromMock.length > 0) return;

      try {
        setTailoringLoading(true);
        const res = await api.post('/interview/questions-from-resume', {
          interview_type: interviewType,
        });
        if (cancelled) return;
        setTailoredQuestions(Array.isArray(res?.data?.questions) ? res.data.questions : null);
      } catch (e) {
        if (cancelled) return;
        setTailoredQuestions(null);
      } finally {
        if (!cancelled) setTailoringLoading(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeAiEnabled, interviewType, resumeStatus]);


  const getQuestions = () => {
    if (Array.isArray(questionsFromMock) && questionsFromMock.length > 0) {
      return questionsFromMock;
    }
    if (Array.isArray(tailoredQuestions) && tailoredQuestions.length > 0) {
      return tailoredQuestions;
    }

    if (interviewType === 'hr') return hrQuestions;
    if (interviewType === 'tech') return technicalQuestions;
    if (interviewType === 'coding') return codingQuestions;
    return hrQuestions;
  };

  const questions = conversationQueue.length ? conversationQueue : getQuestions();
  const totalTime = interviewType === 'hr' ? 1800 : interviewType === 'tech' ? 2400 : 3600;

  const speakText = (text) => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.98;
      utterance.pitch = 1;
      utterance.lang = 'en-US';
      const preferredVoice = (synth.getVoices() || []).find((voice) => voice.lang.startsWith('en') && /female|male/i.test(voice.name)) || (synth.getVoices() || [])[0];
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      synth.speak(utterance);
    } catch (e) {
      console.error('TTS speak failed', e);
    }
  };



  // Timer effect
  useEffect(() => {
    if (interviewStarted && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && interviewStarted) {
      endInterview();
    }
  }, [timeRemaining, interviewStarted]);

  // Request camera access
  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true 
        });
        if (cameraRef.current) {
          cameraRef.current.srcObject = stream;
          cameraRef.current.play().catch(err => console.error('Play error:', err));
        }
      } catch (err) {
        console.error('Camera/Microphone error:', err);
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        if (cameraRef.current) {
          cameraRef.current.srcObject = null;
        }
      }
    };

    if (interviewStarted && cameraOn) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [interviewStarted, cameraOn]);

  const buildResumeFollowUp = async (prompt, answer) => {
    try {
      const response = await api.post('/interview/follow-up-questions', {
        original_question: prompt,
        candidate_answer: answer,
        interview_type: interviewType,
      });
      
      const followUps = response?.data?.follow_up_questions;
      if (Array.isArray(followUps) && followUps.length > 0) {
        return followUps[0]; // Return first follow-up question
      }
    } catch (e) {
      console.error('Follow-up generation error:', e);
    }
    
    // Fallback to local generation if API fails
    const combined = `${prompt || ''} ${answer || ''}`.toLowerCase();
    const keywordMatch = (resumeKeywords || []).find((keyword) => {
      const normalized = (keyword || '').toLowerCase();
      return normalized && combined.includes(normalized);
    });

    if (keywordMatch) {
      return `You mentioned ${keywordMatch}. Can you walk me through a specific example where you used ${keywordMatch} and explain the result?`;
    }

    if (combined.includes('project') || combined.includes('built') || combined.includes('developed')) {
      return 'What was the biggest challenge you faced in that project, and how did you solve it?';
    }

    if (combined.includes('skill') || combined.includes('experience') || combined.includes('worked')) {
      return 'How did that experience shape the way you approach similar work today?';
    }

    return 'Can you share a bit more about the impact of that experience and the outcome you delivered?';
  };

  const startInterview = () => {
    const baseQuestions = getQuestions();
    const queue = Array.isArray(baseQuestions) && baseQuestions.length
      ? baseQuestions
      : [
          'Can you walk me through one of the projects on your resume and describe your contribution?',
        ];

    setConversationQueue(queue);
    setCurrentQuestion(0);
    setAnswers([]);
    setLastTranscript('');
    setInterviewStarted(true);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in this browser. Try Chrome.');
      return;
    }

    if (listening) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    setLastTranscript('');
    setListening(true);

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setLastTranscript(transcript.trim());
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);

      const textToSave = (lastTranscript || '').trim();
      if (textToSave) {
        const activeQuestion = questions[currentQuestion] || '';
        setAnswers((prev) => [...prev, { question: activeQuestion, answer: textToSave }]);

        const followUpQuestion = buildResumeFollowUp(activeQuestion, textToSave);
        if (currentQuestion < 5) {
          setConversationQueue((prev) => [...prev, followUpQuestion]);
        }
      }

      setTimeout(() => {
        nextQuestion();
      }, 300);
    };

    recognition.start();
  };

  const stopListening = () => {
    setListening(false);
    recognitionRef.current?.stop?.();
  };


  // Start camera preview on component mount (before interview)
  useEffect(() => {
    if (!interviewStarted && previewCameraRef.current) {
      navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true 
      })
        .then(stream => {
          if (previewCameraRef.current) {
            previewCameraRef.current.srcObject = stream;
            previewCameraRef.current.play().catch(err => console.error('Preview play error:', err));
          }
        })
        .catch(err => console.error('Preview camera error:', err));
    }

    return () => {
      if (previewCameraRef.current && previewCameraRef.current.srcObject) {
        previewCameraRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [interviewStarted]);

  const nextQuestion = () => {
    // Allow interviews to progress through all 20-30+ questions
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((value) => value + 1);
    } else {
      endInterview();
    }
  };

  // Speak the active question (browser built-in TTS)
  useEffect(() => {
    if (!interviewStarted) return;
    const q = questions?.[currentQuestion];
    if (q) {
      speakText(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewStarted, currentQuestion]);



  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const endInterview = () => {
    navigate('/interview-report', {
      state: {
        interviewType,
        role: location.state?.role,
        answers,
        selectedQuestionsCount: answers.length,
      },
    });
  };


  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  if (!interviewStarted) {
    return (
      <div className="interview-session-container">
        <div className="pre-interview-screen">
          <div className="pre-interview-content glass">
            <h1 className="pre-title">Prepare for Your Interview</h1>
            <p className="pre-subtitle">
              Make sure you have a quiet environment, good lighting, and a stable internet connection.
            </p>

            <div className="pre-checks">
              <div className="check-item">
                <span className="check-icon">✓</span>
                <div className="check-text">
                  <h3>Camera & Microphone</h3>
                  <p>Allow access to your camera and microphone</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">✓</span>
                <div className="check-text">
                  <h3>Environment</h3>
                  <p>Choose a quiet, well-lit background</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">✓</span>
                <div className="check-text">
                  <h3>Connection</h3>
                  <p>Ensure you have stable internet connectivity</p>
                </div>
              </div>
              <div className="check-item">
                <span className="check-icon">✓</span>
                <div className="check-text">
                  <h3>Time</h3>
                  <p>Make sure you have sufficient time available</p>
                </div>
              </div>
            </div>

            <div className="interview-type-selector">
              <div className="resume-ai-indicator">
                <span className={`resume-ai-pill ${resumeAiEnabled ? 'enabled' : ''}`}>
                  {resumeAiEnabled ? 'Resume AI: On (tailoring questions)' : 'Upload your resume (for the interviewer)'}
                </span>
              </div>

              <div className="resume-upload-block">
                <p className="resume-upload-subtitle">Provide a PDF/DOC/DOCX so the resume interviewer can tailor questions.</p>

                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="resume-file-input"
                />

              <div className="resume-upload-actions">
                <button
                  className="btn btn-primary"
                  disabled={uploadingResume}
                  onClick={async () => {
                    await uploadResumeForCandidate();
                  }}
                >
                  {uploadingResume ? 'Uploading...' : 'Upload Resume'}
                </button>

                <button
                  className="btn btn-secondary"
                  disabled={tailoringLoading || uploadingResume}
                  onClick={async () => {
                    try {
                      setAnalyzePhase('analyzing');
                      setTailoringLoading(true);
                      setTailoredQuestions(null);
                      setResumeKeywords([]);
                      setAnalysisComplete(false);
                      setShowAnalysisSuccess(false);

                      if (resumeFile) {
                        const uploaded = await uploadResumeForCandidate();
                        if (!uploaded) {
                          return;
                        }
                      } else if (!resumeStatus.includes('uploaded successfully')) {
                        setResumeStatus('Upload a resume file first so the interviewer can build tailored questions.');
                        return;
                      }

                      const res = await api.post('/interview/questions-from-resume', {
                        interview_type: interviewType,
                      });

                      const qs = Array.isArray(res?.data?.questions) ? res.data.questions : null;
                      const keywords = Array.isArray(res?.data?.keywords) ? res.data.keywords : [];
                      setTailoredQuestions(qs && qs.length ? qs : null);
                      setResumeKeywords(keywords);
                      setAnalyzePhase('done');
                      setAnalysisComplete(true);
                      setResumeStatus('Resume analyzed successfully.');
                      setShowAnalysisSuccess(true);
                    } catch (e) {
                      const detail = e?.response?.data?.detail || e?.message || 'Resume analysis failed';
                      setResumeStatus(detail);
                      setTailoredQuestions(null);
                      setResumeKeywords([]);
                      setAnalysisComplete(false);
                    } finally {
                      setTailoringLoading(false);
                    }
                  }}
                >

                  {tailoringLoading ? 'Analyzing...' : 'Analyze Resume'}
                </button>

                <div className="resume-upload-status">{resumeStatus}</div>
              </div>

              {tailoringLoading && (
                <div className="resume-analysis-loading" role="status" aria-live="polite">
                  <div className="resume-analysis-spinner" />
                  <div className="resume-analysis-copy">
                    <strong>Analyzing your resume…</strong>
                    <span>Matching your background with tailored interviewer questions.</span>
                  </div>
                </div>
              )}

              </div>

              <h3>Select Interview Type</h3>

              <div className="type-buttons">

                <button
                  className={`type-btn ${interviewType === 'hr' ? 'active' : ''}`}
                  onClick={() => setInterviewType('hr')}
                >
                  👔 HR Round
                </button>
                <button
                  className={`type-btn ${interviewType === 'tech' ? 'active' : ''}`}
                  onClick={() => setInterviewType('tech')}
                >
                  ⚙️ Technical Round
                </button>
                <button
                  className={`type-btn ${interviewType === 'coding' ? 'active' : ''}`}
                  onClick={() => setInterviewType('coding')}
                >
                  💻 Coding Round
                </button>
              </div>
            </div>

            <div className="pre-camera-preview">
              <video
                ref={previewCameraRef}
                autoPlay
                playsInline
                muted
                className="preview-video"
              />
              <div className="preview-overlay">
                <span>Camera Preview</span>
              </div>
            </div>

            <div className="pre-actions">
              <button className="btn btn-secondary" onClick={() => navigate('/skills-hub')}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={startInterview}>
                Start Interview
              </button>
            </div>

            {showAnalysisSuccess && (
              <div className="analysis-success-popup" role="dialog" aria-modal="true">
                <div className="analysis-success-card">
                  <div className="analysis-success-icon">✅</div>
                  <h3>Resume analyzed successfully!</h3>
                  <p>
                    Your resume has been analyzed. The AI Interviewer will now generate personalized interview questions based on your skills, projects, experience, education, certifications, and technical knowledge.
                  </p>
                  <button className="btn btn-primary" onClick={() => setShowAnalysisSuccess(false)}>
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="interview-session-container">
      <div className="interview-call-screen">
        {/* Stage (single video-call area) */}
        <div className="call-stage glass">
          <div className="participants-grid">
            {/* Candidate */}
            <div className="participant-tile candidate">
              <div className="participant-label">
                You <span className="pill live">Live</span>
              </div>
              <video
                ref={cameraRef}
                autoPlay
                playsInline
                muted
                className="participant-video"
              />
              <div className="tile-corner">
                <span className={`status-indicator ${cameraOn ? 'active' : ''}`}></span>
              </div>
            </div>

            {/* AI Interviewer */}
            <div className="participant-tile ai">
              <div className="participant-label">
                <span className="ai-label">AI Interviewer</span>
                <span className={`pill ai-${listening ? 'speaking' : 'idle'}`}>{listening ? 'Speaking' : 'Ready'}</span>
              </div>

              <div className="ai-avatar-stage">
                <div className="ai-avatar-placeholder">🤖</div>
                <div className="ai-badge">
                  <span className="ai-badge-glow" />
                  <span className="ai-badge-text">EduMind AI</span>
                </div>
              </div>

              <div className="ai-virtual-cam">
                <div className="ai-eye" />
                <div className="ai-eye" />
              </div>
            </div>
          </div>

          {/* Overlays */}
          <div className="call-overlay-top">
            <div className="call-timer">
              <span className="timer-time">{formatTime(timeRemaining)}</span>
              <span className="timer-label">Remaining</span>
            </div>
            <div className="call-question">
              <div className="call-question-header">
                <span className="question-number">
                  Q{currentQuestion + 1}/{questions.length}
                </span>
                <span className="difficulty-tag">{interviewType.toUpperCase()}</span>
              </div>
              <div className="call-question-body">{questions[currentQuestion]}</div>
            </div>
          </div>


          {/* Speech control (kept lightweight inside call) */}
          <div className="call-overlay-bottom" aria-live="polite">
            <div className="speech-controls">
              <button
                className={`btn btn-primary ${listening ? 'active' : ''}`}
                onClick={() => startListening()}
                disabled={listening}
              >
                {listening ? 'Listening…' : '🎙️ Start Speaking'}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => stopListening()}
                disabled={!listening}
              >
                ⏹️ Stop
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setCurrentQuestion(currentQuestion)}
                disabled={currentQuestion === 0}
              >
                🔄 Repeat
              </button>
            </div>

            <div className="call-transcript-hint">
              {listening ? 'Speak now. Your answer will be captured.' : 'Click Start Speaking when ready.'}
            </div>
          </div>

          {/* Bottom full controls bar */}
          <div className="call-controls-bar">
            <button className={`control-pill ${micOn ? 'active' : ''}`} onClick={() => setMicOn((v) => !v)} title="Microphone">
              🎤 Mic
            </button>
            <button className={`control-pill ${cameraOn ? 'active' : ''}`} onClick={() => setCameraOn((v) => !v)} title="Camera">
              📹 Camera
            </button>
            <button
              className="control-pill"
              onClick={() => alert('Screen share not implemented in this UI refactor yet.')} 
              title="Screen Share"
            >
              🖥️ Share
            </button>
            <button className="control-pill" onClick={() => alert('Chat panel embedded (use your in-call lightweight chat UI next).')} title="Chat">
              💬 Chat
            </button>
            <button className="control-pill end" onClick={endInterview} title="End Call">
              ⛔ End Call
            </button>
            <button className="control-pill" onClick={() => alert('Captions UI placeholder.')} title="Captions">CC</button>
            <button className="control-pill" onClick={() => alert('Settings UI placeholder.')} title="Settings">⚙️</button>
            <div className="recording-indicator" title="Recording">
              <span className="rec-dot" /> REC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
