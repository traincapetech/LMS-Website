// components/UploadLecture/hooks/useQuiz.js
import { makeId } from "../../utils/makeId";

export default function useQuiz(setSections) {
  function addQuestion(sectionId, itemId) {
    const q = {
      id: makeId("q"),
      text: "",
      type: "mcq",
      answers: [
        { id: makeId("ans"), text: "", explain: "", correct: false },
        { id: makeId("ans"), text: "", explain: "", correct: false },
      ],
      hint: "",
      tags: [],
      difficulty: "medium",
      media: null,
    };

    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              items: s.items.map((i) =>
                i.id !== itemId ? i : { ...i, expanded: true, questions: [...i.questions, q] }
              ),
            }
      )
    );
  }

  function updateQuestion(sectionId, itemId, questionId, updated) {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              items: s.items.map((i) =>
                i.id !== itemId
                  ? i
                  : {
                      ...i,
                      questions: i.questions.map((q) =>
                        q.id === questionId ? updated : q
                      ),
                    }
              ),
            }
      )
    );
  }

  function deleteQuestion(sectionId, itemId, questionId) {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              items: s.items.map((i) =>
                i.id !== itemId
                  ? i
                  : { ...i, questions: i.questions.filter((q) => q.id !== questionId) }
              ),
            }
      )
    );
  }

  return {
    addQuestion,
    updateQuestion,
    deleteQuestion,
  };
}
