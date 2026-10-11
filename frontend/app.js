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
  const targetButtons = document.querySelectorAll('.nav-link[data-target]');
  targetButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      if (!target) {
        return;
      }

      showSection(target);
    });
  });

  const comingSoonButtons = document.querySelectorAll('.coming-soon');
  comingSoonButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const message = button.dataset.message || 'This feature is coming soon.';
      showToast(message);
    });
  });

  const featureLinks = document.querySelectorAll('.feature-link');
  featureLinks.forEach((button) => {
    button.addEventListener('click', () => {
      const message = button.dataset.message || 'This feature is coming soon.';
      showToast(message);
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
}

document.addEventListener('DOMContentLoaded', async () => {
  attachNavigation();
  renderRoadmap();
  renderDashboard();

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
