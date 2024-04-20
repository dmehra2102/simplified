import { TicketStageInterface } from "@/interfaces";

export const DefaultTicketStages: TicketStageInterface[] = [
  { stageName: "To Do", stageDescription: "It is the stage where tasks await completion." },
  { stageName: "In Progress", stageDescription: "In Progress signifies the stage where tasks are actively being worked on." },
  {
    stageName: "Hold",
    stageDescription:
      "Hold indicates a pause or delay in the progress of a task or project, suggesting a temporary halt or suspension until further action or clarification is taken",
  },
  {
    stageName: "Peer Review",
    stageDescription:
      "Peer Review is the stage where work undergoes evaluation by colleagues or experts in the field, ensuring quality, accuracy, and adherence to standards before finalization.",
  },
  {
    stageName: "Ready For QA",
    stageDescription:
      "Ready For QA signifies that the work has completed internal checks and is now prepared for quality assurance testing, ensuring it meets specified requirements and standards before final release.",
  },
  {
    stageName: "Hot Fix",
    stageDescription:
      "Hot Fix refers to an urgent update or patch applied to software or systems to address critical issues or bugs, typically deployed outside of the regular release schedule to resolve immediate problems",
  },
  {
    stageName: "Deployed",
    stageDescription:
      "Deployed indicates that the software, application, or system update has been successfully released and made available for use by the intended audience or users.",
  },
];
