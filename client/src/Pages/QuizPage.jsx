// import axios from "axios";
// import { useEffect, useState } from "react";

// const API_BASE = "http://localhost:5001/api/quizzes";

// function QuizPage() {
//   const [quizzes, setQuizzes] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchAllQuizzes() {
//       try {
//         const res = await axios.get(API_BASE);
//         // backend returns { success, total, quizzes: [...] }
//         setQuizzes(res.data.quizzes || []);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         const serverMsg = err.response?.data?.message || err.message;
//         setError(serverMsg);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchAllQuizzes();
//   }, []);

//   if (loading) return <div>Loading quizzes...</div>;
//   if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
//   if (!quizzes.length) return <div>No quizzes found.</div>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Available Quizzes</h1>

//       {quizzes.map((quiz) => (
//         <div
//           key={quiz._id}
//           style={{
//             border: "1px solid #ccc",
//             borderRadius: "8px",
//             padding: "16px",
//             marginBottom: "20px",
//           }}
//         >
//           <h2>{quiz.title}</h2>
//           <p>{quiz.description}</p>
//           <p>
//             <strong>Time Limit:</strong> {quiz.timeLimit || "N/A"} mins
//           </p>
//           <p>
//             <strong>Total Score:</strong> {quiz.totalScore}
//           </p>

//           {/* Show questions */}
//           {quiz.questions && quiz.questions.length > 0 ? (
//             <div style={{ marginTop: "10px" }}>
//               <h3>Questions:</h3>
//               <ol>
//                 {quiz.questions.map((q) => (
//                   <li key={q._id} style={{ marginBottom: "15px" }}>
//                     <p>
//                       <strong>Q:</strong> {q.text} ({q.marks} marks)
//                     </p>

//                     {/* Show options */}
//                     {q.options && q.options.length > 0 ? (
//                       <ul style={{ marginLeft: "20px" }}>
//                         {q.options.map((opt) => (
//                           <li key={opt._id}>
//                             {opt.text}
//                             {opt.isCorrect && (
//                               <span style={{ color: "green", marginLeft: "5px" }}>
//                                 <input type="checkbox"  />
//                               </span>
//                             )}
//                           </li>
//                         ))}
//                       </ul>
//                     ) : (
//                       <p style={{ color: "gray" }}>No options available</p>
//                     )}
//                   </li>
//                 ))}
//               </ol>
//             </div>
//           ) : (
//             <p style={{ color: "gray" }}>No questions added yet.</p>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// export default QuizPage;

// components/UploadLecture/Quiz/QuizPage.jsx
<<<<<<< HEAD
import { Button } from "@/components/ui/button";
import React, { useRef } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function QuizPage({ sectionId, itemId, questions, quiz }) {
=======
import React, { useRef } from "react";

export default function QuizPage({
  sectionId,
  itemId,
  questions,
  quiz,
}) {
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
  const imageInput = useRef({});

  return (
    <div className="quiz-page">
<<<<<<< HEAD
      {questions.map((q, idx) => (
        <div key={q.id} className="quiz-question">
          <div className="flex items-center justify-between pb-3">
            <strong>Q{idx + 1}</strong>

            <div className="quiz-q-actions">
              <Button
                variant="outline"
                onClick={() => quiz.deleteQuestion(sectionId, itemId, q.id)}
              >
                <MdDeleteOutline className="size-5 text-red-500" />
              </Button>
=======

      {questions.map((q, idx) => (
        <div key={q.id} className="quiz-question">

          <div className="quiz-header">
            <strong>Q{idx + 1}</strong>

            <div className="quiz-q-actions">
              <button onClick={() => quiz.deleteQuestion(sectionId, itemId, q.id)}>Delete</button>
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
            </div>
          </div>

          {/* QUESTION TEXT */}
<<<<<<< HEAD
          <Textarea
=======
          <textarea
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
            className="quiz-textarea"
            placeholder="Write your question..."
            value={q.text}
            onChange={(e) =>
<<<<<<< HEAD
              quiz.updateQuestion(sectionId, itemId, q.id, {
                ...q,
                text: e.target.value,
              })
=======
              quiz.updateQuestion(sectionId, itemId, q.id, { ...q, text: e.target.value })
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
            }
          />

          {/* TYPE + DIFFICULTY */}
<<<<<<< HEAD
          <div className="flex items-center gap-5">
            <div className="flex items-center py-5 gap-5">
              <Label>Type:</Label>
              {/* <select
                value={q.type}
                onChange={(e) =>
                  quiz.updateQuestion(sectionId, itemId, q.id, {
                    ...q,
                    type: e.target.value,
                  })
=======
          <div className="quiz-row">
            <div>
              <label>Type:</label>
              <select
                value={q.type}
                onChange={(e) =>
                  quiz.updateQuestion(sectionId, itemId, q.id, { ...q, type: e.target.value })
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
                }
              >
                <option value="mcq">MCQ (single correct)</option>
                <option value="multi">Multi select</option>
                <option value="tf">True/False</option>
<<<<<<< HEAD
              </select> */}

              <Select
                value={q.type}
                onValueChange={(val) =>
                  quiz.updateQuestion(sectionId, itemId, q.id, {
                    ...q,
                    type: val,
                  })
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Question Types</SelectLabel>
                    <SelectItem value="mcq">MCQ (single correct)</SelectItem>
                    <SelectItem value="multi">Multi select</SelectItem>
                    <SelectItem value="tf">True/False</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-5">
              <Label>Difficulty:</Label>
              <Select
                value={q.difficulty}
                onValueChange={(val) =>
                  quiz.updateQuestion(sectionId, itemId, q.id, {
                    ...q,
                    difficulty: val,
                  })
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Select a Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Difficulty</SelectLabel>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
=======
              </select>
            </div>

            <div>
              <label>Difficulty:</label>
              <select
                value={q.difficulty}
                onChange={(e) =>
                  quiz.updateQuestion(sectionId, itemId, q.id, { ...q, difficulty: e.target.value })
                }
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
            </div>
          </div>

          {/* ANSWERS */}
<<<<<<< HEAD
          <div className="quiz-answers mt-5">
            <Label>Answers:</Label>
            <div className="grid grid-cols-2 gap-5 py-5">
              {q.answers.map((ans) => (
                <div key={ans.id} className="flex items-center">
                  <input
                    className="mr-3"
                    type={q.type === "multi" ? "checkbox" : "radio"}
                    name={`correct-${q.id}`}
                    checked={ans.correct}
                    onChange={() => {
                      const updatedAnswers =
                        q.type === "multi"
                          ? q.answers.map((a) =>
                              a.id === ans.id
                                ? { ...a, correct: !a.correct }
                                : a
                            )
                          : q.answers.map((a) => ({
                              ...a,
                              correct: a.id === ans.id,
                            }));

                      quiz.updateQuestion(sectionId, itemId, q.id, {
                        ...q,
                        answers: updatedAnswers,
                      });
                    }}
                  />
                  <Input
                    type="text"
                    className=""
                    placeholder="Answer text"
                    value={ans.text}
                    onChange={(e) => {
                      const updated = q.answers.map((a) =>
                        a.id === ans.id ? { ...a, text: e.target.value } : a
                      );
                      quiz.updateQuestion(sectionId, itemId, q.id, {
                        ...q,
                        answers: updated,
                      });
                    }}
                  />
                  <button
                    className="delete-btn ml-3"
                    onClick={() => {
                      const updated = q.answers.filter((a) => a.id !== ans.id);
                      quiz.updateQuestion(sectionId, itemId, q.id, {
                        ...q,
                        answers: updated,
                      });
                    }}
                  >
                    ✕
                  </button>{" "}
                </div>
              ))}
            </div>
            <div className="w-full flex justify-end">
              <Button
                className="bg-Accent hover:bg-Accent/80"
                onClick={() => {
                  const newAns = {
                    id: Math.random().toString(36),
                    text: "",
                    correct: false,
                    explain: "",
                  };
                  quiz.updateQuestion(sectionId, itemId, q.id, {
                    ...q,
                    answers: [...q.answers, newAns],
                  });
                }}
              >
                + Add Answer
              </Button>
            </div>
          </div>

          {/* MEDIA UPLOAD */}
          <div className="flex items-center gap-3 my-5">
            <Label>Attach Image:</Label>

            <Input
=======
          <div className="quiz-answers">
            <label>Answers:</label>

            {q.answers.map((ans) => (
              <div key={ans.id} className="quiz-answer-row">
                <input
                  type={q.type === "multi" ? "checkbox" : "radio"}
                  name={`correct-${q.id}`}
                  checked={ans.correct}
                  onChange={() => {
                    const updatedAnswers =
                      q.type === "multi"
                        ? q.answers.map((a) =>
                            a.id === ans.id ? { ...a, correct: !a.correct } : a
                          )
                        : q.answers.map((a) => ({ ...a, correct: a.id === ans.id }));

                    quiz.updateQuestion(sectionId, itemId, q.id, {
                      ...q,
                      answers: updatedAnswers,
                    });
                  }}
                />

                <input
                  type="text"
                  className="answer-input"
                  placeholder="Answer text"
                  value={ans.text}
                  onChange={(e) => {
                    const updated = q.answers.map((a) =>
                      a.id === ans.id ? { ...a, text: e.target.value } : a
                    );
                    quiz.updateQuestion(sectionId, itemId, q.id, { ...q, answers: updated });
                  }}
                />

                <button
                  className="delete-btn"
                  onClick={() => {
                    const updated = q.answers.filter((a) => a.id !== ans.id);
                    quiz.updateQuestion(sectionId, itemId, q.id, { ...q, answers: updated });
                  }}
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              className="cb-btn small"
              onClick={() => {
                const newAns = {
                  id: Math.random().toString(36),
                  text: "",
                  correct: false,
                  explain: "",
                };
                quiz.updateQuestion(sectionId, itemId, q.id, {
                  ...q,
                  answers: [...q.answers, newAns],
                });
              }}
            >
              + Add Answer
            </button>
          </div>

          {/* MEDIA UPLOAD */}
          <div className="quiz-media">
            <label>Attach Image:</label>

            <input
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
              ref={(el) => (imageInput.current[q.id] = el)}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                quiz.updateQuestion(sectionId, itemId, q.id, {
                  ...q,
                  media: { filename: file.name, file },
                });
              }}
            />

<<<<<<< HEAD
            <Button
              className="bg-Accent hover:bg-Accent/80"
              onClick={() => imageInput.current[q.id]?.click()}
            >
              Upload Image
            </Button>
=======
            <button
              className="cb-btn"
              onClick={() => imageInput.current[q.id]?.click()}
            >
              Upload Image
            </button>
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02

            {q.media && <span className="media-name">{q.media.filename}</span>}
          </div>

          {/* HINT */}
<<<<<<< HEAD
          <div className="flex items-center gap-2 my-5">
            <Label>Hint:</Label>
            <Input
=======
          <div className="quiz-hint">
            <label>Hint:</label>
            <input
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
              type="text"
              value={q.hint}
              onChange={(e) =>
                quiz.updateQuestion(sectionId, itemId, q.id, {
                  ...q,
                  hint: e.target.value,
                })
              }
            />
          </div>

          {/* TAGS */}
<<<<<<< HEAD
          <div className="flex items-center gap-2 my-5">
            <Label>Tags:</Label>
            <Input
=======
          <div className="quiz-tags">
            <label>Tags:</label>
            <input
>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
              type="text"
              value={q.tags.join(", ")}
              placeholder="comma separated"
              onChange={(e) =>
                quiz.updateQuestion(sectionId, itemId, q.id, {
                  ...q,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
<<<<<<< HEAD
        </div>
      ))}

      <Button
        className="bg-Accent hover:bg-Accent/80"
        onClick={() => quiz.addQuestion(sectionId, itemId)}
      >
        + Add Question
      </Button>
=======

        </div>
      ))}

      <button className="cb-btn" onClick={() => quiz.addQuestion(sectionId, itemId)}>
        + Add Question
      </button>

>>>>>>> 878743f15c374e032c7f7a0450837315d3cedf02
    </div>
  );
}
