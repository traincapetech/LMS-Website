import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5001/api/quizzes";

function QuizPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllQuizzes() {
      try {
        const res = await axios.get(API_BASE);
        // backend returns { success, total, quizzes: [...] }
        setQuizzes(res.data.quizzes || []);
      } catch (err) {
        console.error("Fetch error:", err);
        const serverMsg = err.response?.data?.message || err.message;
        setError(serverMsg);
      } finally {
        setLoading(false);
      }
    }

    fetchAllQuizzes();
  }, []);

  if (loading) return <div>Loading quizzes...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!quizzes.length) return <div>No quizzes found.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Quizzes</h1>

      {quizzes.map((quiz) => (
        <div
          key={quiz._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "20px",
          }}
        >
          <h2>{quiz.title}</h2>
          <p>{quiz.description}</p>
          <p>
            <strong>Time Limit:</strong> {quiz.timeLimit || "N/A"} mins
          </p>
          <p>
            <strong>Total Score:</strong> {quiz.totalScore}
          </p>

          {/* Show questions */}
          {quiz.questions && quiz.questions.length > 0 ? (
            <div style={{ marginTop: "10px" }}>
              <h3>Questions:</h3>
              <ol>
                {quiz.questions.map((q) => (
                  <li key={q._id} style={{ marginBottom: "15px" }}>
                    <p>
                      <strong>Q:</strong> {q.text} ({q.marks} marks)
                    </p>

                    {/* Show options */}
                    {q.options && q.options.length > 0 ? (
                      <ul style={{ marginLeft: "20px" }}>
                        {q.options.map((opt) => (
                          <li key={opt._id}>
                            {opt.text}
                            {opt.isCorrect && (
                              <span style={{ color: "green", marginLeft: "5px" }}>
                                <input type="checkbox"  />
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: "gray" }}>No options available</p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p style={{ color: "gray" }}>No questions added yet.</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default QuizPage;
