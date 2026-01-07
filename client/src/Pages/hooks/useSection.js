// useSection.js
import { useState } from "react";
import { generateObjectId } from "../../utils/objectId";

export default function useSections(initial = []) {
  const [sections, setSections] = useState(initial);

  function makeId(prefix = "") {
    return `${prefix}${Date.now().toString(36)}${Math.floor(
      Math.random() * 1000
    ).toString(36)}`;
  }

  function addSection() {
    setSections((prev) => [
      ...prev,
      { id: makeId("sec_"), title: "New Section", published: false, items: [] },
    ]);
  }

  function editSection(id, title) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  }

  function deleteSection(id) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  function addItem(sectionId, kind) {
    const newItem = {
      id: makeId("it_"),
      type: kind,
      title: kind === "lecture" ? "New Lecture" : "New Quiz",
      expanded: true,
      // local-only
      videoFile: null,
      documents: [],
      questions: [],
      quizId: generateObjectId(),
    };
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      )
    );
  }

  function editItem(sectionId, itemId, title) {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              items: s.items.map((i) =>
                i.id === itemId ? { ...i, title } : i
              ),
            }
      )
    );
  }

  function deleteItem(sectionId, itemId) {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, items: s.items.filter((i) => i.id !== itemId) }
      )
    );
  }

  function toggleExpand(sectionId, itemId) {
    setSections((prev) =>
      prev.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              items: s.items.map((i) =>
                i.id === itemId ? { ...i, expanded: !i.expanded } : i
              ),
            }
      )
    );
  }

  return {
    sections,
    addSection,
    editSection,
    deleteSection,
    addItem,
    editItem,
    deleteItem,
    toggleExpand,
    setSections,
  };
}
