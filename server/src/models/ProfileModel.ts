import mongoose from 'mongoose';
import validator, { trim } from 'validator';
const Schema: typeof mongoose.Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    //   user: { type: Sche  ma.Types.ObjectId, ref: 'User', required: true },
    image: {
      url: {
        type: String,
        required: true,
      },
    },

    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxLength: [50, 'First name must not exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxLength: [50, 'Last name must not exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      validate: validator.isEmail,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// Add index for better query performance
profileSchema.index({ user: 1 });

// Add a virtual property for fullName
profileSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
export default mongoose.model('Profile', profileSchema);
