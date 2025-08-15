"use client";
import { Employee, Team } from "@/types";
import { useState } from "react";
import styles from "./WheelSpinner.module.css";

interface Props {
  employees: Employee[];
  teams: Team[];
  selection: { interviewer: Employee | null; interviewee: Employee | null };
  setSelection: (sel: { interviewer: Employee | null; interviewee: Employee | null }) => void;
  setEmployees: (emps: Employee[]) => void;
}

export default function WheelSpinner({ employees, teams, selection, setSelection, setEmployees }: Props) {
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [wheelEmployees, setWheelEmployees] = useState<Employee[]>([]);

  const spin = (role: "interviewer" | "interviewee") => {
    const eligible = employees.filter((emp) => {
      if (role === "interviewer") {
        return !emp.interviewerUsed && (!selection.interviewee || emp.teamId !== selection.interviewee.teamId);
      }
      return !emp.intervieweeUsed && (!selection.interviewer || emp.teamId !== selection.interviewer.teamId);
    });

    if (eligible.length === 0) {
      alert(`No eligible ${role}s left. Resetting...`);
      setEmployees(employees.map(e => ({
        ...e,
        interviewerUsed: false,
        intervieweeUsed: false
      })));
      return;
    }

    setWheelEmployees(eligible);
    const chosenIndex = Math.floor(Math.random() * eligible.length);
    const slice = 360 / eligible.length;
    const stopAngle = 360 * 5 + (slice * chosenIndex) + slice / 2;

    setAngle(stopAngle);
    setSpinning(true);

    setTimeout(() => {
      const winner = eligible[chosenIndex];
      setSelection({ ...selection, [role]: winner });
      setEmployees(employees.map(e =>
        e.id === winner.id
          ? { ...e, [`${role}Used`]: true }
          : e
      ));
      setSpinning(false);
    }, 5000);
  };

  return (
    <div className={styles.container}>
      <h2>Spin the Wheel</h2>
      <div className={styles.buttonRow}>
        <button disabled={spinning} onClick={() => spin("interviewer")}>Spin Interviewer</button>
        <button disabled={spinning || !selection.interviewer} onClick={() => spin("interviewee")}>Spin Interviewee</button>
      </div>

      <div className={styles.wheelWrapper}>
        <div
          className={styles.wheel}
          style={{
            transform: `rotate(${angle}deg)`,
            transition: spinning ? "transform 5s ease-out" : "none",
          }}
        >
          {wheelEmployees.map((emp, i) => {
            const sliceAngle = 360 / wheelEmployees.length;
            return (
              <div
                key={emp.id}
                className={styles.slice}
                style={{
                  transform: `rotate(${i * sliceAngle}deg) skewY(${90 - sliceAngle}deg)`,
                  background: i % 2 === 0 ? "var(--color-primary)" : "var(--color-secondary)",
                }}
              >
                <span
                  style={{
                    transform: `skewY(-${90 - sliceAngle}deg) rotate(${sliceAngle / 2}deg)`,
                  }}
                >
                  {emp.name}
                </span>
              </div>
            );
          })}
        </div>
        <div className={styles.pointer}></div>
      </div>

      {selection.interviewer && (
        <p>Interviewer: <strong>{selection.interviewer.name}</strong> ({teams.find(t => t.id === selection.interviewer?.teamId)?.name})</p>
      )}
      {selection.interviewee && (
        <p>Interviewee: <strong>{selection.interviewee.name}</strong> ({teams.find(t => t.id === selection.interviewee?.teamId)?.name})</p>
      )}
    </div>
  );
}
