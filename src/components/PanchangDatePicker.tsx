"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent } from "react";

interface PanchangDatePickerProps {
  currentCity: string;
  currentDate: string;
}

export default function PanchangDatePicker({ currentCity, currentDate }: PanchangDatePickerProps) {
  const router = useRouter();

  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
      router.push(`/panchang/${currentCity}/${newDate}`);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
      <label
        htmlFor="panchang-date-picker"
        style={{
          fontSize: "0.82rem",
          color: "var(--text-secondary)",
          fontWeight: 600,
        }}
      >
        తేదీ ఎంచుకోండి:
      </label>
      <input
        id="panchang-date-picker"
        type="date"
        value={currentDate}
        onChange={handleDateChange}
        style={{
          backgroundColor: "var(--bg-card)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "0.35rem 0.65rem",
          fontSize: "0.85rem",
          cursor: "pointer",
          outline: "none",
        }}
        aria-label="Select Panchang Date"
      />
    </div>
  );
}
