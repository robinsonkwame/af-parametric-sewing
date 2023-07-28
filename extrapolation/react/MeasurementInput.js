import './MeasurementInput.css';

import React, { useState, useEffect } from "react";
import { bodyMeasurements } from "./parametric.js";
import { CISFEMALE, CISMALE } from "./freesewingMeasurement.js";
import { findClosestSize } from "./find_closest_size.js";

const MeasurementInput = ({ the_measurement_name, the_gender }) => {
  const [measurements, setMeasurements] = useState({});
  const [new_measurement_size, setNewMeasurementSize] = useState();
  const [text_color, setTextColor] = useState("black");
  const [the_unit, setTheUnit] = useState("mm");

  const neckMin = 50;
  const neckMax = 5000;

  useEffect(() => {
    const subscription = bodyMeasurements.subscribe(value => {
      setMeasurements(value);
      setNewMeasurementSize(value.size[the_measurement_name]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const update = (event) => {
    if ("neck" === the_measurement_name) {
      neckUpdate(event.target.value);
    } else {
      extrapolatedUpdate(event.target.value);
    }
  };

  const do_the_update = (neckSize, the_gender, measurementSize = false) => {
    //...
  };

  const neckUpdate = (event) => {
    //...
  };

  const extrapolatedUpdate = (event) => {
    //...
  };

  return (
    <div>
      <input
        id={"input+" + the_measurement_name}
        type="number"
        value={new_measurement_size}
        min={neckMin}
        max={neckMax}
        onChange={update}
        aria-labelledby={"input+" + the_measurement_name}
        aria-valuenow={new_measurement_size}
        aria-valuemin={neckMin}
        aria-valuemax={neckMax}
        style={{ color: text_color }}
      />
      {the_unit}
    </div>
  );
};

export default MeasurementInput;