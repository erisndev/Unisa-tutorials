export const packages = [
  {
    id: "1v1",
    name: "1v1 (Lecture:Student)",
    description: "Private tutorial session (1 lecturer, 1 student).",
    pricePerModule: 500,
  },
  {
    id: "1v5",
    name: "1v5 (Lecture:Students)",
    description: "Small group tutorial (up to 5 students).",
    pricePerModule: 350,
  },
  {
    id: "1v10",
    name: "1v10 (Lecture:Students)",
    description: "Medium group tutorial (up to 10 students).",
    pricePerModule: 250,
  },
  {
    id: "1v50",
    name: "1v50 (Lecture:Students)",
    description: "Large group tutorial (up to 50 students).",
    pricePerModule: 150,
  },
];

export const faculties = [
  {
    id: "science",
    name: "Faculty of Science",
    description: "Mathematics, computing, and natural sciences.",
    courses: [
      {
        id: "cs",
        name: "Computer Science",
        level: "Undergraduate",
        duration: "3 years",
        shortDescription:
          "Programming, algorithms, data structures, and software development fundamentals.",
        requirements: [
          "Mathematics at high school level",
          "Computer literacy recommended",
        ],
        overview:
          "Computer Science develops problem-solving skills using computation. You'll learn programming, algorithms, systems, databases, and engineering practices.",
        outcomes: [
          "Write clean and maintainable code",
          "Solve problems with algorithms and data structures",
          "Understand core computer systems and databases",
          "Work in teams using modern software practices",
        ],
        years: [
          {
            year: 1,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "cos1511", code: "COS1511", name: "Introduction to Programming I" },
                  { id: "cos1521", code: "COS1521", name: "Computer Systems: Fundamental Concepts" },
                  { id: "mat1503", code: "MAT1503", name: "Linear Algebra I" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "cos1512", code: "COS1512", name: "Introduction to Programming II" },
                  { id: "cos1501", code: "COS1501", name: "Theoretical Computer Science I" },
                  { id: "mat1512", code: "MAT1512", name: "Calculus A" },
                ],
              },
            ],
          },
          {
            year: 2,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "cos2611", code: "COS2611", name: "Programming: Data Structures" },
                  { id: "cos2614", code: "COS2614", name: "Programming: Contemporary Concepts" },
                  { id: "cos2661", code: "COS2661", name: "Formal Logic II" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "cos2633", code: "COS2633", name: "Numerical Methods I" },
                  { id: "cos2621", code: "COS2621", name: "Computer Organisation" },
                  { id: "inf2611", code: "INF2611", name: "Visual Programming II" },
                ],
              },
            ],
          },
          {
            year: 3,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "cos3711", code: "COS3711", name: "Advanced Programming" },
                  { id: "cos3721", code: "COS3721", name: "Operating Systems & Architecture" },
                  { id: "cos3751", code: "COS3751", name: "Databases" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "cos3761", code: "COS3761", name: "Artificial Intelligence" },
                  { id: "cos3741", code: "COS3741", name: "Software Engineering" },
                  { id: "cos3712", code: "COS3712", name: "Machine Learning" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "math",
        name: "Mathematics",
        level: "Undergraduate",
        duration: "3 years",
        shortDescription:
          "Core calculus, algebra, and applied mathematical methods used across science and engineering.",
        requirements: ["Strong mathematics background"],
        overview:
          "Mathematics focuses on rigorous reasoning and techniques for modelling real-world problems.",
        outcomes: [
          "Build fluency in calculus and algebra",
          "Apply mathematical tools to scientific problems",
          "Develop analytical and proof skills",
        ],
        years: [
          {
            year: 1,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "mat1503", code: "MAT1503", name: "Linear Algebra I" },
                  { id: "mat1511", code: "MAT1511", name: "Calculus A" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "mat1512", code: "MAT1512", name: "Calculus B" },
                  { id: "mat1613", code: "MAT1613", name: "Discrete Mathematics" },
                ],
              },
            ],
          },
          {
            year: 2,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "mat2611", code: "MAT2611", name: "Linear Algebra II" },
                  { id: "mat2612", code: "MAT2612", name: "Real Analysis I" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "mat2613", code: "MAT2613", name: "Real Analysis II" },
                  { id: "mat2615", code: "MAT2615", name: "Differential Equations" },
                ],
              },
            ],
          },
          {
            year: 3,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "mat3701", code: "MAT3701", name: "Abstract Algebra" },
                  { id: "mat3705", code: "MAT3705", name: "Complex Analysis" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "mat3706", code: "MAT3706", name: "Topology" },
                  { id: "mat3711", code: "MAT3711", name: "Probability & Statistics" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "commerce",
    name: "Faculty of Commerce",
    description: "Accounting, economics, management, and business analytics.",
    courses: [
      {
        id: "accounting",
        name: "Accounting",
        level: "Undergraduate",
        duration: "3 years",
        shortDescription:
          "Financial accounting, management accounting, and auditing foundations.",
        requirements: ["Basic numeracy", "Attention to detail"],
        overview:
          "Accounting prepares learners to interpret, record, and communicate financial information used for decision-making.",
        outcomes: [
          "Understand financial statements",
          "Apply accounting principles and standards",
          "Develop auditing and taxation fundamentals",
        ],
        years: [
          {
            year: 1,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "fac1501", code: "FAC1501", name: "Financial Accounting Principles" },
                  { id: "ecs1501", code: "ECS1501", name: "Economics IA" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "fac1502", code: "FAC1502", name: "Financial Accounting for Companies" },
                  { id: "ecs1601", code: "ECS1601", name: "Economics IB" },
                ],
              },
            ],
          },
          {
            year: 2,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "fac2601", code: "FAC2601", name: "Group Statements & Analysis" },
                  { id: "mac2601", code: "MAC2601", name: "Management Accounting I" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "fac2602", code: "FAC2602", name: "Financial Accounting II" },
                  { id: "tax2601", code: "TAX2601", name: "Taxation" },
                ],
              },
            ],
          },
          {
            year: 3,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "fac3701", code: "FAC3701", name: "Financial Accounting III" },
                  { id: "aud2601", code: "AUD2601", name: "Auditing I" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "mac3701", code: "MAC3701", name: "Management Accounting II" },
                  { id: "aud3702", code: "AUD3702", name: "Auditing II" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "economics",
        name: "Economics",
        level: "Undergraduate",
        duration: "3 years",
        shortDescription:
          "Microeconomics, macroeconomics, and quantitative economic analysis.",
        requirements: ["Basic mathematics recommended"],
        overview:
          "Economics studies how individuals, firms, and governments allocate scarce resources.",
        outcomes: [
          "Explain micro and macro economic behavior",
          "Use data to evaluate economic questions",
          "Apply economic reasoning to policy and business",
        ],
        years: [
          {
            year: 1,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "ecs1501e", code: "ECS1501", name: "Economics IA (Micro)" },
                  { id: "dsc1520", code: "DSC1520", name: "Quantitative Modelling I" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "ecs1601e", code: "ECS1601", name: "Economics IB (Macro)" },
                  { id: "sta1510", code: "STA1510", name: "Basic Statistics" },
                ],
              },
            ],
          },
          {
            year: 2,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "ecs2601", code: "ECS2601", name: "Microeconomics II" },
                  { id: "ecs2602", code: "ECS2602", name: "Macroeconomics II" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "ecs2604", code: "ECS2604", name: "Labour Economics" },
                  { id: "ecs2605", code: "ECS2605", name: "Public Economics" },
                ],
              },
            ],
          },
          {
            year: 3,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "ecs3701", code: "ECS3701", name: "Econometrics" },
                  { id: "ecs3703", code: "ECS3703", name: "International Economics" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "ecs3704", code: "ECS3704", name: "Development Economics" },
                  { id: "ecs3706", code: "ECS3706", name: "Monetary Economics" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "humanities",
    name: "Faculty of Humanities",
    description: "Communication, education, languages, and social sciences.",
    courses: [
      {
        id: "education",
        name: "Education",
        level: "Undergraduate",
        duration: "4 years",
        shortDescription:
          "Teaching methods, learning psychology, and curriculum design.",
        requirements: ["Interest in teaching and learning"],
        overview:
          "Education prepares learners for teaching and training roles through theory and practice.",
        outcomes: [
          "Plan lessons and learning activities",
          "Understand how learners develop",
          "Apply assessment strategies",
        ],
        years: [
          {
            year: 1,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "edt1601", code: "EDT1601", name: "Foundations of Education" },
                  { id: "pst111q", code: "PST111Q", name: "Teaching Practice I" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "edp1501", code: "EDP1501", name: "Educational Psychology" },
                  { id: "edt1602", code: "EDT1602", name: "Education & Society" },
                ],
              },
            ],
          },
          {
            year: 2,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "edt2601", code: "EDT2601", name: "Curriculum Studies" },
                  { id: "edp2601", code: "EDP2601", name: "Developmental Psychology" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "edt2602", code: "EDT2602", name: "Assessment & Evaluation" },
                  { id: "pst211q", code: "PST211Q", name: "Teaching Practice II" },
                ],
              },
            ],
          },
          {
            year: 3,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "edt3601", code: "EDT3601", name: "Inclusive Education" },
                  { id: "edt3602", code: "EDT3602", name: "Education Management" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "edt3603", code: "EDT3603", name: "Research in Education" },
                  { id: "pst311q", code: "PST311Q", name: "Teaching Practice III" },
                ],
              },
            ],
          },
          {
            year: 4,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "edt4801", code: "EDT4801", name: "Education Policy" },
                  { id: "edt4802", code: "EDT4802", name: "Comparative Education" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "edt4803", code: "EDT4803", name: "Education Research Project" },
                  { id: "pst411q", code: "PST411Q", name: "Teaching Practice IV" },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "psychology",
        name: "Psychology",
        level: "Undergraduate",
        duration: "3 years",
        shortDescription:
          "Behavior, cognition, and research methods for psychology.",
        requirements: ["Strong reading and writing skills"],
        overview:
          "Psychology explores mental processes and behavior through scientific methods.",
        outcomes: [
          "Describe key theories of behavior",
          "Understand research design and ethics",
          "Apply psychological principles to real scenarios",
        ],
        years: [
          {
            year: 1,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "psy1011", code: "PYC1501", name: "Introduction to Psychology" },
                  { id: "psy1012", code: "PYC1502", name: "Psychology of Personality" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "psy1021", code: "PYC1503", name: "Social Psychology" },
                  { id: "psy1022", code: "PYC1504", name: "Research Methods I" },
                ],
              },
            ],
          },
          {
            year: 2,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "psy2011", code: "PYC2601", name: "Child & Adolescent Development" },
                  { id: "psy2012", code: "PYC2602", name: "Cognitive Psychology" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "psy2021", code: "PYC2603", name: "Abnormal Behaviour" },
                  { id: "psy2022", code: "PYC2604", name: "Research Methods II" },
                ],
              },
            ],
          },
          {
            year: 3,
            semesters: [
              {
                semester: 1,
                modules: [
                  { id: "psy3011", code: "PYC3701", name: "Psychopathology" },
                  { id: "psy3012", code: "PYC3702", name: "Community Psychology" },
                ],
              },
              {
                semester: 2,
                modules: [
                  { id: "psy3021", code: "PYC3703", name: "Psychological Assessment" },
                  { id: "psy3022", code: "PYC3704", name: "Health Psychology" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

/* ── helpers ── */

export function findFaculty(facultyId) {
  return faculties.find((f) => f.id === facultyId);
}

export function findCourse(facultyId, courseId) {
  const faculty = findFaculty(facultyId);
  return faculty?.courses?.find((c) => c.id === courseId);
}

/** Flatten all modules from a course's year/semester structure */
export function getAllModules(course) {
  if (!course?.years) return [];
  const modules = [];
  for (const y of course.years) {
    for (const s of y.semesters) {
      for (const m of s.modules) {
        modules.push({ ...m, year: y.year, semester: s.semester });
      }
    }
  }
  return modules;
}

/** Get modules for a specific year & semester */
export function getModulesForSemester(course, year, semester) {
  const y = course?.years?.find((yr) => yr.year === year);
  const s = y?.semesters?.find((sem) => sem.semester === semester);
  return s?.modules || [];
}

/** Count total modules in a course */
export function countModules(course) {
  return getAllModules(course).length;
}

/** Get the number of years for a course */
export function getYearCount(course) {
  return course?.years?.length || 0;
}

export function formatZAR(amount) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}
