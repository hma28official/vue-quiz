<template>
  <div class="home-container">
    <h1>Welcome to BuildWithAngga</h1>
    <button @click="startQuiz">Start Quiz</button>
  </div>
</template>

<script>
export default {
  methods: {
    startQuiz() {
      this.$router.push('/quiz');
    }
  }
}
</script>

<style scoped>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.home-container {
  display: grid;
  place-items: center;
  height: 100vh;
  text-align: center;
}

h1 {
  color: #2447f9;
  font-size: 3em;
}

button {
  background-color: #3d5bf3;
  color: white;
  padding: 15px 30px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0929c7;
}
</style>
