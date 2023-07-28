<script context="module">
	import { getContext } from 'svelte';	
  import  DragDropTouch  from 'svelte-drag-drop-touch'
  import { asDraggable } from 'svelte-drag-and-drop-actions'
</script>

<script>
	// kludges to make placing indicator
	let minY = -1000
	let maxX = 1000
	export let key;
  export let x2 = 0, y2 = 0;

	// update x2, y2 to be in reference to parent abs position
	let the_context = getContext(key);
	let top_pos = parseInt(the_context.top, 10)
	let left_pos = parseInt(the_context.left, 10)
	let indicator_x = parseInt(the_context.indicator_x, 10)
	let indicator_y = parseInt(the_context.indicator_y, 10)
	
	let x1_line = 126//parseInt(x1);
	let y1_line = -47//parseInt(y1); // fixed to display:line relative
	
	// we assume the position is given in terms of mouse viewport x, y 
	//  and so we need to convert to SVG and <html> viewport absolute
	let x2_line = x2 - 19
	let y2_line = y2 - 125
	// ... fix up in opposite direction if from_left
	if(the_context.from_left){
		// sets the beginning of the indicator line
		x1_line = 0

		// sets the indicator line
		// terminal point of the SVG line, different coordinate system
		x2_line = indicator_x - left_pos
		y2_line = indicator_y - 125 // want to offset height of input box

		// sets the indicator box 
		// (the tiny orange indicator box)
		x2 = indicator_x
		y2 = indicator_y
	}

	
	function onDragStart(){
		if(Number.isFinite(x2)){
			return { x:x2,y:y2 } 
		}
	}
  function onDragMove (x,y, dx,dy) { x2 = x; y2 = y }
  function onDragEnd  (x,y, dx,dy) { x2 = x; y2 = y }
</script>

<!-- INDICATOR LINE -->
<svg class="make_abs" style="overflow:visible">
	<line x1={x1_line} y1={y1_line} x2={x2_line} y2={y2_line-top_pos} stroke="darkgray" stroke-width=2 />
</svg>

<!-- INDICATOR BOX -->
<div class="Handle make_abs" style="left:{x2-2}px; top:{y2-3}px"
	use:asDraggable={{
		onDragStart:onDragStart, onDragMove:onDragMove, onDragEnd:onDragEnd,
		minX:0,minY:minY, maxX:maxX,maxY:400
	}}
/>


<style>
	.make_abs{
		position:fixed;
	}
  .Handle {
    width:18px; height:8px;
    border:solid 1px black;
    background:orange;
    cursor:move;
		opacity: 0.5;
  }	
  :global([draggable]) {
    -webkit-touch-callout:none;
    -ms-touch-action:none; touch-action:none;
    -moz-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;
  }
</style>