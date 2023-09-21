<script>
	import { parts, checkboxStates, toggle_overlay, box_to_checkbox, checkBoxToPartId } from './utils.js'
	import BodyParts from "./BodyParts.svelte"
	const standing_female_image = "https://media.githubusercontent.com/media/robinsonkwame/af-parametric-sewing/main/static/model-breasts-standing.jpg"
	const default_overlay = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAwIiBoZWlnaHQ9IjE1MDAiPjwvc3ZnPgo="

	// would be awesome if we could persist selected tape measurements; right now we revet to blank
	const handleMouseover = (overlay=default_overlay) => {
		measurement_ruler = overlay;
	}

	let measurement_ruler = default_overlay;

	const handleCheckboxMouseover = (bodyPart) => {
		toggle_overlay.set(bodyPart);
	}

	$: {
		let checkbox = document.getElementById($box_to_checkbox['bodyPart']+"_checkbox");
		if(checkbox){
			if(checkbox.checked){
				checkbox.checked = false
			}else{
				checkbox.checked = true				
			}
		}
	}

	const handleCheck = (bodyPart) => {
		// we operate on a reactive variable, although that said this is kludgy
		function setSelectedById(array, id) {
				for(let i = 0; i < array.length; i++){
						if(array[i].id === id){
								array[i].selected = true;
								return;
						}
				}
		}		
		let part_id = checkBoxToPartId[bodyPart]
		setSelectedById($parts, part_id)

	}
	
</script>


<div id="container">
	<img
		class="background"
		alt=""
		src={measurement_ruler}
		style="background-image: url({standing_female_image}); background-size: cover;"
	>
  <BodyParts
		{handleMouseover}
		/>
</div>

<div class="checkbox-container">
  {#each checkboxStates as bodyPart}
    <label 
			on:mouseover="{() => handleCheckboxMouseover(bodyPart)}"
			on:focus="{() => true}"
			on:mouseout="{() => handleCheckboxMouseover(null)}"	
			on:blur="{() => handleCheckboxMouseover(null)}"
			on:change="{() => handleCheck(bodyPart)}"
			>
			
			{bodyPart}
      <input
        type="checkbox"
        id="{bodyPart}_checkbox"
      />
			<br />
    </label>
  {/each}
</div>


<style>
.checkbox-container {
	color:black;
}

#container {
  height: 75vh;
  position: relative;
  width: 100vh; /* need a width too */
	border: black solid 1px;
}
.background {
  height: 100%; /* need too, for image*/
}	
</style>


