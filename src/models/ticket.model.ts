import { TicketPriority } from "@/enums";
import { model, Schema } from "mongoose";
import { TicketDocument, TicketInterface } from "@/interfaces";
import { TicketHistoryDocument, TicketHistoryInterface } from "@/interfaces/ticketHistory.interface";

const TicketHistorySchema = new Schema<TicketHistoryDocument, TicketHistoryInterface>(
  {
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedField: { type: String, required: true },
    old_value: { type: Schema.Types.Mixed, required: true },
    new_value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, versionKey: false, _id: false },
);

const TicketSchema = new Schema<TicketDocument, TicketInterface>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    priority: { type: String, enum: Object.values(TicketPriority), required: true },
    deadline: { type: Date, required: true },
    ticketHistory: { type: [{ type: TicketHistorySchema }], default: [] },
    labels: { type: [{ type: Schema.Types.ObjectId, ref: "Label", required: true }], default: [] },
    ticketStatus: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

export const TicketModel = model("Ticket", TicketSchema);
