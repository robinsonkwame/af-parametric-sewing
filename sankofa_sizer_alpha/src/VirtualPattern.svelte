<script>
	import VirtualResize from './VirtualResize.svelte'
	import PatternSetter from './PatternSetter.svelte'
	import { actual_pattern } from './utils.js'
	
</script>
{#if $actual_pattern['blob']}
  <VirtualResize />
{:else}
  <PatternSetter />
{/if}