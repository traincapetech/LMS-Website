// components/UploadLecture/initialData.js
import { makeId } from "../utils/makeId";

const initialData = [
  {
    id: makeId("section"),
    title: "Section 1: Introduction",
    published: true,
    items: [
      {
        id: makeId("lec"),
        type: "lecture",
        title: "Lecture 1",
        expanded: false,
        contents: [],
      },
      {
        id: makeId("quiz"),
        type: "quiz",
        title: "Quiz 1",
        expanded: false,
        questions: [],
      },
    ],
  },
];

export default initialData;
