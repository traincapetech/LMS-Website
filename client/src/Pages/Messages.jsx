import React, { useState, useEffect } from 'react';
import './Messages.css';

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
        text: `Greetings from London!

This is Angela, the lead instructor at the App Brewery.
I'm so excited to be your instructor during this course and I just wanted to send a quick note to welcome you.`,
        isUser: false, // Received (Left)
        time: "1 year ago"
      }
    ],
    time: "1 year ago",
    unread: true,
    starred: false,
  },
  {
    id: 2,
    sender: "Code Warriors",
    avatar: "https://ui-avatars.com/api/?name=CW&background=2d2f31&color=fff",
    snippet: "Welcome! Are you completely new to programming? If not th...",
    initialMessages: [
        {
            id: 'm2',
            sender: "Code Warriors",
            text: "Welcome! Are you completely new to programming? If not, feel free to skip the intro...",
            isUser: false, // Received (Left)
            time: "4 years ago"
        }
    ],
    time: "4 years ago",
    unread: true,
    starred: false,
  },
];

const Messages = () => {
  const [selectedThread, setSelectedThread] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [conversation, setConversation] = useState([]);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (selectedThread) {
      setConversation(selectedThread.initialMessages);
      setReplyText("");
    }
  }, [selectedThread]);

  const handleSend = () => {
    if (!replyText.trim()) return;
    const newMessage = {
      id: Date.now(),
      sender: "You",
      text: replyText,
      isUser: true, // Sent (Right)
      time: "Just now"
    };
    setConversation([...conversation, newMessage]);
    setReplyText("");
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

      <div className="msg-box">
        {/* LEFT SIDEBAR */}
        <div className="msg-sidebar">
          <div className="msg-controls">
            <button className="btn-compose">Compose</button>
            <div className="dropdown-container">
                <select className="dropdown-select">
                    <option>Unread</option>
                    <option>All</option>
                </select>
                <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2d2f31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9L12 15L18 9"/></svg>
            </div>
          </div>
          <div className="msg-search-area">
            <input type="text" placeholder="Search" className="msg-search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            <button className="btn-search">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
          <div className="msg-list">
            {filteredThreads.length > 0 ? (
                filteredThreads.map((thread) => (
                <div key={thread.id} onClick={() => setSelectedThread(thread)} className={`msg-thread ${selectedThread?.id === thread.id ? "active" : ""}`}>
                    <div className="thread-indicators">
                        {thread.unread && <div className="dot-unread"></div>}
                        <svg className="icon-star" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </div>
                    <div className="thread-avatar">
                        <img src={thread.avatar} alt={thread.sender} className="avatar-img" />
                    </div>
                    <div className="thread-content">
                        <div className="thread-top-row">
                            <h3 className="sender-name">{thread.sender}</h3>
                            <span className="msg-time">{thread.time}</span>
                        </div>
                        <p className="msg-snippet">{thread.snippet}</p>
                    </div>
                </div>
                ))
            ) : (
                <div className="no-results">No results found for '{searchTerm}'.</div>
            )}
          </div>
        </div>

        {/* RIGHT CONTENT PANE */}
        <div className="msg-content-pane">
          {selectedThread ? (
            <>
              <div className="right-header">
                <svg className="header-star" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                <img src={selectedThread.avatar} alt="avatar" className="header-avatar" />
                <span className="header-name">{selectedThread.sender}</span>
                <svg style={{cursor:'pointer', color:'#2d2f31'}} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
              </div>

              {/* 3. CHAT HISTORY - DYNAMIC BUBBLES */}
              <div className="msg-history">
                {conversation.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`msg-block ${msg.isUser ? 'msg-bubble-sent' : 'msg-bubble-received'}`}
                    >
                         <div className="sender-info">
                            <span className="sender-name-small">{msg.sender}</span>
                            <span className="msg-time-small">{msg.time}</span>
                         </div>
                        
                        {msg.text.split('\n').map((line, i) => (
                            <p key={i} className="message-text">
                                {line}
                                {line === "" && <br/>} 
                            </p>
                        ))}
                    </div>
                ))}
              </div>

              <div className="reply-section">
                <div className="editor-container">
                    <div className="editor-toolbar">
                        <button className="toolbar-btn">B</button>
                        <button className="toolbar-btn"><i>I</i></button>
                        <button className="toolbar-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </button>
                        <button className="toolbar-btn">&lt; &gt;</button>
                    </div>
                    <textarea 
                        className="editor-textarea" 
                        placeholder="Review course Q&A before sending a new message to the instructor"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                </div>
                
                <div className="editor-footer">
                    <div className="footer-links">
                        <span className="footer-link">View course Q&A</span>
                        <span className="footer-link">Visit the Udemy help center</span>
                    </div>
                    <button className="btn-send" onClick={handleSend}>Send</button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Select a message thread to read it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;