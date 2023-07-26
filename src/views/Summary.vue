<template>
  <div>
    <h1>Quiz Summary</h1>
    <p>You answered {{ correctAnswers }} out of {{ totalQuestions }} questions correctly.</p>
    <p>Your score: {{ score }}%</p>
    <button @click="retakeQuiz">Retake Quiz</button>
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
    }
  }
}
</script>

<style scoped>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
  color: #2447f9;
  font-size: 2em;
  text-align: center;
}

.summary-container {
  display: grid;
  place-items: center;
  height: 100vh;
  text-align: center;
}

button {
  background-color: #3d5bf3;
  color: white;
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1em;
}

button:hover {
  background-color: #0929c7;
}

.score {
  font-size: 3em;
  color: #30336b;
  margin-top: 1em;
}
</style>

