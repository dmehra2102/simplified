import { Document } from "mongoose";

export interface TicketStageInterface {
  stageName: string;
  stageDescription?: string;
  // maxTicketHoldCount?: number;
}

export interface TicketStageDocument extends TicketStageInterface, Document {}

export type CreateTicketStageInput = {
  stageName: string;
  stageDescription?: string;
  // maxTicketHoldCount?: number;
};
