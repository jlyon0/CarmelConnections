"use client";
import { useEffect, useState } from "react";
import styles from "./SmoothWheelTest.module.css";

export default function SmoothWheelTest() {
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (!spinning) return;
    const timer = window.setTimeout(() => {
      setSpinning(false);
    }, 3800);
    return () => window.clearTimeout(timer);
  }, [spinning]);

  return (
    <div className={styles.container}>
      <p className={styles.description}>
        This demo just toggles a CSS transform animation so the GPU compositor can keep a
        smooth 60fps rotation while Teams captures the frame stream.
      </p>
      <div className={styles.frame}>
        <div
          className={`${styles.wheel} ${spinning ? styles.spinning : ""}`}
          aria-hidden
        />
        <div className={styles.pointer} />
      </div>
      <button className="btn secondary" onClick={() => !spinning && setSpinning(true)}>
        {spinning ? "CSS spin in progress" : "Run CSS-based spin"}
      </button>
      <p className={styles.status}>
        {spinning
          ? "CSS transform is on the compositor layer, which should pulse smoothly inside the Teams share."
          : "Animation returns to 0° so the next pulse is always fresh. Try running this while sharing."
        }
      </p>
    </div>
  );
}
