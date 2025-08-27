"use client";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styles from "./TeamManager.module.css";
import type { Team, Employee } from "@/types";

type Props = {
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  setSelection: React.Dispatch<
    React.SetStateAction<{ interviewer: Employee | null; interviewee: Employee | null }>
  >;
};

export default function TeamManager({ teams, setTeams, employees, setEmployees, setSelection }: Props) {
  const [teamName, setTeamName] = useState("");
  const [employeeInputs, setEmployeeInputs] = useState<Record<string, string>>({});
  const [selectedEmployee, setSelectedEmployee] = useState<string|null>()

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
        interviewer: false,
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
          interviewer: false,
          intervieweeUsed: false,
       }
      }),
    );
  }
  const handleToggleInterviewerUsed = (id: string) => {
    let selectedInterviewer: Employee | null = null;
    console.log("Selected interviewer:", selectedInterviewer);
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          // toggle selected employee
          const updated = { ...emp, interviewer: true };
          selectedInterviewer = updated;
          return updated;
        }
        // unset interviewer for everyone else
        return { ...emp, interviewer: false };
      })
    );

    // update selection after state changes
    const selected = employees.find((emp) => emp.id === id) ?? null;
    if (selected) {
      setSelection((prev) => ({ ...prev, interviewer: selected }));
    }
    console.log("Selected interviewer:", selectedInterviewer);
  };

  const handleToggleIntervieweeUsed = (id:string) => {
    setEmployees((e) =>
      e.map((emp) => {
        if (emp.id === id){
          return {
            ...emp,
            intervieweeUsed: !emp.intervieweeUsed,
          };
        }
        return emp;
      }),
    );
  }
  const handleDeleteEmployee = (id:string) => {
    setEmployees((currentEmployees) =>
      currentEmployees.filter((emp) => emp.id !== id),
    );
  }
  const setEmployeeName = (id:string, newName:string) => {
    setEmployees((e) =>
      e.map((emp) => {
        if (emp.id === id){
          return {
            ...emp,
            name: newName,
          };
        }
        return emp;
      }),
    );
   
  }
  const editNameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Function to handle click events on the document
    const handleOutsideClick = (event: MouseEvent) => {
      // Check if the buttonRef exists and if the clicked element is NOT inside the button
      if (editNameRef.current && !editNameRef.current.contains(event.target as Node)) {
        setSelectedEmployee(null); // Hide the message
      }
    };

    // Add the event listener to the document
    document.addEventListener('mousedown', handleOutsideClick);

    // This is the cleanup function. It runs when the component unmounts.
    // It's essential to remove the event listener to prevent memory leaks.
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);// The effect re-runs if the ref changes (it won't in this case)

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
                  <table className={styles.tableContainer}>
                    <thead>
                      <th >Name</th>
                      <th>Interviewer</th>
                      <th>IntervieweeUsed</th>
                      <th>Delete</th>
                    </thead>
                    <tbody>
                    {teamMembers.map((m) => (
                          <tr key={m.id}>
                            <td className={styles.nameCell}>
                              {selectedEmployee == m.id? <input ref={editNameRef} value={m.name} onChange={(e)=> setEmployeeName(m.id, e.target.value)} ></input>:<text onClick={()=> setSelectedEmployee(m.id)}>{m.name}</text>}
                            </td>
                            <td className={styles.buttonCell}>
                              <button onClick={()=> handleToggleInterviewerUsed(m.id)} style={{display: 'flex', justifySelf: 'center'}}>{m.interviewer? "🗹" : "☐"}</button>
                            </td>
                            <td className={styles.buttonCell}>
                              <button onClick={()=> handleToggleIntervieweeUsed(m.id)} style={{display: 'flex', justifySelf: 'center'}}>{m.intervieweeUsed? "🗹": "☐"}</button>
                            </td>
                            <td className={styles.buttonCell}>
                              <button onClick={() => handleDeleteEmployee(m.id)} style={{display: 'flex', justifySelf: 'center'}}>❌</button>
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
                  <button className="btn" onClick={() => addEmployeeToTeam(team.id)}>
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
