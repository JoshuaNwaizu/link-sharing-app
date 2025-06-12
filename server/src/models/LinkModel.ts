import mongoose from 'mongoose';
import validator from 'validator';
const Schema: typeof mongoose.Schema = mongoose.Schema;

const linkSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    platform: { type: String, required: true },
    url: { type: String, required: true },
    order: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);
linkSchema.statics.findLinksDebug = async function (userId: string) {
  const links = await this.find({ user: userId }).lean();
  console.log(`Debug: Found ${links.length} links for user ${userId}`);
  return links;
};
linkSchema.pre('find', function () {
  console.log('Link find query:', this.getQuery());
});
export default mongoose.model('Link', linkSchema);
