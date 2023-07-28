import "./Callout.css";

import React, { useState } from "react";

const Callout = ({ key, x2_initial = 0, y2_initial = 0 }) => {
  const [x2, setX2] = useState(x2_initial);
  const [y2, setY2] = useState(y2_initial);

  const the_context = {
    top: "0", 
    /* ... */
  };

  const [top_pos, left_pos, indicator_x, indicator_y] = [
    parseInt(the_context.top, 10),
    /* ... */
  ];

  const [x1_line, y1_line] = [126, -47];

  let x2_line = x2 - 19;
  let y2_line = y2 - 125;

  if (the_context.from_left) {
    /* ... */
  }

  const onDragStart = () => (Number.isFinite(x2) ? { x: x2, y: y2 } : {});

  const onDragMove = (x, y, dx, dy) => {
    setX2(x);
    setY2(y);
  };

  const onDragEnd = (x, y, dx, dy) => {
    setX2(x);
    setY2(y);
  };

  return (
    <>
      <svg className="make_abs" style={{ overflow: "visible" }}>
        <line
          x1={x1_line}
          y1={y1_line}
          x2={x2_line}
          y2={y2_line - top_pos}
          stroke="darkgray"
          strokeWidth={2}
        />
      </svg>

      <div
        className="Handle make_abs"
        style={{ left: x2 - 2 + "px", top: y2 - 3 + "px" }}
        onMouseDown={onDragStart}
        onMouseMove={onDragMove}
        onMouseUp={onDragEnd}
      />
    </>
  );
};

export default Callout;