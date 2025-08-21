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

export default function WheelWithPointers({
  teams,
  employees,
  setEmployees,
  selection,
  setSelection,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(400);
  const pointer1Ref = useRef<SVGSVGElement>(null); // orange (default points DOWN)
  const pointer2Ref = useRef<SVGSVGElement>(null); // blue   (default points UP)
  const [spinning, setSpinning] = useState(false);

  // Responsive canvas
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      const maxSize = window.innerHeight * 0.4;
      setCanvasSize(maxSize);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Draw wheel whenever employees or size changes
  useEffect(() => drawWheel(), [employees, canvasSize]);

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = canvasSize;
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const n = Math.max(employees.length, 1);
    const center = size / 2;
    const radius = size / 2 - 10;
    const textRadius = radius * 0.75;
    const slice = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);

    for (let i = 0; i < n; i++) {
      // 0 rad at 3 o'clock; positive is clockwise
      const start = i * slice;
      const end = start + slice;

      // fill slice
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "#6c5ce7" : "#00b894";
      ctx.fill();

      // border line (optional)
      ctx.strokeStyle = "#fff4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, start);
      ctx.stroke();

      // label centered in slice
      const label = employees[i]?.name ?? "";
      ctx.save();
      const mid = start + slice / 2; // center of slice (radial line)
      ctx.rotate(mid);
      ctx.translate(textRadius, 0);
      ctx.rotate(Math.PI / 2);
      ctx.fillStyle = "white";
      ctx.font = `${Math.max(12, radius * 0.06)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }

    ctx.restore();
  };

  // Helper: center angle for employee index (wheel uses 3 o’clock as 0, clockwise)
  const centerAngleForIndex = (i: number, n: number) => {
    const slice = (2 * Math.PI) / n;
    return i * slice + slice / 2; // angle of slice center measured from 3 o'clock, clockwise
  };

  // Animate to absolute angle (CSS rotate, radians)
  const animatePointer = (el: SVGSVGElement, targetRad: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const startTime = performance.now();
      const spins = 6; // extra rotations for flair
      const startRot = 0;
      const endRot = targetRad + spins * 2 * Math.PI;

      const tick = (time: number) => {
        const t = Math.min(1, (time - startTime) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        const rot = startRot + (endRot - startRot) * eased;
        el.style.transform = `rotate(${rot}rad)`;
        if (t < 1) requestAnimationFrame(tick);
        else {
          el.style.transform = `rotate(${targetRad}rad)`; // snap to exact target
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  };

  const spinPointers = async () => {
    if (spinning) return;
    if (employees.length < 2 || teams.length < 2) {
      alert("Add at least 2 teams and 2 employees.");
      return;
    }
    setSpinning(true);

    // pick interviewer
    let eligibleInterviewer = employees.filter((e) => !e.interviewerUsed);
    if (!eligibleInterviewer.length) {
      eligibleInterviewer = employees;
      setEmployees((prev) => prev.map((p) => ({ ...p, interviewerUsed: false })));
    }
    const interviewer =
      eligibleInterviewer[Math.floor(Math.random() * eligibleInterviewer.length)];

    // pick interviewee
    let eligibleInterviewee = employees.filter(
      (e) => e.id !== interviewer.id && e.teamId !== interviewer.teamId && !e.intervieweeUsed
    );
    if (!eligibleInterviewee.length) {
      setEmployees((prev) => prev.map((p) => ({ ...p, intervieweeUsed: false })));
      eligibleInterviewee = employees.filter(
        (e) => e.id !== interviewer.id && e.teamId !== interviewer.teamId
      );
    }
    if (!eligibleInterviewee.length) {
      alert("No valid interviewee found.");
      setSpinning(false);
      return;
    }
    const interviewee =
      eligibleInterviewee[Math.floor(Math.random() * eligibleInterviewee.length)];

    const n = employees.length;
    const interviewerIndex = employees.findIndex((e) => e.id === interviewer.id);
    const intervieweeIndex = employees.findIndex((e) => e.id === interviewee.id);

    // ABSOLUTE slice-center angles (from 3 o'clock, clockwise)
    const mid1 = centerAngleForIndex(interviewerIndex, n);
    const mid2 = centerAngleForIndex(intervieweeIndex, n);

    /**
     * IMPORTANT: compensate for each arrow’s default orientation:
     * - pointer1 polygon points DOWN when rotation = 0  -> base orientation = +π/2 from 3 o'clock
     * - pointer2 polygon points UP   when rotation = 0  -> base orientation = -π/2 from 3 o'clock
     * So CSS target rotation = desiredAbsoluteAngle - baseOrientation
     */
    const targetAngle1 = mid1 - Math.PI / 2; // center - (down baseline)
    const targetAngle2 = mid2 + Math.PI / 2; // center - (up baseline) == center - (-π/2)

    await Promise.all([
      animatePointer(pointer1Ref.current!, targetAngle1, 2000),
      animatePointer(pointer2Ref.current!, targetAngle2, 2500),
    ]);

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

    setSpinning(false);
  };

  const arrowWidth = 20;
  const arrowLength = 100;

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        flexBasis: 0.5,
        flexShrink: 1,
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", width: canvasSize, height: canvasSize }}>
        <canvas ref={canvasRef} width={canvasSize} height={canvasSize} />

        {/* Orange pointer (default points DOWN) */}
        <svg
          ref={pointer1Ref}
          width={canvasSize}
          height={canvasSize}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            transformBox: "fill-box",
            transformOrigin: "50% 50%",
          }}
        >
          <polygon
            points={`
              ${canvasSize/2 - arrowWidth/4}, ${canvasSize/2}
              ${canvasSize/2 + arrowWidth/4}, ${canvasSize/2}
              ${canvasSize/2 + arrowWidth/4}, ${canvasSize/2 + arrowLength*0.6}
              ${canvasSize/2 + arrowWidth/2}, ${canvasSize/2 + arrowLength*0.6}
              ${canvasSize/2}, ${canvasSize/2 + arrowLength}
              ${canvasSize/2 - arrowWidth/2}, ${canvasSize/2 + arrowLength*0.6}
              ${canvasSize/2 - arrowWidth/4}, ${canvasSize/2 + arrowLength*0.6}
            `}
            fill="#ff7f50"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>

        {/* Blue arrow (default points UP) */}
        <svg
          ref={pointer2Ref}
          width={canvasSize}
          height={canvasSize}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            transformBox: "fill-box",
            transformOrigin: "50% 50%",
          }}
        >
          <polygon
            points={`
              ${canvasSize/2 - arrowWidth/4}, ${canvasSize/2}
              ${canvasSize/2 + arrowWidth/4}, ${canvasSize/2}
              ${canvasSize/2 + arrowWidth/4}, ${canvasSize/2 - arrowLength*0.6}
              ${canvasSize/2 + arrowWidth/2}, ${canvasSize/2 - arrowLength*0.6}
              ${canvasSize/2}, ${canvasSize/2 - arrowLength}
              ${canvasSize/2 - arrowWidth/2}, ${canvasSize/2 - arrowLength*0.6}
              ${canvasSize/2 - arrowWidth/4}, ${canvasSize/2 - arrowLength*0.6}
            `}
            fill="#3b9fff"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          width={canvasSize}
          height={canvasSize}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            transformBox: "fill-box",
            transformOrigin: "50% 50%",
          }}
        >
          <circle cx={canvasSize/2} cy={canvasSize/2} r="10" fill="white" stroke="black" stroke-width="2" />
        </svg>
      </div>

      <button
        onClick={spinPointers}
        disabled={spinning}
        style={{
          marginTop: 20,
          padding: "10px 16px",
          borderRadius: 8,
          fontWeight: 600,
          cursor: "pointer",
          background: "#6c5ce7",
          color: "white",
          border: "none",
        }}
      >
        {spinning ? "Spinning..." : "Spin Pointers"}
      </button>

      <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
        {selection.interviewer && (
          <span
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              background: "#ff7f50",
              color: "white",
              fontWeight: 700,
            }}
          >
            Interviewer: {selection.interviewer.name}
          </span>
        )}
        {selection.interviewee && (
          <span
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              background: "#3b9fff",
              color: "white",
              fontWeight: 700,
            }}
          >
            Interviewee: {selection.interviewee.name}
          </span>
        )}
      </div>
    </div>
  );
}
