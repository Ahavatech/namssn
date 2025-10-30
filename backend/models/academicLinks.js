const mongoose = require('mongoose');

const academicLinksSchema = new mongoose.Schema({
  mathematics: {
    part1: { type: String, default: '' },
    part2: { type: String, default: '' },
    part3: { type: String, default: '' },
    part4: { type: String, default: '' }
  },
  statistics: {
    part1: { type: String, default: '' },
    part2: { type: String, default: '' },
    part3: { type: String, default: '' },
    part4: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('AcademicLinks', academicLinksSchema);