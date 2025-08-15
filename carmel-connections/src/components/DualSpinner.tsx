"use client";
import { useEffect, useRef, useState } from "react";
import type { Employee, Team } from "@/types";

type Props = {
  teams: Team[];
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  selection: { interviewer: Employee | null; interviewee: Employee | null };
  setSelection: React.Dispatch<
    React.SetStateAction<{ interviewer: Employee | null; interviewee: Employee | null }>
  >;
};

export default function DualSpinner({ teams, employees, setEmployees, selection, setSelection }: Props) {
  const interviewerRef = useRef<HTMLDivElement>(null);
  const intervieweeRef = useRef<HTMLDivElement>(null);
  const [spinning, setSpinning] = useState(false);

  const spinBoth = () => {
    if (spinning) return;
    if (teams.length < 2 || employees.length < 2) return alert("Add at least 2 teams and 2 employees.");
    setSpinning(true);

    // Pick Interviewer
    let eligibleInterviewer = employees.filter(e => !e.interviewerUsed);
    if (!eligibleInterviewer.length) {
      eligibleInterviewer = employees;
      setEmployees(prev => prev.map(p => ({ ...p, interviewerUsed: false })));
    }
    const interviewer = eligibleInterviewer[Math.floor(Math.random() * eligibleInterviewer.length)];

    // Pick Interviewee
    let eligibleInterviewee = employees.filter(
      e => e.id !== interviewer.id && e.teamId !== interviewer.teamId && !e.intervieweeUsed
    );
    if (!eligibleInterviewee.length) {
      setEmployees(prev => prev.map(p => ({ ...p, intervieweeUsed: false })));
      eligibleInterviewee = employees.filter(e => e.id !== interviewer.id && e.teamId !== interviewer.teamId);
    }
    if (!eligibleInterviewee.length) return alert("No valid interviewee found.");
    const interviewee = eligibleInterviewee[Math.floor(Math.random() * eligibleInterviewee.length)];

    // Animate scroll for both
    animateScroll(interviewerRef.current, interviewer.name, 2000).then(() => {
      animateScroll(intervieweeRef.current, interviewee.name, 2000).then(() => {
        // Finalize selection
        setSelection({ interviewer, interviewee });
        setEmployees(prev =>
          prev.map(p =>
            p.id === interviewer.id
              ? { ...p, interviewerUsed: true }
              : p.id === interviewee.id
              ? { ...p, intervieweeUsed: true }
              : p
          )
        );
        setSpinning(false);
      });
    });
  };

  const animateScroll = (el: HTMLDivElement | null, targetName: string, duration: number) => {
    return new Promise<void>((resolve) => {
      if (!el) return resolve();
      const children = Array.from(el.children) as HTMLDivElement[];
      const targetIndex = children.findIndex(c => c.textContent === targetName);
      if (targetIndex === -1) return resolve();

      const scrollHeight = el.scrollHeight;
      const itemHeight = children[0]?.offsetHeight || 40;
      const targetPos = targetIndex * itemHeight;

      const start = el.scrollTop;
      const change = targetPos - start + itemHeight * 3; // extra spins
      const startTime = performance.now();

      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = easeOutCubic(t);
        el.scrollTop = start + change * eased;
        if (t < 1) requestAnimationFrame(tick);
        else {
          el.scrollTop = targetPos; // ensure exact
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  };

  return (
    <div className="container">
      {/* Interviewer */}
      <div className="spinnerCard">
        <div className="titleRow">
          <h3>Interviewer</h3>
        </div>
        <div className="listWrapper" ref={interviewerRef}>
          <div className="list">
            {employees.map(e => (
              <div key={e.id} className="item">{e.name}</div>
            ))}
          </div>
          <div className="pointer"></div>
        </div>
        {selection.interviewer && <span className="badge">{selection.interviewer.name}</span>}
      </div>

      {/* Interviewee */}
      <div className="spinnerCard">
        <div className="titleRow">
          <h3>Interviewee</h3>
        </div>
        <div className="listWrapper" ref={intervieweeRef}>
          <div className="list">
            {employees.map(e => (
              <div key={e.id} className="item">{e.name}</div>
            ))}
          </div>
          <div className="pointer"></div>
        </div>
        {selection.interviewee && <span className="badge">{selection.interviewee.name}</span>}
      </div>

      <button className="btn" onClick={spinBoth} disabled={spinning} style={{ height: 40, alignSelf: "center" }}>
        {spinning ? "Spinning..." : "Spin Both"}
      </button>
    </div>
  );
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
