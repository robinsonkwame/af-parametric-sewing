<script>
	import { parts, the_id_of_the_base_pattern, actual_pattern, pixels_per_inch } from './utils.js'
	import ActualInch from './ActualInch.svelte'

	const X_OFFSET = 8; // feels like there's a rounding error here; compare left side clone against right side clone
	// but Ithink I got it?
	const Y_OFFSET = 9; // part.lineX	 part.lineY
	const FUDGE_FACTOR = 4;

	let INTERPOLATOR_LEFT_OFFSET = 300; // CHEAP HACK	
	/*
          transform: translate({
						$popup_pattern.pattern_offset.x - 
						part.lineX - 
						X_OFFSET - 
						FUDGE_FACTOR}px,  
 */

	//let ppi_slider = 72; // this is the factor we need to scale both the rulers and image by
	let length = 1;

	let width;
	let height;

	// this is the user tweakable ppi setting and we use it
	// to scale from the virtual pattern ppi (assumed to be 96 ppi)
	// this device
	let device_pixels_per_inch = $pixels_per_inch;

	$: width = $pixels_per_inch * $actual_pattern["width"]
	$: height = $pixels_per_inch * $actual_pattern["height"]	
</script>

<ActualInch
	bind:ppi_slider={device_pixels_per_inch}
	{length}
	/>

<div 
	style="position: relative">
{#each $parts as part, index}	
		{#if part.selected}	
		<!-- This is the ruler, a gray rect that is horizontal or vertical; the user moves this into place on their pattern 
								left: {Math.round(width*(part.x/$actual_pattern["width"]))+1}px
			-->
		<div
				class={"virtual-part-"+index + " virtual-part " + (part.type === "vertical" ? "vertical-line" : "horizontal-line")}
				style="
					width: {part.type === 'horizontal' ? part.virtual_length * device_pixels_per_inch : 10}px;
					height: {part.type === 'vertical' ? part.virtual_length * device_pixels_per_inch : 10}px;
					position: absolute;
					left: {part.x * (device_pixels_per_inch/$pixels_per_inch)}px;
					top: {part.y * (device_pixels_per_inch/$pixels_per_inch)}px;
				"
				tabindex={index}
				role="button"				
			>
			<div id={"input-virtual-part-"+index}>
				<input
					type="number"
					value={part.actual_length}
					class="length-input"
					disabled
				/>
				<span class="part-name">
					{part.name}
				</span>
			</div>	
		</div>
			
	{/if}	
{/each}

<img
	alt="" 
	id="actual_pattern" 
	src={$actual_pattern["blob"]} 
	style="
		width: {$actual_pattern["width"] * (device_pixels_per_inch/$pixels_per_inch)}px;
		height: {$actual_pattern["height"] * (device_pixels_per_inch/$pixels_per_inch)}px;
		z-index: -1;
	"
	/>
</div>

<style>
	.virtual-part {
		position: absolute;
		white-space: nowrap;
		color: black;
	}
	
  .vertical-line {
    width: 10px;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .horizontal-line {
    height: 10px; 
    background-color: rgba(0, 0, 0, 0.4);		
  }

  .part-name {
    margin-left: 0.25em;
		position: relative;
		top: -1.7em;		
		color: black;
  }
	
  .length-input {
		position: relative;
		top: -2em;
    width: 3em;
	}
	
  .length-container {
  }

	.virtual-pattern {
		pointer-events: none;
		z-index: -1;
	}
	
</style>