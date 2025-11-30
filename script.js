// Global variables
let coursesData = [];
let completedLessons = {};
let currentCourse = null;
let currentLesson = null;

// Load courses data from JSON file
async function loadCourses() {
    try {
        const response = await fetch('courses.json');
        coursesData = await response.json();
        initializeApp();
    } catch (error) {
        console.error('Error loading courses:', error);
        alert('Error loading courses data. Please make sure courses.json exists.');
    }
}

// Initialize the app
function initializeApp() {
    renderFeaturedCourses();
    renderCategories();
    showHome();
}

// Show/Hide views
function showHome() {
    document.getElementById('homeView').classList.remove('hidden');
    document.getElementById('courseListingView').classList.add('hidden');
    document.getElementById('courseDetailView').classList.add('hidden');
    document.getElementById('lessonViewerView').classList.add('hidden');
}

function showCourses() {
    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('courseListingView').classList.remove('hidden');
    document.getElementById('courseDetailView').classList.add('hidden');
    document.getElementById('lessonViewerView').classList.add('hidden');
    renderAllCourses();
}

function showCourseDetail(courseId) {
    currentCourse = coursesData.find(c => c.id === courseId);
    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('courseListingView').classList.add('hidden');
    document.getElementById('courseDetailView').classList.remove('hidden');
    document.getElementById('lessonViewerView').classList.add('hidden');
    renderCourseDetail();
}

function showLesson(courseId, lessonId) {
    currentCourse = coursesData.find(c => c.id === courseId);
    currentLesson = currentCourse.lessons.find(l => l.id === lessonId);
    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('courseListingView').classList.add('hidden');
    document.getElementById('courseDetailView').classList.add('hidden');
    document.getElementById('lessonViewerView').classList.remove('hidden');
    renderLessonViewer();
}

function showAbout() {
    document.getElementById('homeView').classList.add('hidden');
    document.getElementById('courseListingView').classList.add('hidden');
    document.getElementById('courseDetailView').classList.add('hidden');
    document.getElementById('lessonViewerView').classList.add('hidden');
    document.getElementById('aboutView').classList.remove('hidden');
}

// Render featured courses (first 3)
function renderFeaturedCourses() {
    const container = document.getElementById('featuredCourses');
    const featured = coursesData.slice(0, 3);
    
    container.innerHTML = featured.map(course => `
        <div class="course-card bg-white rounded-lg shadow-md overflow-hidden" onclick="showCourseDetail(${course.id})">
            <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover">
            <div class="p-5">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-blue-600 font-semibold">${course.category}</span>
                    <span class="text-xs bg-gray-100 px-2 py-1 rounded">${course.level}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${course.title}</h3>
                <p class="text-gray-600 text-sm mb-4">${course.description}</p>
                <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Start Course
                </button>
            </div>
        </div>
    `).join('');
}

// Render all courses
function renderAllCourses() {
    const container = document.getElementById('allCourses');
    
    container.innerHTML = coursesData.map(course => `
        <div class="course-card bg-white rounded-lg shadow-md overflow-hidden" onclick="showCourseDetail(${course.id})">
            <img src="${course.image}" alt="${course.title}" class="w-full h-48 object-cover">
            <div class="p-5">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-blue-600 font-semibold">${course.category}</span>
                    <span class="text-xs bg-gray-100 px-2 py-1 rounded">${course.level}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${course.title}</h3>
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">${course.description}</p>
                <div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${course.lessons.length} lessons</span>
                </div>
                <button class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                    Start Course
                </button>
            </div>
        </div>
    `).join('');
}

// Render categories
function renderCategories() {
    const categories = [...new Set(coursesData.map(c => c.category))];
    const container = document.getElementById('categoriesGrid');
    
    container.innerHTML = categories.map(category => {
        const count = coursesData.filter(c => c.category === category).length;
        return `
            <div class="category-card bg-white p-6 rounded-lg shadow-md text-center" onclick="showCourses()">
                <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>
                <h3 class="text-lg font-semibold text-gray-800">${category}</h3>
                <p class="text-sm text-gray-600 mt-2">${count} courses</p>
            </div>
        `;
    }).join('');
}

// Render course detail
function renderCourseDetail() {
    document.getElementById('courseBanner').src = currentCourse.image;
    document.getElementById('courseBanner').alt = currentCourse.title;
    document.getElementById('courseTitle').textContent = currentCourse.title;
    document.getElementById('courseCategory').textContent = currentCourse.category;
    document.getElementById('courseLevel').textContent = currentCourse.level;
    document.getElementById('courseDescription').textContent = currentCourse.description;
    
    // Calculate and display progress
    const progress = calculateProgress(currentCourse.id);
    document.getElementById('progressPercent').textContent = `${progress}%`;
    document.getElementById('progressBar').style.width = `${progress}%`;
    
    // Render lessons
    const lessonsContainer = document.getElementById('lessonsList');
    lessonsContainer.innerHTML = currentCourse.lessons.map((lesson, index) => {
        const isCompleted = completedLessons[`${currentCourse.id}-${lesson.id}`];
        return `
            <div class="lesson-item flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-pointer" 
                 onclick="showLesson(${currentCourse.id}, ${lesson.id})">
                <div class="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    ${index + 1}
                </div>
                <div class="flex-1">
                    <h3 class="font-semibold text-gray-800">${lesson.title}</h3>
                </div>
                ${isCompleted ? `
                    <svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                ` : ''}
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </div>
        `;
    }).join('');
}

// Render lesson viewer
function renderLessonViewer() {
    document.getElementById('lessonCourseTitle').textContent = currentCourse.title;
    document.getElementById('lessonTitle').textContent = currentLesson.title;
    document.getElementById('lessonContent').textContent = currentLesson.content;
    
    const isCompleted = completedLessons[`${currentCourse.id}-${currentLesson.id}`];
    const completeBtn = document.getElementById('completeBtn');
    
    if (isCompleted) {
        completeBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Completed
        `;
        completeBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
        completeBtn.classList.add('bg-gray-400', 'cursor-not-allowed');
        completeBtn.disabled = true;
    } else {
        completeBtn.innerHTML = `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Mark as Complete
        `;
        completeBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        completeBtn.classList.remove('bg-gray-400', 'cursor-not-allowed');
        completeBtn.disabled = false;
        completeBtn.onclick = () => markComplete();
    }
    
    // Show next lesson button
    const currentIndex = currentCourse.lessons.findIndex(l => l.id === currentLesson.id);
    const nextLesson = currentCourse.lessons[currentIndex + 1];
    const nextBtn = document.getElementById('nextLessonBtn');
    
    if (nextLesson) {
        nextBtn.classList.remove('hidden');
        nextBtn.onclick = () => showLesson(currentCourse.id, nextLesson.id);
    } else {
        nextBtn.classList.add('hidden');
    }
    
    // Back button
    document.getElementById('backToCourseBtn').onclick = () => showCourseDetail(currentCourse.id);
}

// Mark lesson as complete
function markComplete() {
    completedLessons[`${currentCourse.id}-${currentLesson.id}`] = true;
    renderLessonViewer();
}

// Calculate progress
function calculateProgress(courseId) {
    const course = coursesData.find(c => c.id === courseId);
    if (!course) return 0;
    
    const completed = course.lessons.filter(
        lesson => completedLessons[`${courseId}-${lesson.id}`]
    ).length;
    
    return Math.round((completed / course.lessons.length) * 100);
}

// Initialize app when page loads
window.addEventListener('DOMContentLoaded', loadCourses);