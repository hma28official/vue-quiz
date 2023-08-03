import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      quizData: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      isLoading: true,
      remainingTime: 60, // add this line
    };
  },
  mutations: {
    setQuizData(state, quizData) {
      state.quizData = quizData;
    },
    setUserAnswer(state, answer) {
      state.userAnswers[state.currentQuestionIndex] = answer;
    },
    nextQuestion(state) {
      if (state.currentQuestionIndex < state.quizData.length - 1) {
        state.currentQuestionIndex++;
        state.remainingTime = 60; // reset the time when go to the next question
        return true; // continue to next question
      } else {
        return false; // no more questions
      }
    },
    setLoading(state, loading) {
      state.isLoading = loading;
    },
    setRemainingTime(state, time) {
      state.remainingTime = time; // add this method
    },
    resetQuiz(state) {
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
      state.remainingTime = 60; // reset the time when reset the quiz
    },
  },
  actions: {
    fetchQuizData({ commit }) {
      commit("setLoading", true);
      fetch("/quizData.json")
        .then((response) => response.json())
        .then((data) => {
          commit("setQuizData", data);
          commit("setLoading", false);
        });
    },
  },
});

export default store;
