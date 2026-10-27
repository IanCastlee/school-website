// White-Label / Dummy School Mock Data for Presentation & Demo to Schools
// Easily customizable via schoolInfo object for any client school

export const schoolInfo = {
  name: "Greenfield National High School",
  shortName: "GNHS",
  communityName: "Greenfielder",
  tagline: "Greenfielder Bleeding Green: Standing to its Cause",
  motto: "Nurturing Potential, Igniting Passions, Shaping Futures",
  founded: 2000,
  schoolId: "300101",
  division: "Schools Division Office — Sample Province",
  region: "Region V - Department of Education",
  location: "San Isidro, Sample Municipality, Philippines",
  address: "Poblacion Ward, Sample Municipality, 4700 Philippines",
  email: "info.greenfieldnhs@school.edu.ph",
  depedEmail: "300101@deped.gov.ph",
  facebookPage: "Greenfield National High School Official",
  facebookUrl: "https://facebook.com",
  contactNumber: "0917-123-4567",
  website: "@deped.gov.ph",
  officeHours: "Monday – Friday, 7:30 AM – 5:00 PM",
  welcomeTitle: "WELCOME TO GREENFIELD NATIONAL HIGH SCHOOL",
  welcomeParagraph1:
    "Welcome to Greenfield National High School (GNHS), an institution that stands as a cornerstone of education and a vibrant hub of opportunity within the heart of our municipality. As you cross our threshold, whether as a new student embarking on an exciting chapter, a returning member of our cherished community, or a visitor eager to experience the spirit of GNHS, know that you are entering a space meticulously crafted to nurture potential, ignite passions, and shape futures.",
  welcomeParagraph2:
    "More than simply a collection of classrooms and buildings, GNHS is a dynamic ecosystem of learning, a place where the pursuit of knowledge is intertwined with the development of character, the cultivation of skills, and the fostering of lifelong connections. We are a community united by a shared commitment to excellence, a deep-seated belief in the transformative power of education, and a collective desire to make a positive and lasting impact on the world around us.",
};

export const navigationLinks = [
  { id: "home", label: "Home", fullLabel: "Home" },
  {
    id: "accomplishments",
    label: "Accomplishments",
    fullLabel: "Accomplishments & Achievements",
  },
  {
    id: "projects",
    label: "Plans & Projects",
    fullLabel: "School Plans / Projects",
  },
  { id: "transparency", label: "Transparency", fullLabel: "Transparency Page" },
  { id: "contact", label: "Contact Us", fullLabel: "Contact Information" },
];

export const quickStats = [
  {
    id: "stat-1",
    label: "Year Established",
    value: "2000",
    suffix: "Est.",
    icon: "Calendar",
    description: "Over two decades of quality public secondary education",
  },
  {
    id: "stat-2",
    label: "Enrolled Learners",
    value: "1,850+",
    suffix: "Students",
    icon: "Users",
    description: "Junior & Senior High School active student body",
  },
  {
    id: "stat-3",
    label: "Faculty & Staff",
    value: "78",
    suffix: "Educators",
    icon: "Award",
    description: "Dedicated DepEd teachers and administrative personnel",
  },
  {
    id: "stat-4",
    label: "Athletic & Academic Medals",
    value: "45+",
    suffix: "Titles",
    icon: "Trophy",
    description: "Provincial & Regional distinctions in sports and arts",
  },
];

export const academicTracks = [
  {
    id: "jhs",
    level: "Junior High School (Grades 7–10)",
    title: "K to 12 Basic Education Curriculum",
    description:
      "Strong foundational instruction across Science, Mathematics, English, Filipino, Araling Panlipunan, TLE, and MAPEH with special programs in athletics and arts.",
    highlights: [
      "Special Science & Math Enrichment",
      "Sports & Athletics Development",
      "Drum & Lyre Corps Training",
      "Values & Character Formation",
    ],
  },
  {
    id: "shs-stem",
    level: "Senior High School — Academic Track",
    title: "STEM & GAS Strands",
    description:
      "Preparing youth for tertiary education, scientific inquiry, environmental stewardship, and technology leadership through student-led clubs like the Sci-Tech Club.",
    highlights: [
      "Science & Technology (Sci-Tech) Research",
      "Chemi-Calc & STEM Club Initiatives",
      "Mathematics & Robotics Readiness",
      "College Entrance Preparation",
    ],
  },
  {
    id: "shs-tvl",
    level: "Senior High School — TVL Track",
    title: "Technical-Vocational-Livelihood",
    description:
      "Equipping students with TESDA-aligned practical skills, entrepreneurship readiness, and hands-on industry competencies for immediate employment or business.",
    highlights: [
      "ICT & Digital Literacy",
      "Home Economics & Culinary Arts",
      "Agri-Fishery & Eco-Sustainability",
      "National Certification (NC II) Prep",
    ],
  },
];

export const accomplishmentsData = {
  bannerTitle: "Scholars",
  bannerSubtitle: "BLEEDING GREEN",
  introParagraph1:
    "Greenfield National High School (GNHS) stands as a notable educational institution within its community. While committed to providing quality secondary education, GNHS has also garnered recognition for its participation and achievements in diverse extracurricular activities. Among these, the school has demonstrated consistent engagement and success in amateur boxing, the Drum and Lyre Corps (DLC), and sepak takraw. This overview explores the school's involvement in these three distinct areas, setting the stage for a closer look at GNHS's broader educational environment.",
  introParagraph2:
    "Greenfield National High School is more than just a school; it is a community of learners, educators, and supporters who are united by a shared commitment to excellence and a belief in the transformative power of education. The school's success in boxing, the DLC, and sepak takraw is a testament to its holistic educational philosophy and its dedication to nurturing the multifaceted potential of its students. As GNHS continues to empower future generations, it will undoubtedly remain a beacon of hope and opportunity for the youth of our community and beyond.",
  categories: [
    "All Achievements",
    "Boxing",
    "Sepak Takraw",
    "Drum & Lyre Corps",
    "Academic & Sci-Tech",
  ],
  featuredPillars: [
    {
      id: "pillar-sepak",
      category: "Sepak Takraw",
      title: "Palarong Panlalawigan 2024 Champion — Sepak Takraw",
      subtitle: "Varsity Bleeding Green Courtside Dominance",
      date: "2024 Provincial Meet",
      badge: "GOLD MEDALIST",
      image:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80",
      description:
        "Displaying extraordinary agility, discipline, and teamwork, the GNHS Sepak Takraw squad clinched the Championship title at the Palarong Panlalawigan 2024, cementing Greenfield National High School as a powerhouse in regional athletics.",
      athletes: [
        "GNHS Sepak Takraw Varsity Team",
        "Coach & Sports Development Unit",
      ],
      metrics: [
        "Provincial Champion",
        "Regional Qualifier",
        "Undefeated Bracket Run",
      ],
    },
    {
      id: "pillar-boxing",
      category: "Boxing",
      title: "Provincial Boxing Pride — Junior Boys Division Distinction",
      subtitle: "51–52 kg & 53–54 kg Weight Classes",
      date: "2024 Palarong Panlalawigan",
      badge: "CHAMPIONSHIP CONTENDERS",
      image:
        "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=900&q=80",
      description:
        "Representing the school with grit and heart in the ring, Junior Boys student-athletes in the 51–52 kls and 53–54 kls weight classes brought pride and medals to GNHS through rigorous training and relentless sportsmanship.",
      athletes: [
        "Junior Boys 53–54 kls Representative",
        "Junior Boys 51–52 kls Representative",
      ],
      metrics: [
        "51–52 kg Division",
        "53–54 kg Division",
        "Regional Meet Qualifiers",
      ],
    },
    {
      id: "pillar-dlc",
      category: "Drum & Lyre Corps",
      title: "GNHS Drum and Lyre Corps (DLC) — Street & Field Exhibition",
      subtitle: "Cultural Heritage, Musical Precision & Visual Artistry",
      date: "Annual Civic & Festival Competitions",
      badge: "CULTURAL EXCELLENCE",
      image:
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80",
      description:
        "Dressed in vibrant green and gold regalia inspired by local natural beauty and cultural heritage, the GNHS Drum and Lyre Corps captivates audiences with synchronized choreography and brass-percussion mastery.",
      athletes: ["GNHS DLC Majorettes", "Percussion & Lyre Ensemble"],
      metrics: [
        "Best in Costume & Visuals",
        "Civic Parade Headliners",
        "80+ Student Performers",
      ],
    },
    {
      id: "pillar-scitech",
      category: "Academic & Sci-Tech",
      title: "Division Science & Technology Fair — Research & Innovation",
      subtitle: "Senior High School Sci-Tech & Chemi-Calc Club",
      date: "SY 2024–2025",
      badge: "ACADEMIC HONOR",
      image:
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80",
      description:
        "Beyond athletics and performing arts, GNHS learners excel in scientific investigation, mathematical problem solving, and environmental conservation projects tailored to the local ecosystem.",
      athletes: ["SHS Sci-Tech Researchers", "Chemi-Calc Club Officers"],
      metrics: [
        "Eco-Science Research",
        "Division Quiz Bee Finalists",
        "Community STEM Outreach",
      ],
    },
  ],
};

export const schoolPlansProjectsData = {
  bannerTitle: "SCHOLARS",
  bannerSubtitle: "STANDING TO ITS CAUSE",
  featuredProject: {
    title:
      "Planting Trees to Green the Earth: Going Easy Towards a Greener Output",
    organization:
      "Chemi-Calc Club — Senior High School Science & Technology (Sci-Tech)",
    date: "March 1, 2025",
    location: "Municipal Reforestation & Watershed Site",
    status: "Completed & Monitored",
    participants: "45+ Student Leaders, Faculty Advisers & Local Foresters",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    narrative:
      "On March 1, 2025, the Chemi-Calc Club of Greenfield National High School (GNHS), a dedicated organization within the Senior High School's Science and Technology (Sci-Tech) strand, spearheaded the environmental advocacy initiative titled 'Planting Trees to Green the Earth: Going Easy Towards a Greener Output.' Working hand-in-hand with local community elders, forest stewards, and faculty mentors, student leaders trekked into the upland greenery to plant native tree seedlings, reinforcing watershed protection and climate resilience.",
    objectives: [
      "Rehabilitate local buffer zones and promote biodiversity around the municipal watershed ecosystem.",
      "Translate classroom Science & Chemistry principles into tangible environmental stewardship.",
      "Foster intergenerational collaboration between GNHS youth and local community farmers and forest guards.",
      "Establish an annual monitoring registry for planted saplings under the SHS Sci-Tech program.",
    ],
  },
  projectsList: [
    {
      id: "proj-1",
      title: "Planting Trees to Green the Earth (Chemi-Calc Club)",
      category: "Environmental & Sci-Tech",
      date: "March 1, 2025",
      status: "Active Monitoring",
      progress: 100,
      lead: "SHS Sci-Tech / Chemi-Calc Club",
      description:
        "Upland reforestation and ecological literacy drive conducted by Senior High School Science and Technology learners in partnership with local community foresters.",
      impact: "350+ Native Seedlings Planted",
    },
    {
      id: "proj-2",
      title: "Project SAGIP-BASA & Literacy Enhancement Program",
      category: "Curriculum & Instruction",
      date: "SY 2024–2025",
      status: "Ongoing",
      progress: 85,
      lead: "English & Filipino Departments",
      description:
        "Comprehensive reading remediation and comprehension workshops designed to ensure every Grade 7 to Grade 10 learner achieves grade-level reading proficiency.",
      impact: "420+ Learners Assisted",
    },
    {
      id: "proj-3",
      title: "Grassroots Sports & Varsity Training Center",
      category: "Athletics & Youth Development",
      date: "Year-Round 2025",
      status: "Ongoing",
      progress: 90,
      lead: "MAPEH & Sports Coordinator",
      description:
        "Structured training camp and equipment modernization for Sepak Takraw, Amateur Boxing, and Track & Field athletes preparing for provincial and regional meets.",
      impact: "65 Varsity Student-Athletes",
    },
    {
      id: "proj-4",
      title: "Gulayan sa Paaralan & Eco-Composting Facility",
      category: "Brigada Pagbasa & Brigada Eskwela",
      date: "Q1–Q4 2025",
      status: "Ongoing",
      progress: 78,
      lead: "TLE Department & SSLG",
      description:
        "Sustainable campus agriculture utilizing organic vermicomposting to supply fresh produce for school feeding programs while teaching practical agri-fishery skills.",
      impact: "Zero-Waste Campus Zone",
    },
    {
      id: "proj-5",
      title: "Digital Classroom & ICT Lab Modernization Plan",
      category: "Infrastructure & SIP",
      date: "2025–2026 Cycle",
      status: "In Progress",
      progress: 65,
      lead: "ICT Coordinator & School Administration",
      description:
        "Upgrading computer workstations, local area networking, and smart TV integration across Junior and Senior High School academic buildings under the School Improvement Plan (SIP).",
      impact: "3 ICT Labs Upgraded",
    },
  ],
};

export const transparencyData = {
  bannerTitle: "SCHOOL",
  bannerSchool: "GREENFIELD NATIONAL HIGH SCHOOL",
  bannerScript: "Transparency",
  reportingPeriod:
    "(January 1, 2023 to December 31, 2023 & FY 2024–2025 Updates)",
  introduction:
    "Greenfield National High School (GNHS) is committed to fostering a culture of transparency and accountability in all its operations. This report aims to provide our valued stakeholders – students, parents, faculty, staff, and community members – with clear and accessible information regarding the school's financial standing, operational activities, and overall performance during the calendar year. We believe that open communication and shared understanding are essential for building trust and fostering a collaborative environment that supports student success.",
  schoolProfile: [
    {
      label: "Official School Name",
      value: "Greenfield National High School (GNHS)",
    },
    { label: "School ID", value: "300101 (Sample ID)" },
    {
      label: "Address",
      value: "Poblacion Ward, Sample Municipality, Philippines",
    },
    { label: "Institution Type", value: "Public Secondary School (JHS & SHS)" },
    { label: "Mother Agency", value: "Department of Education (DepEd)" },
    {
      label: "Governance Framework",
      value: "School-Based Management (SBM) & Transparency Seal Compliant",
    },
  ],
  financialSummary: {
    totalAnnualMOOE: "₱ 2,480,000.00",
    totalUtilized: "₱ 2,455,200.00",
    utilizationRate: "99.0%",
    auditStatus: "COA Liquidated & Compliant",
    allocations: [
      {
        id: "fin-1",
        category: "Instructional Materials & Learner Support",
        amount: "₱ 820,000.00",
        percentage: 33,
        status: "100% Liquidated",
        details:
          "Reproduction of learning modules, laboratory consumables, Sci-Tech chemicals, and library resources.",
      },
      {
        id: "fin-2",
        category: "Campus Facilities, Minor Repairs & Utilities",
        amount: "₱ 745,000.00",
        percentage: 30,
        status: "100% Liquidated",
        details:
          "Classroom roof & electrical maintenance, water/power utilities, and WASH sanitation facilities.",
      },
      {
        id: "fin-3",
        category: "Student Development, Sports (Palaro) & DLC",
        amount: "₱ 495,000.00",
        percentage: 20,
        status: "98% Liquidated",
        details:
          "Support for Boxing, Sepak Takraw, Drum & Lyre Corps, Chemi-Calc Club, and SSLG leadership trainings.",
      },
      {
        id: "fin-4",
        category: "Teacher Training & Administrative Operations",
        amount: "₱ 420,000.00",
        percentage: 17,
        status: "98% Liquidated",
        details:
          "INSET capacity building, LAC sessions, office supplies, and internet connectivity.",
      },
    ],
  },
  documents: [
    {
      id: "doc-1",
      code: "AR-2023-GNHS",
      title:
        "Annual Accomplishment & Financial Transparency Report (Jan 1 – Dec 31, 2023)",
      category: "Annual Report",
      datePublished: "January 2024",
      fileSize: "2.4 MB PDF",
      status: "Verified & Posted",
    },
    {
      id: "doc-2",
      code: "MOOE-Q4-2024",
      title: "MOOE Liquidation & Utilization Statement — 4th Quarter",
      category: "Financial Statement",
      datePublished: "December 2024",
      fileSize: "1.8 MB PDF",
      status: "Verified & Posted",
    },
    {
      id: "doc-3",
      code: "APP-2025-GNHS",
      title:
        "Annual Procurement Plan (APP) & School Operational Budget FY 2025",
      category: "Procurement",
      datePublished: "January 2025",
      fileSize: "3.1 MB PDF",
      status: "Verified & Posted",
    },
    {
      id: "doc-4",
      code: "SRC-2024-2025",
      title: "School Report Card (SRC) & Performance Indicators Summary",
      category: "School Governance",
      datePublished: "March 2025",
      fileSize: "4.2 MB PDF",
      status: "Verified & Posted",
    },
  ],
};

export const contactCardsData = [
  {
    id: "contact-email",
    label: "EMAIL ADDRESS",
    value: "info.greenfieldnhs@school.edu.ph",
    secondaryValue: "300101@deped.gov.ph",
    description:
      "For official correspondence, transcript requests, and institutional partnerships.",
    icon: "Mail",
    actionText: "Send an Email",
    href: "mailto:info.greenfieldnhs@school.edu.ph",
  },
  {
    id: "contact-phone",
    label: "CONTACT NUMBER",
    value: "0917-123-4567",
    secondaryValue: "Mon–Fri • 7:30 AM – 5:00 PM",
    description:
      "Direct hotline to the School Administrative & Registrar's Inquiry Desk.",
    icon: "Phone",
    actionText: "Call Hotline",
    href: "tel:09171234567",
  },
  {
    id: "contact-fb",
    label: "FACEBOOK PAGE",
    value: "Greenfield National High School",
    secondaryValue: "Official Community Page",
    description:
      "Follow real-time announcements, class advisories, and student achievements.",
    icon: "Facebook",
    actionText: "Visit Facebook Page",
    href: "#contact",
  },
  {
    id: "contact-web",
    label: "OFFICIAL WEBSITE",
    value: "@deped.gov.ph",
    secondaryValue: "DepEd Official Portal",
    description:
      "Aligned with Department of Education national portal and e-Governance standards.",
    icon: "Globe",
    actionText: "DepEd Portal Info",
    href: "#transparency",
  },
];
