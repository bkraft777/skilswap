
export interface TeacherNotification {
  id: string;
  teacher_id: string;
  message: string;
  request_id: string;
  status: string;
  created_at: string;
}

export interface HelpRequest {
  id: string;
  learner_id: string;
  skill_category: string;
  specific_need: string;
  status: string;
  created_at: string;
}

export interface TeacherConnection {
  id: string;
  teacher_id: string;
  request_id: string;
  status: string;
  created_at: string;
}
