export type Team = { id: string; name: string; };

export type Employee = {
  id: string;
  name: string;
  teamId: string;
  interviewerUsed: boolean;
  intervieweeUsed: boolean;
};
