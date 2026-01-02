const mongoose = require('mongoose');

// Document Schema
const DocumentSchema = new mongoose.Schema({
  fileUrl: String,
  fileName: String
}, { _id: false });

// 👇👇 NEW: QUIZ ANSWER SCHEMA (Matches Frontend 'answers') 👇👇
const AnswerSchema = new mongoose.Schema({
  id: String,
  text: String,          // Frontend sends 'text'
  correct: Boolean,      // Frontend sends 'correct' (true/false)
  explain: { type: String, default: "" }
}, { _id: false });

// 👇👇 NEW: QUIZ QUESTION SCHEMA (Matches Frontend 'questions') 👇👇
const QuizQuestionSchema = new mongoose.Schema({
  id: String,
  text: String,          // Frontend sends 'text', NOT 'question'
  type: { type: String, default: "mcq" },
  answers: [AnswerSchema], // Array of AnswerSchema
  hint: String,
  tags: [String],
  difficulty: String,
  media: { type: mongoose.Schema.Types.Mixed, default: null }
}, { _id: false, strict: false });
// strict: false ensures agar future me koi extra field bhejo to wo save ho jaye

const ItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  type: { type: String, required: true },
  title: String,
  videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', default: null },
  documents: [DocumentSchema],

  // 👇 CHANGE: Use the new QuizQuestionSchema array
  questions: { type: [QuizQuestionSchema], default: [] },

  quizId: { type: mongoose.Schema.Types.ObjectId, default: null }
}, { _id: false });

const SectionSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
  title: String,
  items: [ItemSchema]
}, { _id: false });

const pendingCourseSchema = new mongoose.Schema({
  learningObjectives: [String],
  requirements: [String],
  courseFor: String,
  structure: String,
  testVideo: { type: String, default: "" },
  thumbnailUrl: String,
  filmEdit: { type: String, default: "" },
  sampleVideo: { type: String, default: "" },
  captions: { type: String, default: "" },
  accessibility: { type: String, default: "" },
  landingTitle: String,
  landingSubtitle: String,
  landingDesc: String,
  price: String,
  promoCode: String,
  promoDesc: String,
  welcomeMsg: String,
  congratsMsg: String,
  curriculum: [SectionSchema],
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  isNew: { type: Boolean, default: true },
  courseType: { type: String, enum: ['course', 'practice'], default: 'course' },
  category: String,
  timeCommitment: String,
  adminMessage: String
}, { timestamps: true });

module.exports = mongoose.model('PendingCourse', pendingCourseSchema);