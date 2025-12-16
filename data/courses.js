const courses = {
    // biology
    'BIOL 105': { name: 'Information Flow in Biological Systems', credits: 3 },
    'BIOL 105L': { name: 'Information Flow in Biological Systems Lab', credits: 1 },
    'BIOL 106': { name: 'Energy Flow in Biological Systems', credits: 3 },
    'BIOL 170': { name: 'Intro to Microbiology', credits: 3 },
    'BIOL 170L': { name: 'Intro to Microbiology Lab', credits: 1 },
    'BIOL 207': { name: 'Genetics', credits: 3 },
    'BIOL 207L': { name: 'Genetics Lab', credits: 1 },
    'BIOL 370': { name: 'Microbiology', credits: 3 },
    'BIOL 370L': { name: 'Microbiology Lab', credits: 1 },
    'BIOL 170 or 370': { name: '170 Intro to Microbiology or 370 Microbiology', credits: 3 },
    'BIOL I70L or 370L': { name: '170 Intro to Micriobiology Lab or 370 Microbiology with Lab', credits: 1 },

    // chemistry
    'CHEM 101': { name: 'General Chemistry 1', credits: 3 },
    'CHEM 101L': { name: 'General Chemistry 1 Lab', credits: 1 },
    'CHEM 102': { name: 'General Chemistry 2', credits: 3 },
    'CHEM 102L': { name: 'General Chemistry 2 Lab', credits: 1 },
    'CHEM 230': { name: 'Organic Chemistry 1', credits: 3 },
    'CHEM 230L': { name: 'Organic Chemistry 1 Lab', credits: 1 },
    'CHEM 231': { name: 'Organic Chemistry 2', credits: 3 },
    'CHEM 231L': { name: 'Organic Chemistry 2 Lab', credits: 1 },
    'CHEM 307': { name: 'Biochemistry 1', credits: 3 },
    'CHEM 307L': { name: 'Biochemistry 1 with Lab', credits: 1 },

    // classic
    'CLAS 199': { name: 'Medical Terminology', credits: 1 },

    // Communication courses
    'COMM 100': { name: 'Communication & Speech', credits: 3 },

    // dept (general)
    'DEPT 104': { name: 'Scientific Inquiry (Year 1 or 2)', credits: 3 },
    'DEPT 193': { name: 'First-Year Seminar', credits: 3 },
    'DEPT 432': { name: 'Core Integration Seminar', credits: 3 },

    // english
    'ENGL 101': { name: 'Writing 101', credits: 3 },

    // human physiology
    'HPHY 205': { name: 'Experimental Design & Statistics', credits: 3 },
    'HPHY 210': { name: 'Scientific Writing', credits: 3 },
    'HPHY 241': { name: 'Human Anatomy & Physiology 1', credits: 3 },
    'HPHY 241L': { name: 'Human Anatomy & Physiology 1 Lab', credits: 1 },
    'HPHY 242': { name: 'Human Anatomy & Physiology 2', credits: 3 },
    'HPHY 242L': { name: 'Human Anatomy & Physiology 2 Lab', credits: 1 },
    'HPHY 244': { name: 'Nutrition and Metabolism', credits: 3 },
    'HPHY 274': { name: 'Musculoskeletal Dynamics & Physiology', credits: 3 },
    'HPHY 375': { name: 'Biomechanics', credits: 3 },
    'HPHY 375L': { name: 'Biomechanics Lab', credits: 1 },
    'HPHY 376': { name: 'Exercise Physiology', credits: 3 },
    'HPHY 376L': { name: 'Exercise Physiology Lab', credits: 1 },
    'HPHY 422': { name: 'Cardiovascular Physiology', credits: 3 },
    'HPHY 441L': { name: 'Guided Experimental Design', credits: 1 },
    'HPHY 442L': { name: 'Guided Research', credits: 1 },
    'HPHY 451': { name: 'Systems Neurophysiology', credits: 3 },
    'HPHY 453': { name: 'Neuroanatomy', credits: 3 },
    'HPHY 477': { name: 'Environmental Physiology', credits: 3 },
    'HPHY 480': { name: 'Applied Immunology', credits: 3 },
    'HPHY 489': { name: 'Special Topics (varies)', credits: 3 }, // several HPHY 489 offerings
    'HPHY 499': { name: 'Culminating Experience', credits: 1 },

    // math
    'MATH': { name: 'MATH 148 or Higher', credits: 3 },
    'MATH 121': { name: 'Statistics', credits: 3 },
    'MATH 148': { name: 'Survey of Calculus', credits: 3 },
    'MATH 157': { name: 'Calculus-Analytic Geometry', credits: 4 },
    'MATH 148 or MATH 157': { name: 'Survey of Calculus or Calculus-Analytic Geometry', credits: 3 },
    'MATH 148 or 157': { name: '148 Survey of Calculus or 157 Calculus-Analytic Geometry', credits: 3 },

    // philosophy
    'PHIL 101': { name: 'Reasoning', credits: 3 },
    'PHIL 201': { name: 'Philosophy of Human Nature', credits: 3 },
    'PHIL 301 or RELI': { name: 'Philosophy 301 or Religion Ethics', credits: 3 },

    // physics
    'PHYS 111': { name: 'General Physics 1', credits: 4 },
    'PHYS 111L': { name: 'General Physics 1 Lab', credits: 1 },
    'PHYS 112': { name: 'General Physics 2', credits: 4 },
    'PHYS 112L': { name: 'General Physics 2 Lab', credits: 1 },

    // psychology
    'PSYC 101': { name: 'General Psychology', credits: 3 },
    'PSYC 357': { name: 'Lifespan Development', credits: 3 },
    'PSYC 364': { name: 'Abnormal Child Psychology', credits: 3 },
    'PSYC 390': { name: 'Psychopathology', credits: 3 },
    'PSYC 101 or SOCI 101': { name: 'General Psychology or Introduction to Sociology', credits: 3 },
    'PSYC 364 or 390': { name: '364 Abnormal Child Psychology or 390 Psychopathology', credits: 3 },
    'PSYC': { name: '364 Abnormal Psych OR 390 Psychopathology OR 357 Lifestyle Development', credits: 3 },

    // religion
    'RELI': { name: 'Christianity & Catholic Traditions', credits: 3 },

    // sociology
    'SOCI 101': { name: 'Introduction to Sociology', credits: 3 },
};

// special variations
const hphy489Variations = [
    { instructor: 'Dr. Do-Houn Kim', name: 'Fundamentals of Skeletal Muscle Physiology', credits: '2, 3' },
    { instructor: 'Dr. Alex Miller', name: 'Neuroendocrine Physiology', credits: '2, 3' },
    { instructor: 'Dr. Bassel Mufarreh', name: 'Introduction to Prosthetics and Orthotics', credits: '2, 3' },
];

export { courses, hphy489Variations };
export default courses;
