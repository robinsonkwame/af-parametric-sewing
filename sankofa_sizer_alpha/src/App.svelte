<!-- Svelte Component -->
<script>
	import BodyPartsUI from './BodyPartsUI.svelte'
	import VirtualInch from './VirtualInch.svelte'
	import BodyMeasurements from './BodyMeasurements.svelte'
	import VirtualPattern from './VirtualPattern.svelte'		
	import Popup from './Popup.svelte'
</script>


<!-- 
	Ideally these div s can be swipeable, where you hit or swipe next

	This would make it a lot easier to use the UI on a tablet
-->
<div class="new-row">
    <div class="rounded-border component">
			 <BodyPartsUI/>
    </div>
    <div class="rounded-border component">
			 <BodyMeasurements /> 
    </div>
    <div class="rounded-border component">
			 <VirtualPattern /> 
    </div>
    <div class="rounded-border component">
			<Popup />
		</div>
</div>

<style>
  /* Style for adding a rounded curved border */
  .rounded-border {
    border: 1px solid lightgray;
    border-radius: 10px;
    padding: 100px;
    margin: 5px;
  }

  /* Style for arranging components in a new row */
  .new-row {
    display: flex;
    flex-direction: row; /* Display items in a column */
		
  }

  /* Style to target each component */
  .component {
    /* Additional component-specific styles here */
  }

/* Visually hide origin marker */
:global(.moveable-origin) {
	border-color: transparent  !important;
	background: transparent  !important;
}

/* Moveable-svelte CSS for markers */

/* Visually hide draggable markers */
:global(.moveable-resizable) {
	border-color: transparent  !important;
	background: transparent  !important;
}
</style>