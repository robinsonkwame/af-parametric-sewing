<script>
	/*
	 Hi Andrew - I put a comment block where
		the measurement ruler stuff is and detail what should happen
		vs what is hapepning right now

	 I'm using the Moveable library, https://github.com/daybrush/moveable
	because it includes pretty neat features like Warp and svg/path elements,
	something that would be nice to have for the future. 
 */

	/*
	 Note on an interaction order that creates off projections when the Actual Size button is pushed:
	* When the sleeve block is first loaded, it's huge; it's basing the dimensions off of a default ppi and the rulers are quite large
  * The user then first resizes the inch marker, the image style width and height change correctly, but the image width and height
	    that Moveable uses to wrap a resize box around does not.
	* I think we need to also update the image width, height (or remove them all together)
 
 */
	import { onMount } from "svelte";
	import VirtualizedInchMarker from './VirtualizedInchMarker.svelte'	

	import {the_id_of_the_base_pattern, parts, pixels_per_inch, actual_pattern } from './utils.js'
	import Moveable from "svelte-moveable";
	import { throttle } from "@daybrush/utils";	

	let image_url = "https://www.theshapesoffabric.com/wp-content/uploads/2022/11/sleeve-pattern-parts.jpg";

  function updateLength(event, index) {
		//event.stopPropagation()
    const newLength = Number(event.target.value);
    if (newLength > 0) {
      parts.update(($parts) => {
        $parts[index].actual_length = newLength;
        return $parts;
      });
    }
  }

	let largest_width;
	let largest_height
	$: {
		
		let the_lengths = $parts.map(part => 
			part.type === "vertical" ? part.virtual_length : -1
		)
		largest_height = Math.max(...the_lengths)
	}

	$: {
		let the_lengths = $parts.map(part => 
			part.type === "horizontal" ? part.virtual_length : -1
		)
		largest_width = Math.max(...the_lengths)
	}

	// pre-scale the image so it's not such a pain to resize rulers onto it
	const handleImageLoad = (event) => {
		event.target.width = largest_width * $pixels_per_inch
		event.target.height = largest_height * $pixels_per_inch	

		$actual_pattern['width'] = event.target.width
		$actual_pattern['height'] = event.target.height

		$actual_pattern['blob'] = event.target.src;
	}
</script>

<VirtualizedInchMarker />

{#each $parts as part, index}	
		{#if part.selected}	
<div class="virtual-part">		
		<!-- This is the ruler, a gray rect that is horizontal or vertical; the user moves this into place on their pattern -->
			<div
				class={"virtual-part-"+index + " virtual-part " + (part.type === "vertical" ? "vertical-line" : "horizontal-line")}
				style="
					width: {part.type === 'horizontal' ? part.virtual_length * $pixels_per_inch : 10}px;
					height: {part.type === 'vertical' ? part.virtual_length * $pixels_per_inch : 10}px;
				"
				tabindex={index}
				role="button"				
			>
			<!-- 
				
				This the input widget for the ruler; it allows the user to correct the length if its incorrect

				expected behavior: user can both move the ruler and enter a new number into the input box
				actual behavior: the user can move the ruler but can not enter a new number in the inptu box. 
				On click is caught but on:input is not.
				
				There seems to be an unwanted interaction between
					* Moveable 
					* Wrapping input in a div (even though that div has no handlers)

				Moving the input outside the virtual part div works as expected except now it does not rotate
				with the ruler div. 
				
			-->
				<div id={"input-virtual-part-"+index}>
	        <input
	          type="number"
	          value={part.actual_length}
	          class="length-input"
						on:click={() => {console.log('whoa nelly')}}						
	          on:input={(event) => updateLength(event, index)}
	        />
	        <span class="part-name">
						{part.name}
					</span>
	      </div>			
			</div>
	
		<Moveable
			target={".virtual-part-"+ index}	
			edge={true}
			draggable={true}
			rotatable={true}
			hideDefaultLines={true}
			rotationPosition={'left'} 
			on:drag={({ detail: e }) => {
				e.target.style.transform = e.transform;

				// update part offset so that we can plot in actual space later
				$parts[index].x = e.translate[0]
				$parts[index].y = e.translate[1]

				/*
				// update input box rotation				
				let input = document.getElementById("input-virtual-part-"+index)
				input.style.transform = e.transform;
				*/
			}}
			on:resize={({ detail: e }) => {
				e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
				e.target.style.transform = e.drag.transform;

				$actual_pattern['width'] = e.width;
				$actual_pattern['height'] = e.height;
				
			}}
			on:beforeRotate={({ detail: e }) => {
				e.setRotation(throttle(e.rotation, 15));
			}}			
			on:rotate={({ detail: e }) => {
				// Apply the transformation to the Moveable target
				  e.target.style.transform = e.drag.transform;
			}}
		/>
	</div>
{/if}			
	{/each}

<!-- 
	todo: probably better to show re-sizing gui elements somehow so users don't get confused 
				I override moveable css in App.svelte heavy handily 

	There's also something off about resizing the image and then having to also move the rulers around.
A grouped moving of the rulers if no specific ruler is selected might do the trick; also
making the group percentage the same might help prevent it from "floating away"

But these are nice-to-haves

I also think it'll be easier when this is displayed as swiapble screens, so you're only focusingon the current
component and things aren't really overlaping other areas of the UI, that looks weird.
-->
<img 
	id="virtual-pattern" 
	class="virtual-pattern" 
	alt="" 
	src={image_url} 
	on:load={handleImageLoad}
	height={largest_height * $pixels_per_inch}
	width={largest_width * $pixels_per_inch}
	/>
<Moveable
	target=".virtual-pattern"
	edge={true}
	resizable={true}
	on:resize={({ detail: e }) => {
		e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
		$actual_pattern['width'] = e.width;
		$actual_pattern['height'] = e.height;

	}}
/>

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
    width: 2.5em;
	}
	
  .length-container {
  }

	.virtual-pattern {
		pointer-events: none;
		z-index: -1;
	}
	
</style>