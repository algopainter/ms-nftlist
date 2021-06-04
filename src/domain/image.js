import Mongoose from 'mongoose';

export const ImageSchema = Mongoose.Schema({
  artist: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    twitter: {
      type: String,
    },
    github: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  isRecovered:{
    type: Boolean,
    required: true,
  },
  supplyIndex: {
    type: Number,
    required: true,
  },
  contractAddress: {
    type: String,
    required: true,
  },
  mintedBy: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  previewImage: {
    type: String,
    required: true,
  },
  rawImage: {
    type: String,
    required: true,
  },
  initialPrice: {
    amount: {
      type: Number,
      required: true,
    },
    tokenSymbol: {
      type: String,
      required: true,
    },
    tokenAddress: {
      type: String,
      required: true,
    },
  },
  parameters: {
    type: Object,
  },
});

export const ImageSet = Mongoose.model('images', ImageSchema);
