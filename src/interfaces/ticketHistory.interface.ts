import { Document } from "mongoose";
import { UserDocument } from "./user.interface";

export interface TicketHistoryInterface {
  updatedBy: UserDocument;
  updatedField: string;
  old_value: JSON;
  new_value: JSON;
}

export interface TicketHistoryDocument extends Document, TicketHistoryInterface {}
