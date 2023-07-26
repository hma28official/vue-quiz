<template>
  <div>
    <h1>Quiz</h1>
    <p v-if="isLoading">Loading...</p>
    <div v-else-if="quizData.length && currentQuestion">
      <p>{{ currentQuestion.question }}</p>
      <div v-for="(option, index) in currentQuestion.options" :key="index">
        <input type="radio" :id="option" :value="option" v-model="userAnswer">
        <label :for="option">{{ option }}</label>
      </div>
      <p v-if="userAnswers[currentQuestionIndex] !== undefined">
        You answered: {{ userAnswers[currentQuestionIndex] }}
        <span v-if="userAnswers[currentQuestionIndex] === currentQuestion.answer">Correct!</span>
        <span v-else>Incorrect. The correct answer was: {{ currentQuestion.answer }}</span>
      </p>
      <button @click="nextQuestionHandler">Next Question</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      userAnswer: ''
    }
  },
  computed: {
    ...mapState(['quizData', 'currentQuestionIndex', 'userAnswers', 'isLoading']),
    currentQuestion() {
      return this.quizData[this.currentQuestionIndex];
    }
  },
  methods: {
    ...mapMutations(['setUserAnswer', 'nextQuestion', 'resetQuiz']),
    selectOption(option) {
      this.userAnswer = option;
      this.setUserAnswer(option);
    },
    nextQuestionHandler() {
      this.setUserAnswer(this.userAnswer);
      
      if (this.currentQuestionIndex < this.quizData.length - 1) {
        this.nextQuestion();
      } else {
        this.$router.push('/summary');
      }
    }
  },
  watch: {
    currentQuestionIndex() {
      this.userAnswer = this.userAnswers[this.currentQuestionIndex] || '';
    }
  },
  created() {
    this.$store.dispatch('fetchQuizData');
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

.quiz-container {
  display: grid;
  place-items: center;
  height: 100vh;
}

.question {
  font-size: 1.5em;
  margin-bottom: 1em;
}

.options {
  display: grid;
  gap: 1em;
}

.option {
  display: flex;
  align-items: center;
}

input[type="radio"] {
  margin-right: 0.5em;
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
</style>
