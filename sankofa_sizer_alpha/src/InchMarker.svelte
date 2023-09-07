<script>
  export let unit = "millimeters"; // or "inches"
  export let length = 1;
  export let pixels_per_inch = 96; // typical screen dpi
	export let height = 45;
	let text_height = 1;
	
	$: text_height = 12;

  $: pixels_per_unit = unit === "inches" ? pixels_per_inch : pixels_per_inch / 25.4;
  $: ruler_length = length * pixels_per_unit;

  let major_ticks = [];
  let minor_ticks = [];

	$: {
	    major_ticks = Array.from({ length: length + 1 }, (_, i) => i * pixels_per_unit).filter(tick => tick <= ruler_length);
	    minor_ticks = unit === "inches"
	      ? Array.from({ length: length * 8 }, (_, i) => i * pixels_per_unit / 8).filter(tick => tick <= ruler_length)
	      : Array.from({ length: length * 10 }, (_, i) => i * pixels_per_unit / 10).filter(tick => tick <= ruler_length);
	  }
</script>

<style>
  .ruler {
    position: relative;
    background: #ddd
  }
  .major-tick {
    position: absolute;
    bottom: 0;
    height: 100%;
    width: 1px;
    background: black;
  }
  .minor-tick {
    position: absolute;
    bottom: 0;
    height: 50%;
    width: 1px;
    background: black;
  }
	.name {
		text-align: center;
		color: black;
		background:rgba(255,255,255, 0.5);
	}
</style>

<div>
<div class="ruler" style="width: {ruler_length}px; height: {height}px">
  {#each major_ticks as tick (tick)}
    <div class="major-tick" style="left: {tick}px"></div>
  {/each}
  {#each minor_ticks as tick (tick)}
    {#if !major_ticks.includes(tick)}
      <div class="minor-tick" style="left: {tick}px"></div>
    {/if}
  {/each}
</div>
<div class="name" style="font-size: {text_height}px">	{length} inch	</div>		
</div>