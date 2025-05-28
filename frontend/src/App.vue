<script setup>
import { ref, onMounted } from 'vue';

// Reactive references for data and state
const poems = ref([]); // Stores the list of all poems
const singlePoem = ref(null); // Stores a single selected poem
const poemIdInput = ref(''); // Binds to the input field for poem ID
const isLoading = ref(true); // Indicates if data is currently being loaded
const error = ref(null); // Stores any error messages
const displayMode = ref('all'); // Controls what is displayed: 'all' or 'single'

// Function to fetch all poems from the Express.js API
const fetchAllPoems = async () => {
  try {
    isLoading.value = true;
    error.value = null; // Clear any previous errors
    singlePoem.value = null; // Clear single poem view
    displayMode.value = 'all'; // Set display mode to show all poems

    const response = await fetch('http://localhost:3000/api/poems');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    poems.value = data; // Update the poems ref with the fetched data
  } catch (err) {
    console.error("Failed to fetch all poems:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

// Function to fetch a single poem by its ID
const fetchSinglePoem = async () => {
  const id = parseInt(poemIdInput.value, 10); // Get ID from input and convert to integer

  // Validate ID
  if (isNaN(id) || id < 1 || id > 5) { // Assuming IDs are 1-5 based on hardcoded data
    error.value = "Please enter a valid poem ID between 1 and 5.";
    singlePoem.value = null;
    displayMode.value = 'single'; // Still show single mode, but with error
    return;
  }

  try {
    isLoading.value = true;
    error.value = null; // Clear any previous errors
    poems.value = []; // Clear all poems list
    displayMode.value = 'single'; // Set display mode to show a single poem

    const response = await fetch(`http://localhost:3000/api/poems/${id}`);

    if (!response.ok) {
      // If poem not found (e.g., 404), handle specifically
      if (response.status === 404) {
        throw new Error(`Poem with ID ${id} not found.`);
      }
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    singlePoem.value = data; // Update the singlePoem ref
  } catch (err) {
    console.error(`Failed to fetch poem with ID ${id}:`, err);
    error.value = err.message;
    singlePoem.value = null; // Ensure single poem is cleared on error
  } finally {
    isLoading.value = false;
  }
};

// Fetch all poems when the component is mounted initially
onMounted(() => {
  //fetchAllPoems();
});
</script>

<template>
  <div class="container mx-auto p-4 font-inter text-gray-800">
    <h1 class="text-4xl font-bold text-center mb-8 text-blue-700 rounded-lg p-2 shadow-md">
      Our Collection of Poems
    </h1>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <input type="number" v-model="poemIdInput" placeholder="Enter Poem ID (1-5)"
               class="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48">
        <button @click="fetchSinglePoem"
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-300 w-full sm:w-auto">
          Fetch Poem by ID
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center text-xl text-blue-500">
      <p>Loading content...</p>
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mt-4"></div>
    </div>

    <div v-else-if="error" class="text-center text-red-600 bg-red-100 p-4 rounded-lg shadow-md">
      <p class="font-bold">Error:</p>
      <p>{{ error }}</p>
      <p class="text-sm mt-2">Please ensure your Express.js server is running on http://localhost:3000</p>
    </div>

    <div v-else-if="displayMode === 'all'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="poem in poems" :key="poem.id"
           class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
        <h2 class="text-2xl font-semibold text-purple-700 mb-2">{{ poem.title }}</h2>
        <p class="text-gray-600 italic mb-4">- {{ poem.author }}</p>
        <div class="text-gray-700 text-sm leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">
          <p v-for="(line, index) in poem.lines" :key="index" class="mb-1">
            {{ line }}
          </p>
        </div>
      </div>
    </div>

    <div v-else-if="displayMode === 'single' && singlePoem"
         class="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 class="text-3xl font-semibold text-purple-700 mb-4 text-center">{{ singlePoem.title }}</h2>
      <p class="text-gray-600 italic mb-6 text-center">- {{ singlePoem.author }}</p>
      <div class="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
        <p v-for="(line, index) in singlePoem.lines" :key="index" class="mb-1">
          {{ line }}
        </p>
      </div>
    </div>
    <div v-else-if="displayMode === 'single' && !singlePoem && !error" class="text-center text-gray-500">
      <p>No poem selected or found with the given ID. Please enter an ID and click "Fetch Poem by ID".</p>
    </div>
  </div>
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
