<template>
  <div class="home-container">
    <h1>Welcome to The BuildWithAngga Quiz</h1>
    <p>Test your knowledge on various topics and see how well you do!</p>
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
  background-color: #F2F2F2;
}

.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh; /* Updated */
  text-align: center;
  padding: 0 2em;
}

h1 {
  color: #2447f9;
  font-size: 2.5em;
}

p {
  color: #333;
  font-size: 1.2em;
  margin: 1em 0;
}

button {
  background-color: #3d5bf3;
  color: white;
  padding: 15px 30px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0929c7;
}
</style>
