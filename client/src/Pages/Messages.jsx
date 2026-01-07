import React, { useState, useEffect, useRef } from 'react';
import { discussionAPI, enrollmentAPI } from '../utils/api';
import { toast } from 'sonner';

const Messages = () => {
  // State
  const [myCourses, setMyCourses] = useState([]); // Student: enrolled courses, Instructor: student conversations
  const [selectedCourse, setSelectedCourse] = useState(null); // Currently selected conversation
  const [messages, setMessages] = useState([]); // Messages for selected conversation
  const [newMessage, setNewMessage] = useState(""); // Input text
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false); // NEW: Track if user is instructor

  // Auto-scroll reference
  const messagesEndRef = useRef(null);

  // Load current user and courses/conversations on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);

        // Get current user from localStorage
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
          setIsInstructor(user.role === 'instructor'); // Set instructor flag

          // BRANCHING LOGIC: Different data for students vs instructors
          if (user.role === 'instructor') {
            // INSTRUCTOR VIEW: Get student conversations
            await loadInstructorConversations();
          } else {
            // STUDENT VIEW: Get enrolled courses
            await loadStudentCourses();
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // STUDENT: Load enrolled courses
  const loadStudentCourses = async () => {
    try {
      const coursesRes = await enrollmentAPI.getMyEnrollments();

      // Format courses with instructor ID for private messaging
      const formattedCourses = coursesRes.data.enrollments.map(item => ({
        id: item.course._id,
        title: item.course.title,
        instructor: item.course.instructor?.name || "Instructor",
        instructorId: item.course.instructor?._id, // For sending messages
        image: item.course.thumbnailUrl,
        isStudentView: true // Flag to identify student view
      }));

      setMyCourses(formattedCourses);
    } catch (error) {
      console.error("Error loading student courses:", error);
      throw error;
    }
  };

  // INSTRUCTOR: Load student conversations
  const loadInstructorConversations = async () => {
    try {
      const conversationsRes = await discussionAPI.getInstructorConversations();

      // Format conversations for display
      // Each item represents a student conversation in a course
      const formattedConversations = conversationsRes.data.conversations.map(conv => ({
        id: conv.id, // Unique ID: courseId_studentId
        title: conv.courseTitle, // Course title
        instructor: conv.studentName, // Student name (shows in subtitle)
        instructorId: conv.studentId, // Actually student ID (for sending messages)
        image: conv.courseImage || conv.studentPhoto, // Course or student image
        courseId: conv.courseId, // Actual course ID
        studentId: conv.studentId, // Student ID for fetching specific conversation
        lastMessage: conv.lastMessage,
        isInstructorView: true // Flag to identify instructor view
      }));

      setMyCourses(formattedConversations);
    } catch (error) {
      console.error("Error loading instructor conversations:", error);
      throw error;
    }
  };

  // Update last check time when user visits Messages page
  useEffect(() => {
    localStorage.setItem('lastMessageCheck', new Date().toISOString());
  }, []);

  // Fetch messages when course/conversation is selected
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchMessages = async () => {
      try {
        let res;

        if (isInstructor && selectedCourse.isInstructorView) {
          // INSTRUCTOR: Fetch conversation with specific student
          res = await discussionAPI.getStudentConversation(
            selectedCourse.courseId,
            selectedCourse.studentId
          );
        } else {
          // STUDENT: Fetch conversation with instructor
          res = await discussionAPI.getCourseMessages(selectedCourse.id);
        }

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

  }, [selectedCourse, isInstructor]);

  // Auto-scroll to bottom when new messages arrive

  // Auto-scroll to bottom when new messages arrive
  // DISABLED: Causing entire page scroll issue
  // useEffect(() => {
  //   if (selectedCourse && messages.length > 0) {
  //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages, selectedCourse]);

  // Send message handler - handles both student and instructor sending
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedCourse) return;

    // Validate recipient is available
    if (!selectedCourse.instructorId) {
      toast.error("Recipient information not available");
      return;
    }

    try {
      setSending(true);

      // Determine courseId (different for instructor vs student view)
      const courseId = selectedCourse.isInstructorView
        ? selectedCourse.courseId  // Instructor: use courseId from conversation
        : selectedCourse.id;       // Student: use course ID directly

      // Send message with recipient ID
      // For student: recipient is instructor
      // For instructor: recipient is student
      const res = await discussionAPI.sendMessage(
        courseId,
        newMessage,
        selectedCourse.instructorId  // Recipient ID
      );

      // Add new message to list immediately for instant UI update
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
    <div className="max-w-[1340px] mx-auto px-6 py-8 min-h-screen pt-28 pb-10">
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Messages</h1>
        <p className="text-gray-600">
          {isInstructor
            ? `You have ${myCourses.length} student conversation${myCourses.length !== 1 ? 's' : ''}.`
            : `You have ${myCourses.length} course discussion${myCourses.length !== 1 ? 's' : ''}.`
          }
        </p>
      </div>

      <div className="flex bg-white h-[650px] border border-gray-300 rounded-lg overflow-hidden">
        {/* SIDEBAR - List of Courses/Conversations */}
        <div className="w-96 min-w-[384px] border-r border-gray-300 flex flex-col">
          {/* Search */}
          <div className="p-3 flex gap-2 border-b border-gray-300">
            <input
              type="text"
              placeholder={isInstructor ? "Search students..." : "Search courses..."}
              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
              🔍
            </button>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : myCourses.length === 0 ? (
              <p className="p-4 text-gray-500">
                {isInstructor
                  ? "No student conversations yet."
                  : "No enrolled courses found."
                }
              </p>
            ) : (
              myCourses.map((course) => (
                <div
                  key={course.id}
                  className={`flex p-3 cursor-pointer border-b border-gray-200 transition-colors hover:bg-gray-50 ${selectedCourse?.id === course.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 mr-3">
                    <img
                      src={course.image || "https://placehold.co/100"}
                      alt="course"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-800 truncate">{course.title}</h4>
                    <p className="text-xs text-gray-500 truncate">
                      {isInstructor
                        ? `Student: ${course.instructor}` // Actually student name
                        : `Instructor: ${course.instructor}`
                      }
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MAIN CHAT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden max-w-full">
          {selectedCourse ? (
            <>
              {/* Chat Header - Shows conversation details */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-lg text-gray-800">{selectedCourse.title}</h3>
                <span className="text-sm text-gray-500">
                  {isInstructor
                    ? `Chat with ${selectedCourse.instructor}` // Student name
                    : `Private Chat with ${selectedCourse.instructor}` // Instructor name
                  }
                </span>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 bg-white flex flex-col w-full max-w-full">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-10">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.sender._id === currentUser?._id;

                    return (
                      <div
                        key={msg._id}
                        className={`flex gap-2 mb-4 max-w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isMe && (
                          <img
                            src={msg.sender.photoUrl || `https://ui-avatars.com/api/?name=${msg.sender.name}`}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            alt="sender"
                          />
                        )}
                        <div className="flex flex-col max-w-[60%]">
                          {!isMe && (
                            <div className="text-xs text-gray-500 mb-1 font-semibold">
                              {msg.sender.name}
                            </div>
                          )}
                          <div
                            className={`px-3.5 py-2.5 rounded-xl break-words max-w-full ${isMe
                              ? 'bg-blue-600 text-white self-end'
                              : 'bg-gray-100 text-gray-800 self-start'
                              } ${msg.isWelcomeMessage ? 'border-2 border-blue-200' : ''}`}
                          >
                            {msg.message}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-1">
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
              <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
                <textarea
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none min-h-[44px] max-h-[120px] focus:outline-none focus:border-blue-600"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={sending}
                  rows={1}
                />
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
                  onClick={handleSendMessage}
                  disabled={sending}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {isInstructor ? 'Select a conversation' : 'Select a course'}
              </h3>
              <p className="text-gray-500">
                {isInstructor
                  ? 'Choose a student conversation from the sidebar.'
                  : 'Choose a course from the sidebar to view discussions.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;