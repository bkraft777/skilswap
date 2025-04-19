
export type Teacher = {
  name: string;
  skills: string[];
  id?: string;
};

export type TeacherHandleClickProps = {
  teacher: Teacher;
  userId: string | undefined;
  onSuccess: (requestId: string) => void;
  onError: (message: string) => void;
};
