export type Team = { id: string; name: string; };

export type Employee = {
  id: string;
  name: string;
  teamId: string;
  interviewer: boolean;
  intervieweeUsed: boolean;
};
