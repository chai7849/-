import { encouragements, questions } from './game-data.js';

const state = {
  currentIndex: 0,
  selectedAnswer: null,
  score: 0,
  showHint: false,
  answeredCount: 0,
};

const elements = {
  score: document.querySelector('#score'),
  totalScore: document.querySelector('#total-score'),
  questionNumber: document.querySelector('#question-number'),
  progressPercent: document.querySelector('#progress-percent'),
  progressFill: document.querySelector('#progress-fill'),
  questionType: document.querySelector('#question-type'),
  questionPrompt: document.querySelector('#question-prompt'),
  hintButton: document.querySelector('#hint-button'),
  encouragement: document.querySelector('#encouragement'),
  hintBox: document.querySelector('#hint-box'),
  choices: document.querySelector('#choices'),
  resultBox: document.querySelector('#result-box'),
  answeredCount: document.querySelector('#answered-count'),
  nextButton: document.querySelector('#next-button'),
  finishCard: document.querySelector('#finish-card'),
  finishMessage: document.querySelector('#finish-message'),
};

function getCurrentQuestion() {
  return questions[state.currentIndex];
}

function renderQuestion() {
  const question = getCurrentQuestion();
  const progress = Math.round(((state.currentIndex + 1) / questions.length) * 100);

  elements.totalScore.textContent = String(questions.length);
  elements.score.textContent = String(state.score);
  elements.questionNumber.textContent = `${state.currentIndex + 1}번째 문제`;
  elements.progressPercent.textContent = `${progress}% 진행`;
  elements.progressFill.style.width = `${progress}%`;
  elements.questionType.textContent = question.type;
  elements.questionPrompt.textContent = question.prompt;
  elements.encouragement.textContent = encouragements[state.currentIndex % encouragements.length];
  elements.hintButton.textContent = state.showHint ? '도움말 접기' : '도움말 보기';
  elements.hintBox.textContent = `💡 ${question.hint}`;
  elements.hintBox.hidden = !state.showHint;
  elements.resultBox.hidden = !state.selectedAnswer;
  elements.answeredCount.textContent = String(state.answeredCount);
  elements.nextButton.hidden = !state.selectedAnswer;
  elements.nextButton.textContent = isLastQuestion() ? '처음부터 다시 하기' : '다음 문제로 가기';
  elements.finishCard.hidden = !isFinished();

  renderChoices(question);
  renderResult(question);

  if (isFinished()) {
    elements.finishMessage.innerHTML = `총 ${questions.length}문제 중 <strong>${state.score}문제</strong>를 맞혔습니다. 점수보다 중요한 것은 꾸준히 떠올리고 말해 보는 연습입니다.`;
  }
}

function renderChoices(question) {
  elements.choices.innerHTML = '';

  question.choices.forEach((choice) => {
    const button = document.createElement('button');
    const isSelected = state.selectedAnswer === choice;
    const isCorrectAnswer = choice === question.answer;
    const isWrongSelected = isSelected && !isCorrectAnswer;

    button.type = 'button';
    button.className = 'choice-button';
    button.textContent = choice;
    button.disabled = Boolean(state.selectedAnswer);

    if (state.selectedAnswer && isCorrectAnswer) {
      button.classList.add('correct');
    }

    if (isWrongSelected) {
      button.classList.add('wrong');
    }

    button.addEventListener('click', () => handleAnswer(choice));
    elements.choices.append(button);
  });
}

function renderResult(question) {
  if (!state.selectedAnswer) {
    elements.resultBox.innerHTML = '';
    elements.resultBox.className = 'result-box';
    return;
  }

  const isCorrect = state.selectedAnswer === question.answer;
  elements.resultBox.className = `result-box ${isCorrect ? 'success' : 'retry'}`;
  elements.resultBox.innerHTML = `
    <strong>${isCorrect ? '정답입니다!' : '괜찮아요, 다시 익히면 됩니다.'}</strong>
    <p>${question.explanation}</p>
  `;
}

function handleAnswer(choice) {
  if (state.selectedAnswer) {
    return;
  }

  const question = getCurrentQuestion();
  state.selectedAnswer = choice;
  state.answeredCount += 1;

  if (choice === question.answer) {
    state.score += 1;
  }

  renderQuestion();
}

function handleHintToggle() {
  state.showHint = !state.showHint;
  renderQuestion();
}

function handleNext() {
  if (isFinished()) {
    restartGame();
    return;
  }

  state.currentIndex += 1;
  state.selectedAnswer = null;
  state.showHint = false;
  renderQuestion();
}

function restartGame() {
  state.currentIndex = 0;
  state.selectedAnswer = null;
  state.score = 0;
  state.showHint = false;
  state.answeredCount = 0;
  renderQuestion();
}

function isLastQuestion() {
  return state.currentIndex === questions.length - 1;
}

function isFinished() {
  return isLastQuestion() && Boolean(state.selectedAnswer);
}

elements.hintButton.addEventListener('click', handleHintToggle);
elements.nextButton.addEventListener('click', handleNext);

renderQuestion();
