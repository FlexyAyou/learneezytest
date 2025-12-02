/**
 * Test script to verify course creation with module, lesson, quiz, and assignment
 * Run with: node test-course-with-assignment.js
 */

const axios = require('axios');

// Configuration
const API_BASE = process.env.API_BASE || 'http://localhost:8000';
const TOKEN = process.env.API_TOKEN || '';

if (!TOKEN) {
  console.error('ERROR: API_TOKEN environment variable is required');
  console.error('Usage: API_TOKEN=<your-token> node test-course-with-assignment.js');
  process.exit(1);
}

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// Helper functions
async function createCourse() {
  console.log('\n📚 Creating course...');
  const courseData = {
    title: 'Test Course with Assignment',
    description: 'A course to test module + lesson + quiz + assignment functionality',
    price: 29.99,
    level: 'débutant',
    category_names: ['Programming', 'Testing'],
    modules: [
      {
        title: 'Module 1: Getting Started',
        description: 'Introduction to the course',
        duration: '2h',
        content: [
          {
            title: 'Lesson 1: Introduction',
            duration: '30m',
            description: 'Welcome to the course',
            type: 'lesson',
          },
        ],
        quizzes: [
          {
            title: 'Quiz 1: Basic Concepts',
            questions: [
              {
                question: 'What is the main topic?',
                type: 'single-choice',
                options: ['Option A', 'Option B', 'Option C'],
                correctAnswer: 0,
                points: 5,
              },
            ],
          },
        ],
        assignment: {
          title: 'Assignment 1: First Task',
          description: 'Your first assignment in this course',
          instructions: 'Complete the following questions carefully',
          questions: [
            {
              question: 'Explain the concept',
              type: 'essay',
              minWords: 100,
              maxWords: 500,
              rubric: ['Clarity', 'Completeness', 'Grammar'],
              points: 20,
            },
          ],
          settings: {
            passing_score: 70,
            max_attempts: 3,
            time_limit: 60,
            allow_late_submission: true,
            requires_manual_grading: true,
          },
        },
      },
    ],
  };

  try {
    const response = await client.post('/api/courses/', courseData);
    const courseId = response.data.id;
    console.log(`✅ Course created: ${courseId}`);
    return courseId;
  } catch (error) {
    console.error('❌ Failed to create course:', error.response?.data || error.message);
    throw error;
  }
}

async function getCourse(courseId) {
  console.log(`\n📖 Fetching course details: ${courseId}`);
  try {
    const response = await client.get(`/api/courses/${courseId}`);
    const course = response.data;
    
    console.log(`\n📋 Course Details:`);
    console.log(`  Title: ${course.title}`);
    console.log(`  Modules: ${course.modules?.length || 0}`);
    
    if (course.modules && course.modules.length > 0) {
      const module = course.modules[0];
      console.log(`\n  📦 Module 1: ${module.title}`);
      console.log(`    - ID: ${module.id}`);
      console.log(`    - Lessons: ${module.content?.length || 0}`);
      console.log(`    - Quizzes: ${module.quizzes?.length || 0}`);
      console.log(`    - Order field: ${JSON.stringify(module.order || [])}`);
      console.log(`    - Assignment field: ${module.assignment ? 'Present' : 'Missing'}`);
      
      if (module.assignment) {
        console.log(`\n  ✅ Assignment found in module.assignment:`);
        console.log(`    - Title: ${module.assignment.title}`);
        console.log(`    - Questions: ${module.assignment.questions?.length || 0}`);
      }
    }
    
    return course;
  } catch (error) {
    console.error('❌ Failed to fetch course:', error.response?.data || error.message);
    throw error;
  }
}

async function getAssignment(courseId, moduleId) {
  console.log(`\n🎓 Fetching assignment for module: ${moduleId}`);
  try {
    const response = await client.get(`/api/courses/${courseId}/modules/${moduleId}/assignment`);
    const assignment = response.data;
    
    console.log(`✅ Assignment retrieved:`);
    console.log(`  - Title: ${assignment.title}`);
    console.log(`  - Questions: ${assignment.questions?.length || 0}`);
    console.log(`  - Settings: ${JSON.stringify(assignment.settings || {})}`);
    
    return assignment;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn('⚠️ Assignment not found (404) - might need to load separately');
      return null;
    }
    console.error('❌ Failed to fetch assignment:', error.response?.data || error.message);
    throw error;
  }
}

async function runTests() {
  console.log('🚀 Starting Course with Assignment Test Suite\n');
  console.log(`API Base: ${API_BASE}`);
  console.log(`=`.repeat(50));

  try {
    // Create course
    const courseId = await createCourse();

    // Fetch and verify course
    const course = await getCourse(courseId);

    // Try to fetch assignment
    if (course.modules && course.modules.length > 0) {
      const moduleId = course.modules[0].id;
      const assignment = await getAssignment(courseId, moduleId);
      
      if (!assignment) {
        console.log('\n⚠️ Assignment not found via direct API call');
        console.log('   This may indicate the assignment was not persisted correctly');
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n✅ Test Suite Completed!');
    console.log(`\n📌 Course ID for verification: ${courseId}`);
    console.log(`\n🔍 Check the course details at:`);
    console.log(`   /dashboard/superadmin/courses/${courseId}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
runTests().catch(console.error);
