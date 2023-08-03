<template>
  <div class="quiz-container">
    <h1>Quiz</h1>
    <p v-if="isLoading">Loading...</p>
    <div v-else>
      <p>Time left: {{ remainingTime }} seconds</p>
      <div v-if="quizData.length && currentQuestion">
        <p>{{ currentQuestion.question }}</p>
        <div v-for="(option, index) in currentQuestion.options" :key="index">
          <input
            type="radio"
            :id="option"
            :value="option"
            v-model="userAnswer"
            :disabled="remainingTime === 0"
            @click="toggleAnswer"
          />
          <label :for="option">{{ option }}</label>
        </div>
        <button
          v-if="userAnswer || remainingTime === 0"
          @click="nextQuestionHandler"
        >
          Next Question
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      userAnswer: "",
      timerInterval: null,
      previousAnswer: null,
    };
  },
  computed: {
    ...mapState([
      "quizData",
      "currentQuestionIndex",
      "userAnswers",
      "isLoading",
      "remainingTime",
    ]),
    currentQuestion() {
      return this.quizData[this.currentQuestionIndex];
    },
  },
  methods: {
    ...mapMutations([
      "setUserAnswer",
      "nextQuestion",
      "resetQuiz",
      "setRemainingTime",
    ]),
    toggleAnswer(event) {
      if (this.remainingTime > 0) {
        const answer = event.target.value;

        if (answer === this.previousAnswer) {
          this.userAnswer = null;
          this.previousAnswer = null;
        } else {
          this.userAnswer = answer;
          this.previousAnswer = answer;
        }
      }
    },
    selectOption(option) {
      if (this.remainingTime > 0) {
        this.userAnswer = option;
      }
    },
    nextQuestionHandler() {
      // Set the user answer in the Vuex state
      this.setUserAnswer(this.userAnswer);

      // Show alert based on whether the user answer is correct or not
      if (this.userAnswer === this.currentQuestion.answer) {
        window.alert("Correct!");
      } else {
        window.alert(
          "Incorrect. The correct answer was: " + this.currentQuestion.answer
        );
      }

      // Stop the timer
      clearInterval(this.timerInterval);

      // Move to the next question or go to the summary page
      if (this.currentQuestionIndex < this.quizData.length - 1) {
        this.nextQuestion();
        this.startTimer();
      } else {
        this.$router.push("/summary");
      }
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.remainingTime > 0) {
          this.setRemainingTime(this.remainingTime - 1);
        } else {
          clearInterval(this.timerInterval);
        }
      }, 1000);
    },
  },
  watch: {
    currentQuestionIndex() {
      this.userAnswer = this.userAnswers[this.currentQuestionIndex] || "";
    },
  },
  created() {
    this.$store.dispatch("fetchQuizData");
    this.startTimer();
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
};
</script>

<style scoped>
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f2f2f2;
}

.quiz-container {
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
  margin-bottom: 1em;
}

.question {
  font-size: 1.5em;
  margin-bottom: 1em;
}

.options {
  display: flex;
  flex-direction: column;
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
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1em;
}

button:hover {
  background-color: #0929c7;
}
</style>
