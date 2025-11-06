// Course data for all courses mentioned in Footer.jsx
export const courseData = {
  // Web Development Courses
  "web-development": {
    id: "web-development",
    title: "Complete Web Development Bootcamp 2025",
    subtitle: "Learn HTML, CSS, JavaScript, React, Node.js, MongoDB and more! Master modern web development from scratch to advanced concepts.",
    instructor: { name: "Dr. Angela Yu", role: "Lead Instructor", avatar: "https://img-c.udemycdn.com/user/200_H/31334738_3535_3.jpg" },
    rating: 4.8, ratingsCount: 245893, learners: 1892347, lastUpdated: "1/2025", language: "English", autoLanguages: ["Spanish", "French", "German"],
    bestseller: true, price: 89.99, originalPrice: 199.99, discount: 55, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Build 25+ projects including a massive professional E-commerce site with MERN stack",
      "Master HTML5, CSS3, JavaScript ES6+ and modern web development",
      "Learn React.js and build real-world applications",
      "Master Node.js and Express.js to build backend APIs",
      "Learn MongoDB and integrate it with your applications",
      "Deploy your applications to production with confidence"
    ],
    requirements: [
      "No programming experience needed - we'll teach you everything you need to know",
      "A computer with access to the internet",
      "No paid software required - all tools used are free",
      "We'll walk you through, step-by-step how to get everything set up"
    ],
    description: "This is the most comprehensive web development course available online. Even if you have zero programming experience, this course will take you from beginner to mastery.",
    courseContent: { totalSections: 45, totalLectures: 612, totalLength: "65h 30m" },
    includes: ["65.5 hours on-demand video", "50 articles", "200 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "javascript": {
    id: "javascript",
    title: "JavaScript: The Complete Guide 2025",
    subtitle: "Master JavaScript ES6+, DOM manipulation, async programming, and modern frameworks. Build real-world projects!",
    instructor: { name: "Jonas Schmedtmann", role: "Full-Stack Developer & Instructor", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.7, ratingsCount: 189234, learners: 1456789, lastUpdated: "2/2025", language: "English", autoLanguages: ["Spanish", "Portuguese"],
    bestseller: true, price: 79.99, originalPrice: 179.99, discount: 56, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Master JavaScript ES6+ features and modern syntax",
      "Understand asynchronous JavaScript with Promises and async/await",
      "Learn DOM manipulation and event handling",
      "Build real-world projects with JavaScript",
      "Master modern JavaScript frameworks and libraries",
      "Understand JavaScript design patterns and best practices"
    ],
    requirements: ["Basic computer knowledge", "No programming experience required", "A computer with internet access", "Willingness to learn and practice"],
    description: "This is the most comprehensive JavaScript course on Udemy. You'll learn everything you need to know to become a JavaScript developer, from the basics to advanced concepts.",
    courseContent: { totalSections: 38, totalLectures: 485, totalLength: "52h 15m" },
    includes: ["52.5 hours on-demand video", "35 articles", "150 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "react-js": {
    id: "react-js",
    title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
    subtitle: "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Router, Next.js and more!",
    instructor: { name: "Maximilian Schwarzmüller", role: "Professional Web Developer & Instructor", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.6, ratingsCount: 234567, learners: 1892345, lastUpdated: "3/2025", language: "English", autoLanguages: ["German", "Spanish"],
    bestseller: true, price: 84.99, originalPrice: 189.99, discount: 55, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Build powerful, fast, user-friendly and reactive web applications",
      "Provide amazing user experiences by leveraging the power of JavaScript with ease",
      "Learn all about React Hooks and React Components, in theory and practice",
      "Learn React routing with React Router",
      "Understand how to build reusable components",
      "Dive into React's internals to gain a deeper understanding"
    ],
    requirements: ["JavaScript knowledge is required", "NO prior React knowledge is required", "ES6+ JavaScript knowledge is beneficial but not a must-have", "Basic understanding of HTML and CSS"],
    description: "React.js is THE most popular JavaScript library you can use and learn these days to build modern, reactive user interfaces for the web.",
    courseContent: { totalSections: 42, totalLectures: 578, totalLength: "58h 20m" },
    includes: ["58.5 hours on-demand video", "40 articles", "180 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "angular": {
    id: "angular",
    title: "Angular - The Complete Guide (2025 Edition)",
    subtitle: "Master Angular 17 and build awesome, reactive web apps with the successor of Angular.js",
    instructor: { name: "Maximilian Schwarzmüller", role: "Professional Web Developer & Instructor", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.5, ratingsCount: 156789, learners: 1234567, lastUpdated: "1/2025", language: "English", autoLanguages: ["German", "Spanish"],
    bestseller: true, price: 89.99, originalPrice: 199.99, discount: 55, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Develop modern, complex, responsive and scalable web applications with Angular 17",
      "Fully understand the architecture behind an Angular application and how to use it",
      "Use the gained, deep understanding of the Angular fundamentals to quickly establish yourself as a frontend developer",
      "Create single-page applications with one of the most modern JavaScript frameworks out there",
      "Learn Angular from scratch and build a complete e-commerce application",
      "Master Angular's dependency injection system and understand how it works"
    ],
    requirements: ["Basic HTML, CSS and JavaScript knowledge", "No prior Angular knowledge required", "Basic understanding of TypeScript is helpful but not required"],
    description: "This course starts from scratch, you neither need to know Angular 1 nor Angular 2! Angular 17 is simply the latest version of Angular 2.",
    courseContent: { totalSections: 35, totalLectures: 445, totalLength: "48h 15m" },
    includes: ["48.5 hours on-demand video", "30 articles", "120 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "java": {
    id: "java",
    title: "Java Programming Masterclass for Software Developers",
    subtitle: "Learn Java In This Course And Become a Computer Programmer. Obtain valuable Core Java Skills And Java Certification",
    instructor: { name: "Tim Buchalka", role: "Java Python Android and C# Expert Developer", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.6, ratingsCount: 234567, learners: 1892345, lastUpdated: "2/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 94.99, originalPrice: 199.99, discount: 53, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Learn the core Java skills needed to apply for Java developer positions",
      "Obtain proficiency in Java 8 and Java 11",
      "Learn to write high-quality, reusable code with Java",
      "Learn best practices from true programmers",
      "Learn to use Object-Oriented Programming with Java",
      "Learn to use the latest Java features and understand the language"
    ],
    requirements: ["A computer with either Windows, Mac or Linux to install all the free software and tools needed to build your apps", "A strong work ethic, willingness to learn and plenty of excitement about the awesome new programs you're about to build"],
    description: "This Java course is designed to give you the Java skills you need to get a job as a Java developer. By the end of the course, you will understand Java extremely well and be able to build your own Java applications.",
    courseContent: { totalSections: 40, totalLectures: 523, totalLength: "55h 30m" },
    includes: ["55.5 hours on-demand video", "45 articles", "180 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "data-scientist": {
    id: "data-scientist",
    title: "Data Science and Machine Learning Bootcamp with R",
    subtitle: "Learn how to use R for data science and machine learning to solve real-world analytical problems!",
    instructor: { name: "Jose Portilla", role: "Data Scientist & Head of Data Science at Pierian Data", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.5, ratingsCount: 156789, learners: 1234567, lastUpdated: "1/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 94.99, originalPrice: 199.99, discount: 53, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Program in R by understanding programming fundamentals",
      "Build a solid foundation for data analysis and visualization",
      "Learn to work with different data types in R",
      "Master the most important data structures in R",
      "Learn to create visualizations using ggplot2",
      "Understand how to perform statistical analysis in R"
    ],
    requirements: ["No prior programming experience needed", "Basic math skills", "A computer with internet access", "Willingness to learn and practice"],
    description: "This course will take you from the basics of R programming to advanced data science and machine learning techniques.",
    courseContent: { totalSections: 35, totalLectures: 445, totalLength: "48h 15m" },
    includes: ["48.5 hours on-demand video", "30 articles", "120 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "aws-cloud-practitioner": {
    id: "aws-cloud-practitioner",
    title: "[NEW] Ultimate AWS Certified Cloud Practitioner CLF-C02 2025",
    subtitle: "Pass the AWS Certified Cloud Practitioner CLF-C02 exam with this comprehensive course!",
    instructor: { name: "Stephane Maarek", role: "AWS Certified Cloud Practitioner, Solutions Architect, Developer", avatar: "https://img-c.udemycdn.com/user/200_H/31334738_3535_3.jpg" },
    rating: 4.7, ratingsCount: 234567, learners: 1892345, lastUpdated: "2/2025", language: "English", autoLanguages: ["Spanish", "French", "German"],
    bestseller: true, price: 89.99, originalPrice: 179.99, discount: 50, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Pass the AWS Certified Cloud Practitioner CLF-C02 exam",
      "Learn the fundamentals of AWS Cloud",
      "Understand AWS pricing and support models",
      "Learn about AWS security and compliance",
      "Understand AWS global infrastructure",
      "Learn about AWS core services"
    ],
    requirements: ["No AWS experience required", "Basic IT knowledge", "A computer with internet access", "Willingness to learn"],
    description: "This course is designed to help you pass the AWS Certified Cloud Practitioner CLF-C02 exam.",
    courseContent: { totalSections: 28, totalLectures: 345, totalLength: "42h 30m" },
    includes: ["42.5 hours on-demand video", "25 articles", "100 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "aws-solutions-architect": {
    id: "aws-solutions-architect",
    title: "Ultimate AWS Certified Solutions Architect Associate 2025",
    subtitle: "Master AWS Solutions Architecture and pass the SAA-C03 exam with hands-on practice!",
    instructor: { name: "Stephane Maarek", role: "AWS Certified Cloud Practitioner, Solutions Architect, Developer", avatar: "https://img-c.udemycdn.com/user/200_H/31334738_3535_3.jpg" },
    rating: 4.8, ratingsCount: 189234, learners: 1456789, lastUpdated: "1/2025", language: "English", autoLanguages: ["Spanish", "French", "German"],
    bestseller: true, price: 94.99, originalPrice: 189.99, discount: 50, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Pass the AWS Certified Solutions Architect Associate SAA-C03 exam",
      "Design and deploy scalable, highly available, and fault-tolerant systems",
      "Lift and shift an existing on-premises application to AWS",
      "Select appropriate AWS services to design and deploy an application",
      "Identify cost-optimization opportunities",
      "Understand AWS security best practices"
    ],
    requirements: ["Basic understanding of IT concepts", "No prior AWS experience required", "A computer with internet access", "Willingness to learn"],
    description: "This comprehensive course will prepare you for the AWS Certified Solutions Architect Associate exam.",
    courseContent: { totalSections: 35, totalLectures: 420, totalLength: "48h 15m" },
    includes: ["48.5 hours on-demand video", "30 articles", "150 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "aws-ai-practitioner": {
    id: "aws-ai-practitioner",
    title: "[NEW] Ultimate AWS Certified AI Practitioner AIF-C01",
    subtitle: "Master AWS AI/ML services and pass the AIF-C01 exam with hands-on projects!",
    instructor: { name: "Stephane Maarek", role: "AWS Certified Cloud Practitioner, Solutions Architect, Developer", avatar: "https://img-c.udemycdn.com/user/200_H/31334738_3535_3.jpg" },
    rating: 4.6, ratingsCount: 98765, learners: 654321, lastUpdated: "2/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 99.99, originalPrice: 199.99, discount: 50, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Pass the AWS Certified AI Practitioner AIF-C01 exam",
      "Understand AWS AI/ML services and their use cases",
      "Learn to build and deploy machine learning models on AWS",
      "Master Amazon SageMaker and related services",
      "Understand AI/ML security and compliance",
      "Learn to optimize AI/ML solutions for cost and performance"
    ],
    requirements: ["Basic understanding of AI/ML concepts", "No prior AWS experience required", "A computer with internet access", "Willingness to learn"],
    description: "This course will prepare you for the AWS Certified AI Practitioner certification.",
    courseContent: { totalSections: 30, totalLectures: 380, totalLength: "45h 20m" },
    includes: ["45.5 hours on-demand video", "25 articles", "120 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "aws-developer": {
    id: "aws-developer",
    title: "Ultimate AWS Certified Developer Associate 2025 DVA-C02",
    subtitle: "Master AWS development and pass the DVA-C02 exam with hands-on coding!",
    instructor: { name: "Stephane Maarek", role: "AWS Certified Cloud Practitioner, Solutions Architect, Developer", avatar: "https://img-c.udemycdn.com/user/200_H/31334738_3535_3.jpg" },
    rating: 4.7, ratingsCount: 145678, learners: 987654, lastUpdated: "1/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 89.99, originalPrice: 179.99, discount: 50, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Pass the AWS Certified Developer Associate DVA-C02 exam",
      "Develop, deploy, and debug cloud-based applications using AWS",
      "Understand AWS SDKs and how to use them",
      "Learn to use AWS CLI and CloudFormation",
      "Master AWS Lambda and serverless development",
      "Understand AWS security best practices for developers"
    ],
    requirements: ["Basic programming knowledge", "No prior AWS experience required", "A computer with internet access", "Willingness to learn"],
    description: "This course will prepare you for the AWS Certified Developer Associate certification.",
    courseContent: { totalSections: 32, totalLectures: 395, totalLength: "46h 30m" },
    includes: ["46.5 hours on-demand video", "28 articles", "130 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "azure-fundamentals": {
    id: "azure-fundamentals",
    title: "AZ-900: Microsoft Azure Fundamentals Certification Course",
    subtitle: "Pass the AZ-900 exam and become Microsoft Azure certified with this comprehensive course!",
    instructor: { name: "Scott Duffy", role: "Microsoft Azure Expert & Instructor", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.6, ratingsCount: 156789, learners: 1234567, lastUpdated: "1/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 84.99, originalPrice: 169.99, discount: 50, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Pass the AZ-900 Microsoft Azure Fundamentals exam",
      "Understand Azure cloud concepts and services",
      "Learn Azure pricing and support options",
      "Master Azure security and compliance",
      "Understand Azure identity and governance",
      "Learn about Azure core services and solutions"
    ],
    requirements: ["No Azure experience required", "Basic IT knowledge", "A computer with internet access", "Willingness to learn"],
    description: "This course will prepare you for the AZ-900 Microsoft Azure Fundamentals certification exam.",
    courseContent: { totalSections: 25, totalLectures: 320, totalLength: "38h 45m" },
    includes: ["38.5 hours on-demand video", "20 articles", "80 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "kubernetes": {
    id: "kubernetes",
    title: "Kubernetes for the Absolute Beginners - Hands-on",
    subtitle: "Learn Kubernetes from scratch with hands-on practice. Master container orchestration and deployment!",
    instructor: { name: "Mumshad Mannambeth", role: "Kubernetes Expert & Instructor", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.7, ratingsCount: 123456, learners: 987654, lastUpdated: "1/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 79.99, originalPrice: 159.99, discount: 50, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Learn Kubernetes from scratch with hands-on practice",
      "Understand container orchestration concepts",
      "Deploy applications on Kubernetes clusters",
      "Manage Kubernetes resources and configurations",
      "Learn to scale and monitor applications",
      "Understand Kubernetes networking and storage"
    ],
    requirements: ["Basic understanding of containers (Docker)", "Basic Linux command line knowledge", "A computer with internet access", "Willingness to learn"],
    description: "This course will take you from the basics of Kubernetes to advanced deployment strategies.",
    courseContent: { totalSections: 30, totalLectures: 380, totalLength: "45h 20m" },
    includes: ["45.5 hours on-demand video", "25 articles", "120 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "project-management": {
    id: "project-management",
    title: "PMP Certification Exam Prep Course 35 PDU Contact Hours",
    subtitle: "PMI PMP Exam Prep Course with 35 Contact Hours. Complete PMP Certification Training with Practice Tests!",
    instructor: { name: "Joseph Phillips", role: "PMP, PMI-ACP, ITIL Expert & Project Management Instructor", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.6, ratingsCount: 189234, learners: 1456789, lastUpdated: "1/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 99.99, originalPrice: 199.99, discount: 50, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Pass the PMP certification exam on your first attempt",
      "Understand all 49 project management processes",
      "Learn the 10 knowledge areas and 5 process groups",
      "Master project management formulas and calculations",
      "Understand PMP exam question types and strategies",
      "Get 35 PDU contact hours for PMP certification"
    ],
    requirements: ["No prior project management experience required", "Basic understanding of business concepts", "A computer with internet access", "Willingness to study and practice"],
    description: "This comprehensive PMP certification course will prepare you to pass the PMP exam on your first attempt.",
    courseContent: { totalSections: 32, totalLectures: 412, totalLength: "45h 20m" },
    includes: ["45.5 hours on-demand video", "35 articles", "150 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access", "35 PDU Contact Hours"]
  },

  "leadership": {
    id: "leadership",
    title: "Leadership Skills Masterclass: Become a Great Leader",
    subtitle: "Develop your leadership skills and learn how to lead teams effectively in any organization",
    instructor: { name: "Simon Brown", role: "Leadership Expert & Executive Coach", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.5, ratingsCount: 98765, learners: 654321, lastUpdated: "2/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 69.99, originalPrice: 149.99, discount: 53, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Develop essential leadership skills and qualities",
      "Learn to inspire and motivate your team",
      "Master communication and conflict resolution",
      "Understand different leadership styles and when to use them",
      "Learn to make effective decisions under pressure",
      "Build trust and create a positive work environment"
    ],
    requirements: ["No prior leadership experience required", "Willingness to learn and grow", "Open mind to new concepts", "Desire to become a better leader"],
    description: "This comprehensive course will help you develop the leadership skills needed to succeed in any organization.",
    courseContent: { totalSections: 25, totalLectures: 320, totalLength: "38h 45m" },
    includes: ["38.5 hours on-demand video", "20 articles", "100 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "cybersecurity-certification": {
    id: "cybersecurity-certification",
    title: "Cybersecurity Certification: Complete Course",
    subtitle: "Master cybersecurity fundamentals and prepare for industry-recognized certifications",
    instructor: { name: "Jason Dion", role: "Cybersecurity Expert & Instructor", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.7, ratingsCount: 123456, learners: 987654, lastUpdated: "2/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 89.99, originalPrice: 189.99, discount: 53, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Understand cybersecurity fundamentals and principles",
      "Learn network security and protocols",
      "Master threat detection and prevention techniques",
      "Understand cryptography and encryption methods",
      "Learn incident response and disaster recovery",
      "Prepare for cybersecurity certifications"
    ],
    requirements: ["Basic computer knowledge", "Understanding of networking concepts helpful", "A computer with internet access", "Willingness to learn security concepts"],
    description: "This comprehensive course will prepare you for cybersecurity certifications and careers in information security.",
    courseContent: { totalSections: 35, totalLectures: 450, totalLength: "48h 30m" },
    includes: ["48.5 hours on-demand video", "30 articles", "150 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "data-analytics-certification": {
    id: "data-analytics-certification",
    title: "Data Analytics Certification: Complete Course",
    subtitle: "Master data analytics and prepare for industry-recognized certifications",
    instructor: { name: "Kirill Eremenko", role: "Data Science Expert & Instructor", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.6, ratingsCount: 98765, learners: 654321, lastUpdated: "1/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 79.99, originalPrice: 169.99, discount: 53, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Master data analysis techniques and methodologies",
      "Learn to work with various data sources and formats",
      "Develop skills in data visualization and reporting",
      "Understand statistical analysis and modeling",
      "Learn to use popular analytics tools and platforms",
      "Prepare for data analytics certifications"
    ],
    requirements: ["Basic math and statistics knowledge", "Familiarity with Excel helpful", "A computer with internet access", "Willingness to learn data concepts"],
    description: "This course will prepare you for data analytics certifications and careers in business intelligence.",
    courseContent: { totalSections: 30, totalLectures: 380, totalLength: "42h 15m" },
    includes: ["42.5 hours on-demand video", "25 articles", "120 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  },

  "game-developer": {
    id: "game-developer",
    title: "Complete Game Development Bootcamp 2025",
    subtitle: "Learn to create games from scratch using Unity, C#, and game development principles",
    instructor: { name: "Ben Tristem", role: "Game Developer & Instructor", avatar: "https://img-c.udemycdn.com/user/200_H/437533_72a6_2.jpg" },
    rating: 4.6, ratingsCount: 145678, learners: 987654, lastUpdated: "1/2025", language: "English", autoLanguages: ["Spanish", "French"],
    bestseller: true, price: 84.99, originalPrice: 179.99, discount: 53, thumbnailUrl: "https://img-c.udemycdn.com/course/750x422/851712_fc61_6.jpg",
    whatYouWillLearn: [
      "Learn Unity game engine from scratch",
      "Master C# programming for game development",
      "Create 2D and 3D games from concept to completion",
      "Understand game design principles and mechanics",
      "Learn to implement game physics and animations",
      "Publish and monetize your games"
    ],
    requirements: ["Basic computer knowledge", "No programming experience required", "A computer with internet access", "Willingness to learn game development"],
    description: "This comprehensive course will teach you everything you need to know to become a game developer.",
    courseContent: { totalSections: 40, totalLectures: 520, totalLength: "55h 30m" },
    includes: ["55.5 hours on-demand video", "40 articles", "200 downloadable resources", "Access on mobile and TV", "Certificate of completion", "Full lifetime access"]
  }
};

export const getAllCourses = () => Object.values(courseData);
export const getCourseById = (id) => courseData[id];
export const searchCourses = (query) => {
  const searchTerm = query.toLowerCase();
  return Object.values(courseData).filter(course => 
    course.title.toLowerCase().includes(searchTerm) ||
    course.subtitle.toLowerCase().includes(searchTerm) ||
    course.instructor.name.toLowerCase().includes(searchTerm) ||
    course.whatYouWillLearn.some(item => item.toLowerCase().includes(searchTerm))
  );
}; 