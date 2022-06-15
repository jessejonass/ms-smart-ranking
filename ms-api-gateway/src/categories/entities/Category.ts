import { Event } from './Event';

export type Category = {
  _id: string;
  category: string;
  description: string;
  events: Event[];
};
