import { Document } from 'mongoose';

export class Player extends Document {
  phoneNumber: string;
  email: string;
  name: string;
  ranking: string;
  rankingPosition: number;
  imageUrl: string;
}
