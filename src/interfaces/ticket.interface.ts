import { TicketPriority } from "@/enums";
import { UserDocument } from "./user.interface";
import { LabelDocument } from "./label.interface";
import { TicketHistoryInterface } from "./ticketHistory.interface";
import { Document, Model } from "mongoose";

export interface TicketInterface {
  title: string;
  description: string;
  creator: UserDocument;
  assignee: UserDocument;
  priority: TicketPriority;
  deadline: Date;
  ticketHistory: TicketHistoryInterface[];
  labels: LabelDocument[];
  ticketStatus: string;
}

export interface TicketDocument extends Document, TicketInterface {}
export type TicketModelInterface = Model<TicketDocument>;
