import "./NumberSpinner.css";

import React, { useEffect, useRef, useState } from "react";
import MeasurementInput from "./MeasurementInput.js";
import Callout from "./Callout.js";
import { bodyMeasurements } from "./parametric.js";

const NumberSpinner = ({
  the_measurement_name,
  the_gender,
  indicator_x,
  indicator_y,
}) => {
  const [measurements, setMeasurements] = useState({});
  bodyMeasurements.subscribe((value) => {
    setMeasurements(value);
  });

  const the_title_cased = measurements.printedNames[the_measurement_name];
  const the_link = measurements.urls[the_measurement_name];
  const containerRef = useRef(null);

  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (
        event.target === containerRef.current ||
        event.target === containerRef.current
      ) {
        const offsetX = event.clientX - containerRef.current.offsetLeft;
        const offsetY = event.clientY - containerRef.current.offsetTop;
        setPosX(event.clientX - offsetX);
        setPosY(event.clientY - offsetY);
      }
    };

    const handleMouseMove = (event) => {
      if (!containerRef.current) {
        return;
      }
      setPosX(event.clientX);
      setPosY(event.clientY);
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="spinner-container"
      ref={containerRef}
      style={{ left: posX + "px", top: posY + "px" }}
    >
      <div>
        <span className="measurement-text inline-block">
          {the_title_cased}
        </span>
        <label
          className="inline-block"
          htmlFor={the_measurement_name}
          id={"input+" + the_measurement_name}
        >
          <a href={the_link}>*</a>
        </label>
      </div>

      <MeasurementInput
        the_measurement_name={the_measurement_name}
        the_gender={the_gender}
      />

      <Callout
        key={the_measurement_name}
        x2={indicator_x}
        y2={indicator_y}
      />
    </div>
  );
};

export default NumberSpinner;