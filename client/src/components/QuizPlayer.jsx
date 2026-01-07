import React, { useState } from "react";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaArrowRight,
    FaRedo,
} from "react-icons/fa";
import { toast } from "sonner";
import { progressAPI } from "@/utils/api";

import { Button } from "@/components/ui/button";

const QuizPlayer = ({ quiz, courseId, onComplete }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: answerId } or { questionId: [answerIds] }
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const questions = quiz.question || quiz.questions || quiz.quizQuestions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    console.log("mohit_data-quiz", quiz);

    // Helper to check if an option is selected
    const isSelected = (qId, ansId) => {
        const selected = selectedAnswers[qId];
        if (Array.isArray(selected)) {
            return selected.includes(ansId);
        }
        return selected === ansId;
    };

    const handleOptionClick = (qId, ansId, type) => {
        if (isSubmitted) return;

        setSelectedAnswers((prev) => {
            if (type === "multi") {
                const current = prev[qId] || [];
                const newSelection = current.includes(ansId)
                    ? current.filter((id) => id !== ansId)
                    : [...current, ansId];
                return { ...prev, [qId]: newSelection };
            }
            return { ...prev, [qId]: ansId };
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = async () => {
        setIsSubmitted(true);
        let calculatedScore = 0;

        // Simple scoring logic based on client-side data (assuming 'correct' flag exists)
        // For a more secure app, this should be calculated on the backend.
        questions.forEach((q) => {
            const selected = selectedAnswers[q.id || q._id];

            if (!selected) return;

            if (q.type === "multi") {
                // For multi-select, check if all correct answers are selected and no wrong ones
                const correctIds = q.answers.filter((a) => a.correct).map((a) => a.id);
                const selectedIds = selected;

                const allCorrectSelected = correctIds.every((id) =>
                    selectedIds.includes(id)
                );
                const noWrongSelected = selectedIds.every((id) =>
                    correctIds.includes(id)
                );

                if (allCorrectSelected && noWrongSelected) {
                    calculatedScore += 1;
                }
            } else {
                // Single choice
                const correctAns = q.answers.find((a) => a.correct);
                if (correctAns && correctAns.id === selected) {
                    calculatedScore += 1;
                }
            }
        });

        setScore(calculatedScore);
        setShowResult(true);

        // Call API to mark complete
        try {
            if (courseId) {
                await progressAPI.markQuizComplete({
                    courseId,
                    quizId: quiz._id || quiz.quizId,
                    itemId: quiz.itemId || quiz._id,
                    score: calculatedScore,
                    total: totalQuestions,
                });
                toast.success("Quiz completed!");
            }

            if (onComplete) onComplete(calculatedScore);
        } catch (error) {
            console.error("Failed to save progress", error);
        }
    };

    const restartQuiz = () => {
        setSelectedAnswers({});
        setIsSubmitted(false);
        setShowResult(false);
        setScore(0);
        setCurrentQuestionIndex(0);
    };

    if (!questions.length) {
        return (
            <div style={{ padding: "40px", textAlign: "center", color: "#fff" }}>
                <h3>No questions in this quiz.</h3>
            </div>
        );
    }

    if (showResult) {
        const percentage = Math.round((score / totalQuestions) * 100);
        const passed = percentage >= 70; // Arbitrary pass mark

        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#fff",
                    background: "linear-gradient(145deg, #1e1e2e, #2d2d44)",
                    borderRadius: "16px",
                    maxWidth: "600px",
                    margin: "40px auto",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
            >
                <div style={{ fontSize: "60px", marginBottom: "20px" }}>
                    {passed ? "🎉" : "📚"}
                </div>
                <h2
                    style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "10px" }}
                >
                    {passed ? "Quiz Passed!" : "Needs Improvement"}
                </h2>
                <p style={{ fontSize: "18px", color: "#a1a1aa", marginBottom: "30px" }}>
                    You scored{" "}
                    <span
                        style={{
                            color: passed ? "#4ade80" : "#f87171",
                            fontWeight: "bold",
                        }}
                    >
                        {percentage}%
                    </span>
                    ({score} out of {totalQuestions} correct)
                </p>

                <button
                    onClick={restartQuiz}
                    style={{
                        padding: "12px 24px",
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#fff",
                        backgroundColor: "#7e22ce",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        transition: "transform 0.2s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                    <FaRedo /> Retry Quiz
                </button>
            </div>
        );
    }

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#181821", // Dark background to match video player
                color: "#fff",
                overflowY: "auto",
            }}
        >
            {/* Quiz Header */}
            <div style={{ padding: "20px", borderBottom: "1px solid #333" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "600" }}>{quiz.title}</h2>
                <span style={{ fontSize: "14px", color: "#a1a1aa" }}>
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                {/* Progress bar */}
                <div
                    style={{
                        width: "100%",
                        height: "4px",
                        backgroundColor: "#333",
                        borderRadius: "2px",
                        marginTop: "10px",
                    }}
                >
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                            width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                            height: "100%",
                            borderRadius: "2px",
                            transition: "width 0.3s ease",
                        }}
                    />
                </div>
            </div>

            {/* Question Area */}
            <div
                style={{
                    flex: 1,
                    padding: "30px",
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "800px",
                    margin: "0 auto",
                    width: "100%",
                }}
            >
                <h3
                    style={{ fontSize: "18px", marginBottom: "24px", lineHeight: "1.5" }}
                >
                    {currentQuestion.question}
                </h3>

                {/* Start Image displaying  */}
                {currentQuestion.image && (
                    <div style={{ marginBottom: "20px" }}>
                        <img
                            src={currentQuestion.image}
                            alt="Question"
                            style={{
                                maxWidth: "100%",
                                maxHeight: "300px",
                                borderRadius: "8px",
                            }}
                        />
                    </div>
                )}
                {/* End Image displaying  */}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {currentQuestion.answers.map((ans) => {
                        const selected = isSelected(
                            currentQuestion.id || currentQuestion._id,
                            ans.id
                        );
                        return (
                            <div
                                key={ans.id}
                                onClick={() =>
                                    handleOptionClick(
                                        currentQuestion.id || currentQuestion._id,
                                        ans.id,
                                        currentQuestion.type
                                    )
                                }
                                style={{
                                    padding: "16px",
                                    borderRadius: "8px",
                                    border: `2px solid ${selected ? "#7e22ce" : "#333"}`,
                                    backgroundColor: selected
                                        ? "rgba(126, 34, 206, 0.1)"
                                        : "#272732",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    transition: "all 0.2s ease",
                                }}
                            >
                                <div
                                    style={{
                                        width: "20px",
                                        height: "20px",
                                        borderRadius:
                                            currentQuestion.type === "multi" ? "4px" : "50%",
                                        border: `2px solid ${selected ? "#7e22ce" : "#666"}`,
                                        marginRight: "16px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: selected ? "#7e22ce" : "transparent",
                                    }}
                                >
                                    {selected && (
                                        <span style={{ color: "white", fontSize: "12px" }}>✓</span>
                                    )}
                                </div>
                                <span style={{ fontSize: "16px" }}>{ans.text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer / Controls */}
            <div
                style={{
                    padding: "20px",
                    borderTop: "1px solid #333",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <button
                    onClick={() =>
                        setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentQuestionIndex === 0}
                    style={{
                        background: "transparent",
                        color: currentQuestionIndex === 0 ? "#555" : "#a1a1aa",
                        border: "none",
                        cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
                        padding: "10px 20px",
                    }}
                >
                    Previous
                </button>

                <Button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-600/80"
                >
                    {currentQuestionIndex === totalQuestions - 1 ? "Submit Quiz" : "Next"}{" "}
                    <FaArrowRight size={14} />
                </Button>
            </div>
        </div>
    );
};

export default QuizPlayer;
