import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      quizData: [],
      currentQuestionIndex: 0,
      userAnswers: [],
      isLoading: true,
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
        return true; // continue to next question
      } else {
        return false; // no more questions
      }
    },
    setLoading(state, loading) {
      state.isLoading = loading;
    },
    resetQuiz(state) {
      state.currentQuestionIndex = 0;
      state.userAnswers = [];
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
