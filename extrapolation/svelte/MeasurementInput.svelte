<script>
	import { onMount, onDestroy } from 'svelte';
	import { bodyMeasurements } from "./parametric.js"
	import { CISFEMALE, CISMALE } from "./freesewingMeasurement.js"
	import { findClosestSize } from './find_closest_size.js'

	export let the_measurement_name;
	export let the_gender;
	let measurements = {};
	bodyMeasurements.subscribe(value => { measurements = value;});
	
	//let new_measurement_size = measurements.size[the_measurement_name]
	$: new_measurement_size = measurements.size[the_measurement_name];

	let text_color = "black"
	let the_unit = "mm" // also used to explain a red flag
	let neckMin = 50
	let neckMax = 5000

	// update functions
	const update = (event) => {
		if('neck' == the_measurement_name){
			neckUpdate(event.target.value);
		}
		else{
			extrapolatedUpdate(event.target.value)
		}
	}

	function do_the_update(neckSize, the_gender, measurementSize=false){
		let data = {
			neckSize: neckSize,
			gender: the_gender
		}
		let use_this = bodyMeasurements.getMeasurements(data)

		if(!measurementSize){
			// we hard code this instantiation of the measurement
			// ... the getMeasurement function is 1 or 2 mm off because of rounding error
			// and/or direction of approach in the binary search
			use_this[the_measurement_name] = measurementSize
		}
		
		bodyMeasurements.set(
			use_this
		);		
	}
	
	const neckUpdate = (event) => {		
		do_the_update(event, the_gender)
	}

	const extrapolatedUpdate = (event) => {
		let response = findClosestSize(
			event, 
			the_gender, 
			the_measurement_name, 
			bodyMeasurements.getMeasurements
		)
		
		if(response.neckSize){
			text_color = "black"
			do_the_update(response.neckSize, the_gender, event) // update + the custom measurement

			// there's probably a smarter, more reactive way to do this
			if(the_unit != 'mm'){
				the_unit = 'mm'
			}
		}
		else{
			text_color = "red"
			the_unit = "Is " + response.reason
		}
	}	
</script>

<div>
	<input 
		id="input+{the_measurement_name}"
	  type="number"
		value={new_measurement_size}
	  min={neckMin}
	  max={neckMax}
	  on:change={update}
	  aria-labelledby="input+{the_measurement_name}"
	  aria-valuenow={new_measurement_size} 
	  aria-valuemin={neckMin}
	  aria-valuemax={neckMax} 
		style="color:{text_color}"
	/> 
	{the_unit}
</div>

<style>
	div {
		background: gray;
    width: 110px; /* setting the width based on the content */		
    border-radius: 0.5rem;
    -moz-border-radius: 1rem;
		padding: 0.5rem
	}
  input[type="number"] {
    padding: 0.5rem; /* adding padding to the input box */
    line-height: 1.5; /* making the input box 1.5 times taller than the font */
    background-color: white; /* setting a white background color */
  }
</style>