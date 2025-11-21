// components/UploadLecture/hooks/useSections.js
import { useState } from "react";
import { makeId } from "../../utils/makeId";

export default function useSections(initial) {
  const [sections, setSections] = useState(initial);

  function addSection() {
    setSections((prev) => [
      ...prev,
      { id: makeId("section"), title: "New Section", published: false, items: [] },
    ]);
  }

  function editSection(id, title) {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)));
  }

  function deleteSection(id) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleSectionPublish(id) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, published: !s.published } : s))
    );
  }

  function addItem(sectionId, kind) {
    const newItem = {
      id: makeId(kind),
      type: kind,
      title: kind === "lecture" ? "New Lecture" : "New Quiz",
      expanded: false,
      contents: [],
      questions: [],
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
    toggleSectionPublish,
    addItem,
    editItem,
    deleteItem,
    toggleExpand,
    setSections,
  };
}
