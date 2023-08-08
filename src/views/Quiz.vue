<template>
  <div class="quiz-page">
    <h1 class="quiz-title">Quiz</h1>
    <div class="quiz-container">
      <p v-if="isLoading">Loading...</p>
      <div v-else>
        <div class="timer">Time left: {{ remainingTime }} seconds</div>
        <div v-if="quizData.length && currentQuestion">
          <div class="question">{{ currentQuestion.question }}</div>
          <img
            v-if="currentQuestion.image"
            :src="currentQuestion.image"
            alt="Question image"
            class="question-image"
          />
          <div
            v-for="(option, index) in shuffledOptions"
            :key="index"
            :class="optionClass(option)"
          >
            <input
              type="radio"
              :id="option"
              :value="option"
              v-model="userAnswer"
              :disabled="remainingTime === 0 || submitted"
              @click="toggleAnswer"
            />
            <label :for="option">
              <img
                v-if="isUrl(option)"
                :src="option"
                class="option-image"
                alt="Option Image"
              />
              <span v-else>{{ option }}</span>
            </label>
          </div>
          <button
            class="submit-button"
            v-if="
              !submitted &&
              remainingTime > 0 &&
              (userAnswer || remainingTime === 0)
            "
            @click="submitAnswer"
          >
            Submit
          </button>
          <button
            class="next-button"
            v-if="submitted || remainingTime === 0"
            @click="nextQuestionHandler"
          >
            Next Question
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

function shuffleArray(array, type) {
  if (type === "text") {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  // Don't shuffle if type is 'image'
  return array;
}

export default {
  data() {
    return {
      userAnswer: "",
      timerInterval: null,
      previousAnswer: null,
      submitted: false,
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
      let question = this.quizData[this.currentQuestionIndex];
      if (question) {
        question = JSON.parse(JSON.stringify(question));
        question.options = shuffleArray(question.options, question.answerType); // pass the answer type here
      }
      return question;
    },
    shuffledOptions() {
      return this.currentQuestion
        ? shuffleArray(
            [...this.currentQuestion.options],
            this.currentQuestion.answerType
          ) // pass the answer type here
        : [];
    },
  },
  methods: {
    ...mapMutations([
      "setUserAnswer",
      "nextQuestion",
      "resetQuiz",
      "setRemainingTime",
    ]),
    isUrl(str) {
      try {
        new URL(str);
      } catch (_) {
        return false;
      }
      return true;
    },
    optionClass(option) {
      if (!this.submitted) {
        return;
      }
      if (this.currentQuestion.answerType === "text") {
        if (option === this.currentQuestion.answer) {
          return "correct-answer"; // add 'correct' class
        }
        if (option === this.userAnswer) {
          return "wrong-answer"; // add 'incorrect' class
        }
      } else if (this.currentQuestion.answerType === "image") {
        if (option === this.currentQuestion.answer) {
          return "correct-answer"; // add 'correct' class
        }
        if (option === this.userAnswer) {
          return "wrong-answer"; // add 'incorrect' class
        }
      }
    },
    toggleAnswer(event) {
      if (this.remainingTime > 0 && !this.submitted) {
        const answer = event.target.value;

        if (this.currentQuestion.answerType === "text") {
          if (answer === this.previousAnswer) {
            this.userAnswer = null;
            this.previousAnswer = null;
          } else {
            this.userAnswer = answer;
            this.previousAnswer = answer;
          }
        } else if (this.currentQuestion.answerType === "image") {
          if (answer === this.previousAnswer) {
            this.userAnswer = null;
            this.previousAnswer = null;
          } else {
            this.userAnswer = answer;
            this.previousAnswer = answer;
          }
        }
      }
    },
    submitAnswer() {
      this.submitted = true;
      if (this.remainingTime > 0) {
        clearInterval(this.timerInterval);
      }
    },
    nextQuestionHandler() {
      // Set the user answer in the Vuex state
      this.setUserAnswer(this.userAnswer);
      // Move to the next question or go to the summary page
      if (this.currentQuestionIndex < this.quizData.length - 1) {
        this.nextQuestion();
      } else {
        this.$router.push("/summary");
      }
      // Reset the user answer and the submitted state
      this.userAnswer = "";
      this.submitted = false;
      this.startTimer();
    },
    startTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
      }
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
      this.submitted = false;
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

.quiz-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
}

.quiz-title {
  color: #2447f9;
  font-size: 2em;
  margin-bottom: 1em;
}

.quiz-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;  /* Maksimum lebar container */
  background: #fff; /* Background putih untuk quiz-container */
  padding: 2em;     /* Beri padding di sekitar konten */
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);  /* Bayangan untuk depth */
  border-radius: 10px;  /* Membuat sudut container menjadi rounded */
  overflow-y: auto;
}

h1 {
  color: #2447f9;
  font-size: 2.5em;
  margin-bottom: 1em;
}

.timer {
  font-size: 1.2em;
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

.option-image {
  width: 100px;
  height: 100px;
}

input[type="radio"] {
  margin-right: 0.5em;
}

.correct-answer {
  background-color: #4caf50;
  color: white;
  padding: 0.5em;
  border-radius: 5px;
  margin: 0.5em 0;
}

.wrong-answer {
  background-color: #f44336;
  color: white;
  padding: 0.5em;
  border-radius: 5px;
  margin: 0.5em 0;
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
