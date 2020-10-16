var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AddressSchema = new Schema ({
  street: String,
  city: String,
  state: String,
  zipcode: String
}, {_id: false})

var StudentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'non-active']
  }, 
  address: AddressSchema,
}, {
  strict: false,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v
    } 
  }}) 



 StudentSchema.virtual('guardians', {
   ref: 'GuardianStudent',
   localField: '_id',
   foreignField: 'student'
 })


module.exports=mongoose.model('Student', StudentSchema);
