export interface MessageTemplateProps {
  id: string;
  message: string;
  category: MessageTemplateCategory;
}

export enum MessageTemplateCategory {
  INTERVIEW_INVITE = "INTERVIEW_INVITE",
}
