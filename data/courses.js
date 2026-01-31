const courses = {
    // biology
    'BIOL 105 & 105L': { name: 'Information Flow in Biological Systems with Lab', credits: 4 },
    'BIOL 105': { name: 'Information Flow in Biological Systems', credits: 3 },
    'BIOL 105L': { name: 'Information Flow in Biological Systems Lab', credits: 1 },
    'BIOL 106': { name: 'Energy Flow in Biological Systems', credits: 3 },
    'BIOL 170': { name: 'Intro to Microbiology', credits: 3 },
    'BIOL 170L': { name: 'Intro to Microbiology Lab', credits: 1 },
    'BIOL 170 & 170L': { name: 'Intro to Microbiology with Lab', credits: 4 },
    'BIOL 207': { name: 'Genetics', credits: 3 },
    'BIOL 207L': { name: 'Genetics Lab', credits: 1 },
    'BIOL 207 & 207L': { name: 'Genetics with Lab', credits: 4 },
    'BIOL 370': { name: 'Microbiology', credits: 3 },
    'BIOL 370L': { name: 'Microbiology Lab', credits: 1 },
    'BIOL 370 & 370L': { name: 'Microbiology with Lab', credits: 4 },
    'BIOL 170 or 370': { name: '170 Intro to Microbiology or 370 Microbiology', credits: 3 },
    'BIOL 170L or 370L': { name: '170 Intro to Microbiology Lab or 370 Microbiology with Lab', credits: 4 },
    'BIOL 170/L or 370/L' : { name: 'Intro to Microbiology, or Microbiology (both with lab)', credits: 4 },

    // chemistry
    'CHEM 101 & 101L': { name: 'General Chemistry 1 with Lab', credits: 4 },
    'CHEM 102 & 102L': { name: 'General Chemistry 2 with Lab', credits: 4 },
    'CHEM 230 & 230L': {name: 'Organic Chemistry 1 with Lab', credits: 4 },
    'CHEM 102/L or CHEM 230/L': { name: 'General Chemistry 2 or Organic Chemistry 1 (both with lab)', credits: 4 },
    'CHEM 230': { name: 'Organic Chemistry 1', credits: 3 },
    'CHEM 230L': { name: 'Organic Chemistry 1 Lab', credits: 1 },
    'CHEM 231 & 231L': { name: 'Organic Chemistry 2 with Lab', credits: 4 },
    'CHEM 231': { name: 'Organic Chemistry 2', credits: 3 },
    'CHEM 231L': { name: 'Organic Chemistry 2 Lab', credits: 1 },
    'CHEM 307': { name: 'Biochemistry 1', credits: 3 },
    'CHEM 307L': { name: 'Biochemistry 1 with Lab', credits: 1 },
    'CHEM 307 & 307L': { name: 'Biochemistry 1 with Lab', credits: 4 },

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
    'HPHY 241 & 241L': { name: 'Human Anatomy & Physiology 1 with Lab', credits: 4 },
    'HPHY 242 & 242L': { name: 'Human Anatomy & Physiology 2 with Lab', credits: 4 },
    'HPHY 244': { name: 'Nutrition and Metabolism', credits: 3 },
    'HPHY 274': { name: 'Musculoskeletal Dynamics & Physiology', credits: 3 },
    'HPHY 375 & 375L': { name: 'Biomechanics with Lab', credits: 4 },
    'HPHY 376 & 376L': { name: 'Exercise Physiology with Lab', credits: 4 },
    'HPHY 422': { name: 'Cardiovascular Physiology', credits: 3 },
    'HPHY 441L': { name: 'Guided Experimental Design', credits: 1 },
    'HPHY 442L': { name: 'Guided Research', credits: 1 },
    'HPHY 451': { name: 'Systems Neurophysiology', credits: 3 },
    'HPHY 453': { name: 'Neuroanatomy', credits: 3 },
    'HPHY 477': { name: 'Environmental Physiology', credits: 3 },
    'HPHY 480': { name: 'Applied Immunology', credits: 3 },
    'HPHY 489': { name: 'Special Topics (varies)', credits: 3 },
    'HPHY 499': { name: 'Culminating Experience', credits: 1 },
    'HPHY Elective': { name: 'x credits required, see FAQ page for more info', credits: 0 },

    // math
    'MATH': { name: 'MATH 148 (Survey of Calculus) or Higher', credits: 3 },
    'MATH 121': { name: 'Statistics', credits: 3 },
    'MATH 148': { name: 'Survey of Calculus', credits: 3 },
    'MATH 157': { name: 'Calculus and Analytic Geometry', credits: 4 },
    'MATH 148 or MATH 157': { name: 'Survey of Calculus or Calculus-Analytic Geometry', credits: 3 },
    'MATH 221': { name: 'Applied Statistics', credits: 3 },
    'MATH 231': { name: 'Discrete Structures', credits: 3 },
    'MATH 258': { name: 'Calculus and Analytic Geometry 2', credits: 3 },

    // scientific inquiry
    'BIOL 104 & 104L': { name: 'Biology Scientific Inquiry and Lab', credits: 3 },
    'CHEM 104 & 104L': { name : 'Chemistry Scientific Inquiry and Lab', credits: 3 },
    'PHYS 104': { name: 'Physics Scientific Inquiry', credits: 3 },

    // philosophy
    'PHIL 101': { name: 'Reasoning', credits: 3 },
    'PHIL 201': { name: 'Philosophy of Human Nature', credits: 3 },
    'PHIL 301 or RELI': { name: 'PHIL 301 Ethics or Ethics-Based Religion Course', credits: 3 },
    'PHIL 301': { name: 'Ethics', credits: 3 },

    // physics
    'PHYS 111 & 111L': { name: 'General Physics 1', credits: 5 },
    'PHYS 112 & 112L': { name: 'General Physics 2', credits: 5 },
    'PHYS 121 & 121L': { name: 'Physics 1 with Lab', credits: 5 },
    'PHYS 122 & 122L': { name: 'Physics 2 with Lab', credits: 5 },
    'PHYS 111/L or PHYS 121/L': { name: 'General Physics 1 or Physics 1 (both with lab)', credits: 5 },
    'PHYS 112/L or PHYS 122/L': { name: 'General Physics 2 or Physics 2 (both with lab)', credits: 5 },


    // psychology
    'PSYC 101': { name: 'General Psychology', credits: 3 },
    'PSYC 357': { name: 'Lifespan Development', credits: 3 },
    'PSYC 364': { name: 'Abnormal Child Psychology', credits: 3 },
    'PSYC 390': { name: 'Psychopathology', credits: 3 },
    'PSYC 101 or SOCI 101': { name: 'General Psychology or Introduction to Sociology', credits: 3 },
    'PSYC 364 or 390': { name: '364 Abnormal Child Psychology or 390 Psychopathology', credits: 3 },
    'PSYC': { name: '364 Abnormal Psych OR 390 Psychopathology OR 357 Lifestyle Development (varies by PT school)', credits: 3 },

    // religion
    'FYS 193a': { name: 'Christianity & Catholic Traditions', credits: 3 },
    'FYS 193b': { name: 'World and Comparative Religions', credits: 3 },


    // first year seminar 193
    'FYSa 193': { name: 'Satire, Race, & Social Critique', credits: 3 },
    'FYSb 193': { name: 'Forged by Failure (engineering)', credits: 3 },
    'FYSc 193': { name: 'Conformity & Deviance (english dept)', credits: 3 },
    'FYSd 193': { name: 'Spokane as Text (english dept)', credits: 3 },
    'FYSe 193': { name: '1960s in 21 Songs (english dept)', credits: 3 },
    'FYSf 193': { name: 'The Chernobyl Accident (history dept)', credits: 3 },
    'FYSg 193': { name: 'Resonate Fearlessly (integrated media dept)', credits: 3 },
    'FYSh 193': { name: 'Knitting (math dept)', credits: 3 },
    'FYSi 193': { name: 'Exploring Austria (modern language dept)', credits: 3 },
    'FYSj 193': { name: 'Latin Noir (modern language dept)', credits: 3 },
    'FYSk 193': { name: 'Social Justice and Music (music dept)', credits: 3 },
    'FYSl 193': { name: 'Caring Matters (nursing dept)', credits: 3 },
    'FYSm 193': { name: 'Care, Listening, & Health (philosophy dept)', credits: 3 },
    'FYSn 193': { name: 'Spirituality and Sport (religion dept)', credits: 3 },
    'FYSo 193': { name: 'Problem of God (religion dept)', credits: 3 },
    'FYSp 193': { name: 'Difference and Dialogue (religion dept)', credits: 3 },
    'FYSq 193': { name: 'Violence & the Humanities (religion dept)', credits: 3 },
    'FYSs 193': { name: 'Why do I do What I do? (special ed dept)', credits: 3 },
    'FYSt 193': { name: 'Learning Theory & Epistemology (teacher education dept)', credits: 3 },
    'FYSu 193': { name: 'Gender, Sexuality, & Games (gender studies dept)', credits: 3 },
    'MATH 193': { name: 'Math First Year Seminar', credits: 3 },

    // core integration seminar 432
    'CIS 432a': { name: 'Catholic Social Teaching & Public Health', credits: 3 },
    'CIS 432b': { name: 'Dorothy Day & Catholic Workers Movement', credits: 3 },
    'CIS 432c': { name: 'Kids, Media, and Consumer Culture (communication dept)', credits: 3 },
    'CIS 432d': { name: 'The American Dream (english dept)', credits: 3 },
    'CIS 432e': { name: 'Philosophy in Film (film studies dept)', credits: 3 },
    'CIS 432f': { name: 'All Art is Propaganda', credits: 3 },
    'CIS 432g': { name: 'Catholic Social Teaching & Public Health', credits: 3 },
    'CIS 432h': { name: 'The Examined Life (honors dept)', credits: 3 },
    'CIS 432i': { name: 'Global Conflict & Humanitarian Action (international studies)', credits: 3 },
    'CIS 432j': { name: 'Classic Criticisms of Democracy (philosophy dept)', credits: 3 },
    'CIS 432k': { name: 'Health Care Ethics (philosophy dept)', credits: 3 },
    'CIS 432l': { name: 'Solidarity & Social Justice (philosophy dept)', credits: 3 },
    'CIS 432m': { name: 'Theories of Social Justice (philosophy dept)', credits: 3 },
    'CIS 432n': { name: 'Science & Society (philosophy dept)', credits: 3 },
    'CIS 432o': { name: 'Modeling Social Believers', credits: 3 },
    'CIS 432p': { name: 'Care for the Person & Planet (religion dept)', credits: 3 },
    'CIS 432q': { name: 'Advocacy & Policy', credits: 3 },
    'CIS 432r': { name: 'Advocacy & Policy (teacher education dept)', credits: 3 },
    'CIS 432s': { name: 'Arts & Community (theatre arts dept)', credits: 3 },
    'CIS 432t': { name: 'Gender & Media Activism (gender studies dept)', credits: 3 },

    // other
    'SOCI 101': { name: 'Introduction to Sociology', credits: 3 },
    'HIST/LIT/ART': { name: 'History, Literature, or Art course', credits: 3 },
    'Global Studies': { name: 'Global Studies', credits: 3 },
    'WE': { name: 'Writing Enriched', credits: 3 },
    'SOCI': { name: 'Social Justice', credits: 3 },
    'OTHER': { name: '1 semester of upper-division Biology, Human Physiology, or Kinesiology\n' +
            '(varies by PT school) ', credits: 4 },
};

// special variations
const hphy489Variations = [
    { instructor: 'Dr. Do-Houn Kim', name: 'Fundamentals of Skeletal Muscle Physiology', credits: '2, 3' },
    { instructor: 'Dr. Alex Miller', name: 'Neuroendocrine Physiology', credits: '2, 3' },
    { instructor: 'Dr. Bassel Mufarreh', name: 'Introduction to Prosthetics and Orthotics', credits: '2, 3' },
];

export { courses, hphy489Variations };
export default courses;
