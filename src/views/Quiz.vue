<template>
  <div class="quiz-container">
    <h1>Quiz</h1>
    <p v-if="isLoading">Loading...</p>
    <div v-else>
      <div class="timer">Time left: {{ remainingTime }} seconds</div>
      <div v-if="quizData.length && currentQuestion">
        <div class="question">{{ currentQuestion.question }}</div>
        <img v-if="currentQuestion.image" :src="currentQuestion.image" alt="Question image" class="question-image">
        <div class="options" v-for="(option, index) in currentQuestion.options" :key="index">
          <div class="option">
            <input
              type="radio"
              :id="option"
              :value="option"
              v-model="userAnswer"
              :disabled="remainingTime === 0 || showCorrect"
              @click="toggleAnswer"
            />
            <label :for="option" :class="getLabelClass(option)">{{ option }}</label>
          </div>
        </div>
        <button class="submit-button"
          v-if="userAnswer || remainingTime === 0"
          @click="submitAnswer"
        >
          Submit
        </button>
        <button class="next-button"
          v-if="showCorrect && (userAnswer || remainingTime === 0)"
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
      showCorrect: false,
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
      if (this.remainingTime > 0 && !this.showCorrect) {
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
    getLabelClass(option) {
      if (this.showCorrect) {
        if (option === this.currentQuestion.answer) {
          return "correct-answer";
        } else if (option === this.userAnswer) {
          return "wrong-answer";
        }
      }
      return "";
    },
    submitAnswer() {
      // Set the user answer in the Vuex state
      this.setUserAnswer(this.userAnswer);

      this.showCorrect = true;
    },
    nextQuestionHandler() {
      // Stop the timer
      clearInterval(this.timerInterval);

      this.showCorrect = false;

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
  height: 80vh;
  text-align: center;
  padding: 0 2em;
}

h1 {
  color: #2447f9;
  font-size: 2.5em;
  margin-bottom: 1em;
}

.timer {
  font-size: 1.5em;
  color: #30336b;
  margin-bottom: 1em;
}

.question {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 1em;
}

.question-image {
  width: 100%;
  max-width: 500px;
  height: auto;
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

.correct-answer {
  background-color: #28a745;
  color: white;
}

.wrong-answer {
  background-color: #dc3545;
  color: white;
}

.submit-button,
.next-button {
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

.submit-button:hover,
.next-button:hover {
  background-color: #0929c7;
}

.submit-button {
  margin-right: 0.5em;
}
</style>
