<script>
	import { actual_pattern } from './utils.js'
  let imageUrl = ''; // Variable to store the URL or base64 data of the image

  let fileInput = null; // Reference to the file input element

  // Function to handle image file upload
  function handleFileUpload(event) {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imageUrl = e.target.result; // Set the image URL to base64 data
      };
      reader.readAsDataURL(file);
    }
  }

	function setSleeveBlock(){
		imageUrl = "https://www.theshapesoffabric.com/wp-content/uploads/2022/11/sleeve-pattern-parts.jpg"
		$actual_pattern['blob'] = imageUrl;
	}
	
</script>

<div>
  {#if !imageUrl}
    <!-- Input box for URL -->
    <input type="text" placeholder="Enter image URL" bind:value={imageUrl} />

    <!-- Input box for file upload -->
    <input type="file" accept="image/*" on:change={handleFileUpload} bind:this={fileInput} />
		<!-- demo button :D -->
		<button 
			type="button" 
			on:click={setSleeveBlock}> 
						Sleeve block (Demo) 
		</button>
  {/if}
</div>