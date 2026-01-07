import React, { useState, useEffect, useRef } from 'react';
import './Messages.css';
import { discussionAPI, enrollmentAPI } from '../utils/api';
import { toast } from 'sonner';

const Messages = () => {
  // State
  const [myCourses, setMyCourses] = useState([]); // User's enrolled courses
  const [selectedCourse, setSelectedCourse] = useState(null); // Currently selected course
  const [messages, setMessages] = useState([]); // Messages for selected course
  const [newMessage, setNewMessage] = useState(""); // Input text
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Auto-scroll reference
  const messagesEndRef = useRef(null);

  // Load current user and courses on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Get current user from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          setCurrentUser(JSON.parse(userStr));
        }

        // Get enrolled courses
        const coursesRes = await enrollmentAPI.getMyEnrollments();

        // Format courses for display
        const formattedCourses = coursesRes.data.enrollments.map(item => ({
          id: item.course._id,
          title: item.course.title,
          instructor: item.course.instructor?.name || "Instructor",
          image: item.course.thumbnailUrl
        }));

        setMyCourses(formattedCourses);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Fetch messages when course is selected
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchMessages = async () => {
      try {
        const res = await discussionAPI.getCourseMessages(selectedCourse.id);
        setMessages(res.data.messages || []);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();

    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);

  }, [selectedCourse]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCourse) return;

    try {
      setSending(true);
      const res = await discussionAPI.sendMessage(selectedCourse.id, newMessage);

      // Add new message to list immediately
      setMessages([...messages, res.data.message]);
      setNewMessage("");
      toast.success("Message sent!");
    } catch (error) {
      console.error("Send failed:", error);
      toast.error("Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="msg-container">
      {/* HEADER */}
      <div className="msg-header">
        <h1>Messages</h1>
        <p>You have {myCourses.length} course discussion{myCourses.length !== 1 ? 's' : ''}.</p>
      </div>

      <div className="msg-box">
        {/* SIDEBAR - List of Courses */}
        <div className="msg-sidebar">
          <div className="sidebar-search">
            <input type="text" placeholder="Search courses..." />
            <button className="search-btn">🔍</button>
          </div>

          <div className="thread-list">
            {loading ? (
              <div className="p-4 text-center">Loading...</div>
            ) : myCourses.length === 0 ? (
              <p className="p-4 text-gray-500">No enrolled courses found.</p>
            ) : (
              myCourses.map((course) => (
                <div
                  key={course.id}
                  className={`thread-item ${selectedCourse?.id === course.id ? 'active' : ''}`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="avatar-circle">
                    <img
                      src={course.image || "https://placehold.co/100"}
                      alt="course"
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                  <div className="thread-info">
                    <h4>{course.title.substring(0, 40)}...</h4>
                    <p className="thread-snippet">
                      Instructor: {course.instructor}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className="msg-content">
          {selectedCourse ? (
            <>
              {/* Chat Header */}
              <div className="chat-header p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg">{selectedCourse.title}</h3>
                <span className="text-sm text-gray-500">Group Discussion</span>
              </div>

              {/* Messages List */}
              <div className="message-stream" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-10">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender._id === currentUser?._id;

                    return (
                      <div key={msg._id} className={`message-bubble-row ${isMe ? 'my-msg' : 'other-msg'}`}>
                        {!isMe && (
                          <img
                            src={msg.sender.photoUrl || `https://ui-avatars.com/api/?name=${msg.sender.name}`}
                            className="msg-avatar"
                            alt="sender"
                          />
                        )}
                        <div className="message-content">
                          {!isMe && <div className="sender-name text-xs text-gray-500 mb-1">{msg.sender.name}</div>}
                          <div className={`bubble ${isMe ? 'bubble-me' : 'bubble-other'}`}>
                            {msg.message}
                          </div>
                          <div className="msg-time">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="reply-box">
                <textarea
                  className="reply-input"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={sending}
                />
                <button
                  className="send-btn bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={handleSendMessage}
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="empty-state flex flex-col items-center justify-center h-full">
              <h3 className="text-xl font-semibold text-gray-700">Select a course</h3>
              <p className="text-gray-500">Choose a course from the sidebar to view discussions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;