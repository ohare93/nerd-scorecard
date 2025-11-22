// State management
let config = null;
let checkedQuestions = new Set();

// ========================================
// SCROLL HEADER - shows score when main display scrolls out of view
// ========================================

function handleScroll() {
    const scoreDisplay = document.querySelector('.score-display');
    const rect = scoreDisplay.getBoundingClientRect();
    const isOffscreen = rect.bottom < 0;

    const scrollHeader = document.getElementById('scroll-header');
    if (isOffscreen) {
        scrollHeader.classList.add('visible');
    } else {
        scrollHeader.classList.remove('visible');
    }
}

function updateScrollHeader() {
    const currentScore = getCurrentScore();
    const maxScore = getMaxScore();
    const tier = getCurrentTier(currentScore);
    const percentage = maxScore > 0 ? (currentScore / maxScore) * 100 : 0;

    document.getElementById('header-score').textContent = currentScore;
    document.getElementById('header-max').textContent = maxScore;
    document.getElementById('header-tier').textContent = tier ? tier.title : '';
    document.getElementById('header-progress-fill').style.width = `${percentage}%`;
}

// Load configuration from YAML
async function loadConfig() {
    try {
        const response = await fetch('nerd-scorecard.yaml');
        const yamlText = await response.text();
        config = jsyaml.load(yamlText);
        
        // Load saved state from localStorage
        const saved = localStorage.getItem('nerd-scorecard');
        if (saved) {
            checkedQuestions = new Set(JSON.parse(saved));
        }
        
        renderCategories();
        updateScore();
    } catch (error) {
        console.error('Error loading configuration:', error);
        document.getElementById('categories-container').innerHTML = 
            '<div class="loading">Error loading questions. Please refresh the page.</div>';
    }
}

// Calculate maximum possible score
function getMaxScore() {
    if (!config) return 0;
    let total = 0;
    config.categories.forEach(category => {
        category.questions.forEach(question => {
            total += question.points;
        });
    });
    return total;
}

// Calculate current score
function getCurrentScore() {
    if (!config) return 0;
    let total = 0;
    config.categories.forEach(category => {
        category.questions.forEach(question => {
            if (checkedQuestions.has(question.id)) {
                total += question.points;
            }
        });
    });
    return total;
}

// Calculate category score
function getCategoryScore(category) {
    let total = 0;
    category.questions.forEach(question => {
        if (checkedQuestions.has(question.id)) {
            total += question.points;
        }
    });
    return total;
}

// Calculate category max score
function getCategoryMaxScore(category) {
    return category.questions.reduce((sum, q) => sum + q.points, 0);
}

// Get current tier based on score
function getCurrentTier(score) {
    if (!config) return null;
    
    for (let i = config.scoring_tiers.length - 1; i >= 0; i--) {
        const tier = config.scoring_tiers[i];
        if (score >= tier.min) {
            return tier;
        }
    }
    return config.scoring_tiers[0];
}

// Update the score display
function updateScore() {
    const currentScore = getCurrentScore();
    const maxScore = getMaxScore();
    const tier = getCurrentTier(currentScore);
    
    // Update score number with animation
    const scoreElement = document.getElementById('current-score');
    scoreElement.textContent = currentScore;
    scoreElement.parentElement.classList.add('animate');
    setTimeout(() => scoreElement.parentElement.classList.remove('animate'), 300);
    
    document.getElementById('max-score').textContent = maxScore;
    
    // Update tier
    if (tier) {
        document.getElementById('tier-title').textContent = tier.title;
        document.getElementById('tier-description').textContent = tier.description;
    }
    
    // Update progress bar
    const percentage = maxScore > 0 ? (currentScore / maxScore) * 100 : 0;
    document.getElementById('progress-fill').style.width = `${percentage}%`;
    
    // Update category scores
    config.categories.forEach((category, index) => {
        const scoreElement = document.querySelector(`[data-category-index="${index}"] .category-score`);
        if (scoreElement) {
            const catScore = getCategoryScore(category);
            const catMax = getCategoryMaxScore(category);
            scoreElement.textContent = `${catScore}/${catMax}`;
        }
    });

    // Update scroll header
    updateScrollHeader();
}

// Save state to localStorage
function saveState() {
    localStorage.setItem('nerd-scorecard', JSON.stringify([...checkedQuestions]));
}

// Handle checkbox change
function handleCheckboxChange(questionId) {
    if (checkedQuestions.has(questionId)) {
        checkedQuestions.delete(questionId);
    } else {
        checkedQuestions.add(questionId);
    }
    
    saveState();
    updateScore();
    
    // Update the visual state of the question
    const questionElement = document.querySelector(`[data-question-id="${questionId}"]`);
    if (questionElement) {
        if (checkedQuestions.has(questionId)) {
            questionElement.classList.add('checked');
        } else {
            questionElement.classList.remove('checked');
        }
    }
}

// Render all categories and questions
function renderCategories() {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';
    
    config.categories.forEach((category, categoryIndex) => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category';
        categoryElement.setAttribute('data-category-index', categoryIndex);
        
        const categoryScore = getCategoryScore(category);
        const categoryMax = getCategoryMaxScore(category);
        
        categoryElement.innerHTML = `
            <div class="category-header">
                <h2>
                    ${category.name}
                    <span class="category-score">${categoryScore}/${categoryMax}</span>
                </h2>
                <p class="category-description">${category.description}</p>
            </div>
            <div class="questions"></div>
        `;
        
        const questionsContainer = categoryElement.querySelector('.questions');

        [...category.questions].sort((a, b) => a.points - b.points).forEach(question => {
            const questionElement = document.createElement('label');
            questionElement.className = 'question';
            questionElement.setAttribute('data-question-id', question.id);
            
            if (checkedQuestions.has(question.id)) {
                questionElement.classList.add('checked');
            }
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = checkedQuestions.has(question.id);
            checkbox.addEventListener('change', () => handleCheckboxChange(question.id));
            
            const content = document.createElement('div');
            content.className = 'question-content';
            content.innerHTML = `
                <span class="question-text">
                    ${question.text}
                    <span class="question-points">${question.points}pts</span>
                </span>
            `;
            
            questionElement.appendChild(checkbox);
            questionElement.appendChild(content);
            questionsContainer.appendChild(questionElement);
        });
        
        container.appendChild(categoryElement);
    });
}

// Reset all checkboxes
function resetAll() {
    if (confirm('Are you sure you want to reset all your answers? This cannot be undone.')) {
        checkedQuestions.clear();
        saveState();
        
        // Update all checkboxes
        document.querySelectorAll('.question input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Remove checked class from all questions
        document.querySelectorAll('.question').forEach(q => {
            q.classList.remove('checked');
        });
        
        updateScore();
    }
}

// Generate shareable text
function shareScore() {
    const currentScore = getCurrentScore();
    const maxScore = getMaxScore();
    const tier = getCurrentTier(currentScore);

    const shareText = `Scored ${currentScore}/${maxScore} and earned "${tier.title}" status. Find out how nerdy you really are: ${window.location.href}`;
    
    // Try to use the Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: 'My Programmer Nerd Score',
            text: shareText
        }).catch(err => {
            // Fallback to clipboard
            copyToClipboard(shareText);
        });
    } else {
        // Fallback to clipboard
        copyToClipboard(shareText);
    }
}

// Copy text to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show a temporary notification
        const btn = document.getElementById('share-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied to clipboard!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        alert('Unable to copy to clipboard. Your score:\n\n' + text);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();

    // Set up event listeners
    document.getElementById('reset-btn').addEventListener('click', resetAll);
    document.getElementById('share-btn').addEventListener('click', shareScore);
    document.getElementById('header-share-btn').addEventListener('click', shareScore);

    // Set up scroll listener for sticky score header
    window.addEventListener('scroll', handleScroll, { passive: true });
});

// Optional: URL parameter support for sharing specific scores
// Parse URL parameters on load
function parseUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get('score');
    
    if (shared) {
        try {
            const decoded = atob(shared);
            const questionIds = decoded.split(',');
            checkedQuestions = new Set(questionIds);
            saveState();
        } catch (e) {
            console.error('Invalid share URL');
        }
    }
}

// Generate shareable URL
function generateShareUrl() {
    const questionIds = [...checkedQuestions].join(',');
    const encoded = btoa(questionIds);
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?score=${encoded}`;
}
