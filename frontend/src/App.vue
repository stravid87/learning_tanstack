<script setup>
import { ref, onMounted } from 'vue';
import { useQuery } from '@tanstack/vue-query'

// Reactive references for data and state
const poemId = ref(1); 

// Function to fetch all poems from the Express.js API
const fetchAllPoems = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/poems');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const allPoemsData = await response.json();
    //console.log("allPoemsData:", allPoemsData)
    return allPoemsData; // Update the poems ref with the fetched data
  } catch (err) {
    // console.error("Failed to fetch all poems:", err);

    throw new Error("Failed to fetch all poems: {}", err);
  } finally {
    // isLoading.value = false;
    // console.log("Finally code block");
  }
};

const { isPending, isFetching, isError, data: allPoemData, error } = useQuery({
  queryKey: ['fetchAllPoems'],
  queryFn: fetchAllPoems,
})

// Function to fetch a single poem by its ID
// Now accepts an ID as an argument, allowing buttons to pass their specific ID
const fetchOnePoem = async (param) => {
    // Delay of 2 seconds 
  await new Promise((res, rej)=>{
    setTimeout(()=>{
      res();
    }, 2000);
  })
  const idToFetch = param.queryKey[1]
  //const id = parseInt(idToFetch, 10); // Use the argument for the ID

  // Validate ID
  if (isNaN(idToFetch) || idToFetch < 1 || idToFetch > 5) { // Assuming IDs are 1-5 based on hardcoded data
    error.value = "Please enter a valid poem ID between 1 and 5.";
    singlePoem.value = null;
    displayMode.value = 'single'; // Still show single mode, but with error
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/poems/${idToFetch}`);

    if (!response.ok) {
      // If poem not found (e.g., 404), handle specifically
      if (response.status === 404) {
        throw new Error(`Poem with ID ${id} not found.`);
      }
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (e) {
    console.log(e)
  }
};

const { isPending: op_ip, data: op_data, error: op_error, refetch } = useQuery({
  queryKey: ['fetchOnePoem', poemId],
  queryFn: fetchOnePoem,
})




// Fetch all poems when the component is mounted initially
onMounted(() => {
  console.log("let's do this...")
  //fetchAllPoems();
});
</script>

<template>
  <h1>Get One Poem</h1>
    <button @click="refetch">GET NEXT POEM</button>
    <input type="number" v-model="poemId">
    <div>
      <span v-if="isPending_op">Loading...</span>
      <span v-else-if="isError_op">Error: {{ error_op.message }}</span>
      <div v-else-if="op_data">
        <h2>{{ op_data.id }}</h2><br>
        <h3>{{ op_data.author}}</h3><br>
        <p>{{ op_data.lines }}</p>
      </div>
    </div>
  <hr><br>
  <hr><br>
  <hr><br>
  <hr>
  <span v-if="isPending">Loading...</span>
  <span v-else-if="isError">Error: {{ error.message }}</span>
  <!-- We can assume by this point that `isSuccess === true` -->
  <ul v-else-if="allPoemData">
    <li v-for="poem in allPoemData" :key="poem.id">
      <h2>{{ poem.id }}</h2><br>
      <h3>{{ poem.author}}</h3><br>
      {{ poem.lines }}
    </li>
  </ul>
</template>

<style>
/* Basic Tailwind CSS setup (assuming you have Tailwind configured in your Vue project) */
/* You might need to adjust your tailwind.config.js to include font-inter if not already present */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
  background-color: #f0f4f8; /* Light background for the page */
}

/* Custom scrollbar for poem lines */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
