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

export default function TeamViewer({ teams, setTeams, employees, setEmployees }: Props) {


  return (
    <div> {/* List teams */}
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
            </div>
            );
          })}
          {teams.length === 0 && (
            <p className="label">Create a team to start adding employees.</p>
          )}
        </div>
    </div>
  )
}