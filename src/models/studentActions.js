var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StudentActionsSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    index:true,
    required: true
  },
  actionType: {
    type: String,
    enum: ['checkin', 'checkout'],
    required: true
  },
  timeStamp: {
    type: Date,
    default: Date.now,
    required: true
  }
})

StudentActionsSchema.virtual('guardians', {
  ref: 'Student',
  localField: 'studentId',
  foreignField: '_id'
})

module.exports = mongoose.model('StudentActions', StudentActionsSchema )