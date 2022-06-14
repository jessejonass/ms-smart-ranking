import { Document } from 'mongoose';
import { Player } from 'src/players/entities/Player';
import { Event } from 'src/types/Event';

export class Category extends Document {
  readonly category: string;
  description: string;
  events: Event[];
  players: Player[];
}
