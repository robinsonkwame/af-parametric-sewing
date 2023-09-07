<script>
  import { onMount } from 'svelte';
  import { draggable } from './draggable.js';	
  import { createEventDispatcher } from 'svelte';
	import { parts, updateParts, addModifiedParts, add_image_toggle, bartol_et_al_measurements, bartol_to_part } from './utils.js';

	const dispatch = createEventDispatcher(); // for cloning pattern in Interpolator

	/*
		 This should be updated to work in inches and pounds ... :X
 */
	
	//export let unit = "mm"
	let clonedImage;
	
  let cursorX = -9999; // Initial value set far outside the viewport
  let cursorY = -9999; // Initial value set far outside the viewport
  let isMouseOverImage = false;
  let image;
  let handleClickEnabled = true;

  function cloneImage() {
		$add_image_toggle = !$add_image_toggle // Interpolator.svelte handles
  }
	
  function handleMouseMove(event) {
    if (isMouseOverImage) {
      cursorX = event.clientX;
      cursorY = event.clientY;
    }
  }
	let weightInKg = 87;
	let heightInMeters = 1.83;

	const to_inch = () => {return 2.53} // cm -> inch
	
  function handleClick() {
/*
export const bartol_to_part = {
	'Shoulder to wrist (arm)': (meas, heightInMeters) => {return meas['arm_length']}, // does that include the hand?
	'biceps': (meas, heightInMeters) => {return meas['bicep_circumference']},
	'Wrist width': (meas, heightInMeters) => {return meas['wrist_circumference']},
}

*/
		let bartol = bartol_et_al_measurements(heightInMeters, weightInKg)
		//console.log(bartol)
		let newValues = [
			{length: bartol_to_part['Shoulder to wrist (arm)'](bartol, heightInMeters) / to_inch()},
			{length: bartol_to_part['biceps'](bartol, heightInMeters) / to_inch()},
			{length: bartol_to_part['Wrist width'](bartol, heightInMeters) / to_inch()},
		]

				// directly add to the VirtualPattern
	      //parts.update(($parts) => $parts.map((part, i) => ({ ...part, ...newValues[i] })));

				updateParts(newValues);
		console.log(newValues, $parts)		
		/*
			if (!handleClickEnabled) {	

			}
			else{
				addModifiedParts(
					newValues
				)
			}
	 */
  }

</script>


<style>
	.container {
	  display: flex;
	  flex-direction: column;
		color: black;
		background-color: white;
	}
	
	.input-wrapper {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 10px; 
	}

	.estimate-input {
		width: 3em;
	}
	
	.gender {
		height: 2em;
	}	
/*todo: fig out later */
	.measurement-button {
		display: flex;
		align-items: center;	
	}
</style>

<div class="container">
  <div class="input-wrapper">
    <div>height in meters</div>
    <div>
			<input class="estimate-input" step="0.01" type="number" bind:value={heightInMeters} />
		</div>
  </div>
  <div class="input-wrapper">
    <div>weight in kg</div>
    <div>
			<input class="estimate-input" step="0.1" type="number" bind:value={weightInKg} />
		</div>
  </div>

	<div class="input-wrapper">
		<div> 
			gender
		</div>
		<div class="gender">
			<select name="gender" id="cars">
			  <option value="female">female</option>
			  <option value="male" disabled>male</option>
			</select>		
		</div>
	</div>
	
  <div class="measurement-button">
		<div>
			<button on:click={handleClick}>
			Add Measurement Rulers		
			</button>
		</div>
	</div>
</div>
