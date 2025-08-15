"use client";
import { useState } from "react";
import type { Employee, Team } from "@/types";
import TeamManager from "@/components/TeamManager";
import Wheel from "@/components/Wheel";
import DualSpinner from "@/components/DualSpinner";
import WheelWithPointers from "@/components/WheelWithPointers";

export default function Page() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selection, setSelection] = useState<{ interviewer: Employee | null; interviewee: Employee | null }>({
    interviewer: null,
    interviewee: null,
  });

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
