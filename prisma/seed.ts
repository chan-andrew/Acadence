import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL! });
const prisma = new PrismaClient({
  adapter,
  transactionOptions: { timeout: 30000 },
});

async function main() {
  console.log("Clearing existing data...");
  await prisma.section.deleteMany();
  await prisma.course.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.university.deleteMany();
  await prisma.schedule.deleteMany();

  console.log("Creating university...");
  const university = await prisma.university.create({
    data: {
      name: "Greenfield University",
      slug: "greenfield",
    },
  });

  console.log("Creating professors...");

  const professorData: {
    name: string;
    department: string;
    rmpRating: number;
    rmpDifficulty: number;
    wouldTakeAgain: number;
    topTags: string[];
  }[] = [
    // Computer Science (7 professors)
    { name: "Dr. Alan Whitfield", department: "Computer Science", rmpRating: 4.7, rmpDifficulty: 3.8, wouldTakeAgain: 92, topTags: ["amazing lectures", "tough grader", "clear grading criteria"] },
    { name: "Dr. Priya Nair", department: "Computer Science", rmpRating: 4.5, rmpDifficulty: 4.1, wouldTakeAgain: 88, topTags: ["inspirational", "lots of homework", "skip class you won't pass"] },
    { name: "Dr. Marcus Chen", department: "Computer Science", rmpRating: 3.9, rmpDifficulty: 3.5, wouldTakeAgain: 75, topTags: ["group projects", "gives good feedback", "accessible outside class"] },
    { name: "Dr. Rebecca Torres", department: "Computer Science", rmpRating: 4.2, rmpDifficulty: 4.3, wouldTakeAgain: 80, topTags: ["tough grader", "lots of homework", "test heavy"] },
    { name: "Dr. James Okoro", department: "Computer Science", rmpRating: 3.6, rmpDifficulty: 2.8, wouldTakeAgain: 65, topTags: ["caring", "extra credit", "clear grading criteria"] },
    { name: "Dr. Samantha Liu", department: "Computer Science", rmpRating: 4.8, rmpDifficulty: 3.2, wouldTakeAgain: 95, topTags: ["amazing lectures", "hilarious", "gives good feedback"] },
    { name: "Dr. David Kowalski", department: "Computer Science", rmpRating: 3.3, rmpDifficulty: 4.5, wouldTakeAgain: 50, topTags: ["tough grader", "skip class you won't pass", "test heavy"] },

    // Mathematics (6 professors)
    { name: "Dr. Elena Vasquez", department: "Mathematics", rmpRating: 4.4, rmpDifficulty: 4.0, wouldTakeAgain: 85, topTags: ["clear grading criteria", "amazing lectures", "tough grader"] },
    { name: "Dr. Robert Kim", department: "Mathematics", rmpRating: 3.8, rmpDifficulty: 3.6, wouldTakeAgain: 70, topTags: ["lots of homework", "gives good feedback", "test heavy"] },
    { name: "Dr. Patricia Holden", department: "Mathematics", rmpRating: 4.1, rmpDifficulty: 4.4, wouldTakeAgain: 78, topTags: ["tough grader", "skip class you won't pass", "inspirational"] },
    { name: "Dr. Andrei Petrov", department: "Mathematics", rmpRating: 3.5, rmpDifficulty: 4.7, wouldTakeAgain: 55, topTags: ["tough grader", "lots of homework", "test heavy"] },
    { name: "Dr. Linda Farrell", department: "Mathematics", rmpRating: 4.6, rmpDifficulty: 3.0, wouldTakeAgain: 90, topTags: ["caring", "amazing lectures", "extra credit"] },
    { name: "Dr. Yusuf Hassan", department: "Mathematics", rmpRating: 3.2, rmpDifficulty: 3.9, wouldTakeAgain: 58, topTags: ["test heavy", "lots of homework", "clear grading criteria"] },

    // English (6 professors)
    { name: "Dr. Catherine Moore", department: "English", rmpRating: 4.6, rmpDifficulty: 3.1, wouldTakeAgain: 91, topTags: ["inspirational", "caring", "gives good feedback"] },
    { name: "Dr. William Ashford", department: "English", rmpRating: 3.9, rmpDifficulty: 3.4, wouldTakeAgain: 72, topTags: ["get ready to read", "participation matters", "clear grading criteria"] },
    { name: "Dr. Naomi Osei", department: "English", rmpRating: 4.3, rmpDifficulty: 3.7, wouldTakeAgain: 84, topTags: ["inspirational", "get ready to read", "amazing lectures"] },
    { name: "Dr. Thomas Brennan", department: "English", rmpRating: 3.4, rmpDifficulty: 2.5, wouldTakeAgain: 68, topTags: ["caring", "extra credit", "participation matters"] },
    { name: "Dr. Lydia Chang", department: "English", rmpRating: 4.0, rmpDifficulty: 3.9, wouldTakeAgain: 76, topTags: ["tough grader", "get ready to read", "gives good feedback"] },
    { name: "Dr. Frederick Hale", department: "English", rmpRating: 2.8, rmpDifficulty: 4.2, wouldTakeAgain: 40, topTags: ["tough grader", "lots of homework", "skip class you won't pass"] },

    // History (5 professors)
    { name: "Dr. Margaret Sullivan", department: "History", rmpRating: 4.5, rmpDifficulty: 3.3, wouldTakeAgain: 87, topTags: ["amazing lectures", "get ready to read", "inspirational"] },
    { name: "Dr. Howard Grant", department: "History", rmpRating: 3.7, rmpDifficulty: 3.0, wouldTakeAgain: 73, topTags: ["caring", "participation matters", "gives good feedback"] },
    { name: "Dr. Amara Diallo", department: "History", rmpRating: 4.1, rmpDifficulty: 3.6, wouldTakeAgain: 80, topTags: ["amazing lectures", "get ready to read", "clear grading criteria"] },
    { name: "Dr. Richard Yamamoto", department: "History", rmpRating: 3.3, rmpDifficulty: 2.7, wouldTakeAgain: 62, topTags: ["extra credit", "caring", "group projects"] },
    { name: "Dr. Claire Beaumont", department: "History", rmpRating: 4.8, rmpDifficulty: 3.5, wouldTakeAgain: 94, topTags: ["inspirational", "amazing lectures", "hilarious"] },

    // Philosophy (5 professors)
    { name: "Dr. Stefan Richter", department: "Philosophy", rmpRating: 4.3, rmpDifficulty: 3.8, wouldTakeAgain: 82, topTags: ["inspirational", "participation matters", "amazing lectures"] },
    { name: "Dr. Helen Parikh", department: "Philosophy", rmpRating: 3.6, rmpDifficulty: 3.2, wouldTakeAgain: 67, topTags: ["get ready to read", "caring", "gives good feedback"] },
    { name: "Dr. Oscar Mendez", department: "Philosophy", rmpRating: 4.0, rmpDifficulty: 4.0, wouldTakeAgain: 75, topTags: ["tough grader", "inspirational", "participation matters"] },
    { name: "Dr. Ingrid Larsen", department: "Philosophy", rmpRating: 3.1, rmpDifficulty: 4.3, wouldTakeAgain: 48, topTags: ["tough grader", "get ready to read", "skip class you won't pass"] },
    { name: "Dr. Kenneth Wolfe", department: "Philosophy", rmpRating: 4.5, rmpDifficulty: 2.9, wouldTakeAgain: 89, topTags: ["hilarious", "caring", "amazing lectures"] },

    // Physics (6 professors)
    { name: "Dr. Nina Johansson", department: "Physics", rmpRating: 4.4, rmpDifficulty: 4.2, wouldTakeAgain: 83, topTags: ["amazing lectures", "tough grader", "inspirational"] },
    { name: "Dr. Charles Webb", department: "Physics", rmpRating: 3.5, rmpDifficulty: 4.5, wouldTakeAgain: 56, topTags: ["tough grader", "test heavy", "lots of homework"] },
    { name: "Dr. Fatima Al-Rashid", department: "Physics", rmpRating: 4.1, rmpDifficulty: 3.7, wouldTakeAgain: 79, topTags: ["clear grading criteria", "gives good feedback", "accessible outside class"] },
    { name: "Dr. Gregory Santos", department: "Physics", rmpRating: 3.8, rmpDifficulty: 3.4, wouldTakeAgain: 71, topTags: ["caring", "extra credit", "group projects"] },
    { name: "Dr. Irene Nakamura", department: "Physics", rmpRating: 4.7, rmpDifficulty: 3.9, wouldTakeAgain: 91, topTags: ["amazing lectures", "inspirational", "clear grading criteria"] },
    { name: "Dr. Walter Grimes", department: "Physics", rmpRating: 2.5, rmpDifficulty: 4.8, wouldTakeAgain: 30, topTags: ["tough grader", "skip class you won't pass", "test heavy"] },

    // Chemistry (5 professors)
    { name: "Dr. Angela Russo", department: "Chemistry", rmpRating: 4.2, rmpDifficulty: 3.9, wouldTakeAgain: 81, topTags: ["clear grading criteria", "amazing lectures", "gives good feedback"] },
    { name: "Dr. Brian Okafor", department: "Chemistry", rmpRating: 3.7, rmpDifficulty: 4.1, wouldTakeAgain: 66, topTags: ["tough grader", "lots of homework", "test heavy"] },
    { name: "Dr. Diane Xu", department: "Chemistry", rmpRating: 4.5, rmpDifficulty: 3.3, wouldTakeAgain: 88, topTags: ["caring", "amazing lectures", "accessible outside class"] },
    { name: "Dr. Philip Strand", department: "Chemistry", rmpRating: 3.0, rmpDifficulty: 4.6, wouldTakeAgain: 42, topTags: ["tough grader", "skip class you won't pass", "lots of homework"] },
    { name: "Dr. Rosa Gutierrez", department: "Chemistry", rmpRating: 4.0, rmpDifficulty: 3.5, wouldTakeAgain: 77, topTags: ["gives good feedback", "group projects", "extra credit"] },

    // Biology (6 professors)
    { name: "Dr. Samuel Odom", department: "Biology", rmpRating: 4.3, rmpDifficulty: 3.6, wouldTakeAgain: 84, topTags: ["amazing lectures", "caring", "clear grading criteria"] },
    { name: "Dr. Vanessa Pham", department: "Biology", rmpRating: 3.9, rmpDifficulty: 3.8, wouldTakeAgain: 74, topTags: ["group projects", "gives good feedback", "lots of homework"] },
    { name: "Dr. Harold Finch", department: "Biology", rmpRating: 4.6, rmpDifficulty: 3.1, wouldTakeAgain: 90, topTags: ["hilarious", "amazing lectures", "extra credit"] },
    { name: "Dr. Maria Espinoza", department: "Biology", rmpRating: 3.4, rmpDifficulty: 4.3, wouldTakeAgain: 59, topTags: ["tough grader", "test heavy", "skip class you won't pass"] },
    { name: "Dr. Jonathan Reed", department: "Biology", rmpRating: 4.1, rmpDifficulty: 3.4, wouldTakeAgain: 80, topTags: ["accessible outside class", "caring", "gives good feedback"] },
    { name: "Dr. Keiko Tanaka", department: "Biology", rmpRating: 3.6, rmpDifficulty: 4.0, wouldTakeAgain: 63, topTags: ["lots of homework", "tough grader", "group projects"] },

    // Economics (5 professors)
    { name: "Dr. Lawrence Burke", department: "Economics", rmpRating: 4.0, rmpDifficulty: 3.7, wouldTakeAgain: 76, topTags: ["clear grading criteria", "test heavy", "gives good feedback"] },
    { name: "Dr. Sonia Agarwal", department: "Economics", rmpRating: 4.4, rmpDifficulty: 3.4, wouldTakeAgain: 86, topTags: ["amazing lectures", "inspirational", "caring"] },
    { name: "Dr. Martin Schroeder", department: "Economics", rmpRating: 3.3, rmpDifficulty: 4.1, wouldTakeAgain: 55, topTags: ["tough grader", "lots of homework", "test heavy"] },
    { name: "Dr. Claudia Voss", department: "Economics", rmpRating: 3.8, rmpDifficulty: 3.2, wouldTakeAgain: 72, topTags: ["group projects", "extra credit", "participation matters"] },
    { name: "Dr. Derek Washington", department: "Economics", rmpRating: 4.6, rmpDifficulty: 3.0, wouldTakeAgain: 91, topTags: ["hilarious", "amazing lectures", "caring"] },

    // Psychology (6 professors)
    { name: "Dr. Olivia Palmer", department: "Psychology", rmpRating: 4.7, rmpDifficulty: 2.8, wouldTakeAgain: 93, topTags: ["caring", "amazing lectures", "inspirational"] },
    { name: "Dr. Nathan Cross", department: "Psychology", rmpRating: 3.5, rmpDifficulty: 3.5, wouldTakeAgain: 64, topTags: ["test heavy", "lots of homework", "gives good feedback"] },
    { name: "Dr. Rachel Adebayo", department: "Psychology", rmpRating: 4.2, rmpDifficulty: 3.3, wouldTakeAgain: 82, topTags: ["inspirational", "group projects", "clear grading criteria"] },
    { name: "Dr. Victor Huang", department: "Psychology", rmpRating: 3.9, rmpDifficulty: 3.7, wouldTakeAgain: 73, topTags: ["participation matters", "gives good feedback", "tough grader"] },
    { name: "Dr. Julia Engström", department: "Psychology", rmpRating: 4.4, rmpDifficulty: 3.1, wouldTakeAgain: 87, topTags: ["caring", "hilarious", "accessible outside class"] },
    { name: "Dr. George Thornton", department: "Psychology", rmpRating: 2.9, rmpDifficulty: 4.4, wouldTakeAgain: 38, topTags: ["tough grader", "skip class you won't pass", "test heavy"] },

    // Art (5 professors)
    { name: "Dr. Isabella Fontaine", department: "Art", rmpRating: 4.6, rmpDifficulty: 2.6, wouldTakeAgain: 92, topTags: ["inspirational", "caring", "amazing lectures"] },
    { name: "Dr. Liam O'Brien", department: "Art", rmpRating: 4.1, rmpDifficulty: 3.0, wouldTakeAgain: 80, topTags: ["group projects", "gives good feedback", "hilarious"] },
    { name: "Dr. Maya Kapoor", department: "Art", rmpRating: 3.7, rmpDifficulty: 3.3, wouldTakeAgain: 69, topTags: ["participation matters", "caring", "clear grading criteria"] },
    { name: "Dr. Peter Lindqvist", department: "Art", rmpRating: 4.3, rmpDifficulty: 2.4, wouldTakeAgain: 85, topTags: ["extra credit", "hilarious", "inspirational"] },
    { name: "Dr. Zara Mitchell", department: "Art", rmpRating: 3.4, rmpDifficulty: 3.8, wouldTakeAgain: 60, topTags: ["tough grader", "participation matters", "gives good feedback"] },

    // Music (5 professors)
    { name: "Dr. Alexander Volkov", department: "Music", rmpRating: 4.5, rmpDifficulty: 3.2, wouldTakeAgain: 88, topTags: ["inspirational", "amazing lectures", "caring"] },
    { name: "Dr. Stephanie Wells", department: "Music", rmpRating: 4.0, rmpDifficulty: 3.5, wouldTakeAgain: 77, topTags: ["participation matters", "gives good feedback", "clear grading criteria"] },
    { name: "Dr. Raj Malhotra", department: "Music", rmpRating: 3.6, rmpDifficulty: 2.9, wouldTakeAgain: 66, topTags: ["caring", "hilarious", "extra credit"] },
    { name: "Dr. Emily Sato", department: "Music", rmpRating: 4.8, rmpDifficulty: 3.0, wouldTakeAgain: 96, topTags: ["amazing lectures", "inspirational", "hilarious"] },
    { name: "Dr. Carlos Rivera", department: "Music", rmpRating: 3.2, rmpDifficulty: 4.0, wouldTakeAgain: 52, topTags: ["tough grader", "skip class you won't pass", "participation matters"] },

    // Political Science (5 professors)
    { name: "Dr. Hannah Fitzgerald", department: "Political Science", rmpRating: 4.3, rmpDifficulty: 3.4, wouldTakeAgain: 83, topTags: ["amazing lectures", "participation matters", "inspirational"] },
    { name: "Dr. Adrian Kovac", department: "Political Science", rmpRating: 3.8, rmpDifficulty: 3.7, wouldTakeAgain: 71, topTags: ["get ready to read", "gives good feedback", "clear grading criteria"] },
    { name: "Dr. Miriam Baptiste", department: "Political Science", rmpRating: 4.1, rmpDifficulty: 3.1, wouldTakeAgain: 79, topTags: ["caring", "inspirational", "group projects"] },
    { name: "Dr. Donald Pearce", department: "Political Science", rmpRating: 3.0, rmpDifficulty: 4.2, wouldTakeAgain: 45, topTags: ["tough grader", "lots of homework", "get ready to read"] },
    { name: "Dr. Cynthia Okonkwo", department: "Political Science", rmpRating: 4.6, rmpDifficulty: 3.3, wouldTakeAgain: 90, topTags: ["hilarious", "amazing lectures", "accessible outside class"] },

    // Sociology (5 professors)
    { name: "Dr. Kevin Morales", department: "Sociology", rmpRating: 4.2, rmpDifficulty: 3.0, wouldTakeAgain: 81, topTags: ["caring", "gives good feedback", "inspirational"] },
    { name: "Dr. Aisha Mahmoud", department: "Sociology", rmpRating: 3.9, rmpDifficulty: 3.4, wouldTakeAgain: 74, topTags: ["group projects", "participation matters", "clear grading criteria"] },
    { name: "Dr. Douglas Lam", department: "Sociology", rmpRating: 3.4, rmpDifficulty: 3.8, wouldTakeAgain: 60, topTags: ["tough grader", "get ready to read", "lots of homework"] },
    { name: "Dr. Natalie Bergman", department: "Sociology", rmpRating: 4.5, rmpDifficulty: 2.7, wouldTakeAgain: 89, topTags: ["hilarious", "caring", "amazing lectures"] },
    { name: "Dr. Terrence Frost", department: "Sociology", rmpRating: 3.7, rmpDifficulty: 3.6, wouldTakeAgain: 68, topTags: ["test heavy", "clear grading criteria", "accessible outside class"] },

    // Business (6 professors)
    { name: "Dr. Victoria Sterling", department: "Business", rmpRating: 4.4, rmpDifficulty: 3.5, wouldTakeAgain: 86, topTags: ["amazing lectures", "clear grading criteria", "inspirational"] },
    { name: "Dr. Michael Tran", department: "Business", rmpRating: 3.6, rmpDifficulty: 3.9, wouldTakeAgain: 65, topTags: ["group projects", "tough grader", "participation matters"] },
    { name: "Dr. Sarah Goldman", department: "Business", rmpRating: 4.1, rmpDifficulty: 3.2, wouldTakeAgain: 79, topTags: ["caring", "gives good feedback", "extra credit"] },
    { name: "Dr. Robert Blackwell", department: "Business", rmpRating: 3.3, rmpDifficulty: 4.3, wouldTakeAgain: 52, topTags: ["tough grader", "test heavy", "lots of homework"] },
    { name: "Dr. Diana Kessler", department: "Business", rmpRating: 4.7, rmpDifficulty: 2.8, wouldTakeAgain: 93, topTags: ["hilarious", "amazing lectures", "accessible outside class"] },
    { name: "Dr. Franklin Dubois", department: "Business", rmpRating: 3.9, rmpDifficulty: 3.6, wouldTakeAgain: 73, topTags: ["group projects", "clear grading criteria", "participation matters"] },
  ];

  const professors = await prisma.$transaction(
    professorData.map((p) =>
      prisma.professor.create({ data: p })
    )
  );

  // Build a lookup: department -> professor[]
  const profsByDept: Record<string, typeof professors> = {};
  for (const prof of professors) {
    if (!profsByDept[prof.department]) profsByDept[prof.department] = [];
    profsByDept[prof.department].push(prof);
  }

  console.log(`Created ${professors.length} professors.`);

  // ── Course definitions ──────────────────────────────────────────────

  interface CourseDef {
    code: string;
    title: string;
    description: string;
    credits: number;
    department: string;
    fulfills: string[];
    prerequisites: string[];
    level: "intro" | "mid" | "upper";
    hasLab?: boolean;
    hasRecitation?: boolean;
  }

  const courseDefs: CourseDef[] = [
    // ── Computer Science (16 courses) ────────────────────────────────
    { code: "CS 0007", title: "Introduction to Computer Programming", description: "Introductory programming concepts using Python. Variables, control flow, functions, and basic data structures.", credits: 3, department: "Computer Science", fulfills: ["CS Core", "Quantitative Requirement"], prerequisites: [], level: "intro", hasRecitation: true },
    { code: "CS 0011", title: "Introduction to Computing for Scientists", description: "Computing fundamentals for science majors. Data analysis, visualization, and scientific computation.", credits: 3, department: "Computer Science", fulfills: ["CS Core", "Quantitative Requirement"], prerequisites: [], level: "intro" },
    { code: "CS 0401", title: "Intermediate Programming Using Java", description: "Object-oriented programming in Java. Classes, inheritance, polymorphism, exception handling, and GUI basics.", credits: 4, department: "Computer Science", fulfills: ["CS Core"], prerequisites: ["CS 0007"], level: "mid", hasRecitation: true },
    { code: "CS 0441", title: "Discrete Structures for Computer Science", description: "Logic, sets, relations, functions, combinatorics, graph theory, and proof techniques for CS.", credits: 3, department: "Computer Science", fulfills: ["CS Core", "Quantitative Requirement"], prerequisites: [], level: "mid" },
    { code: "CS 0445", title: "Data Structures", description: "Abstract data types, stacks, queues, linked lists, trees, hash tables, graphs, and algorithm analysis.", credits: 3, department: "Computer Science", fulfills: ["CS Core"], prerequisites: ["CS 0401"], level: "mid", hasRecitation: true },
    { code: "CS 0447", title: "Computer Organization and Assembly Language", description: "Machine language, assembly programming, computer architecture, memory hierarchy, and I/O systems.", credits: 3, department: "Computer Science", fulfills: ["CS Core"], prerequisites: ["CS 0401"], level: "mid", hasLab: true },
    { code: "CS 0449", title: "Introduction to Systems Software", description: "Systems programming in C. Memory management, process control, file systems, and concurrency.", credits: 3, department: "Computer Science", fulfills: ["CS Core"], prerequisites: ["CS 0447"], level: "mid" },
    { code: "CS 1501", title: "Algorithm Implementation", description: "Advanced algorithm design and analysis. Greedy, dynamic programming, graph algorithms, NP-completeness.", credits: 3, department: "Computer Science", fulfills: ["CS Core"], prerequisites: ["CS 0445", "CS 0441"], level: "upper" },
    { code: "CS 1502", title: "Formal Methods in Computer Science", description: "Automata theory, formal languages, computability, and complexity theory.", credits: 3, department: "Computer Science", fulfills: ["CS Core"], prerequisites: ["CS 0441"], level: "upper" },
    { code: "CS 1510", title: "Algorithm Design", description: "Advanced techniques for designing efficient algorithms. Approximation algorithms, randomized algorithms.", credits: 3, department: "Computer Science", fulfills: ["CS Core"], prerequisites: ["CS 1501"], level: "upper" },
    { code: "CS 1520", title: "Programming Language for Web Applications", description: "Server-side and client-side web development. HTML, CSS, JavaScript, Python Flask, databases.", credits: 3, department: "Computer Science", fulfills: ["CS Core", "Free Elective"], prerequisites: ["CS 0401"], level: "upper" },
    { code: "CS 1550", title: "Introduction to Operating Systems", description: "Process management, memory management, file systems, I/O, and distributed systems concepts.", credits: 3, department: "Computer Science", fulfills: ["CS Core"], prerequisites: ["CS 0449"], level: "upper" },
    { code: "CS 1555", title: "Database Management Systems", description: "Relational model, SQL, normalization, query optimization, transactions, and NoSQL databases.", credits: 3, department: "Computer Science", fulfills: ["CS Core", "Free Elective"], prerequisites: ["CS 0445"], level: "upper" },
    { code: "CS 1566", title: "Introduction to Computer Graphics", description: "3D rendering pipeline, transformations, shading, texturing, and real-time graphics programming.", credits: 3, department: "Computer Science", fulfills: ["CS Core", "Free Elective"], prerequisites: ["CS 0445"], level: "upper" },
    { code: "CS 1571", title: "Introduction to Artificial Intelligence", description: "Search, knowledge representation, machine learning fundamentals, and natural language processing.", credits: 3, department: "Computer Science", fulfills: ["CS Core", "Free Elective"], prerequisites: ["CS 1501"], level: "upper" },
    { code: "CS 1675", title: "Introduction to Machine Learning", description: "Supervised and unsupervised learning, neural networks, SVMs, ensemble methods, and evaluation.", credits: 3, department: "Computer Science", fulfills: ["CS Core", "Free Elective"], prerequisites: ["CS 1501"], level: "upper" },

    // ── Mathematics (15 courses) ─────────────────────────────────────
    { code: "MATH 0120", title: "Business Calculus", description: "Calculus techniques for business applications. Limits, derivatives, integrals, and optimization.", credits: 4, department: "Mathematics", fulfills: ["Math Core", "Quantitative Requirement"], prerequisites: [], level: "intro" },
    { code: "MATH 0220", title: "Analytic Geometry and Calculus 1", description: "Limits, continuity, differentiation, integration, and the Fundamental Theorem of Calculus.", credits: 4, department: "Mathematics", fulfills: ["Math Core", "Quantitative Requirement"], prerequisites: [], level: "intro", hasRecitation: true },
    { code: "MATH 0230", title: "Analytic Geometry and Calculus 2", description: "Techniques of integration, sequences, series, Taylor series, and parametric equations.", credits: 4, department: "Mathematics", fulfills: ["Math Core", "Quantitative Requirement"], prerequisites: ["MATH 0220"], level: "intro", hasRecitation: true },
    { code: "MATH 0240", title: "Analytic Geometry and Calculus 3", description: "Multivariable calculus: partial derivatives, multiple integrals, vector calculus, and Stokes' theorem.", credits: 4, department: "Mathematics", fulfills: ["Math Core", "Quantitative Requirement"], prerequisites: ["MATH 0230"], level: "mid" },
    { code: "MATH 0280", title: "Matrices and Linear Algebra", description: "Systems of equations, matrix algebra, vector spaces, eigenvalues, and linear transformations.", credits: 3, department: "Mathematics", fulfills: ["Math Core", "Quantitative Requirement"], prerequisites: ["MATH 0220"], level: "mid" },
    { code: "MATH 0290", title: "Differential Equations", description: "First and second order ODEs, systems, Laplace transforms, and applications.", credits: 3, department: "Mathematics", fulfills: ["Math Core", "Quantitative Requirement"], prerequisites: ["MATH 0230"], level: "mid" },
    { code: "MATH 0413", title: "Introduction to Theoretical Mathematics", description: "Proof techniques, set theory, relations, functions, and foundational mathematical reasoning.", credits: 3, department: "Mathematics", fulfills: ["Math Core"], prerequisites: ["MATH 0230"], level: "mid" },
    { code: "MATH 1010", title: "Introduction to Number Theory", description: "Divisibility, primes, congruences, quadratic residues, and cryptographic applications.", credits: 3, department: "Mathematics", fulfills: ["Math Core", "Free Elective"], prerequisites: ["MATH 0413"], level: "upper" },
    { code: "MATH 1070", title: "Combinatorics", description: "Counting principles, generating functions, Polya enumeration, and combinatorial designs.", credits: 3, department: "Mathematics", fulfills: ["Math Core", "Free Elective"], prerequisites: ["MATH 0413"], level: "upper" },
    { code: "MATH 1180", title: "Linear Algebra", description: "Advanced linear algebra: inner product spaces, spectral theorem, Jordan form, bilinear forms.", credits: 3, department: "Mathematics", fulfills: ["Math Core"], prerequisites: ["MATH 0280", "MATH 0413"], level: "upper" },
    { code: "MATH 1270", title: "Numerical Mathematics 1", description: "Numerical solutions to equations, interpolation, numerical integration, and error analysis.", credits: 3, department: "Mathematics", fulfills: ["Math Core", "Free Elective"], prerequisites: ["MATH 0240", "MATH 0280"], level: "upper" },
    { code: "MATH 1360", title: "Applied Real Analysis", description: "Metric spaces, continuity, differentiation, integration, and function spaces.", credits: 3, department: "Mathematics", fulfills: ["Math Core"], prerequisites: ["MATH 0413", "MATH 0240"], level: "upper" },
    { code: "STAT 1000", title: "Applied Statistical Methods", description: "Descriptive statistics, probability, inference, regression, and ANOVA with software applications.", credits: 4, department: "Mathematics", fulfills: ["Math Core", "Quantitative Requirement"], prerequisites: [], level: "intro" },
    { code: "STAT 1100", title: "Statistics and Probability for Business", description: "Probability, sampling, hypothesis testing, regression, and decision-making for business.", credits: 3, department: "Mathematics", fulfills: ["Quantitative Requirement", "Free Elective"], prerequisites: [], level: "intro" },
    { code: "STAT 1200", title: "Applied Regression", description: "Simple and multiple regression, model selection, diagnostics, and generalized linear models.", credits: 3, department: "Mathematics", fulfills: ["Quantitative Requirement", "Free Elective"], prerequisites: ["STAT 1000"], level: "mid" },

    // ── English (14 courses) ─────────────────────────────────────────
    { code: "ENGLIT 0300", title: "Introduction to Literature", description: "Close reading and analysis of poetry, fiction, and drama from diverse traditions.", credits: 3, department: "English", fulfills: ["Humanities Elective", "Writing Requirement"], prerequisites: [], level: "intro" },
    { code: "ENGLIT 0325", title: "Shakespeare", description: "Study of Shakespeare's major plays including comedies, tragedies, and histories.", credits: 3, department: "English", fulfills: ["Humanities Elective"], prerequisites: [], level: "intro" },
    { code: "ENGLIT 0365", title: "American Literature to 1865", description: "Survey of American literature from colonial period through the Civil War.", credits: 3, department: "English", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "mid" },
    { code: "ENGLIT 0370", title: "American Literature Since 1865", description: "American literary movements from Reconstruction through postmodernism and contemporary fiction.", credits: 3, department: "English", fulfills: ["Humanities Elective"], prerequisites: [], level: "mid" },
    { code: "ENGLIT 0500", title: "Introduction to Critical Reading", description: "Theoretical frameworks for literary analysis: formalism, structuralism, deconstruction, feminism.", credits: 3, department: "English", fulfills: ["Humanities Elective", "Writing Requirement"], prerequisites: ["ENGLIT 0300"], level: "mid" },
    { code: "ENGLIT 0573", title: "Literature of the African Diaspora", description: "Literature from Africa, the Caribbean, and the African American tradition.", credits: 3, department: "English", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "mid" },
    { code: "ENGLIT 0610", title: "The Novel", description: "History and development of the novel form from the 18th century to the present.", credits: 3, department: "English", fulfills: ["Humanities Elective"], prerequisites: ["ENGLIT 0300"], level: "upper" },
    { code: "ENGCMP 0200", title: "Seminar in Composition", description: "Academic writing seminar focusing on argumentation, research, and critical analysis.", credits: 3, department: "English", fulfills: ["Writing Requirement"], prerequisites: [], level: "intro" },
    { code: "ENGCMP 0400", title: "Creative Writing: Fiction", description: "Workshop in fiction writing. Short story craft, revision strategies, and peer critique.", credits: 3, department: "English", fulfills: ["Humanities Elective", "Writing Requirement"], prerequisites: ["ENGCMP 0200"], level: "mid" },
    { code: "ENGCMP 0410", title: "Creative Writing: Poetry", description: "Workshop in poetry writing. Form, imagery, voice, and contemporary poetic techniques.", credits: 3, department: "English", fulfills: ["Humanities Elective", "Writing Requirement"], prerequisites: ["ENGCMP 0200"], level: "mid" },
    { code: "ENGCMP 0420", title: "Creative Writing: Creative Nonfiction", description: "Workshop in creative nonfiction. Memoir, essay, literary journalism, and hybrid forms.", credits: 3, department: "English", fulfills: ["Humanities Elective", "Writing Requirement"], prerequisites: ["ENGCMP 0200"], level: "mid" },
    { code: "ENGCMP 0600", title: "Professional Writing", description: "Writing for professional contexts: reports, proposals, technical documentation, and presentations.", credits: 3, department: "English", fulfills: ["Writing Requirement", "Free Elective"], prerequisites: ["ENGCMP 0200"], level: "upper" },
    { code: "ENGLIT 1325", title: "Modern Drama", description: "Drama from Ibsen to the present. Realism, expressionism, absurdism, and contemporary theater.", credits: 3, department: "English", fulfills: ["Humanities Elective"], prerequisites: ["ENGLIT 0300"], level: "upper" },
    { code: "ENGLIT 1380", title: "Postcolonial Literature", description: "Literature exploring colonialism, independence, and cultural identity across the global South.", credits: 3, department: "English", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: ["ENGLIT 0300"], level: "upper" },

    // ── History (14 courses) ─────────────────────────────────────────
    { code: "HIST 0100", title: "Western Civilization 1", description: "Ancient civilizations through the Renaissance. Mesopotamia, Greece, Rome, and medieval Europe.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "HIST 0101", title: "Western Civilization 2", description: "Early modern Europe through the 20th century. Reformation, Enlightenment, revolutions, and world wars.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "HIST 0187", title: "World History", description: "Global history from prehistory to the present. Cross-cultural exchange, empires, and globalization.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "intro" },
    { code: "HIST 0500", title: "Colonial America", description: "European colonization of the Americas, indigenous encounters, and the road to revolution.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Social Science Elective"], prerequisites: [], level: "mid" },
    { code: "HIST 0600", title: "The American Civil War", description: "Causes, conduct, and consequences of the American Civil War and Reconstruction.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Social Science Elective"], prerequisites: [], level: "mid" },
    { code: "HIST 0670", title: "History of the American West", description: "Westward expansion, frontier life, Native American displacement, and mythmaking.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "mid" },
    { code: "HIST 0700", title: "America in the 20th Century", description: "The United States from World War I through the end of the Cold War.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Social Science Elective"], prerequisites: [], level: "mid" },
    { code: "HIST 0756", title: "Introduction to African History", description: "Pre-colonial African civilizations, colonialism, independence movements, and contemporary Africa.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "intro" },
    { code: "HIST 0800", title: "Modern East Asia", description: "China, Japan, and Korea from the 19th century to the present.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "mid" },
    { code: "HIST 1000", title: "Methodologies of History", description: "Historiography, primary source analysis, and research methods for historians.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Writing Requirement"], prerequisites: ["HIST 0100"], level: "upper" },
    { code: "HIST 1045", title: "The Holocaust", description: "Origins, execution, and aftermath of the Holocaust. Memory, testimony, and justice.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "upper" },
    { code: "HIST 1060", title: "History of Science", description: "Scientific thought from antiquity to the present. Revolutions, institutions, and society.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Natural Science Elective"], prerequisites: [], level: "upper" },
    { code: "HIST 1090", title: "The Atlantic World", description: "Connections between Europe, Africa, and the Americas from 1400 to 1800.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "upper" },
    { code: "HIST 1125", title: "History of American Foreign Policy", description: "U.S. foreign relations from the founding through contemporary global engagement.", credits: 3, department: "History", fulfills: ["Humanities Elective", "Social Science Elective"], prerequisites: [], level: "upper" },

    // ── Philosophy (13 courses) ──────────────────────────────────────
    { code: "PHIL 0080", title: "Introduction to Philosophical Problems", description: "Classic philosophical questions: knowledge, reality, morality, free will, and personal identity.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective"], prerequisites: [], level: "intro" },
    { code: "PHIL 0200", title: "Introduction to Ethics", description: "Ethical theories: utilitarianism, deontology, virtue ethics, and applied moral dilemmas.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective"], prerequisites: [], level: "intro" },
    { code: "PHIL 0210", title: "History of Ancient Philosophy", description: "Pre-Socratics, Plato, Aristotle, Stoics, and Epicureans.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective"], prerequisites: [], level: "mid" },
    { code: "PHIL 0220", title: "History of Modern Philosophy", description: "Descartes, Hume, Kant, and the development of modern philosophical thought.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective"], prerequisites: [], level: "mid" },
    { code: "PHIL 0300", title: "Introduction to Logic", description: "Propositional and predicate logic, proofs, truth tables, and logical reasoning.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective", "Quantitative Requirement"], prerequisites: [], level: "intro" },
    { code: "PHIL 0320", title: "Social and Political Philosophy", description: "Justice, rights, liberty, equality, and the legitimacy of political authority.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective", "Social Science Elective"], prerequisites: [], level: "mid" },
    { code: "PHIL 0330", title: "Political Ethics", description: "Moral dimensions of political life: war, civil disobedience, democracy, and human rights.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective"], prerequisites: [], level: "mid" },
    { code: "PHIL 0400", title: "Philosophy of Science", description: "Scientific method, explanation, theory change, and the nature of scientific knowledge.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective", "Natural Science Elective"], prerequisites: [], level: "upper" },
    { code: "PHIL 0470", title: "Philosophy of Mind", description: "Consciousness, mental representation, personal identity, and the mind-body problem.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective"], prerequisites: ["PHIL 0080"], level: "upper" },
    { code: "PHIL 0500", title: "Existentialism", description: "Kierkegaard, Nietzsche, Heidegger, Sartre, and de Beauvoir on freedom and meaning.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective"], prerequisites: ["PHIL 0080"], level: "upper" },
    { code: "PHIL 1020", title: "Bioethics", description: "Ethical issues in medicine and biology: euthanasia, genetic engineering, research ethics.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: ["PHIL 0200"], level: "upper" },
    { code: "PHIL 1040", title: "Environmental Ethics", description: "Moral relationship between humans and the natural environment. Sustainability and animal rights.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: [], level: "upper" },
    { code: "PHIL 1060", title: "Philosophy of Art", description: "Nature of art, aesthetic experience, creativity, and the role of art in society.", credits: 3, department: "Philosophy", fulfills: ["Humanities Elective"], prerequisites: ["PHIL 0080"], level: "upper" },

    // ── Physics (13 courses) ─────────────────────────────────────────
    { code: "PHYS 0110", title: "Introduction to Physics 1", description: "Mechanics, thermodynamics, and waves for non-science majors.", credits: 3, department: "Physics", fulfills: ["Natural Science Elective"], prerequisites: [], level: "intro", hasLab: true },
    { code: "PHYS 0111", title: "Introduction to Physics 2", description: "Electricity, magnetism, optics, and modern physics for non-science majors.", credits: 3, department: "Physics", fulfills: ["Natural Science Elective"], prerequisites: ["PHYS 0110"], level: "intro", hasLab: true },
    { code: "PHYS 0174", title: "Basic Physics for Science and Engineering 1", description: "Calculus-based mechanics: kinematics, Newton's laws, energy, momentum, and rotational motion.", credits: 4, department: "Physics", fulfills: ["Natural Science Elective", "Quantitative Requirement"], prerequisites: ["MATH 0220"], level: "intro", hasLab: true, hasRecitation: true },
    { code: "PHYS 0175", title: "Basic Physics for Science and Engineering 2", description: "Calculus-based electromagnetism: electric fields, circuits, magnetism, and electromagnetic waves.", credits: 4, department: "Physics", fulfills: ["Natural Science Elective", "Quantitative Requirement"], prerequisites: ["PHYS 0174"], level: "mid", hasLab: true, hasRecitation: true },
    { code: "PHYS 0219", title: "Basic Laboratory in Mechanics", description: "Experimental techniques in mechanics. Data analysis, error propagation, and scientific reporting.", credits: 1, department: "Physics", fulfills: ["Natural Science Elective"], prerequisites: ["PHYS 0174"], level: "mid", hasLab: true },
    { code: "PHYS 0520", title: "Modern Physics", description: "Special relativity, quantum mechanics, atomic structure, and nuclear physics.", credits: 3, department: "Physics", fulfills: ["Natural Science Elective"], prerequisites: ["PHYS 0175", "MATH 0290"], level: "mid" },
    { code: "PHYS 1321", title: "Classical Mechanics 1", description: "Lagrangian and Hamiltonian mechanics, central forces, rigid body dynamics.", credits: 3, department: "Physics", fulfills: ["Natural Science Elective"], prerequisites: ["PHYS 0520"], level: "upper" },
    { code: "PHYS 1331", title: "Electricity and Magnetism 1", description: "Electrostatics, magnetostatics, Maxwell's equations, and electromagnetic radiation.", credits: 3, department: "Physics", fulfills: ["Natural Science Elective"], prerequisites: ["PHYS 0520"], level: "upper" },
    { code: "PHYS 1341", title: "Quantum Mechanics 1", description: "Wave functions, Schrodinger equation, angular momentum, hydrogen atom, and perturbation theory.", credits: 3, department: "Physics", fulfills: ["Natural Science Elective"], prerequisites: ["PHYS 0520"], level: "upper" },
    { code: "PHYS 1361", title: "Thermodynamics and Statistical Mechanics", description: "Laws of thermodynamics, ensembles, partition functions, and quantum statistics.", credits: 3, department: "Physics", fulfills: ["Natural Science Elective"], prerequisites: ["PHYS 0520"], level: "upper" },
    { code: "PHYS 1370", title: "Computational Physics", description: "Numerical methods for physics problems. Simulation, Monte Carlo methods, and data analysis.", credits: 3, department: "Physics", fulfills: ["Natural Science Elective", "Quantitative Requirement"], prerequisites: ["PHYS 0520"], level: "upper" },
    { code: "ASTRON 0089", title: "Stars, Galaxies, and the Cosmos", description: "Stellar evolution, galaxy formation, cosmology, dark matter, and the expanding universe.", credits: 3, department: "Physics", fulfills: ["Natural Science Elective"], prerequisites: [], level: "intro" },
    { code: "PHYS 0088", title: "Physics of Music", description: "Acoustics, wave phenomena, harmonics, musical instruments, and digital sound.", credits: 3, department: "Physics", fulfills: ["Natural Science Elective", "Free Elective"], prerequisites: [], level: "intro" },

    // ── Chemistry (13 courses) ───────────────────────────────────────
    { code: "CHEM 0110", title: "General Chemistry 1", description: "Atomic structure, bonding, stoichiometry, thermochemistry, and gas laws.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: [], level: "intro", hasLab: true, hasRecitation: true },
    { code: "CHEM 0120", title: "General Chemistry 2", description: "Equilibrium, kinetics, electrochemistry, acid-base chemistry, and thermodynamics.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: ["CHEM 0110"], level: "intro", hasLab: true },
    { code: "CHEM 0310", title: "Organic Chemistry 1", description: "Structure, bonding, stereochemistry, and reactions of carbon compounds.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: ["CHEM 0120"], level: "mid", hasLab: true },
    { code: "CHEM 0320", title: "Organic Chemistry 2", description: "Advanced reactions, synthesis strategies, spectroscopy, and biomolecules.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: ["CHEM 0310"], level: "mid", hasLab: true },
    { code: "CHEM 0710", title: "Analytical Chemistry", description: "Quantitative analysis, spectroscopy, chromatography, and electroanalytical methods.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: ["CHEM 0120"], level: "mid", hasLab: true },
    { code: "CHEM 1000", title: "Chemistry and the Environment", description: "Chemical principles applied to environmental issues. Air, water, soil, and energy.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective", "Free Elective"], prerequisites: [], level: "intro" },
    { code: "CHEM 1030", title: "Physical Chemistry 1", description: "Quantum chemistry, spectroscopy, and molecular structure.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: ["CHEM 0120", "MATH 0240", "PHYS 0175"], level: "upper" },
    { code: "CHEM 1040", title: "Physical Chemistry 2", description: "Thermodynamics, statistical mechanics, and chemical kinetics.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: ["CHEM 1030"], level: "upper" },
    { code: "CHEM 1210", title: "Inorganic Chemistry", description: "Coordination chemistry, organometallics, solid-state chemistry, and bioinorganic chemistry.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: ["CHEM 0320"], level: "upper" },
    { code: "CHEM 1410", title: "Biochemistry 1", description: "Protein structure and function, enzyme kinetics, metabolism, and bioenergetics.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: ["CHEM 0320"], level: "upper" },
    { code: "CHEM 1420", title: "Biochemistry 2", description: "Nucleic acids, gene expression, signal transduction, and metabolic regulation.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: ["CHEM 1410"], level: "upper" },
    { code: "CHEM 1500", title: "Medicinal Chemistry", description: "Drug design, pharmacokinetics, receptor interactions, and therapeutic agents.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective", "Free Elective"], prerequisites: ["CHEM 0320"], level: "upper" },
    { code: "CHEM 0960", title: "Chemistry for Everyone", description: "Chemistry in everyday life. Food, materials, energy, and health.", credits: 3, department: "Chemistry", fulfills: ["Natural Science Elective"], prerequisites: [], level: "intro" },

    // ── Biology (14 courses) ─────────────────────────────────────────
    { code: "BIOSC 0150", title: "Foundations of Biology 1", description: "Cell biology, genetics, molecular biology, and evolution.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective"], prerequisites: [], level: "intro", hasLab: true },
    { code: "BIOSC 0160", title: "Foundations of Biology 2", description: "Organismal biology, ecology, biodiversity, and plant and animal physiology.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective"], prerequisites: ["BIOSC 0150"], level: "intro", hasLab: true },
    { code: "BIOSC 0350", title: "Genetics", description: "Mendelian genetics, molecular genetics, gene regulation, and population genetics.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective"], prerequisites: ["BIOSC 0150"], level: "mid" },
    { code: "BIOSC 0370", title: "Ecology", description: "Population, community, and ecosystem ecology. Biodiversity and conservation biology.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective", "Diversity Requirement"], prerequisites: ["BIOSC 0160"], level: "mid" },
    { code: "BIOSC 0500", title: "Cell Biology", description: "Cell structure and function, membranes, organelles, cytoskeleton, and cell signaling.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective"], prerequisites: ["BIOSC 0150", "CHEM 0120"], level: "mid" },
    { code: "BIOSC 0800", title: "Introduction to Neuroscience", description: "Neural signaling, sensory systems, motor control, learning, and neurological disorders.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective"], prerequisites: ["BIOSC 0150"], level: "mid" },
    { code: "BIOSC 1000", title: "Biochemistry", description: "Biomolecules, enzyme mechanisms, metabolic pathways, and molecular biology.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective"], prerequisites: ["BIOSC 0150", "CHEM 0320"], level: "upper" },
    { code: "BIOSC 1040", title: "Microbiology", description: "Microbial diversity, metabolism, genetics, pathogenesis, and immunology.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective"], prerequisites: ["BIOSC 0150"], level: "mid", hasLab: true },
    { code: "BIOSC 1100", title: "Comparative Physiology", description: "Physiological systems across animal phyla. Respiration, circulation, and osmoregulation.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective"], prerequisites: ["BIOSC 0160"], level: "upper" },
    { code: "BIOSC 1200", title: "Molecular Biology", description: "DNA replication, transcription, translation, gene regulation, and genomics.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective"], prerequisites: ["BIOSC 0350"], level: "upper" },
    { code: "BIOSC 1320", title: "Evolutionary Biology", description: "Natural selection, speciation, phylogenetics, and macroevolution.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective", "Diversity Requirement"], prerequisites: ["BIOSC 0350"], level: "upper" },
    { code: "BIOSC 1540", title: "Computational Biology", description: "Bioinformatics, sequence analysis, phylogenetic methods, and structural biology.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective", "Quantitative Requirement"], prerequisites: ["BIOSC 0350"], level: "upper" },
    { code: "BIOSC 1630", title: "Human Anatomy", description: "Gross and microscopic anatomy of the human body. Organ systems and clinical correlations.", credits: 4, department: "Biology", fulfills: ["Natural Science Elective"], prerequisites: ["BIOSC 0160"], level: "upper", hasLab: true },
    { code: "NROSCI 1000", title: "Introduction to Cognitive Neuroscience", description: "Neural basis of cognition. Perception, attention, memory, language, and decision-making.", credits: 3, department: "Biology", fulfills: ["Natural Science Elective", "Social Science Elective"], prerequisites: ["BIOSC 0800"], level: "upper" },

    // ── Economics (14 courses) ───────────────────────────────────────
    { code: "ECON 0100", title: "Introduction to Microeconomics", description: "Supply and demand, market structures, consumer theory, and welfare economics.", credits: 3, department: "Economics", fulfills: ["Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "ECON 0110", title: "Introduction to Macroeconomics", description: "GDP, inflation, unemployment, monetary and fiscal policy, and international trade.", credits: 3, department: "Economics", fulfills: ["Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "ECON 0500", title: "Intermediate Microeconomics", description: "Consumer and producer theory, general equilibrium, and market failure.", credits: 3, department: "Economics", fulfills: ["Social Science Elective"], prerequisites: ["ECON 0100", "MATH 0220"], level: "mid" },
    { code: "ECON 0510", title: "Intermediate Macroeconomics", description: "IS-LM model, AS-AD framework, growth theory, and stabilization policy.", credits: 3, department: "Economics", fulfills: ["Social Science Elective"], prerequisites: ["ECON 0110", "MATH 0220"], level: "mid" },
    { code: "ECON 0520", title: "Econometrics", description: "Regression analysis, hypothesis testing, time series, and causal inference.", credits: 3, department: "Economics", fulfills: ["Social Science Elective", "Quantitative Requirement"], prerequisites: ["ECON 0500", "STAT 1000"], level: "mid" },
    { code: "ECON 1100", title: "Game Theory", description: "Strategic decision-making, Nash equilibrium, auctions, and mechanism design.", credits: 3, department: "Economics", fulfills: ["Social Science Elective", "Quantitative Requirement"], prerequisites: ["ECON 0500"], level: "upper" },
    { code: "ECON 1110", title: "Public Economics", description: "Government spending, taxation, social insurance, and cost-benefit analysis.", credits: 3, department: "Economics", fulfills: ["Social Science Elective"], prerequisites: ["ECON 0500"], level: "upper" },
    { code: "ECON 1120", title: "Labor Economics", description: "Labor supply and demand, human capital, discrimination, and unemployment.", credits: 3, department: "Economics", fulfills: ["Social Science Elective"], prerequisites: ["ECON 0500"], level: "upper" },
    { code: "ECON 1130", title: "International Trade", description: "Comparative advantage, trade policy, trade agreements, and globalization effects.", credits: 3, department: "Economics", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: ["ECON 0500"], level: "upper" },
    { code: "ECON 1150", title: "Health Economics", description: "Healthcare markets, insurance, provider behavior, and health policy.", credits: 3, department: "Economics", fulfills: ["Social Science Elective"], prerequisites: ["ECON 0500"], level: "upper" },
    { code: "ECON 1160", title: "Environmental Economics", description: "Market failures, externalities, pollution control, and natural resource management.", credits: 3, department: "Economics", fulfills: ["Social Science Elective", "Free Elective"], prerequisites: ["ECON 0500"], level: "upper" },
    { code: "ECON 1170", title: "Development Economics", description: "Economic growth, poverty, inequality, and policy in developing countries.", credits: 3, department: "Economics", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: ["ECON 0500"], level: "upper" },
    { code: "ECON 1180", title: "Behavioral Economics", description: "Bounded rationality, heuristics, biases, and their implications for economic policy.", credits: 3, department: "Economics", fulfills: ["Social Science Elective", "Free Elective"], prerequisites: ["ECON 0100"], level: "upper" },
    { code: "ECON 1200", title: "Financial Economics", description: "Asset pricing, portfolio theory, risk management, and financial markets.", credits: 3, department: "Economics", fulfills: ["Social Science Elective", "Quantitative Requirement"], prerequisites: ["ECON 0500", "STAT 1000"], level: "upper" },

    // ── Psychology (14 courses) ──────────────────────────────────────
    { code: "PSY 0010", title: "Introduction to Psychology", description: "Survey of psychology: learning, memory, perception, development, social behavior, and disorders.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "PSY 0105", title: "Abnormal Psychology", description: "Psychological disorders: anxiety, mood, personality, and psychotic disorders. Diagnosis and treatment.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective"], prerequisites: ["PSY 0010"], level: "mid" },
    { code: "PSY 0160", title: "Social Psychology", description: "Social influence, attitudes, group behavior, prejudice, and interpersonal relationships.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective"], prerequisites: ["PSY 0010"], level: "mid" },
    { code: "PSY 0210", title: "Research Methods in Psychology", description: "Experimental design, measurement, ethical considerations, and statistical analysis.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective", "Quantitative Requirement"], prerequisites: ["PSY 0010"], level: "mid" },
    { code: "PSY 0310", title: "Developmental Psychology", description: "Physical, cognitive, and social development across the lifespan.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective"], prerequisites: ["PSY 0010"], level: "mid" },
    { code: "PSY 0405", title: "Cognitive Psychology", description: "Attention, perception, memory, language, problem-solving, and decision-making.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective"], prerequisites: ["PSY 0010"], level: "mid" },
    { code: "PSY 0420", title: "Biological Foundations of Behavior", description: "Neural systems, neurotransmitters, brain-behavior relationships, and psychopharmacology.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective", "Natural Science Elective"], prerequisites: ["PSY 0010"], level: "mid" },
    { code: "PSY 0505", title: "Personality Psychology", description: "Trait, psychodynamic, humanistic, and social-cognitive approaches to personality.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective"], prerequisites: ["PSY 0010"], level: "mid" },
    { code: "PSY 1020", title: "Psychology of Aging", description: "Cognitive, emotional, and social changes in later adulthood. Health and well-being.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: ["PSY 0310"], level: "upper" },
    { code: "PSY 1200", title: "Clinical Psychology", description: "Assessment, diagnosis, and treatment approaches. Evidence-based practice.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective"], prerequisites: ["PSY 0105"], level: "upper" },
    { code: "PSY 1230", title: "Health Psychology", description: "Behavioral factors in health and illness. Stress, coping, and health promotion.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective"], prerequisites: ["PSY 0010"], level: "upper" },
    { code: "PSY 1330", title: "Psychology of Gender", description: "Gender development, stereotypes, identity, and gender-related behavior across cultures.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: ["PSY 0010"], level: "upper" },
    { code: "PSY 1400", title: "Forensic Psychology", description: "Psychology in legal contexts: criminal profiling, eyewitness testimony, and competency.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective", "Free Elective"], prerequisites: ["PSY 0010"], level: "upper" },
    { code: "PSY 1505", title: "Industrial/Organizational Psychology", description: "Psychology in the workplace: selection, motivation, leadership, and organizational culture.", credits: 3, department: "Psychology", fulfills: ["Social Science Elective", "Free Elective"], prerequisites: ["PSY 0010"], level: "upper" },

    // ── Art (12 courses) ─────────────────────────────────────────────
    { code: "HAA 0010", title: "Introduction to Art History", description: "Survey of art from prehistory to the present. Painting, sculpture, architecture, and media arts.", credits: 3, department: "Art", fulfills: ["Humanities Elective"], prerequisites: [], level: "intro" },
    { code: "HAA 0020", title: "Modern and Contemporary Art", description: "Art movements from Impressionism to the present. Conceptual art, installations, and digital art.", credits: 3, department: "Art", fulfills: ["Humanities Elective"], prerequisites: [], level: "intro" },
    { code: "SA 0100", title: "Drawing Fundamentals", description: "Observational drawing, perspective, composition, and mixed media techniques.", credits: 3, department: "Art", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: [], level: "intro" },
    { code: "SA 0200", title: "Painting 1", description: "Introduction to painting techniques, color theory, and visual expression.", credits: 3, department: "Art", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: ["SA 0100"], level: "mid" },
    { code: "SA 0300", title: "Sculpture 1", description: "Three-dimensional art using clay, wood, metal, and mixed media.", credits: 3, department: "Art", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: ["SA 0100"], level: "mid" },
    { code: "SA 0400", title: "Photography 1", description: "Digital and film photography. Composition, exposure, lighting, and image editing.", credits: 3, department: "Art", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: [], level: "intro" },
    { code: "SA 0500", title: "Graphic Design", description: "Visual communication principles, typography, layout, and digital design tools.", credits: 3, department: "Art", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: [], level: "mid" },
    { code: "HAA 0300", title: "Renaissance Art", description: "Italian and Northern Renaissance art. Painting, sculpture, and architecture.", credits: 3, department: "Art", fulfills: ["Humanities Elective"], prerequisites: ["HAA 0010"], level: "mid" },
    { code: "HAA 0400", title: "Asian Art", description: "Art traditions of China, Japan, India, and Southeast Asia.", credits: 3, department: "Art", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "mid" },
    { code: "HAA 1010", title: "Women in Art", description: "Women as artists, subjects, and patrons from antiquity to the present.", credits: 3, department: "Art", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "upper" },
    { code: "SA 0600", title: "Printmaking", description: "Relief, intaglio, lithography, and screen printing techniques.", credits: 3, department: "Art", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: ["SA 0100"], level: "mid" },
    { code: "SA 1000", title: "Digital Art and New Media", description: "Digital tools for artistic expression. Interactive media, animation, and net art.", credits: 3, department: "Art", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: [], level: "upper" },

    // ── Music (12 courses) ───────────────────────────────────────────
    { code: "MUSIC 0100", title: "Introduction to Music", description: "Elements of music, listening strategies, and survey of Western and world music traditions.", credits: 3, department: "Music", fulfills: ["Humanities Elective"], prerequisites: [], level: "intro" },
    { code: "MUSIC 0200", title: "Music Theory 1", description: "Notation, scales, intervals, chords, and harmonic progressions.", credits: 3, department: "Music", fulfills: ["Humanities Elective"], prerequisites: [], level: "intro" },
    { code: "MUSIC 0211", title: "Aural Skills 1", description: "Ear training, sight singing, rhythmic dictation, and interval recognition.", credits: 2, department: "Music", fulfills: ["Humanities Elective"], prerequisites: [], level: "intro" },
    { code: "MUSIC 0300", title: "Music Theory 2", description: "Advanced harmony, counterpoint, chromatic harmony, and analysis.", credits: 3, department: "Music", fulfills: ["Humanities Elective"], prerequisites: ["MUSIC 0200"], level: "mid" },
    { code: "MUSIC 0400", title: "History of Western Music", description: "Medieval through Romantic music. Composers, forms, and cultural contexts.", credits: 3, department: "Music", fulfills: ["Humanities Elective"], prerequisites: ["MUSIC 0100"], level: "mid" },
    { code: "MUSIC 0500", title: "World Music", description: "Music traditions from Africa, Asia, Latin America, and indigenous cultures.", credits: 3, department: "Music", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "intro" },
    { code: "MUSIC 0600", title: "Jazz History", description: "Evolution of jazz from its origins to contemporary styles. Major artists and recordings.", credits: 3, department: "Music", fulfills: ["Humanities Elective", "Diversity Requirement"], prerequisites: [], level: "mid" },
    { code: "MUSIC 0700", title: "Electronic Music Production", description: "Digital audio workstations, synthesis, sampling, mixing, and live performance.", credits: 3, department: "Music", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: [], level: "mid" },
    { code: "MUSIC 1000", title: "Composition", description: "Original music composition. Techniques of melody, harmony, texture, and orchestration.", credits: 3, department: "Music", fulfills: ["Humanities Elective"], prerequisites: ["MUSIC 0300"], level: "upper" },
    { code: "MUSIC 1100", title: "Conducting", description: "Baton technique, score reading, rehearsal methods, and ensemble leadership.", credits: 3, department: "Music", fulfills: ["Humanities Elective"], prerequisites: ["MUSIC 0300"], level: "upper" },
    { code: "MUSIC 1200", title: "Music and Film", description: "Film scoring techniques, analysis of film music, and the role of music in cinema.", credits: 3, department: "Music", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: [], level: "upper" },
    { code: "MUSIC 1300", title: "Music Technology", description: "Sound recording, acoustics, MIDI, and music software applications.", credits: 3, department: "Music", fulfills: ["Humanities Elective", "Free Elective"], prerequisites: [], level: "mid" },

    // ── Political Science (14 courses) ───────────────────────────────
    { code: "PS 0010", title: "Introduction to American Politics", description: "Constitution, Congress, presidency, judiciary, political parties, and public opinion.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "PS 0050", title: "Introduction to International Relations", description: "Theories of international relations, security, international organizations, and globalization.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "PS 0060", title: "Introduction to Comparative Politics", description: "Political systems, regimes, democratization, and political institutions across countries.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: [], level: "intro" },
    { code: "PS 0200", title: "Introduction to Political Theory", description: "Classic political thinkers: Plato, Aristotle, Machiavelli, Hobbes, Locke, and Rousseau.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective", "Humanities Elective"], prerequisites: [], level: "intro" },
    { code: "PS 0300", title: "American Public Policy", description: "Policy process, agenda-setting, implementation, and evaluation across major policy domains.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective"], prerequisites: ["PS 0010"], level: "mid" },
    { code: "PS 0500", title: "The American Presidency", description: "Presidential power, executive-legislative relations, and the modern presidency.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective"], prerequisites: ["PS 0010"], level: "mid" },
    { code: "PS 0550", title: "Congress and the Legislative Process", description: "Congressional structure, lawmaking, committees, and partisan dynamics.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective"], prerequisites: ["PS 0010"], level: "mid" },
    { code: "PS 0600", title: "Constitutional Law", description: "Supreme Court decisions on federalism, separation of powers, and individual rights.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective"], prerequisites: ["PS 0010"], level: "mid" },
    { code: "PS 1310", title: "Politics of Developing Countries", description: "Political development, governance, conflict, and democratization in the developing world.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: ["PS 0060"], level: "upper" },
    { code: "PS 1381", title: "International Security", description: "War, deterrence, arms control, terrorism, and contemporary security challenges.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective"], prerequisites: ["PS 0050"], level: "upper" },
    { code: "PS 1500", title: "Elections and Voting Behavior", description: "Electoral systems, campaigns, voter turnout, and public opinion formation.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective"], prerequisites: ["PS 0010"], level: "upper" },
    { code: "PS 1540", title: "Race and American Politics", description: "Racial politics, civil rights, representation, and political participation.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: ["PS 0010"], level: "upper" },
    { code: "PS 1580", title: "Political Parties and Interest Groups", description: "Party systems, interest group formation, lobbying, and campaign finance.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective"], prerequisites: ["PS 0010"], level: "upper" },
    { code: "PS 1600", title: "International Political Economy", description: "Trade, finance, development, and the politics of global economic institutions.", credits: 3, department: "Political Science", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: ["PS 0050"], level: "upper" },

    // ── Sociology (13 courses) ───────────────────────────────────────
    { code: "SOC 0010", title: "Introduction to Sociology", description: "Social structures, culture, socialization, stratification, and social institutions.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "SOC 0100", title: "Social Problems", description: "Analysis of contemporary social problems: poverty, crime, education, and healthcare.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "SOC 0150", title: "Social Inequality", description: "Class, race, gender, and other dimensions of inequality in modern societies.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: [], level: "intro" },
    { code: "SOC 0300", title: "Sociological Research Methods", description: "Survey design, qualitative methods, sampling, and data analysis.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective", "Quantitative Requirement"], prerequisites: ["SOC 0010"], level: "mid" },
    { code: "SOC 0352", title: "Social Stratification", description: "Theories of class, mobility, wealth distribution, and the persistence of inequality.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective"], prerequisites: ["SOC 0010"], level: "mid" },
    { code: "SOC 0400", title: "Sociological Theory", description: "Classical and contemporary sociological theory: Marx, Weber, Durkheim, and modern theorists.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective"], prerequisites: ["SOC 0010"], level: "mid" },
    { code: "SOC 0460", title: "Race and Ethnicity", description: "Racial and ethnic relations, immigration, identity, and institutional racism.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: ["SOC 0010"], level: "mid" },
    { code: "SOC 0477", title: "Urban Sociology", description: "Urbanization, cities, neighborhoods, gentrification, and community development.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective"], prerequisites: ["SOC 0010"], level: "mid" },
    { code: "SOC 1010", title: "Medical Sociology", description: "Social dimensions of health, illness, healthcare systems, and public health.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective"], prerequisites: ["SOC 0010"], level: "upper" },
    { code: "SOC 1050", title: "Criminology", description: "Theories of crime, criminal justice system, policing, and correctional policies.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective"], prerequisites: ["SOC 0010"], level: "upper" },
    { code: "SOC 1100", title: "Sociology of Education", description: "Educational institutions, achievement gaps, school reform, and social mobility.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective"], prerequisites: ["SOC 0010"], level: "upper" },
    { code: "SOC 1150", title: "Sociology of Religion", description: "Religion as a social institution. Secularization, fundamentalism, and religious movements.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: ["SOC 0010"], level: "upper" },
    { code: "SOC 1200", title: "Sociology of Gender", description: "Gender socialization, identity, work, family, and gender-based violence.", credits: 3, department: "Sociology", fulfills: ["Social Science Elective", "Diversity Requirement"], prerequisites: ["SOC 0010"], level: "upper" },

    // ── Business (15 courses) ────────────────────────────────────────
    { code: "BUSACC 0030", title: "Financial Accounting", description: "Financial statements, recording transactions, adjusting entries, and financial analysis.", credits: 3, department: "Business", fulfills: ["Free Elective"], prerequisites: [], level: "intro" },
    { code: "BUSACC 0040", title: "Managerial Accounting", description: "Cost behavior, budgeting, variance analysis, and management decision-making.", credits: 3, department: "Business", fulfills: ["Free Elective"], prerequisites: ["BUSACC 0030"], level: "mid" },
    { code: "BUSFIN 1030", title: "Introduction to Finance", description: "Time value of money, risk and return, valuation, capital budgeting, and working capital.", credits: 3, department: "Business", fulfills: ["Free Elective", "Quantitative Requirement"], prerequisites: ["BUSACC 0030"], level: "mid" },
    { code: "BUSMKT 1010", title: "Principles of Marketing", description: "Marketing mix, consumer behavior, market research, segmentation, and branding.", credits: 3, department: "Business", fulfills: ["Free Elective", "Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "BUSORG 1010", title: "Organizational Behavior", description: "Individual behavior, group dynamics, motivation, leadership, and organizational culture.", credits: 3, department: "Business", fulfills: ["Free Elective", "Social Science Elective"], prerequisites: [], level: "intro" },
    { code: "BUSQOM 1050", title: "Operations Management", description: "Process design, quality management, inventory, supply chain, and project management.", credits: 3, department: "Business", fulfills: ["Free Elective", "Quantitative Requirement"], prerequisites: ["STAT 1100"], level: "mid" },
    { code: "BUSENV 1740", title: "Business Law", description: "Contracts, torts, business organizations, employment law, and intellectual property.", credits: 3, department: "Business", fulfills: ["Free Elective"], prerequisites: [], level: "mid" },
    { code: "BUSFIN 1311", title: "Corporate Finance", description: "Capital structure, dividend policy, mergers and acquisitions, and financial strategy.", credits: 3, department: "Business", fulfills: ["Free Elective"], prerequisites: ["BUSFIN 1030"], level: "upper" },
    { code: "BUSFIN 1321", title: "Investments", description: "Security analysis, portfolio management, derivatives, and market efficiency.", credits: 3, department: "Business", fulfills: ["Free Elective", "Quantitative Requirement"], prerequisites: ["BUSFIN 1030"], level: "upper" },
    { code: "BUSMKT 1040", title: "Consumer Behavior", description: "Psychological and social factors in consumer decision-making and marketing strategy.", credits: 3, department: "Business", fulfills: ["Free Elective"], prerequisites: ["BUSMKT 1010"], level: "upper" },
    { code: "BUSMKT 1060", title: "Digital Marketing", description: "Online marketing channels, SEO, social media, analytics, and content strategy.", credits: 3, department: "Business", fulfills: ["Free Elective"], prerequisites: ["BUSMKT 1010"], level: "upper" },
    { code: "BUSORG 1020", title: "Strategic Management", description: "Competitive analysis, strategy formulation, implementation, and corporate governance.", credits: 3, department: "Business", fulfills: ["Free Elective"], prerequisites: ["BUSFIN 1030", "BUSMKT 1010"], level: "upper" },
    { code: "BUSSPP 0020", title: "Entrepreneurship", description: "Opportunity recognition, business planning, venture funding, and startup management.", credits: 3, department: "Business", fulfills: ["Free Elective"], prerequisites: [], level: "intro" },
    { code: "BUSSCM 1750", title: "Supply Chain Management", description: "Logistics, procurement, inventory optimization, and global supply chain networks.", credits: 3, department: "Business", fulfills: ["Free Elective"], prerequisites: ["BUSQOM 1050"], level: "upper" },
    { code: "BUSERV 1560", title: "Business Analytics", description: "Data-driven decision making, predictive modeling, visualization, and business intelligence.", credits: 3, department: "Business", fulfills: ["Free Elective", "Quantitative Requirement"], prerequisites: ["STAT 1100"], level: "upper" },
  ];

  console.log(`Preparing ${courseDefs.length} courses...`);

  // ── Time slots and buildings ──────────────────────────────────────

  const mwfSlots = [
    { start: "09:00", end: "09:50" },
    { start: "10:00", end: "10:50" },
    { start: "11:00", end: "11:50" },
    { start: "13:00", end: "13:50" },
    { start: "14:00", end: "14:50" },
    { start: "15:00", end: "15:50" },
  ];

  const tthSlots = [
    { start: "09:30", end: "10:45" },
    { start: "11:00", end: "12:15" },
    { start: "13:00", end: "14:15" },
    { start: "14:30", end: "15:45" },
    { start: "16:00", end: "17:15" },
  ];

  const eveningSlots = [
    { start: "18:00", end: "20:30", days: ["M", "W"] },
    { start: "18:00", end: "20:30", days: ["T", "Th"] },
    { start: "18:00", end: "20:30", days: ["W"] },
  ];

  const buildingsByDept: Record<string, string[]> = {
    "Computer Science": ["Sennott Square 5502", "Sennott Square 6110", "Sennott Square 5313", "Sennott Square 6516", "Sennott Square 5505"],
    "Mathematics": ["Thackeray Hall 524", "Thackeray Hall 627", "Thackeray Hall 704", "Cathedral of Learning 324", "Cathedral of Learning 232"],
    "English": ["Cathedral of Learning 501", "Cathedral of Learning 324", "Cathedral of Learning 218", "David Lawrence Hall 121", "David Lawrence Hall 230"],
    "History": ["Cathedral of Learning 324", "Cathedral of Learning 218", "Posvar Hall 1500", "David Lawrence Hall 121", "David Lawrence Hall 230"],
    "Philosophy": ["Cathedral of Learning 324", "Cathedral of Learning 501", "Cathedral of Learning 218", "David Lawrence Hall 121", "Posvar Hall 1500"],
    "Physics": ["Allen Hall 103", "Allen Hall 321", "Thackeray Hall 524", "Old Engineering Hall 200", "Chevron Science Center 150"],
    "Chemistry": ["Chevron Science Center 150", "Chevron Science Center 217", "Chevron Science Center 321", "Eberly Hall 228", "Eberly Hall 307"],
    "Biology": ["Crawford Hall 169", "Langley Hall A219", "Langley Hall A221", "Chevron Science Center 150", "Life Sciences Annex 201"],
    "Economics": ["Posvar Hall 1500", "Posvar Hall 1700", "Posvar Hall 1800", "David Lawrence Hall 121", "Cathedral of Learning 324"],
    "Psychology": ["Sennott Square 2200", "Sennott Square 2400", "Cathedral of Learning 324", "David Lawrence Hall 121", "Posvar Hall 1500"],
    "Art": ["Frick Fine Arts 204", "Frick Fine Arts 125", "Frick Fine Arts 300", "Frick Fine Arts Studio A", "University Art Gallery"],
    "Music": ["Music Building 132", "Music Building 212", "Music Building 305", "Music Building Recital Hall", "Bellefield Hall 314"],
    "Political Science": ["Posvar Hall 1500", "Posvar Hall 1700", "Posvar Hall 1800", "David Lawrence Hall 121", "Cathedral of Learning 324"],
    "Sociology": ["Posvar Hall 1500", "Posvar Hall 1700", "Posvar Hall 1800", "David Lawrence Hall 121", "Cathedral of Learning 218"],
    "Business": ["Mervis Hall 104", "Mervis Hall 209", "Mervis Hall 117", "Sennott Square 2200", "Posvar Hall 1500"],
  };

  // Deterministic seeded pseudo-random for reproducibility
  let seed = 42;
  function seededRandom() {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  function pick<T>(arr: T[]): T {
    return arr[Math.floor(seededRandom() * arr.length)];
  }

  // ── Build all section data ────────────────────────────────────────

  interface SectionInput {
    sectionNumber: string;
    professorId: string;
    days: string[];
    startTime: string;
    endTime: string;
    location: string;
    totalSeats: number;
    openSeats: number;
    waitlist: number;
    term: string;
    type: string;
  }

  interface CourseWithSections {
    code: string;
    title: string;
    description: string;
    credits: number;
    department: string;
    fulfills: string[];
    prerequisites: string[];
    universityId: string;
    sections: SectionInput[];
  }

  const allCourses: CourseWithSections[] = [];
  let fullSectionCount = 0;
  let totalSectionCount = 0;

  for (const cDef of courseDefs) {
    const deptProfs = profsByDept[cDef.department] || professors.slice(0, 3);
    const buildings = buildingsByDept[cDef.department] || ["Cathedral of Learning 324"];

    // Determine number of lecture sections (2-4)
    const numSections = 2 + Math.floor(seededRandom() * 3); // 2, 3, or 4

    // Determine seat count based on level
    let baseTotalSeats: number;
    if (cDef.level === "intro") {
      baseTotalSeats = 120 + Math.floor(seededRandom() * 180); // 120-300
    } else if (cDef.level === "mid") {
      baseTotalSeats = 50 + Math.floor(seededRandom() * 100); // 50-150
    } else {
      baseTotalSeats = 30 + Math.floor(seededRandom() * 50); // 30-80
    }

    const sections: SectionInput[] = [];

    for (let s = 0; s < numSections; s++) {
      const prof = deptProfs[s % deptProfs.length];
      const sectionNumber = String(s + 1).padStart(3, "0");

      // Vary seats slightly per section
      const totalSeats = baseTotalSeats + Math.floor(seededRandom() * 30) - 15;

      // ~15% of sections should be full
      const isFull = seededRandom() < 0.15;
      let openSeats: number;
      let waitlist = 0;
      if (isFull) {
        openSeats = 0;
        waitlist = Math.floor(seededRandom() * 12) + 1;
        fullSectionCount++;
      } else {
        openSeats = Math.floor(seededRandom() * totalSeats * 0.6) + 1;
      }

      // Pick time slot
      let days: string[];
      let startTime: string;
      let endTime: string;

      // Small chance of evening (~8%)
      if (seededRandom() < 0.08) {
        const ev = pick(eveningSlots);
        days = ev.days;
        startTime = ev.start;
        endTime = ev.end;
      } else if (seededRandom() < 0.5) {
        // MWF
        days = ["M", "W", "F"];
        const slot = mwfSlots[s % mwfSlots.length];
        startTime = slot.start;
        endTime = slot.end;
      } else {
        // TTh
        days = ["T", "Th"];
        const slot = tthSlots[s % tthSlots.length];
        startTime = slot.start;
        endTime = slot.end;
      }

      const location = buildings[s % buildings.length];

      sections.push({
        sectionNumber,
        professorId: prof.id,
        days,
        startTime,
        endTime,
        location,
        totalSeats,
        openSeats,
        waitlist,
        term: "Fall 2026",
        type: "Lecture",
      });
      totalSectionCount++;
    }

    // Add lab sections for science/CS courses
    if (cDef.hasLab) {
      const labCount = Math.min(numSections, 2 + Math.floor(seededRandom() * 2));
      for (let l = 0; l < labCount; l++) {
        const prof = deptProfs[(numSections + l) % deptProfs.length];
        const labSeats = 24 + Math.floor(seededRandom() * 12);
        const isFull = seededRandom() < 0.15;
        const labSlot = tthSlots[l % tthSlots.length];

        sections.push({
          sectionNumber: `L${String(l + 1).padStart(2, "0")}`,
          professorId: prof.id,
          days: l % 2 === 0 ? ["T"] : ["Th"],
          startTime: labSlot.start,
          endTime: labSlot.end,
          location: pick(buildings),
          totalSeats: labSeats,
          openSeats: isFull ? 0 : Math.floor(seededRandom() * labSeats * 0.5) + 1,
          waitlist: isFull ? Math.floor(seededRandom() * 8) + 1 : 0,
          term: "Fall 2026",
          type: "Lab",
        });
        totalSectionCount++;
        if (isFull) fullSectionCount++;
      }
    }

    // Add recitation sections for courses that have them
    if (cDef.hasRecitation) {
      const recCount = Math.min(numSections, 2 + Math.floor(seededRandom() * 2));
      for (let r = 0; r < recCount; r++) {
        const prof = deptProfs[(numSections + r) % deptProfs.length];
        const recSeats = 30 + Math.floor(seededRandom() * 15);
        const isFull = seededRandom() < 0.15;
        const recSlot = mwfSlots[(r + 2) % mwfSlots.length];

        sections.push({
          sectionNumber: `R${String(r + 1).padStart(2, "0")}`,
          professorId: prof.id,
          days: ["F"],
          startTime: recSlot.start,
          endTime: recSlot.end,
          location: pick(buildings),
          totalSeats: recSeats,
          openSeats: isFull ? 0 : Math.floor(seededRandom() * recSeats * 0.5) + 1,
          waitlist: isFull ? Math.floor(seededRandom() * 6) + 1 : 0,
          term: "Fall 2026",
          type: "Recitation",
        });
        totalSectionCount++;
        if (isFull) fullSectionCount++;
      }
    }

    allCourses.push({
      code: cDef.code,
      title: cDef.title,
      description: cDef.description,
      credits: cDef.credits,
      department: cDef.department,
      fulfills: cDef.fulfills,
      prerequisites: cDef.prerequisites,
      universityId: university.id,
      sections,
    });
  }

  console.log(`Creating ${allCourses.length} courses with ${totalSectionCount} sections (${fullSectionCount} full)...`);

  // ── Insert in batches to avoid transaction timeout ────────────────
  const BATCH_SIZE = 20;
  for (let i = 0; i < allCourses.length; i += BATCH_SIZE) {
    const batch = allCourses.slice(i, i + BATCH_SIZE);
    await prisma.$transaction(
      batch.map((c) =>
        prisma.course.create({
          data: {
            code: c.code,
            title: c.title,
            description: c.description,
            credits: c.credits,
            department: c.department,
            fulfills: c.fulfills,
            prerequisites: c.prerequisites,
            universityId: c.universityId,
            sections: {
              create: c.sections,
            },
          },
        })
      )
    );
    console.log(`  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(allCourses.length / BATCH_SIZE)} done`);
  }

  // ── Summary ───────────────────────────────────────────────────────

  const courseCount = await prisma.course.count();
  const sectionCount = await prisma.section.count();
  const profCount = await prisma.professor.count();
  const fullCount = await prisma.section.count({ where: { openSeats: 0 } });

  console.log("\nSeed complete!");
  console.log(`  University: ${university.name} (${university.slug})`);
  console.log(`  Professors: ${profCount}`);
  console.log(`  Courses:    ${courseCount}`);
  console.log(`  Sections:   ${sectionCount} (${fullCount} full)`);
  console.log(`  Departments: ${Array.from(new Set(allCourses.map((c) => c.department))).length}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
