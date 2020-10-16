var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var GuardianStudentSchema = new Schema({
  relationshipType: {
    type: String,
    required: true,
    enum: ['parent', 'pickup'],
  },
  student: { type: Schema.Types.ObjectId, ref: 'Student', required: true},
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true} 
 })

 module.exports = mongoose.model('GuardianStudent', GuardianStudentSchema)