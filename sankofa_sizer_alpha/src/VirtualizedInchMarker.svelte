<script>
  import Moveable from "svelte-moveable";
	import { throttle } from "@daybrush/utils";	
	import InchMarker from './InchMarker.svelte' // our virtual marker	
	import { pixels_per_inch } from './utils.js'

	
	// resizable width and height
	//let pixels_per_inch = pixels_per_inch;
	let height = 45;
  let isHovered = true;

</script>

<div
		class="target-inch"
>
	<InchMarker
		unit="inches" 
		length=1
		bind:pixels_per_inch = {$pixels_per_inch}
		bind:height = {height}
		/>	
</div>

<Moveable
		target={".target-inch"}
		hideDefaultLines=true
		rotationPosition="top"
		resizable={true}
		draggable={true}
		rotatable={true}
		on:drag={({ detail: e }) => {
				e.target.style.transform = e.transform;
		}}
		on:resize={({ detail: e }) => {
				$pixels_per_inch = e.width;
				height = e.height;
				e.target.style.cssText += `width: ${e.width}px; height: ${e.height}px`;
				e.target.style.transform = e.drag.transform;
		}}
		on:beforeRotate={({ detail: e }) => {
			e.setRotation(throttle(e.rotation, 15));
		}}
		on:rotate={({ detail: e }) => {
			// nice to have: 5 deg increment rotations
			e.target.style.transform = e.drag.transform;
		}} />

<style>
.target-inch {
    position: absolute;
}
</style>