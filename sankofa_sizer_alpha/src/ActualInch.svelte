<script>
	//import PPIToMarker from './PPIToMarker.svelte'
	import InchMarker from './InchMarker.svelte' // our virtual marker	

	export let ppi_slider = 72;
	export let length = 3;
	export let unit = "inches"
</script>

<div>
	<div>
<InchMarker 
	unit={unit}
	length={length}
	pixels_per_inch={ppi_slider}
	/> 
	</div>

	<input type=range min=1 max=326 step=1 bind:value={ppi_slider} />{ppi_slider} ppi

	<input type="number" min=1 max=50 step=1 bind:value={length} /> {unit == 'inches' ? 'in' : 'mm'} length
</div>
