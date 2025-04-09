import mongoose, { Document, Schema } from 'mongoose';

// Interface for Decal document
export interface IDecal extends Document {
  name: string;
  prompt: string;
  colors: string[];
  userId: string;
  imageUrl: string;
  previewUrl: string;
  downloadUrl: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Decal
const DecalSchema: Schema = new Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  colors: [{ type: String }],
  userId: { type: String, required: true },
  imageUrl: { type: String },
  previewUrl: { type: String },
  downloadUrl: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

// Create and export the model
export default mongoose.model<IDecal>('Decal', DecalSchema);
