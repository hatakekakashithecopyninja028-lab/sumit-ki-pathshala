import mongoose from "mongoose";
import dotenv from "dotenv";
import courseSchema from "./modals/enrollecourse.modal.js";

dotenv.config();

const sampleCourses = [
  {
    title: "Mathematics for Class 10",
    class_level: 10,
    subject: "Maths",
    description: "Complete mathematics course covering algebra, geometry, trigonometry, and statistics for Class 10 students.",
    price: 2999,
    duration: "6 months",
    teacher_name: "Sumit Sir",
    thumbnail_url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    video_url: "",
    syllabus: [
      "Real Numbers",
      "Polynomials",
      "Linear Equations",
      "Quadratic Equations",
      "Arithmetic Progression",
      "Triangles",
      "Coordinate Geometry",
      "Trigonometry",
      "Statistics"
    ],
    features: [
      "100+ Video Lectures",
      "Practice Tests",
      "Chapter-wise Notes",
      "Doubt Clearing Sessions",
      "Live Classes"
    ]
  },
  {
    title: "Science Foundation for Class 9",
    class_level: 9,
    subject: "Science",
    description: "Comprehensive science course covering physics, chemistry, and biology for Class 9 students.",
    price: 2499,
    duration: "6 months",
    teacher_name: "Sumit Sir",
    thumbnail_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
    video_url: "",
    syllabus: [
      "Matter in Our Surroundings",
      "Is Matter Around Us Pure?",
      "Atoms and Molecules",
      "Structure of Atom",
      "The Fundamental Unit of Life",
      "Tissues",
      "Diversity in Living Organisms",
      "Motion",
      "Force and Laws of Motion"
    ],
    features: [
      "80+ Video Lectures",
      "Lab Experiments",
      "MCQ Practice",
      "Sample Papers",
      "Online Tests"
    ]
  },
  {
    title: "Physics for Class 11",
    class_level: 11,
    subject: "Physics",
    description: "Detailed physics course covering mechanics, waves, and thermodynamics for Class 11.",
    price: 3499,
    duration: "1 year",
    teacher_name: "Sumit Sir",
    thumbnail_url: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
    video_url: "",
    syllabus: [
      "Physical World",
      "Units and Measurements",
      "Motion in a Straight Line",
      "Motion in a Plane",
      "Laws of Motion",
      "Work, Energy and Power",
      "System of Particles and Rotational Motion",
      "Gravitation",
      "Mechanical Properties of Solids"
    ],
    features: [
      "120+ Video Lectures",
      "Numerical Practice",
      "Conceptual Videos",
      "Previous Year Papers",
      "Live Doubt Sessions"
    ]
  },
  {
    title: "Chemistry for Class 11",
    class_level: 11,
    subject: "Chemistry",
    description: "In-depth chemistry course covering organic, inorganic, and physical chemistry.",
    price: 3299,
    duration: "1 year",
    teacher_name: "Sumit Sir",
    thumbnail_url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400",
    video_url: "",
    syllabus: [
      "Some Basic Concepts of Chemistry",
      "Structure of Atom",
      "Classification of Elements",
      "Chemical Bonding",
      "Thermodynamics",
      "Equilibrium",
      "Redox Reactions",
      "Organic Chemistry Basics",
      "Hydrocarbons"
    ],
    features: [
      "100+ Video Lectures",
      "Reaction Mechanisms",
      "Practice Questions",
      "Notes Download",
      "Quiz Tests"
    ]
  },
  {
    title: "Biology for Class 11",
    class_level: 11,
    subject: "Biology",
    description: "Comprehensive biology course covering all chapters of Class 11 NCERT.",
    price: 2999,
    duration: "1 year",
    teacher_name: "Sumit Sir",
    thumbnail_url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400",
    video_url: "",
    syllabus: [
      "The Living World",
      "Biological Classification",
      "Plant Kingdom",
      "Animal Kingdom",
      "Morphology of Flowering Plants",
      "Anatomy of Flowering Plants",
      "Structural Organization in Animals",
      "Cell: The Unit of Life",
      "Biomolecules"
    ],
    features: [
      "90+ Video Lectures",
      "Diagram Practice",
      "NCERT Solutions",
      "Important Questions",
      "Mock Tests"
    ]
  },
  {
    title: "Mathematics for Class 12",
    class_level: 12,
    subject: "Maths",
    description: "Complete mathematics course for Class 12 board exams and JEE preparation.",
    price: 3999,
    duration: "1 year",
    teacher_name: "Sumit Sir",
    thumbnail_url: "https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d?w=400",
    video_url: "",
    syllabus: [
      "Relations and Functions",
      "Inverse Trigonometric Functions",
      "Matrices",
      "Determinants",
      "Continuity and Differentiability",
      "Application of Derivatives",
      "Integrals",
      "Application of Integrals",
      "Differential Equations"
    ],
    features: [
      "150+ Video Lectures",
      "JEE Level Questions",
      "Previous Year Papers",
      "Formula Sheets",
      "Live Classes"
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/education_website');
    console.log('Connected to MongoDB');

    // Clear existing courses
    await courseSchema.deleteMany({});
    console.log('Cleared existing courses');

    // Insert sample courses
    const courses = await courseSchema.insertMany(sampleCourses);
    console.log(`Inserted ${courses.length} sample courses`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();

