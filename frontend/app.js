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
const PRACTICE_STATE_KEY = 'learnloop-python-practice-state';
const PYTHON_STARTER_CODE = `ages = [12, 15, 18]
print("Student ages:", ages)
print("Average age:", sum(ages) / len(ages))`;

const practiceExercises = [
  {
    id: 'variables-assignment',
    title: 'Variables and assignment',
    topic: 'Variables',
    task: 'Create a variable named score and assign it the value 12. Then print score.',
    goal: 'Understand how assignment stores a value for later use.',
    starterCode: 'score = 12\nprint(score)',
    expectedOutput: '12',
    successMessage: 'Perfect! You used assignment correctly and printed the stored value.'
  },
  {
    id: 'integers-arithmetic',
    title: 'Integers and basic arithmetic',
    topic: 'Arithmetic',
    task: 'Write code that adds 4 and 6 and stores the result in a variable named total. Then print total.',
    goal: 'Practice using integers with basic arithmetic operations.',
    starterCode: 'total = 4 + 6\nprint(total)',
    expectedOutput: '10',
    successMessage: 'Nice work. Python can do arithmetic the same way a calculator does.'
  },
  {
    id: 'strings-print',
    title: 'Strings and print()',
    topic: 'Strings',
    task: 'Create a greeting string and print it exactly as shown.',
    goal: 'Learn how strings are stored in quotes and displayed with print().',
    starterCode: 'greeting = "Hello, learner!"\nprint(greeting)',
    expectedOutput: 'Hello, learner!',
    successMessage: 'Great job. Strings are text values, and print() displays them clearly.'
  },
  {
    id: 'basic-data-types',
    title: 'Basic data types',
    topic: 'Data types',
    task: 'Create a decimal value named temperature and a boolean named is_warm. Print both values.',
    goal: 'Recognize float and boolean values in Python.',
    starterCode: 'temperature = 21.5\nis_warm = True\nprint(temperature)\nprint(is_warm)',
    expectedOutput: '21.5\nTrue',
    successMessage: 'Excellent. You identified a float and a boolean and printed both values correctly.'
  }
];

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

function loadPracticeState() {
  try {
    const savedPractice = JSON.parse(localStorage.getItem(PRACTICE_STATE_KEY) || '{}');
    if (!savedPractice || typeof savedPractice !== 'object' || Array.isArray(savedPractice)) {
      return { completed: {} };
    }

    const completed = savedPractice.completed && typeof savedPractice.completed === 'object' && !Array.isArray(savedPractice.completed)
      ? savedPractice.completed
      : {};

    return {
      completed: Object.fromEntries(
        Object.entries(completed)
          .filter(([exerciseId]) => practiceExercises.some((exercise) => exercise.id === exerciseId))
          .map(([exerciseId, value]) => [exerciseId, value === true])
      )
    };
  } catch (error) {
    return { completed: {} };
  }
}

function savePracticeState(state) {
  const safeState = {
    completed: state && typeof state === 'object' && state.completed && typeof state.completed === 'object'
      ? state.completed
      : {}
  };

  localStorage.setItem(PRACTICE_STATE_KEY, JSON.stringify(safeState));
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

function normalizePythonOutput(value) {
  return String(value ?? '').replace(/\r\n/g, '\n').trim();
}

async function executePythonCode(code) {
  try {
    const pyodide = await ensurePyodide();
    const outputLines = [];

    pyodide.setStdout({ batched: (text) => outputLines.push(String(text)) });
    pyodide.setStderr({ batched: (text) => outputLines.push(String(text)) });

    await pyodide.runPythonAsync(code);

    return {
      ok: true,
      output: normalizePythonOutput(outputLines.join('') || 'Program finished successfully.')
    };
  } catch (error) {
    const message = error && error.message ? error.message : String(error);
    return {
      ok: false,
      output: normalizePythonOutput(message)
    };
  }
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
      const result = await executePythonCode(code);
      if (!result.ok) {
        setPythonOutput(`Python error:\n${result.output}`, true);
        return;
      }

      setPythonOutput(result.output);
      statusElement.textContent = 'Execution complete';
    } finally {
      setRunningState(false);
    }
  });
}

function setupPracticeExercises() {
  const practiceContainer = document.getElementById('practice-exercises');
  if (!practiceContainer) {
    return;
  }

  if (practiceContainer.dataset.practiceBound === 'true') {
    return;
  }

  const savedState = loadPracticeState();

  practiceContainer.innerHTML = practiceExercises.map((exercise) => {
    const isCompleted = Boolean(savedState.completed[exercise.id]);
    return `
      <div class="practice-card ${isCompleted ? 'completed' : ''}" data-exercise-id="${exercise.id}">
        <div class="practice-header">
          <div>
            <h4>${exercise.title}</h4>
            <p class="practice-topic">${exercise.topic}</p>
          </div>
          <span class="practice-badge ${isCompleted ? 'done' : ''}">${isCompleted ? 'Completed' : 'Ready'}</span>
        </div>
        <p class="practice-task">${exercise.task}</p>
        <p class="practice-goal"><strong>Goal:</strong> ${exercise.goal}</p>
        <textarea class="practice-code" aria-label="${exercise.title} Python practice code">${exercise.starterCode}</textarea>
        <div class="practice-actions">
          <button type="button" class="practice-run-btn btn-ghost">Run code</button>
          <button type="button" class="practice-check-btn btn-primary">Check answer</button>
        </div>
        <div class="practice-output" aria-live="polite">Output will appear here.</div>
        <div class="practice-feedback"></div>
      </div>
    `;
  }).join('');

  const applyCompletedState = (card, isCompleted) => {
    const badge = card.querySelector('.practice-badge');
    const cardState = card;

    cardState.classList.toggle('completed', isCompleted);
    if (badge) {
      badge.textContent = isCompleted ? 'Completed' : 'Ready';
      badge.classList.toggle('done', isCompleted);
    }
  };

  const runPracticeExercise = async (card) => {
    const exerciseId = card.dataset.exerciseId;
    const exercise = practiceExercises.find((item) => item.id === exerciseId);
    const code = card.querySelector('.practice-code')?.value?.trim() || '';
    const outputEl = card.querySelector('.practice-output');
    const feedbackEl = card.querySelector('.practice-feedback');

    if (!exercise || !code) {
      if (outputEl) {
        outputEl.textContent = 'Please enter some Python code before running.';
        outputEl.classList.add('error');
      }
      if (feedbackEl) {
        feedbackEl.textContent = 'Add a small Python snippet before trying the exercise.';
        feedbackEl.classList.remove('success');
        feedbackEl.classList.add('warning');
      }
      return;
    }

    if (outputEl) {
      outputEl.textContent = 'Running your code...';
      outputEl.classList.remove('error');
    }
    if (feedbackEl) {
      feedbackEl.textContent = 'Running your code...';
      feedbackEl.classList.remove('warning', 'success');
    }

    const result = await executePythonCode(code);

    if (outputEl) {
      outputEl.textContent = result.ok ? result.output : `Python error:\n${result.output}`;
      outputEl.classList.toggle('error', !result.ok);
    }

    if (feedbackEl) {
      feedbackEl.textContent = result.ok
        ? 'The code ran successfully. Use Check answer to see if it matches the exercise goal.'
        : 'The code raised a Python error. Fix the syntax or variable names and try again.';
      feedbackEl.classList.toggle('warning', !result.ok);
      feedbackEl.classList.toggle('success', result.ok);
    }
  };

  const checkPracticeExercise = async (card) => {
    const exerciseId = card.dataset.exerciseId;
    const exercise = practiceExercises.find((item) => item.id === exerciseId);
    const code = card.querySelector('.practice-code')?.value?.trim() || '';
    const outputEl = card.querySelector('.practice-output');
    const feedbackEl = card.querySelector('.practice-feedback');

    if (!exercise) {
      return;
    }

    const savedState = loadPracticeState();
    if (savedState.completed[exercise.id] === true) {
      if (feedbackEl) {
        feedbackEl.textContent = 'This exercise is already complete. You can review it or continue to the next one.';
        feedbackEl.classList.remove('warning');
        feedbackEl.classList.add('success');
      }
      return;
    }

    if (!code) {
      if (outputEl) {
        outputEl.textContent = 'Please write some code before checking the exercise.';
        outputEl.classList.add('error');
      }
      if (feedbackEl) {
        feedbackEl.textContent = 'Your answer is empty. Add the Python code first.';
        feedbackEl.classList.remove('success');
        feedbackEl.classList.add('warning');
      }
      return;
    }

    const result = await executePythonCode(code);
    if (!result.ok) {
      if (outputEl) {
        outputEl.textContent = `Python error:\n${result.output}`;
        outputEl.classList.add('error');
      }
      if (feedbackEl) {
        feedbackEl.textContent = 'The code has a Python error. Fix the syntax and try again.';
        feedbackEl.classList.remove('success');
        feedbackEl.classList.add('warning');
      }
      return;
    }

    const normalizedOutput = normalizePythonOutput(result.output);
    const expectedOutput = normalizePythonOutput(exercise.expectedOutput);
    const isCorrect = normalizedOutput === expectedOutput;

    if (outputEl) {
      outputEl.textContent = result.output;
      outputEl.classList.remove('error');
    }

    if (feedbackEl) {
      if (isCorrect) {
        savedState.completed[exercise.id] = true;
        savePracticeState(savedState);
        applyCompletedState(card, true);
        feedbackEl.textContent = exercise.successMessage;
        feedbackEl.classList.remove('warning');
        feedbackEl.classList.add('success');
        showToast('Exercise complete!');
      } else {
        feedbackEl.textContent = `Not quite. Your output was: ${result.output || 'empty'}\nHint: ${exercise.goal}`;
        feedbackEl.classList.remove('success');
        feedbackEl.classList.add('warning');
        showToast('Check the output and try again.');
      }
    }
  };

  practiceContainer.dataset.practiceBound = 'true';
  practiceContainer.addEventListener('click', async (event) => {
    const runButton = event.target.closest('.practice-run-btn');
    const checkButton = event.target.closest('.practice-check-btn');

    if (runButton) {
      const card = runButton.closest('.practice-card');
      if (card) {
        await runPracticeExercise(card);
      }
      return;
    }

    if (checkButton) {
      const card = checkButton.closest('.practice-card');
      if (card) {
        await checkPracticeExercise(card);
      }
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


function setupAiTutor() {
  const form = document.getElementById('ai-tutor-form');
  const topicSelect = document.getElementById('ai-topic');
  const questionInput = document.getElementById('ai-question');
  const answerInput = document.getElementById('ai-answer');
  const submitBtn = document.getElementById('ai-submit-btn');
  const resetBtn = document.getElementById('ai-reset-btn');
  const statusEl = document.getElementById('ai-status');
  const responseEl = document.getElementById('ai-response');
  const backBtn = document.getElementById('aiTutorBackBtn');

  if (
    !form ||
    !topicSelect ||
    !questionInput ||
    !answerInput ||
    !submitBtn ||
    !resetBtn ||
    !statusEl ||
    !responseEl
  ) {
    return;
  }

  if (form.dataset.bound === 'true') {
    return;
  }

  form.dataset.bound = 'true';

  const setStatus = (message, isError = false) => {
    statusEl.textContent = message;
    statusEl.style.color = isError ? '#ffb4b4' : '#d2e9ff';
  };

  const clearForm = () => {
    form.reset();
    topicSelect.value = 'Python basics';
    questionInput.value = '';
    answerInput.value = '';
    responseEl.textContent = 'Your tutor response will appear here.';
    responseEl.classList.remove('error');
    setStatus('Ready');
  };

  resetBtn.addEventListener('click', clearForm);

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      showSection('dashboard');
    });
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const topic = (topicSelect.value || '').trim();
    const question = questionInput.value.trim();
    const studentAnswer = answerInput.value.trim();

    if (!question) {
      setStatus('Please enter a question first.', true);
      questionInput.focus();
      return;
    }

    responseEl.textContent = 'Thinking...';
    responseEl.classList.remove('error');
    setStatus('Asking the tutor...');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Asking...';

    try {
      const response = await fetch('http://localhost:3000/api/tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: topic || 'General DSA',
          question: question,
          studentAnswer: studentAnswer || ''
        })
      });

      const data = await response.json();

      if (!response.ok || data.status !== 'ok' || !data.answer) {
        const backendMessage = data && typeof data.message === 'string' ? data.message : 'The AI tutor is temporarily busy.';
        throw new Error(backendMessage);
      }

      responseEl.textContent = data.answer;
      setStatus('Tutor response ready');
    } catch (error) {
      const message = error && error.message ? error.message : 'The AI tutor is temporarily busy.';
      console.error('AI Tutor request failed:', error);

      const friendlyMessage = message.toLowerCase().includes('quota') || message.toLowerCase().includes('rate-limited')
        ? 'The AI tutor is currently rate-limited or quota is exhausted. Please try again in a moment.'
        : message.toLowerCase().includes('temporarily busy') || message.toLowerCase().includes('temporarily unavailable') || message.toLowerCase().includes('not configured')
          ? 'The AI tutor is temporarily busy. Please try again in a moment.'
          : message;

      responseEl.textContent = friendlyMessage;
      responseEl.classList.add('error');
      setStatus('Tutor request failed', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Ask tutor';
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  attachNavigation();
  renderRoadmap();
  renderDashboard();
  renderLessonQuiz();
  updateLessonProgressUI();
  setupPythonRunner();
  setupPracticeExercises();
  setupCodeLab();
  setupAiTutor();

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



function setupCodeLab() {
  const codeInput = document.getElementById('codeLabPythonInput');
  const runButton = document.getElementById('codeLabRunBtn');
  const resetButton = document.getElementById('codeLabResetBtn');
  const status = document.getElementById('codeLabStatus');
  const output = document.getElementById('codeLabOutput');
  const backButton = document.getElementById('codeLabBackBtn');

  if (!codeInput || !runButton || !resetButton || !status || !output) {
    console.warn('Code Lab elements were not found.');
    return;
  }

  const starterCode = 'print("Hello, LearnLoop AI!")\nprint(10 + 20)';

  runButton.addEventListener('click', async () => {
    runButton.disabled = true;
    status.textContent = 'Starting Python...';
    output.textContent = '';

    try {
      const pyodide = await ensurePyodide();
      const lines = [];

      pyodide.setStdout({
        batched: (text) => lines.push(text)
      });
      pyodide.setStderr({
        batched: (text) => lines.push(text)
      });

      status.textContent = 'Running code...';
      await pyodide.runPythonAsync(codeInput.value);

      output.textContent = lines.join('\n') || 'Code ran successfully with no output.';
      status.textContent = 'Finished successfully';
    } catch (error) {
      output.textContent = String(error);
      status.textContent = 'There was an error. Check your code.';
    } finally {
      runButton.disabled = false;
    }
  });

  resetButton.addEventListener('click', () => {
    codeInput.value = starterCode;
    status.textContent = 'Ready';
    output.textContent = 'Output will appear here.';
  });

  if (backButton) {
    backButton.addEventListener('click', () => showSection('dashboard'));
  }
}
