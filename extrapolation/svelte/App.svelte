<script>
	import { onMount, setContext } from 'svelte'
	import { bodyMeasurements, vert_from_bottom, are_equal } from "./parametric.js"
	import { CISFEMALE, CISMALE } from "./freesewingMeasurement.js"
	import NumberSpinner from './NumberSpinner.svelte';

  const imageUrl = 'https://raw.githubusercontent.com/robinsonkwame/csdt-af-sewing/main/static/front-model-only-standing.jpg';
	const makeXLeft = (value) => { return value - 100;}	

	// DEMO: kinda matching best i can from here between Freesewing and a nominal reference
	// https://www.ageberry.com/wp-content/uploads/2019/09/Body-measurements-chart-768x994.jpg.webp
	// -----
	// These coordinates are <html> viewport coordinates. If you press "A" and look at the console
	// it'll spit out it the x,y coordinates. The 'from_left' tag tells it to use the coordinates
	// in an opposite direction so that what pt you give where the indicator line and tiny box end up
	// -----
		const measurement_names_and_positions = [
			{key: 'neck', top: '0px', left: '0px', indicator_x: 453, indicator_y: 184 },
		  {key: 'biceps', top: '100px', left: '0px', indicator_x: 396, indicator_y: 243 },
			{key: 'highBust', top: '300px', left: '0px', indicator_x: 470, indicator_y: 237},
			{key: 'underbust', top: '400px', left: '0px', indicator_x: 465, indicator_y: 264},
			{key: 'waist', top: '500px', left: '0px', indicator_x: 475, indicator_y: 332},
			{key: 'hips', top: '600px', left: '0px', indicator_x: 429, indicator_y: 347},
			{key: 'shoulderToShoulder', top: '0px', left: '770px', indicator_x: 459, indicator_y: 198, from_left: true},
			{key: 'shoulderToWrist', top: '100px', left: '770px', indicator_x: 558, indicator_y: 233, from_left: true},
			{key: 'wrist', top: '200px', left: '770px', indicator_x: 616, indicator_y: 294, from_left: true},
			{key: 'hpsToWaistFront', top: '300px', left: '770px', indicator_x: 522, indicator_y: 291, from_left: true},
			{key: 'waistToSeat', top: '400px', left: '770px', indicator_x: 525, indicator_y: 334, from_left: true},
			{key: 'inseam', top: '600px', left: '770px', indicator_x: 451, indicator_y: 512,from_left: true},
			{key: 'upperLeg', top: '500px', left: '770px', indicator_x: 497, indicator_y: 412,from_left: true},
			{key: 'waistToFloor', top: '200px', left: '0px', indicator_x: 294, indicator_y: 491}]

	
	// Set up store so that Callout.svelte can position itself on absolute coordinates
	measurement_names_and_positions.forEach((item)=>{
		setContext(item.key, item)		
	})

	// Initalize the data to be a standard female neck
	let neckSize = 340 // mm, about 13"

	let the_measurement_name = "neck"
	let data = {
		neckSize: neckSize,
		gender: CISFEMALE
	} // setup for debug testing

	let use_this = bodyMeasurements.getMeasurements(data)
	bodyMeasurements.set(use_this);

	// DEBUG STUff to help determine the x,y positions for each!
	// ----------------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;

    function updateMousePosition(event) {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }

    function handleKeyPress(event) {
      if(event.key === 'a' || event.key === 'A'){
        console.log(`Mouse is at position X: ${mouseX}, Y: ${mouseY}`);
      }
    }

		onMount(() => {
      window.addEventListener('mousemove', updateMousePosition);
      window.addEventListener('keydown', handleKeyPress);

      return () => {
        window.removeEventListener('mousemove', updateMousePosition);
        window.removeEventListener('keydown', handleKeyPress);
      };			
		})
	
	
</script>

Artisanal Futures Parametric Sewing Measurement Extrapolator v alpha-0.1 [image credit: freesewing.org]
<div class="parent-container" >
  {#each measurement_names_and_positions as name_postion}
		<div class="spinner" style="position: absolute; top: {name_postion.top}; left: {name_postion.left};">
			<NumberSpinner
				the_measurement_name = {name_postion.key}
				the_gender = {CISFEMALE}
				indicator_x = {name_postion.indicator_x}
				indicator_y = {name_postion.indicator_y}
      />
		</div>
  {/each}
</div>


<style>	
.parent-container {
  height: 690px;
  width: auto;
  position: relative;
  background-image: url('https://raw.githubusercontent.com/robinsonkwame/csdt-af-sewing/main/static/front-model-only-standing.jpg');
  background-size: auto 690px; /* first value is width , second value is height */
  background-repeat: no-repeat; /* prevent image to repeat itself */
}
  .spinner {
    position: absolute;
  }

</style>
