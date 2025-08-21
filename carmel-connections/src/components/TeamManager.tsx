"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./TeamManager.module.css";
import type { Team, Employee } from "@/types";

type Props = {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
};

export default function TeamManager({ teams, setTeams, employees, setEmployees }: Props) {
  const [teamName, setTeamName] = useState("");
  const [employeeInputs, setEmployeeInputs] = useState<Record<string, string>>({});

  const addTeam = () => {
    const name = teamName.trim();
    if (!name) return;
    setTeams((t) => [...t, { id: uuidv4(), name }]);
    setTeamName("");
  };

  const handleTeamKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTeam();
  };

  const addEmployeeToTeam = (teamId: string) => {
    const name = (employeeInputs[teamId] || "").trim();
    if (!name) return;
    setEmployees((e) => [
      ...e,
      {
        id: uuidv4(),
        name,
        teamId,
        interviewerUsed: false,
        intervieweeUsed: false,
      },
    ]);
    setEmployeeInputs((m) => ({ ...m, [teamId]: "" }));
  };

  const handleEmployeeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, teamId: string) => {
    if (e.key === "Enter") addEmployeeToTeam(teamId);
  };
  const handleClearSelections = () => {
    setEmployees((e) => 
      e.map((emp) => {
        return {
          id: emp.id,
          name: emp.name,
          teamId: emp.teamId,
          interviewerUsed: false,
          intervieweeUsed: false,
       }
      }),
    );
  }

  return (
    <div className="card">
      <div className="titleRow">
        <h2>Manage Teams</h2>
      </div>

      <div className={styles.container}>
        {/* Add team */}
        <div className={styles.row}>
          <input
            className="input"
            placeholder="New team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            onKeyDown={handleTeamKeyDown}
          />
          <button className="btn" onClick={addTeam}>
            Add Team
          </button>
        </div>

        <div className="hr" />

        {/* List teams */}
        <div className={styles.teamGrid}>
          {teams.map((team) => {
            const teamMembers = employees.filter((e) => e.teamId === team.id);
            return (
              <div key={team.id} className={styles.teamCard}>
                <div className={styles.teamHeader}>
                  <h3>{team.name}</h3>
                  <span className="label">{teamMembers.length} member(s)</span>
                </div>

                {teamMembers.length > 0 && (
                  <table>
                    <tbody>
                    {teamMembers.map((m) => (
                          <tr key={m.id}>
                            <td>
                              {m.name}
                            </td>
                            <td>
                              {m.intervieweeUsed? "🔴" : "\t"}
                            </td>
                            <td>
                              {m.interviewerUsed? "🔵": "\t"}
                            </td>
                          </tr>
                    ))}
                    </tbody>
                  </table>
                )}

                {/* Add employee */}
                <div className={styles.addRow}>
                  <input
                    className="input"
                    placeholder={`Add employee to ${team.name}`}
                    value={employeeInputs[team.id] || ""}
                    onChange={(e) =>
                      setEmployeeInputs((map) => ({ ...map, [team.id]: e.target.value }))
                    }
                    onKeyDown={(e) => handleEmployeeKeyDown(e, team.id)}
                  />
                  <button className="btn secondary" onClick={() => addEmployeeToTeam(team.id)}>
                    Add Employee
                  </button>
                </div>
              </div>
            );
          })}
          {teams.length === 0 && (
            <p className="label">Create a team to start adding employees.</p>
          )}
          <div>
            <button className="btn secondary" onClick={() => handleClearSelections()}>
                    Clear Selections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
