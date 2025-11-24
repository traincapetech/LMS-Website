import React, { useState, useEffect } from 'react';
import './Messages.css';

// Mock Data for Purchased Courses
const PURCHASED_COURSES = [
  {
    id: 101,
    title: "The Complete Full-Stack Web Development Bootcamp",
    instructor: "Dr. Angela Yu, Developer and Lead Instructor",
    image: "https://img-c.udemycdn.com/course/240x135/1565838_e54e_18.jpg" // Example URL
  },
  {
    id: 102,
    title: "Python Course From Basic to Advanced",
    instructor: "Code Warriors, Kaustubh Tripathi",
    image: "https://img-c.udemycdn.com/course/240x135/2776760_f176_10.jpg" // Example URL
  }
];

const MOCK_THREADS = [
  {
    id: 1,
    sender: "Dr. Angela Yu, Developer and Lead Instructor",
    avatar: "https://ui-avatars.com/api/?name=Angela+Yu&background=random&color=fff",
    snippet: "WooHoo! Congrats on finishing The Complete Web Development...",
    initialMessages: [
      {
        id: 'm1',
        sender: "Dr. Angela Yu, Developer and Lead Instructor",
        text: `Greetings from London!`,
        isUser: false,
        time: "1 year ago"
      }
    ],
    unread: true,
  },
  {
    id: 2,
    sender: "Code Warriors",
    avatar: "https://ui-avatars.com/api/?name=CW&background=2d2f31&color=fff",
    snippet: "Welcome! Are you completely new to programming?",
    initialMessages: [
        {
            id: 'm2',
            sender: "Code Warriors",
            text: "Welcome! Are you completely new to programming?",
            isUser: false, 
            time: "4 years ago"
        }
    ],
    unread: true,
  },
];

const Messages = () => {
  // States
  const [selectedThread, setSelectedThread] = useState(null); // For Chat
  const [view, setView] = useState('thread'); // 'thread', 'compose', 'new-message'
  const [showQAModal, setShowQAModal] = useState(false); // For Modal Popup
  
  const [searchTerm, setSearchTerm] = useState("");
  const [replyText, setReplyText] = useState("");
  const [allChats, setAllChats] = useState(() => {
    const saved = localStorage.getItem('udemy_chat_history');
    if (saved) return JSON.parse(saved);
    const initialData = {};
    MOCK_THREADS.forEach(thread => initialData[thread.id] = thread.initialMessages);
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('udemy_chat_history', JSON.stringify(allChats));
  }, [allChats]);

  const getRealTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (!replyText.trim()) return;
    const newMessage = { id: Date.now(), sender: "You", text: replyText, isUser: true, time: getRealTime() };
    setAllChats(prev => ({ ...prev, [selectedThread.id]: [...prev[selectedThread.id], newMessage] }));
    setReplyText("");
  };

  // Handle "Compose" Button Click
  const handleComposeClick = () => {
    setSelectedThread(null); // Deselect any chat
    setView('compose'); // Switch right side to Compose View
  };

  // Handle Thread Click
  const handleThreadClick = (thread) => {
    setSelectedThread(thread);
    setView('thread'); // Switch back to Chat View
  };

  const filteredThreads = MOCK_THREADS.filter(thread => 
    thread.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
    thread.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="msg-container">
      <div className="msg-header">
        <h1>Messages</h1>
        <p>You have {filteredThreads.length} unread message{filteredThreads.length !== 1 && 's'}.</p>
      </div>

      <div className={`msg-box ${selectedThread || view !== 'thread' ? 'mobile-active' : ''}`}>
        
        {/* --- LEFT SIDEBAR --- */}
        <div className="msg-sidebar">
          <div className="msg-controls">
            <button className="btn-compose" onClick={handleComposeClick}>Compose</button>
            <div className="dropdown-container">
                <select className="dropdown-select"><option>Unread</option><option>All</option></select>
                <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2d2f31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9L12 15L18 9"/></svg>
            </div>
          </div>
          <div className="msg-search-area">
            <input type="text" placeholder="Search" className="msg-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            <button className="btn-search"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></button>
          </div>
          <div className="msg-list">
            {filteredThreads.map((thread) => (
              <div key={thread.id} onClick={() => handleThreadClick(thread)} className={`msg-thread ${selectedThread?.id === thread.id ? "active" : ""}`}>
                  <div className="thread-indicators">
                      {thread.unread && <div className="dot-unread"></div>}
                      <svg className="icon-star" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </div>
                  <img src={thread.avatar} alt={thread.sender} className="avatar-img" />
                  <div className="thread-content">
                      <div className="thread-top-row">
                          <h3 className="sender-name">{thread.sender}</h3>
                          <span className="msg-time">{thread.time}</span>
                      </div>
                      <p className="msg-snippet">{thread.snippet}</p>
                  </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT CONTENT PANE --- */}
        <div className="msg-content-pane">
          
          {/* VIEW 1: CHAT THREAD */}
          {view === 'thread' && selectedThread && (
            <>
              <div className="right-header">
                <div className="back-button" onClick={() => setSelectedThread(null)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg></div>
                <svg className="header-star" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <img src={selectedThread.avatar} alt="avatar" className="header-avatar" />
                <span className="header-name">{selectedThread.sender}</span>
              </div>
              <div className="msg-history">
                {allChats[selectedThread.id]?.map((msg) => (
                    <div key={msg.id} className={`msg-block ${msg.isUser ? 'msg-bubble-sent' : 'msg-bubble-received'}`}>
                         <span className="msg-time-inside">{msg.time}</span>
                        {msg.text.split('\n').map((line, i) => <p key={i} className="message-text">{line}{line === "" && <br/>}</p>)}
                    </div>
                ))}
              </div>
              <div className="reply-section">
                <div className="editor-container">
                    <textarea className="editor-textarea" placeholder="Write a message..." value={replyText} onChange={(e) => setReplyText(e.target.value)}></textarea>
                </div>
                <div className="editor-footer"><button className="btn-send" onClick={handleSend}>Send</button></div>
              </div>
            </>
          )}

          {/* VIEW 2: COMPOSE OPTIONS (The page you asked for) */}
          {view === 'compose' && (
            <div className="compose-container">
              <div className="compose-header">Compose</div>
              <div className="compose-options">
                <h3>What do you have in mind?</h3>
                
                {/* Option 1 */}
                <div className="option-card">
                  <span className="option-title">Technical, payment or other platform issues</span>
                  <button className="btn-action">Visit the Traincape help center</button>
                </div>

                {/* Option 2: Q&A Modal Trigger */}
                <div className="option-card">
                  <span className="option-title">Questions about course content</span>
                  <button className="btn-action" onClick={() => setShowQAModal(true)}>View course Q&A</button>
                </div>

                {/* Option 3: Send New Message */}
                <div className="option-card">
                  <span className="option-title">Private or personal message to instructor</span>
                  <button className="btn-action" onClick={() => setView('new-message')}>Send a new message</button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: NEW MESSAGE FORM (The Instructor Search Input) */}
          {view === 'new-message' && (
            <div className="compose-container">
               <div className="compose-header">New Message</div>
               <div className="new-msg-form">
                  <label>Instructor</label>
                  <input type="text" className="new-msg-input" placeholder="Type an instructor's name" autoFocus />
               </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {view === 'thread' && !selectedThread && (
            <div className="empty-state">
              <p>Select a message thread to read it here.</p>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL: COURSE Q&A (Visible when showQAModal is true) --- */}
      {showQAModal && (
        <div className="modal-overlay" onClick={() => setShowQAModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select a course to display Q&A</h3>
              <button className="close-btn" onClick={() => setShowQAModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {PURCHASED_COURSES.map(course => (
                <div key={course.id} className="course-list-item">
                  <img src={course.image} alt="course" className="course-thumb" />
                  <div className="course-info">
                    <h4>{course.title}</h4>
                    <p>{course.instructor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Messages;