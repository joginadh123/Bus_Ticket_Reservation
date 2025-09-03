import React from "react";

export default function Loader({ text="Loading..." }){
  return (
    <div className="text-center my-5">
      <div className="spinner-border" role="status" />
      <div className="mt-2 text-muted">{text}</div>
    </div>
  );
}
