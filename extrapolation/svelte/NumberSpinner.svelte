<script>
    import { onMount, setContext } from 'svelte';
      import MeasurementInput from "./MeasurementInput.svelte"	
      import { bodyMeasurements } from "./parametric.js"	
      import Callout from './Callout.svelte'
    export let onDrag = () => {};
  
      let X_OFFSET = -35
      let Y_OFFSET = -165 // for allowing abs coords relative to the callout
      
      export let the_measurement_name;
      export let the_gender;
      export let indicator_x;
      export let indicator_y;
      
      let measurements = {};
      bodyMeasurements.subscribe(value => { measurements = value;});
  
      let the_title_cased = measurements.printedNames[the_measurement_name]
      let the_link = measurements.urls[the_measurement_name]
    let container;
      let input;
    let dragging = false;
    let offsetX, offsetY, posX, posY;
  
    function handleMouseDown(event) {
      if (event.target === container || event.target === input) {
        dragging = true;
        offsetX = event.clientX - container.offsetLeft;
        offsetY = event.clientY - container.offsetTop;
      }
    }
  
    function handleMouseUp() {
      dragging = false;
    }
  
    function handleMouseMove(event) {
      if (!dragging) return;
      posX = event.clientX - offsetX;
      posY = event.clientY - offsetY;
      onDrag(posX, posY);
    }
  
    onMount(() => {
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
  
      return () => {
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
      };
    });
  </script>
  
  
  <div
    class="spinner-container"
    bind:this="{container}"
    style="left: {posX}px; top: {posY}px;"
  >
  
      <div>
      <span class="measurement-text inline-block">{the_title_cased}</span>
      <label class="inline-block" for={the_measurement_name} id="input+{the_measurement_name}">
          <a href="{the_link}">*</a>
      </label>
      </div>
  
      <MeasurementInput 
          bind:this="{input}"
          the_measurement_name = {the_measurement_name}
          the_gender = {the_gender}
      />
      
      <Callout
          key= {the_measurement_name}
          x2= {indicator_x}
          y2= {indicator_y}
          />
      
  </div>
  
  <style>
        .inline-block {
      display: inline-block;
    }
      .measurement-text {
          font-size: 0.6rem;
      }
      .spinner-container {
      position: absolute;
      cursor: move;
      user-select: none;
          font-weight: bold;
          font-size: 20px;
          color: orange;
    }
    label {
      display: flex;
      align-items: center;
          font-size: 0.75rem;
    }
      
  </style>