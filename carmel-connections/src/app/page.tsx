"use client";
import { useState } from "react";
import type { Employee, Team } from "@/types";
import TeamManager from "@/components/TeamManager";
import Wheel from "@/components/Wheel";
import DualSpinner from "@/components/DualSpinner";
import WheelWithPointers from "@/components/WheelWithPointers";

export default function Page() {
  const [teams, setTeams] = useState<Team[]>([
    {
        "id": "630ceffa-fe87-43e6-8dcb-2f25b8064913",
        "name": "IT"
    },
    {
        "id": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "name": "Sales"
    }
]);
  const [employees, setEmployees] = useState<Employee[]>([
    {
        "id": "0111d695-1bad-4350-adbb-bd99368b65f3",
        "name": "Joe",
        "teamId": "630ceffa-fe87-43e6-8dcb-2f25b8064913",
        "interviewerUsed": false,
        "intervieweeUsed": false
    },
    {
        "id": "726dff84-e081-4dc6-93e0-104a6a466858",
        "name": "Brad",
        "teamId": "630ceffa-fe87-43e6-8dcb-2f25b8064913",
        "interviewerUsed": false,
        "intervieweeUsed": false
    },
    {
        "id": "8dcf52b7-3ce7-47df-9767-60a12108feac",
        "name": "Eric",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewerUsed": false,
        "intervieweeUsed": false
    },
    {
        "id": "fc0a21ee-2089-4f0b-9dd8-bc149cb22ddf",
        "name": "Katie",
        "teamId": "56c1c1df-bf3d-44da-9b1a-e1df06f700a4",
        "interviewerUsed": false,
        "intervieweeUsed": false
    }
]);
  const [selection, setSelection] = useState<{ interviewer: Employee | null; interviewee: Employee | null }>({
    interviewer: null,
    interviewee: null,
  });
  console.log("Teams:", teams)
  console.log("Employees:", employees)

  return (
    <main className="app">
      <div className="titleRow">
        <h1 className="title">Carmel Connections</h1>
      </div>
      <div className="grid">
        <TeamManager
          teams={teams}
          setTeams={setTeams}
          employees={employees}
          setEmployees={setEmployees}
        />
        <WheelWithPointers
          teams={teams}
          employees={employees}
          setEmployees={setEmployees}
          selection={selection}
          setSelection={setSelection}
        />
      </div>
    </main>
  );
}
