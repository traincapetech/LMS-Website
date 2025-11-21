import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5001/api/quizzes";

function CreateQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({}); // user answers

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await axios.get(`${API_BASE}/${id}`);
        setQuiz(res.data.quiz);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [id]);

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!quiz) return <div>Quiz not found.</div>;

  // handle selection
  const handleOptionChange = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    console.log("User answers:", answers);
    alert("Quiz submitted! (You can now send answers to backend)");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      <p className="text-gray-600 mb-6">{quiz.description}</p>

      <form onSubmit={(e) => e.preventDefault()}>
        {quiz.questions.map((q, index) => (
          <div key={q._id} className="mb-6">
            <p className="font-semibold mb-2">
              {index + 1}. {q.text}
            </p>
            <div className="space-y-1 ml-4">
              {q.options.map((opt) => (
                <label key={opt._id} className="block">
                  <input
                    type="radio"
                    name={q._id}
                    value={opt._id}
                    checked={answers[q._id] === opt._id}
                    onChange={() => handleOptionChange(q._id, opt._id)}
                    className="mr-2"
                  />
                  {opt.text}
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
}

export default CreateQuiz;
