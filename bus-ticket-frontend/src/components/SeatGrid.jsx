import React from "react";

export default function SeatGrid({ total=32, booked=[], selected=[], onToggle }){
  // Simple 4 columns layout
  const cols = 4;
  const seats = Array.from({ length: total }, (_, i) => i+1);

  return (
    <div className="d-grid" style={{ gridTemplateColumns: `repeat(${cols}, 48px)`, gap: 10 }}>
      {seats.map(n => {
        const isBooked = booked.includes(n);
        const isSel = selected.includes(n);
        const cls = ["seat"];
        if(isBooked) cls.push("booked");
        else if(isSel) cls.push("selected");
        else cls.push("available");

        return (
          <div
            key={n}
            className={cls.join(" ")}
            onClick={() => !isBooked && onToggle(n)}
            title={isBooked ? "Booked" : "Available"}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
}
