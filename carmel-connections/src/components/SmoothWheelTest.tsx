"use client";
import { useRef, useState } from "react";
import styles from "./SmoothWheelTest.module.css";
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

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export default function SmoothWheelTest({
  teams,
  employees,
  setEmployees,
  selection,
  setSelection,
}: Props) {
  const [spinning, setSpinning] = useState(false);
  const [finalRotation, setFinalRotation] = useState(0);
  const spins = 3;      // number of full rotations before landing
  const topSpeed = .25;   // peak speed in rotations per second
  // duration derived: peak_vel = spins * 5 / (duration/1000)  →  duration = spins * 5000 / topSpeed
  const spinDurationMs = (spins * 5000) / topSpeed;

  const n = employees.length;
  const sliceDeg = 360 / Math.max(n, 1);
  const colors = ["#0099ff", "#69cc00"];
  const size = 500;
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 4;
  const textRadius = radius * 0.65;

  const spinWheel = () => {
    if (spinning || employees.length < 2 || !selection.interviewer) return;

    const interviewer = selection.interviewer;

    let eligibleInterviewees = employees.filter(
      (e) =>
        e.id !== interviewer.id &&
        e.teamId !== interviewer.teamId &&
        !e.intervieweeUsed &&
        !e.excluded
    );

    if (eligibleInterviewees.length === 0) {
      setEmployees((prev) => prev.map((p) => ({ ...p, intervieweeUsed: false })));
      eligibleInterviewees = employees.filter(
        (e) => e.id !== interviewer.id && e.teamId !== interviewer.teamId && !e.excluded
      );
    }

    if (eligibleInterviewees.length === 0) {
      alert("No valid interviewee found.");
      return;
    }

    const interviewee =
      eligibleInterviewees[Math.floor(Math.random() * eligibleInterviewees.length)];
    console.log("Selected interviewee:", interviewee.name);

    setSelection((prev) => ({ ...prev, interviewee }));

    const index = employees.findIndex((e) => e.id === interviewee.id);
    const targetSliceCenter = index * sliceDeg + sliceDeg / 2;
    // The wheel needs to land so that the target slice center aligns with 0° (pointer on right)
    const desiredAngle = ((360 - targetSliceCenter) % 360 + 360) % 360;
    const currentAngle = ((finalRotation % 360) + 360) % 360;
    let delta = desiredAngle - currentAngle;
    if (delta <= 0) delta += 360;
    const newRotation = finalRotation + delta + 360 * spins;
    setFinalRotation(newRotation);
    setSpinning(true);

    setTimeout(() => {
      setEmployees((prev) =>
        prev.map((p) => (p.id === interviewee.id ? { ...p, intervieweeUsed: true } : p))
      );
      setSpinning(false);
    }, spinDurationMs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.frame}>
        <svg
          className={styles.wheel}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            transform: `rotate(${finalRotation}deg)`,
            transition: spinning
              ? `transform ${spinDurationMs}ms cubic-bezier(0.25, 0.1, 0.25, 1)`
              : "none",
          }}
        >
          {employees.map((emp, i) => {
            const startAngle = i * sliceDeg;
            const endAngle = startAngle + sliceDeg;
            const midAngle = startAngle + sliceDeg / 2;
            const textPos = polarToCartesian(cx, cy, textRadius, midAngle);
            return (
              <g key={emp.id}>
                <path
                  d={describeArc(cx, cy, radius, startAngle, endAngle)}
                  fill={colors[i % 2]}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="1"
                />
                <text
                  x={textPos.x}
                  y={textPos.y}
                  fill="white"
                  fontSize="14"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${midAngle}, ${textPos.x}, ${textPos.y})`}
                >
                  {emp.name}
                </text>
              </g>
            );
          })}
        </svg>
        <div className={styles.pointer} />
      </div>
      <button className="btn" onClick={spinWheel} disabled={spinning}>
        {spinning ? "Spinning..." : "Spin"}
      </button>
      {!spinning && selection.interviewee && (
        <p className={styles.result}>Selected: {selection.interviewee.name}</p>
      )}
    </div>
  );
}
