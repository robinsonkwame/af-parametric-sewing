<script>
	import {onMount, onDestroy} from 'svelte'
	import {show_popup_pattern} from './utils.js'
	import ActualPattern from './ActualPattern.svelte'

	// Popup component from 
	//   https://svelte.dev/repl/4ed97c8932334861a504d9fd850f7dbd?version=4.2.0
	let win
	let component

	onDestroy(destroyWindow)
	
	function destroyWindow() {
		try {
			if (component) {
				component.$destroy()
			}
		} finally {
			if (win) {
				win.close()
			}
		}
	}
	
	function createWindow() {
		destroyWindow()
		win = window.open(
			'about:blank', // can we open a new tab instead?
			'', 
			'width=420,height=230,resizable,scrollbars=yes,status=1'
		)
		try {
			var container = win.document.createElement('div')
			win.document.body.appendChild(container)
			component = new ActualPattern({
				target: container,
			})
		} catch (err) {
			win.close()
			throw err
		}
	}

	$: if($show_popup_pattern){
		createWindow()
	}else{
		destroyWindow()
	}
</script>

<button on:click={() => $show_popup_pattern = !$show_popup_pattern}> 
Actual Size 
</button>