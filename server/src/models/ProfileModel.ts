import mongoose, { Types } from 'mongoose';
import validator from 'validator';

interface ImageData {
  url: string;
  public_id: string;
}

interface IProfile {
  user: Types.ObjectId;
  firstName: string;
  lastName: string;
  email?: string; // Optional
  image?: ImageData;
}

const profileSchema = new mongoose.Schema<IProfile>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Ensures one profile per user
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
      required: false,
      validate: {
        validator: (value: string) => !value || validator.isEmail(value),
        message: 'Please provide a valid email address',
      },
      index: { unique: true, sparse: true }, // Sparse index to allow multiple undefined emails
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

profileSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default mongoose.model('Profile', profileSchema);
