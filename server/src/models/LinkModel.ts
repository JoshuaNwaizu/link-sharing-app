import mongoose from 'mongoose';
import validator from 'validator';
const Schema: typeof mongoose.Schema = mongoose.Schema;

const linkSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  platform: { type: String, required: true },
  url: { type: String, required: true },
  order: { type: Number, required: true },
});

export default mongoose.model('Link', linkSchema);
