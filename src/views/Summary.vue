<template>
  <div class="summary-container">
    <h1>Quiz Summary</h1>
    <p>You answered {{ correctAnswers }} out of {{ totalQuestions }} questions correctly.</p>
    <p class="score">Your score: {{ score }}%</p>
    <button @click="retakeQuiz">Retake Quiz</button>
    <button @click="goHome">Back to Home</button>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  computed: {
    ...mapState(['quizData', 'userAnswers']),
    totalQuestions() {
      return this.quizData.length;
    },
    correctAnswers() {
      return this.quizData.filter((question, index) => question.answer === this.userAnswers[index]).length;
    },
    score() {
      return Math.round((this.correctAnswers / this.totalQuestions) * 100);
    }
  },
  methods: {
    ...mapMutations(['resetQuiz']),
    retakeQuiz() {
      this.resetQuiz();
      this.$router.push('/quiz');
    },
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #F2F2F2;
}

.summary-container {
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
  font-size: 2em;
}

p {
  color: #333;
  font-size: 1.2em;
  margin: 1em 0;
}

.score {
  font-size: 2em;
  color: #30336b;
  margin-top: 1em;
}

button {
  background-color: #3d5bf3;
  color: white;
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1em;
  margin-right: 1em;
}

button:hover {
  background-color: #0929c7;
}
</style>
