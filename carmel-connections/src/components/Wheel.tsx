"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./Wheel.module.css";
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

export default function Wheel({ teams, employees, setEmployees, selection, setSelection }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landIndex, setLandIndex] = useState<number | null>(null);
  const [canvasSize, setCanvasSize] = useState(400);

  // Update canvas size based on window
  useEffect(() => {
    const handleResize = () => {
      const maxWidth = window.innerWidth * 0.6;
      const maxHeight = window.innerHeight * 0.6;
      setCanvasSize(Math.min(maxWidth, maxHeight, 720));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // draw wheel
  useEffect(() => {
    drawWheel(rot, landIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, rot, landIndex, canvasSize]);

  const drawWheel = (rotation: number, highlightIndex: number | null) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const size = canvasSize;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const n = Math.max(employees.length, 1);
    const center = size / 2;
    const radius = size * 0.48;
    const textRadius = radius * 0.72;
    const slice = (Math.PI * 2) / n;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);

    for (let i = 0; i < n; i++) {
      const start = i * slice;
      const end = start + slice;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();

      const isHL = highlightIndex === i;
      const base = i % 2 === 0 ? getCss("--color-primary") : getCss("--color-secondary");
      ctx.fillStyle = isHL ? lighten(base, 0.25) : base;
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,.22)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, radius, start, start);
      ctx.stroke();

      const label = employees[i]?.name ?? "";
      if (!label) continue;

      ctx.save();
      const mid = start + slice / 2;
      ctx.rotate(mid);
      ctx.translate(textRadius, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = "white";
      ctx.font = `${Math.max(10, Math.min(18, radius * 0.05))}px ui-sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const text = truncate(label, 22);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,.85)";
    ctx.fill();
    ctx.restore();
  };

  const spinOnce = () => {
    if (spinning) return;
    if (teams.length < 2 || employees.length < 2)
      return alert("Create at least 2 teams and 2 employees.");

    let eligibleInterviewer = employees.filter((e) => !e.interviewerUsed);
    if (!eligibleInterviewer.length) {
      eligibleInterviewer = employees;
      setEmployees((prev) => prev.map((p) => ({ ...p, interviewerUsed: false })));
    }

    const candidateIndices = employees
      .map((e, i) => ({ e, i }))
      .filter(({ e }) => eligibleInterviewer.includes(e))
      .map(({ i }) => i);

    const chosenI = candidateIndices[Math.floor(Math.random() * candidateIndices.length)];
    setLandIndex(chosenI);

    const n = employees.length;
    const slice = (Math.PI * 2) / n;
    const midAngle = chosenI * slice + slice / 2;
    const pointer = -Math.PI / 2;
    const current = rot % (Math.PI * 2);
    const spins = 6 + Math.floor(Math.random() * 3);
    const target = pointer - midAngle + spins * Math.PI * 2;

    animateRotation(current, current + target, 4200).then(() => {
      const interviewer = employees[chosenI];
      const pickInterviewee = () => {
        let pool = employees.filter(
          (e) => e.id !== interviewer.id && e.teamId !== interviewer.teamId && !e.intervieweeUsed
        );
        if (!pool.length) {
          setEmployees((prev) => prev.map((p) => ({ ...p, intervieweeUsed: false })));
          pool = employees.filter((e) => e.id !== interviewer.id && e.teamId !== interviewer.teamId);
        }
        if (!pool.length) return null;
        return pool[Math.floor(Math.random() * pool.length)];
      };

      const interviewee = pickInterviewee();
      if (!interviewee) return;

      setSelection({ interviewer, interviewee });
      setEmployees((prev) =>
        prev.map((p) =>
          p.id === interviewer.id
            ? { ...p, interviewerUsed: true }
            : p.id === interviewee.id
            ? { ...p, intervieweeUsed: true }
            : p
        )
      );
    });
  };

  const animateRotation = (from: number, to: number, duration = 4000) => {
    setSpinning(true);
    return new Promise<void>((resolve) => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = easeOutCubic(t);
        setRot(from + (to - from) * eased);
        if (t < 1) requestAnimationFrame(tick);
        else {
          setSpinning(false);
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  };

  return (
    <div className="card">
      <div className={styles.wrap}>
        <div className="titleRow">
          <h2>Wheel</h2>
          <button className="btn" disabled={spinning || employees.length < 2} onClick={spinOnce}>
            {spinning ? "Spinning..." : "Spin Once (Pick Both)"}
          </button>
        </div>

        <div className={styles.wheelArea} style={{ width: canvasSize, height: canvasSize }}>
          <canvas ref={canvasRef} className={styles.canvas} />
          <div className={styles.pointer} />
        </div>

        <div className={styles.labels}>
          {selection.interviewer && (
            <span className={styles.badge}>
              Interviewer: {selection.interviewer.name}
            </span>
          )}
          {selection.interviewee && (
            <span className={styles.badge}>
              Interviewee: {selection.interviewee.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* helpers */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
function getCss(name: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || "#888";
}
function lighten(hex: string, amt: number) {
  const p = (h: string) => Math.min(255, Math.max(0, Math.round(parseInt(h, 16) * (1 + amt))));
  const r = p(hex.slice(1, 3)).toString(16).padStart(2, "0");
  const g = p(hex.slice(3, 5)).toString(16).padStart(2, "0");
  const b = p(hex.slice(5, 7)).toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}
function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
