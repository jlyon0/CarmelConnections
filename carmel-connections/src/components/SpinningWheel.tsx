"use client";
import { useEffect, useRef, useState } from "react";
import type { Employee, Team} from "@/types";
import logoSrc from "@/../public/CarmelColorLogo.png";
import { useSelectedLayoutSegment } from "next/navigation";
type Props = {
    teams: Team[];
    setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  employees: Employee[];
  setSelection: React.Dispatch<
    React.SetStateAction<{ interviewer: Employee | null; interviewee: Employee | null }>
  >;
  selection: { interviewer: Employee | null; interviewee: Employee | null };
};

export default function SpinningWheel({
    teams,
    setEmployees,
    employees,
    setSelection,
    selection,
    }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(600);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0); // track wheel rotation
  const [logo, setLogo] = useState<HTMLImageElement | null>(null); // track 
  useEffect(() => {
    const img = new Image();
    img.src = logoSrc.src; // relative to public
    img.onload = () => setLogo(img);
    }, []);


  // Responsive canvas
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      const maxSize = window.innerHeight * 0.5;
      setCanvasSize(maxSize);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Draw wheel
  useEffect(() => drawWheel(rotation, logo), [employees, canvasSize, rotation, logo]);

  const drawWheel = (rot: number, logo?: HTMLImageElement|null) => {
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
    const textRadius = radius * 0.7;
    const slice = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rot);

    for (let i = 0; i < n; i++) {
      const start = i * slice;
      const end = start + slice;

      // slice background
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = i % 2 === 0 ? "#0099ff" : "#69cc00";
      ctx.fill();

      // label
      const label = employees[i]?.name ?? "";
      ctx.save();
      const mid = start + slice / 2;
      ctx.rotate(mid);
      ctx.translate(textRadius, 0);
    //   ctx.rotate(Math.PI / 2);
      ctx.fillStyle = "white";
      ctx.font = `${Math.max(12, radius * 0.06)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, 0, 0);
      ctx.restore();
    }
    if (logo) {
    const logoMaxSize = radius * 0.4;

    const aspect = logo.width / logo.height;
    let drawW = logoMaxSize;
    let drawH = logoMaxSize;

    // preserve aspect ratio
    if (aspect > 1) {
      drawH = drawW / aspect;
    } else {
      drawW = drawH * aspect;
    }

    ctx.save();
    // white circular background
    ctx.beginPath();
    ctx.arc(0, 0, logoMaxSize / 2, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    // cancel out the wheel rotation so logo ends upright
    ctx.rotate(-rot);

    // clip to circle and draw logo
    ctx.clip();
    ctx.drawImage(logo, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }
    ctx.restore();
  };

  // Spin wheel
  const spinWheel = () => {
    if (spinning || employees.length < 2 || selection.interviewer === null) return;
    setSpinning(true);

    const interviewer = selection.interviewer;

    // Filter eligible interviewees
    let eligibleInterviewees = employees.filter(
        (e) =>
        e.id !== interviewer.id &&
        e.teamId !== interviewer.teamId &&
        !e.intervieweeUsed
    );

    // If none left, reset usage and try again
    if (eligibleInterviewees.length === 0) {
        setEmployees((prev) =>
        prev.map((p) => ({ ...p, intervieweeUsed: false }))
        );
        eligibleInterviewees = employees.filter(
        (e) => e.id !== interviewer.id && e.teamId !== interviewer.teamId
        );
    }

    // Still none? Abort
    if (eligibleInterviewees.length === 0) {
        alert("No valid interviewee found.");
        setSpinning(false);
        return;
    }

    // Pick random from eligible pool
    const interviewee =
        eligibleInterviewees[
        Math.floor(Math.random() * eligibleInterviewees.length)
        ];

    // Mark interviewee as used
    setEmployees((prev) =>
        prev.map((p) =>
        p.id === interviewee.id ? { ...p, intervieweeUsed: true } : p
        )
    );

    // Save selection
    setSelection((prev) => ({ ...prev, interviewee }));

    // Now spin to the right slice
    const n = employees.length;
    const index = employees.findIndex((e) => e.id === interviewee.id);
    const slice = (2 * Math.PI) / n;

    // Target rotation: align chosen slice center to arrow (right side, 3 o'clock)
    const chosenAngle = index * slice + slice / 2;

    // Current rotation normalized
    const currentRot = rotation % (2 * Math.PI);

    const spins = 4; // extra spins for flair
    // Compute minimal rotation delta to land on chosen slice
    let deltaRot = -currentRot - chosenAngle + spins * 2 * Math.PI; // 10 extra spins
    // ensure deltaRot positive
    if (deltaRot < 0) deltaRot += 2 * Math.PI;

    const duration = 20000;
    const start = rotation;
    const end = start + deltaRot;
    const startTime = performance.now();

    const tick = (time: number) => {
      const t = Math.min(1, (time - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out
      const rot = start + (end - start) * eased;
      setRotation(rot);
      if (t < 1) requestAnimationFrame(tick);
      else {
        setRotation(end);
        setSpinning(false);
      }
    };
    requestAnimationFrame(tick);
  };

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
        {/* Static arrow on right side */}
        <svg
          width={canvasSize}
          height={canvasSize}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
          }}
        >
            {/* Arrow */}
          <polygon
                points={`
                    ${canvasSize - 20}, ${canvasSize / 2}
                    ${canvasSize }, ${canvasSize / 2 - 20}
                    ${canvasSize }, ${canvasSize / 2 + 20}
                `}
                fill="White"
                stroke="black"
                strokeWidth="2"
            />
        </svg>
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className="btn"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>

      {/* {selection.interviewee && (
        <div style={{ marginTop: 16 }}>
          <span
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              background: "#3b9fff",
              color: "white",
              fontWeight: 700,
            }}
          >
            Selected: {selection.interviewee.name}
          </span>
        </div>
      )} */}
    </div>
  );
}
