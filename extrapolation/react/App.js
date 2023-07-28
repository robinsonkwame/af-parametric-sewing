import './App.css';

import React, { useState, useEffect } from "react";
import {	bodyMeasurements, vert_from_bottom, are_equal } from "./parametric.js";
import {	CISFEMALE, CISMALE } from "./freesewingMeasurement.js";
import NumberSpinner from "./NumberSpinner.js";

const imageUrl = 
	"https://raw.githubusercontent.com/robinsonkwame/csdt-af-sewing/main/static/front-model-only-standing.jpg";

const measurement_names_and_positions = [
  { key: "neck", top: "0px", left: "0px", indicator_x: 453, indicator_y: 184 },
  { key: "biceps", top: "100px", left: "0px", indicator_x: 396, indicator_y: 243 },
  // ...
];

const App = () => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const neckSize = 340; // mm, about 13"
  const data = {	neckSize,	gender: CISFEMALE };
  const use_this = bodyMeasurements.getMeasurements(data);
  const [bodyMeasurementsState, setBodyMeasurementsState] = useState(use_this);

  useEffect(() => {
    const updateMousePosition = (event) => {
      setMouseX(event.clientX);
      setMouseY(event.clientY);
    };

    const handleKeyPress = (event) => {
      if (event.key === "a" || event.key === "A") {
        console.log(`Mouse is at position X: ${mouseX}, Y: ${mouseY}`);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [mouseX, mouseY]);

  const spinners = measurement_names_and_positions.map((name_position) => (
    <div
      className="spinner"
      style={{
        position: "absolute",
        top: name_position.top,
        left: name_position.left,
      }}
      key={name_position.key}
    >
      <NumberSpinner
        the_measurement_name={name_position.key}
        the_gender={CISFEMALE}
        indicator_x={name_position.indicator_x}
        indicator_y={name_position.indicator_y}
      />
    </div>
  ));

  return (
    <div>
      Artisanal Futures Parametric Sewing Measurement Extrapolator v
      alpha-0.1 [image credit: freesewing.org]
      <div className="parent-container">{spinners}</div>
    </div>
  );
};

export default App;