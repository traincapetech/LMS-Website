const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  fileUrl: String,
  fileName: String
}, { _id: false });

const ItemSchema = new mongoose.Schema({
  type: String,
  title: String,
  videoUrl: String,
  documents: [DocumentSchema],
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" }
}, { _id: false });

const SectionSchema = new mongoose.Schema({
  sectionTitle: String,
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

  instructor: { type: mongoose.Schema.Types.Mixed, required: true },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  adminMessage: String
}, { timestamps: true });

module.exports = mongoose.model('PendingCourse', pendingCourseSchema);
//691d7acd9e2c2837e2494ffd