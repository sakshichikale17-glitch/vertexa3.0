const roadmap = [
  {
    id: 'week-1',
    month: 'Month 1',
    week: 'Week 1',
    title: 'Python basics',
    description: 'Variables, loops, functions, and basic problem-solving patterns.'
  },
  {
    id: 'week-2',
    month: 'Month 1',
    week: 'Week 2',
    title: 'Big O notation and arrays',
    description: 'Understand complexity and practice array operations with speed in mind.'
  },
  {
    id: 'week-3',
    month: 'Month 1',
    week: 'Week 3',
    title: 'Strings and searching',
    description: 'Work with string patterns, substring problems, and common searching strategies.'
  },
  {
    id: 'week-4',
    month: 'Month 1',
    week: 'Week 4',
    title: 'Sorting and linked lists',
    description: 'Review sorting basics and learn how linked lists differ from arrays.'
  },
  {
    id: 'week-5',
    month: 'Month 2',
    week: 'Week 5',
    title: 'Stacks and queues',
    description: 'Explore LIFO and FIFO structures through practical examples.'
  },
  {
    id: 'week-6',
    month: 'Month 2',
    week: 'Week 6',
    title: 'Recursion and backtracking basics',
    description: 'Practice recursive thinking and simple decision-tree problems.'
  },
  {
    id: 'week-7',
    month: 'Month 2',
    week: 'Week 7',
    title: 'Trees and heaps',
    description: 'Learn tree traversal, heaps, and how to reason about hierarchical data.'
  },
  {
    id: 'week-8',
    month: 'Month 2',
    week: 'Week 8',
    title: 'Hashing and revision',
    description: 'Review your fundamentals and strengthen problem-solving with hash maps.'
  },
  {
    id: 'week-9',
    month: 'Month 3',
    week: 'Week 9',
    title: 'Graphs and BFS',
    description: 'Learn graph representations and breadth-first traversal strategies.'
  },
  {
    id: 'week-10',
    month: 'Month 3',
    week: 'Week 10',
    title: 'DFS and greedy algorithms',
    description: 'Understand depth-first traversal and greedy decision making.'
  },
  {
    id: 'week-11',
    month: 'Month 3',
    week: 'Week 11',
    title: 'Dynamic programming',
    description: 'Solve overlapping subproblem challenges with memoization and tabulation.'
  },
  {
    id: 'week-12',
    month: 'Month 3',
    week: 'Week 12',
    title: 'Interview revision and mixed practice',
    description: 'Combine your skills in a final revision block and mock interview mindset.'
  }
];

const STORAGE_KEY = 'learnloop-dsa-progress';
const LESSON_STATE_KEY = 'learnloop-python-lesson-state';
const PYTHON_STARTER_CODE = `ages = [12, 15, 18]
print("Student ages:", ages)
print("Average age:", sum(ages) / len(ages))`;

let pyodideInstance = null;
let pyodideInitPromise = null;

const lessonQuestions = [
  {
    id: 'q1',
    prompt: 'Which statement creates a variable that stores a whole number?',
    options: ['print(12)', 'number = 12', '"12"', '12 + 3'],
    correctIndex: 1,
    explanation: 'The correct answer is `number = 12` because we store a value in a variable using `=`.'
  },
  {
    id: 'q2',
    prompt: 'What is the main purpose of print() in Python?',
    options: ['It creates a file', 'It displays output to the screen', 'It repeats code', 'It deletes a variable'],
    correctIndex: 1,
    explanation: '`print()` is used to show information on the screen so we can check the program output.'
  },
  {
    id: 'q3',
    prompt: 'Which value is a string?',
    options: ['42', 'True', '"hello"', '3.14'],
    correctIndex: 2,
    explanation: 'A string is text wrapped in quotes, so `"hello"` is the correct answer.'
  },
  {
    id: 'q4',
    prompt: 'What does 7 + 3 evaluate to in Python?',
    options: ['73', '10', '4', '7 3'],
    correctIndex: 1,
    explanation: 'Python adds numbers the same way a calculator does, so `7 + 3` equals `10`.'
  }
];

function loadCompletedWeeks() {
  try {
    const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(savedProgress) ? savedProgress : [];
  } catch (error) {
    return [];
  }
}

function saveCompletedWeeks(completedWeeks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(completedWeeks));
}

function loadLessonState() {
  try {
    const savedLesson = JSON.parse(localStorage.getItem(LESSON_STATE_KEY) || '{}');
    if (!savedLesson || typeof savedLesson !== 'object' || Array.isArray(savedLesson)) {
      return { answers: {} };
    }

    const answers = savedLesson.answers && typeof savedLesson.answers === 'object' && !Array.isArray(savedLesson.answers)
      ? savedLesson.answers
      : {};

    return {
      answers: Object.fromEntries(
        Object.entries(answers).filter(([questionId]) => lessonQuestions.some((question) => question.id === questionId))
          .map(([questionId, answer]) => {
            const safeAnswer = answer && typeof answer === 'object' ? answer : {};
            return [questionId, {
              selected: Number.isInteger(safeAnswer.selected) ? safeAnswer.selected : null,
              correct: safeAnswer.correct === true,
              attempts: Number.isInteger(safeAnswer.attempts) ? safeAnswer.attempts : 0
            }];
          })
      )
    };
  } catch (error) {
    return { answers: {} };
  }
}

function saveLessonState(state) {
  const safeState = {
    answers: state && typeof state === 'object' && state.answers && typeof state.answers === 'object'
      ? state.answers
      : {}
  };

  localStorage.setItem(LESSON_STATE_KEY, JSON.stringify(safeState));
}

function getLessonProgress() {
  const state = loadLessonState();
  const answers = state.answers || {};
  const correctCount = lessonQuestions.filter((question) => answers[question.id]?.correct === true).length;
  return {
    correctCount,
    totalCount: lessonQuestions.length
  };
}

function updateLessonProgressUI() {
  const progressText = document.getElementById('lesson-progress-text');
  const progressBar = document.getElementById('lesson-progress-bar');
  if (!progressText || !progressBar) {
    return;
  }

  const { correctCount, totalCount } = getLessonProgress();
  const percent = totalCount ? (correctCount / totalCount) * 100 : 0;
  progressText.textContent = `${correctCount}/${totalCount} mastered`;
  progressBar.style.width = `${percent}%`;
}

function renderLessonQuiz() {
  const quizContainer = document.getElementById('quiz-container');
  if (!quizContainer) {
    return;
  }

  const state = loadLessonState();
  const answers = state.answers || {};

  quizContainer.innerHTML = lessonQuestions.map((question, index) => {
    const savedAnswer = answers[question.id];
    const hasCorrectAnswer = savedAnswer && savedAnswer.correct === true;

    const optionMarkup = question.options.map((option, optionIndex) => {
      const isCorrectOption = optionIndex === question.correctIndex;
      const isSelected = savedAnswer && savedAnswer.selected === optionIndex;
      const classes = ['quiz-option'];

      if (hasCorrectAnswer && isCorrectOption) {
        classes.push('correct');
      }

      if (savedAnswer && !hasCorrectAnswer && isSelected && !isCorrectOption) {
        classes.push('incorrect');
      }

      return `
        <button
          type="button"
          class="${classes.join(' ')}"
          data-question-id="${question.id}"
          data-option-index="${optionIndex}"
          ${hasCorrectAnswer ? 'disabled' : ''}
        >
          ${option}
        </button>
      `;
    }).join('');

    const feedbackMarkup = savedAnswer
      ? `<p class="quiz-feedback ${savedAnswer.correct ? 'success' : 'warning'}">
          ${savedAnswer.correct ? 'Correct! ' : 'Not quite. '}${question.explanation}
        </p>`
      : '';

    return `
      <div class="quiz-card">
        <p class="quiz-question">Q${index + 1}. ${question.prompt}</p>
        <div class="quiz-options">
          ${optionMarkup}
        </div>
        ${feedbackMarkup}
      </div>
    `;
  }).join('');

  const optionButtons = quizContainer.querySelectorAll('.quiz-option');
  optionButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const questionId = button.dataset.questionId;
      const selectedIndex = Number(button.dataset.optionIndex);
      const question = lessonQuestions.find((item) => item.id === questionId);

      if (!question) {
        return;
      }

      const state = loadLessonState();
      const answers = state.answers || {};
      const previousAnswer = answers[questionId] || {};

      if (previousAnswer.correct === true) {
        return;
      }

      const isCorrect = selectedIndex === question.correctIndex;
      answers[questionId] = {
        selected: selectedIndex,
        correct: isCorrect,
        attempts: (Number.isInteger(previousAnswer.attempts) ? previousAnswer.attempts : 0) + 1
      };

      state.answers = answers;
      saveLessonState(state);
      renderLessonQuiz();
      updateLessonProgressUI();

      if (isCorrect) {
        showToast('Correct answer! Nice work.');
      } else {
        showToast('Not quite — try again.');
      }
    });
  });
}

function setPythonOutput(message, isError = false) {
  const outputElement = document.getElementById('python-output');
  const statusElement = document.getElementById('python-status');

  if (!outputElement || !statusElement) {
    return;
  }

  outputElement.textContent = message;
  outputElement.classList.toggle('error', isError);
  statusElement.textContent = isError ? 'Execution failed' : 'Ready';
}

async function ensurePyodide() {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (!window.loadPyodide) {
    throw new Error('Pyodide did not load. This browser needs internet access to fetch the Pyodide files from the CDN.');
  }

  if (!pyodideInitPromise) {
    const statusElement = document.getElementById('python-status');
    if (statusElement) {
      statusElement.textContent = 'Loading Python runtime...';
    }

    pyodideInitPromise = window.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/'
    }).then((instance) => {
      pyodideInstance = instance;
      return instance;
    });
  }

  return pyodideInitPromise;
}

function setupPythonRunner() {
  const editor = document.getElementById('python-code-input');
  const runButton = document.getElementById('runPythonBtn');
  const resetButton = document.getElementById('resetPythonBtn');
  const statusElement = document.getElementById('python-status');
  const outputElement = document.getElementById('python-output');

  if (!editor || !runButton || !resetButton || !statusElement || !outputElement) {
    return;
  }

  editor.value = PYTHON_STARTER_CODE;
  outputElement.textContent = 'Output will appear here.';
  outputElement.classList.remove('error');
  statusElement.textContent = 'Ready';

  const setRunningState = (isRunning) => {
    runButton.disabled = isRunning;
    runButton.textContent = isRunning ? 'Running...' : 'Run code';
  };

  resetButton.addEventListener('click', () => {
    editor.value = PYTHON_STARTER_CODE;
    setPythonOutput('Output will appear here.');
    statusElement.textContent = 'Reset to starter example';
  });

  runButton.addEventListener('click', async () => {
    const code = editor.value.trim();
    if (!code) {
      setPythonOutput('Please enter some Python code before running.', true);
      return;
    }

    setRunningState(true);
    setPythonOutput('Loading Python environment...');

    try {
      const pyodide = await ensurePyodide();
      const outputLines = [];
      pyodide.setStdout({ batched: (text) => outputLines.push(String(text)) });
      pyodide.setStderr({ batched: (text) => outputLines.push(String(text)) });

      await pyodide.runPythonAsync(code);

      const output = outputLines.join('') || 'Program finished successfully.';
      setPythonOutput(output.trim() || 'Program finished successfully.');
      statusElement.textContent = 'Execution complete';
    } catch (error) {
      const message = error && error.message ? error.message : String(error);
      setPythonOutput(`Python error:\n${message}`, true);
    } finally {
      setRunningState(false);
    }
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add('show');

  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 1800);
}

function showSection(targetSectionId) {
  const sections = document.querySelectorAll('.page-section');
  const navLinks = document.querySelectorAll('.nav-link[data-target]');

  sections.forEach((section) => {
    section.classList.toggle('active', section.id === targetSectionId);
  });

  navLinks.forEach((link) => {
    const isActive = link.dataset.target === targetSectionId;
    link.classList.toggle('active', isActive);
  });
}

function renderRoadmap() {
  const roadmapContainer = document.getElementById('roadmap-container');
  if (!roadmapContainer) {
    return;
  }

  const completedWeeks = new Set(loadCompletedWeeks());
  const roadmapByMonth = roadmap.reduce((groups, week) => {
    if (!groups[week.month]) {
      groups[week.month] = [];
    }
    groups[week.month].push(week);
    return groups;
  }, {});

  const months = Object.entries(roadmapByMonth);
  roadmapContainer.innerHTML = months.map(([month, weeks]) => {
    const cards = weeks.map((week) => {
      const isCompleted = completedWeeks.has(week.id);

      return `
        <article class="roadmap-card ${isCompleted ? 'completed' : ''}">
          <div class="roadmap-card-header">
            <span class="month-badge">${week.week}</span>
            <span class="status-badge ${isCompleted ? '' : 'pending'}">${isCompleted ? 'Done' : 'Pending'}</span>
          </div>
          <h3>${week.title}</h3>
          <p>${week.description}</p>
          <button class="mark-btn ${isCompleted ? 'done' : ''}" data-week-id="${week.id}">
            ${isCompleted ? 'Completed' : 'Mark complete'}
          </button>
        </article>
      `;
    }).join('');

    return `
      <div class="month-group">
        <h3>${month}</h3>
        <div class="roadmap-list">
          ${cards}
        </div>
      </div>
    `;
  }).join('');

  const monthGroups = roadmapContainer.querySelectorAll('.month-group');
  monthGroups.forEach((group) => {
    group.style.gridColumn = '1 / -1';
  });

  const markButtons = document.querySelectorAll('.mark-btn');
  markButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const weekId = button.dataset.weekId;
      if (!weekId) {
        return;
      }

      const completed = loadCompletedWeeks();
      const weekIndex = completed.indexOf(weekId);

      if (weekIndex >= 0) {
        completed.splice(weekIndex, 1);
        showToast('Week marked as incomplete.');
      } else {
        completed.push(weekId);
        showToast('Week marked complete!');
      }

      saveCompletedWeeks(completed);
      renderRoadmap();
      renderDashboard();
    });
  });
}

function renderDashboard() {
  const progressPercent = document.getElementById('progress-percent');
  const progressSummary = document.getElementById('progress-summary');
  const completedWeeksCount = document.getElementById('completed-weeks');
  const nextMilestone = document.getElementById('next-milestone');
  const continueLearning = document.getElementById('continue-learning');
  const recentActivity = document.getElementById('recent-activity');

  if (!progressPercent || !progressSummary || !completedWeeksCount || !nextMilestone || !continueLearning || !recentActivity) {
    return;
  }

  const completed = loadCompletedWeeks();
  const completedSet = new Set(completed);
  const totalWeeks = roadmap.length;
  const completedCount = completedSet.size;
  const percentage = Math.round((completedCount / totalWeeks) * 100);

  progressPercent.textContent = `${percentage}%`;
  progressSummary.textContent = `${completedCount} of ${totalWeeks} weeks completed`;
  completedWeeksCount.textContent = String(completedCount);

  const nextWeek = roadmap.find((week) => !completedSet.has(week.id));
  nextMilestone.textContent = nextWeek ? nextWeek.week : 'All weeks complete';

  if (nextWeek) {
    continueLearning.innerHTML = `
      <div class="lesson-card">
        <div>
          <h4>${nextWeek.title}</h4>
          <p>${nextWeek.month} • ${nextWeek.week}</p>
        </div>
        <button class="lesson-action" data-target="roadmap">Resume</button>
      </div>
    `;
  } else {
    continueLearning.innerHTML = `
      <div class="lesson-card">
        <div>
          <h4>Great job!</h4>
          <p>All roadmap weeks are completed.</p>
        </div>
      </div>
    `;
  }

  const recent = roadmap
    .filter((week) => completedSet.has(week.id))
    .slice(-3)
    .reverse();

  if (!recent.length) {
    recentActivity.innerHTML = '<li><span class="empty-state">No completed weeks yet. Start with Week 1.</span></li>';
  } else {
    recentActivity.innerHTML = recent.map((week) => `
      <li>
        <span class="activity-dot"></span>
        <span>${week.week}: ${week.title} completed</span>
      </li>
    `).join('');
  }

  const resumeButton = document.querySelector('.lesson-action[data-target="roadmap"]');
  if (resumeButton) {
    resumeButton.addEventListener('click', () => showSection('roadmap'));
  }
}

function attachNavigation() {
  const targetButtons = document.querySelectorAll('[data-target]');
  targetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      if (!target) {
        return;
      }

      if (button.classList.contains('coming-soon')) {
        const message = button.dataset.message || 'This feature is coming soon.';
        showToast(message);
        return;
      }

      showSection(target);
    });
  });

  const openRoadmapBtn = document.getElementById('openRoadmapBtn');
  if (openRoadmapBtn) {
    openRoadmapBtn.addEventListener('click', () => showSection('roadmap'));
  }

  const backToDashboardBtn = document.getElementById('backToDashboardBtn');
  if (backToDashboardBtn) {
    backToDashboardBtn.addEventListener('click', () => showSection('dashboard'));
  }

  const lessonBackBtn = document.getElementById('lessonBackToDashboardBtn');
  if (lessonBackBtn) {
    lessonBackBtn.addEventListener('click', () => showSection('dashboard'));
  }

  const nextLessonPlaceholderBtn = document.getElementById('nextLessonPlaceholderBtn');
  if (nextLessonPlaceholderBtn) {
    nextLessonPlaceholderBtn.addEventListener('click', () => {
      showSection('roadmap');
      showToast('Big O Notation is a future lesson placeholder.');
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  attachNavigation();
  renderRoadmap();
  renderDashboard();
  renderLessonQuiz();
  updateLessonProgressUI();
  setupPythonRunner();

  const statusLabel = document.getElementById('backend-status-label');
  const statusDot = document.querySelector('.status-dot');

  if (!statusLabel || !statusDot) {
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/health');

    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`);
    }

    const data = await response.json();
    statusLabel.textContent = `Backend: ${data.status}`;
    statusDot.style.background = '#7ee7c5';
  } catch (error) {
    statusLabel.textContent = 'Backend: unavailable';
    statusDot.style.background = '#ff7d7d';
    statusDot.style.boxShadow = '0 0 14px rgba(255, 125, 125, 0.9)';
    console.error('LearnLoop backend check failed:', error);
  }
});
