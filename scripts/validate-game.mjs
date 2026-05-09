import { questions } from '../game-data.js';

const failures = [];
const ids = new Set();

questions.forEach((question, index) => {
  if (ids.has(question.id)) {
    failures.push(`${index + 1}번째 문제의 id가 중복되었습니다.`);
  }

  ids.add(question.id);

  if (!question.prompt || !question.answer || !question.hint || !question.explanation) {
    failures.push(`${question.id}번 문제에 필수 문구가 비어 있습니다.`);
  }

  if (!Array.isArray(question.choices) || question.choices.length !== 4) {
    failures.push(`${question.id}번 문제는 선택지가 정확히 4개여야 합니다.`);
  }

  if (!question.choices.includes(question.answer)) {
    failures.push(`${question.id}번 문제의 선택지에 정답이 없습니다.`);
  }
});

if (questions.length < 9) {
  failures.push('어르신이 충분히 연습할 수 있도록 최소 9문제가 필요합니다.');
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`검증 완료: ${questions.length}개의 낱말놀이 문제가 준비되었습니다.`);
