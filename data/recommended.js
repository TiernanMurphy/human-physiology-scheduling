const recommended = {
    medicine: [
        // 3 semesters of biology
        'BIOL 105',
        'BIOL 105L',
        'BIOL 106',
        'BIOL 207',
        'BIOL 207L',
        // 5 semesters of chemistry
        'CHEM 101',
        'CHEM 101L',
        'CHEM 102',
        'CHEM 102L',
        'CHEM 230',
        'CHEM 230L',
        'CHEM 231',
        'CHEM 231L',
        'CHEM 307',
        'CHEM 307L',
        // 2 semesters of physics
        'PHYS 111',
        'PHYS 111L',
        'PHYS 112',
        'PHYS 112L',
        // 1-2 semesters of mathematics
        'MATH 121',
        'MATH 148 or MATH 157',
    ],

    physician_assistant: [
        // 4 semesters of biology
        'BIOL 105',
        'BIOL 105L',
        'BIOL 106',
        'BIOL 207',
        'BIOL 207L',
        'BIOL 370',
        'BIOL 370L',
        // 4 semesters of chemistry
        'CHEM 101',
        'CHEM 101L',
        'CHEM 102',
        'CHEM 102L',
        'CHEM 230',
        'CHEM 230L',
        'CHEM 307',
        'CHEM 307L',
        // 2 semesters of anatomy & physiology
        'HPHY 241',
        'HPHY 241L',
        'HPHY 242',
        'HPHY 242L',
        // 1 semester of mathematics
        'MATH 121',
        // 1 semester of social science
        'PSYC 101',
    ],

    physical_therapy: [
        // 3 semesters of biology
        'BIOL 105',
        'BIOL 105L',
        'BIOL 170',
        'BIOL 170L',
        // 2 semesters of chemistry
        'CHEM 101',
        'CHEM 101L',
        'CHEM 102',
        'CHEM 102L',
        // 2 semesters of anatomy & physiology
        'HPHY 241',
        'HPHY 241L',
        'HPHY 242',
        'HPHY 242L',
        // 1 semester of math
        'MATH 121',
        // 2 semesters of physics
        'PHYS 111',
        'PHYS 111L',
        'PHYS 112',
        'PHYS 112L',
        // 2 semesters of psychology
        'PSYC 101',
        'PSYC',
    ],

    dental: [
        // 3 semesters of biology
        'BIOL 105',
        'BIOL 105L',
        'BIOL 106',
        'BIOL 170',
        'BIOL 170L',
        // 5 semesters of chemistry
        'CHEM 101',
        'CHEM 101L',
        'CHEM 102',
        'CHEM 102L',
        'CHEM 230',
        'CHEM 230L',
        'CHEM 231',
        'CHEM 231L',
        'CHEM 307',
        'CHEM 307L',
        // 2 semesters of physics
        'PHYS 111',
        'PHYS 111L',
        'PHYS 112',
        'PHYS 112L',
        // 1 - 2 semesters of mathematics
        'MATH 121',
        'MATH 148 or MATH 157',
    ],

    occupational_therapy: [
        // 1 semester of biology
        'BIOL 105',
        'BIOL 105L',
        // 1 semester of chemistry
        'CHEM 101',
        'CHEM 101L',
        // 2 semesters of anatomy & physiology
        'HPHY 241',
        'HPHY 241L',
        'HPHY 242',
        'HPHY 242L',
        // 1 semester of math
        'MATH 121',
        // 1 semester of sociology / anthropology
        'SOCI 101',
        // 2 - 3 semesters of psychology
        'PSYC 101',
        'PSYC 364 or 390',
        'PSYC 357',
        // medical terminology
        'CLAS 199',
    ],

    pharmacy: [
        // 3 semesters of biology
        'BIOL 105',
        'BIOL 105L',
        'BIOL 106',
        'BIOL 170',
        'BIOL 170L',
        // 5 semesters of chemistry
        'CHEM 101',
        'CHEM 101L',
        'CHEM 102',
        'CHEM 102L',
        'CHEM 230',
        'CHEM 230L',
        'CHEM 231',
        'CHEM 231L',
        'CHEM 307',
        'CHEM 307L',
        // 2 semesters of physics
        'PHYS 111',
        'PHYS 111L',
        'PHYS 112',
        'PHYS 112L',
        // 1 - 2 semesters of mathematics
        'MATH 121',
        'MATH 148 or MATH 157',
        // 1 semester of social science
        'PSYC 101 or SOCI 101',
    ],

    optometry: [
        // 2 semesters of general biology and 1 semester of microbiology
        'BIOL 105',
        'BIOL 105L',
        'BIOL 106',
        'BIOL 170 or 370',
        'BIOL 170L or 370L',
        // 4 semesters of chemistry
        'CHEM 101',
        'CHEM 101L',
        'CHEM 102',
        'CHEM 102L',
        'CHEM 230',
        'CHEM 230L',
        'CHEM 307',
        'CHEM 307L',
        // 2 semesters general physics
        'PHYS 111',
        'PHYS 111L',
        'PHYS 112',
        'PHYS 112L',
        // 2 semesters anatomy & physiology
        'HPHY 241',
        'HPHY 241L',
        'HPHY 242',
        'HPHY 242L',
        // 1 semester of statistics and 1 semester of calculus
        'MATH 121',
        'MATH 148 or 157',
        // 1 semester of psychology
        'PSYC 101',
    ],

    nursing: [
        // 2 semesters of biology
        'BIOL 105',
        'BIOL 105L',
        'BIOL 170 or 370',
        'BIOL 170L or 370L',
        // 1 semester of chemistry
        'CHEM 101',
        'CHEM 101L',
        // 2 semesters of anatomy & physiology
        'HPHY 241',
        'HPHY 241L',
        'HPHY 242',
        'HPHY 242L',
        // 1 semester of nutrition
        'HPHY 244',
        // 1 semester of math
        'MATH 121',
        // 3 semesters of social science
        'PSYC 101',
        'SOCI 101',
        'PSYC 357',
    ],
};

export default recommended;
