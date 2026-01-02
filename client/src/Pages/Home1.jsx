import React, { useEffect, Suspense, useState } from "react";
const FeaturedCourses = React.lazy(() =>
  import("../components/FeaturedCourses")
);
import HeroSection from "../components/HeroSection";
import { motion } from "framer-motion";
import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img4 from "../assets/img3.png";
import { FaStar } from "react-icons/fa";
import "../App.css";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ImBooks } from "react-icons/im";
import { TbTargetArrow } from "react-icons/tb";
import {
  BarChart3,
  Users2,
  BookOpenCheck,
  Trophy,
  ShieldCheck,
  Zap,
  Laptop,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FaRobot,
  FaPenNib,
  FaBrain,
  FaComments,
  FaUserTie,
  FaNetworkWired,
  FaMicrosoft,
  FaAws,
  FaGoogle,
  FaProjectDiagram,
  FaApple,
  FaCalculator,
  FaAutoprefixer,
  FaCertificate,
  FaChartLine,
  FaCogs,
  FaHandsHelping,
} from "react-icons/fa";
import { SiUnity, SiCisco } from "react-icons/si";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineThunderbolt } from "react-icons/ai";
import { FaSuitcase } from "react-icons/fa6";
import { FaTools } from "react-icons/fa";
import { BsGlobe2 } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { useStore } from "@/Store/store";
import { toast } from "sonner";
import { newsletterAPI, publicAPI } from "@/utils/api";
const Home1 = () => {
  const [email, setEmail] = useState("");
  const [homeStats, setHomeStats] = useState({
    students: 0,
    courses: 0,
    instructors: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await publicAPI.getStats();
        setHomeStats(res.data);
      } catch (err) {
        console.error("Failed to load home stats", err);
      }
    };
    loadStats();
  }, []);

  const location = useLocation();

  useEffect(() => {
    console.log("location.hash", location.hash);
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      console.log("element", element);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 500); // 100ms delay to ensure DOM is ready
      }
    }
  }, [location]);

  const {
    subscribe,
    subscribing,
    setSubscribing,
    courses,
    loading,
    error,
    fetchCourses,
  } = useStore();

  const handleSubscribe = async () => {
    subscribe(email);
    setEmail("");
  };

  const course = [
    {
      title: "Full-Stack Web Development",
      instructor: "John Carter",
      rating: 4.8,
      students: "12k+",
      image: "/mern.jpeg",
    },
    {
      title: "UI/UX Design Mastery",
      instructor: "Alicia Gomez",
      rating: 4.7,
      students: "9k+",
      image:
        "https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg?ga=GA1.1.569897932.1764927346&semt=ais_hybrid&w=740&q=80",
    },
    {
      title: "Python for Data Science",
      instructor: "Dr. Kartik Rao",
      rating: 4.9,
      students: "15k+",
      image:
        "https://img.freepik.com/premium-photo/table-with-computer-mouse-keyboard-it_1083272-4970.jpg?w=1480",
    },
    // NEW CARDS ADDED ↓
    {
      title: "Machine Learning Essentials",
      instructor: "Sarah Williams",
      rating: 4.8,
      students: "10k+",
      image:
        "https://img.freepik.com/free-vector/gradient-rpa-illustration_23-2149250982.jpg?t=st=1765349044~exp=1765352644~hmac=646868c26326f302ee526e8d111c3b5815be506d76296bdf0ad198e67863d909&w=1480",
    },
    {
      title: "Cloud Computing with AWS",
      instructor: "Mark Johnson",
      rating: 4.6,
      students: "7k+",
      image:
        "https://img.freepik.com/free-vector/cloud-services-isometric-composition-with-flat-silhouette-pictograms-big-cloud-storage-with-people-vector-illustration_1284-30499.jpg?t=st=1765348779~exp=1765352379~hmac=808e79d1e1578a5d4e142fcc4e3da38b18eedd479948e3559af66e7cddc4f3a9&w=2000",
    },
    {
      title: "JavaScript Zero-to-Hero",
      instructor: "Emily Turner",
      rating: 4.9,
      students: "20k+",
      image:
        "https://img.freepik.com/free-vector/programmers-using-javascript-programming-language-computer-tiny-people-javascript-language-javascript-engine-js-web-development-concept-bright-vibrant-violet-isolated-illustration_335657-986.jpg?t=st=1765349143~exp=1765352743~hmac=fb647361ac18d905a09aff9a234372fd808587f4e6073837dc6e5bfff3cc8b7b&w=2000",
    },
  ];

  const UspCards = [
    {
      title: "Expert-Led Courses",
      description:
        "Learn from top instructors with real-world industry experience.",
      icon: <ImBooks />,
    },
    {
      title: "Career-Focused Learning",
      description:
        "Every course is designed to boost your skills and career growth.",
      icon: <TbTargetArrow />,
    },
    {
      title: "Interactive Learning",
      description:
        "Engage with quizzes, assignments, live classes, and discussions.",
      icon: <AiOutlineThunderbolt />,
    },
    {
      title: "Job-Ready Skills",
      description:
        "TrainCape equips you with skills that companies are hiring for.",
      icon: <FaSuitcase />,
    },
    {
      title: "Hands-On Projects",
      description:
        "Apply your knowledge with real projects built into each course.",
      icon: <FaTools />,
    },
    {
      title: "Learn Anywhere",
      description:
        "Access your courses anytime from laptop, tablet, or mobile.",
      icon: <BsGlobe2 />,
    },
  ];

  const testimonials = [
    {
      name: "Aarav Sharma",
      role: "Full-Stack Developer at Infosys",
      image:
        "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg?t=st=1765358801~exp=1765362401~hmac=0ed17ff709f5a8d85be790485cc3c72d644284193638cdc2003dc07be8773318&w=1480",
      review:
        "TrainCape helped me transform my skills. The MERN Stack course was structured and practical—landed my first developer job easily!",
      rating: 5,
    },
    {
      name: "Priya Verma",
      role: "UI/UX Designer at TCS",
      image:
        "https://img.freepik.com/premium-photo/young-pretty-woman-smiling-positively-confidently-looking-satisfied-friendly-happy_1194-211009.jpg?w=2000",
      review:
        "The hands-on projects and personalized feedback from instructors helped me build a professional-looking portfolio.",
      rating: 5,
    },
    {
      name: "Rohan Mehta",
      role: "Frontend Developer at Wipro",
      image:
        "https://img.freepik.com/premium-photo/portrait-young-bearded-indian-man-streets-outdoors_251136-80087.jpg?w=2000",
      review:
        "I loved the structured curriculum and real-world assignments. TrainCape gave me confidence to crack interviews!",
      rating: 4,
    },
  ];

  // FETCH COURSES (DYNAMIC ONLY)
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);
  const navigate = useNavigate();

  // if (loading) {
  //   return (
  //     <div className="flex items-center w-full h-screen justify-center">
  //       <Spinner className="text-blue-600 size-12" />
  //     </div>
  //   );
  // }
  return (
    <>
      <section className="relative w-full overflow-hidden bg-linear-to-br from-[#f7faff] via-[#e3ecff] to-[#bdd3ff] pt-25">
        {/* bg-gradient-to-br from-[#f7faff] via-[#e3ecff] to-[#bdd3ff] */}
        {/* Decorative Blur Shape */}
        {/* <div className="absolute right-0 top-20 w-[450px] h-[450px] bg-blue-300/30 blur-[100px] rounded-full"></div> */}

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 relative z-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="flex-1 space-y-6"
          >
            <h1 className="text-5xl font-medium text-slate-900 leading-tight font-poppins">
              Learn. Grow. Achieve
              <br />
              <span className="text-blue-600">With TrainCape LMS.</span>
            </h1>

            <p className="text-slate-600 max-w-lg font-inter">
              Empower your skills with industry-ready courses taught by expert
              instructors. Join thousands of learners upgrading their careers
              through TrainCape.
            </p>

            <div className="flex gap-4 mt-4">
              <Link to="/courses">
                <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow">
                  Explore Courses
                </Button>
              </Link>

              <Link to="/teach">
                <Button className="px-6 py-3 border bg-Background border-Primary text-blue-600 hover:bg-blue-600 hover:text-white cursor-pointer  transition">
                  Become an Instructor
                </Button>
              </Link>
            </div>

            <div className="flex gap-12 mt-10">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {homeStats.students}+
                </p>
                <p className="text-sm text-slate-600">Students</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {homeStats.courses}+
                </p>
                <p className="text-sm text-slate-600">Courses</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {homeStats.instructors}+
                </p>
                <p className="text-sm text-slate-600">Instructors</p>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="relative flex-1 flex justify-center md:justify-end mt-10 md:mt-0"
          >
            <div className="absolute -right-10 top-20 w-[450px] h-[450px] bg-radial from-Primary/70 from-40% to-fuchsia-700 blur-3xl rounded-full"></div>
            <img
              src="/student.png"
              alt="Student"
              className="w-[360px] drop-shadow-xl object-cover"
            />
          </motion.div>
        </div>
      </section>
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Spinner className="text-blue-600 size-12" />
          </div>
        }
      >
        <FeaturedCourses courses={courses} />
      </Suspense>
      {/* SECTION 3 – WHY CHOOSE TRAINCAPE */}
      <section id="aboutus" className="w-full py-20 bg-white font-poppins">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="text-center mb-14"
          >
            <h2 className="text-4xl font-semibold text-gray-900">
              Why Choose <span className="text-blue-600">TrainCape?</span>
            </h2>
            <p className="mt-4 text-gray-600 font-inter">
              A modern learning platform built to help students, instructors,
              and <br /> professionals achieve more with high-quality education.
            </p>
          </motion.div>

          {/* USP Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Cards */}
            {UspCards.map((card, index) => (
              <Card key={index} className="hover:shadow-md transition">
                <motion.div
                  style={{ cursor: "pointer" }}
                  initial={{ opacity: 0, y: 50 }} // Gayab aur neeche
                  whileInView={{ opacity: 1, y: 0 }} // Dikhna aur upar aana
                  viewport={{ once: false }} // ✅ CHANGE: Har baar animation repeat hoga
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                >
                  <CardHeader>
                    <div className="text-blue-600 text-4xl pl-2">
                      {card.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl font-medium mb-3">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="font-inter text-TextSecondary">
                      {card.description}
                    </CardDescription>
                  </CardContent>
                </motion.div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full py-20 bg-linear-to-r from-blue-50 via-white to-purple-50 font-poppins">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight">
              Become an Instructor
              <span className="text-blue-600"> & Share Your Knowledge</span>
            </h2>

            <p className="mt-6 text-lg text-gray-600 max-w-xl font-inter">
              Join TrainCape and turn your expertise into impact. Create
              high-quality courses, reach thousands of learners, and earn while
              teaching what you love.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700 font-inter">
              <li className="flex items-center gap-3">
                <span className="text-blue-600 text-xl">✔</span>
                Easy course creation tools
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-600 text-xl">✔</span>
                Earn money for every student enrolled
              </li>
              <li className="flex items-center gap-3">
                <span className="text-blue-600 text-xl">✔</span>
                Get advanced analytics & student insights
              </li>
            </ul>

            <Button className="mt-8 bg-Accent text-white hover:bg-Accent/80 transition-all shadow-md">
              Start Teaching Today
            </Button>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full h-full"
          >
            <img
              src="/instructor.png"
              alt="Become Instructor"
              className="w-full drop-shadow-xl"
            />
          </motion.div>
        </div>
      </section>
      <section className="w-full py-20 bg-gray-50 font-poppins">
        <div className="max-w-7xl mx-auto px-6">
          {/* Heading */}
          <div className="text-center mb-14">
            <h2 className="text-4xl font-semibold text-TextPrimary">
              Student Success <span className="text-blue-600">Stories</span>
            </h2>
            <p className="mt-3 text-gray-600 text-lg font-inter">
              Hear what our learners say after taking TrainCape courses.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-md rounded-2xl p-6 border border-gray-200"
              >
                {/* Student Info */}
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={t.image}
                    className="w-16 h-16 rounded-full object-cover"
                    alt={t.name}
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {t.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{t.role}</p>
                  </div>
                </div>

                {/* Review */}
                <p className="text-TextSecondary mb-4 font-inter">{t.review}</p>

                {/* Rating */}
                <div className="flex text-yellow-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="w-full py-20 bg-linear-to-br from-[#f8fafc] to-[#eef2ff] font-poppins">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          {/* LEFT — ANALYTICS */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-semibold text-TextPrimary leading-tight mb-4">
              Powerful Insights for Better{" "}
              <span className="text-blue-600">Learning Outcomes</span>
            </h2>
            <p className="text-TextSecondary font-inter mb-10">
              TrainCape provides advanced analytics to help students track their
              progress and instructors monitor performance for effective
              teaching.
            </p>

            {/* STATS BOX */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                <BarChart3 className="w-10 h-10 text-indigo-600 mb-3" />
                <h3 className="text-3xl font-semibold text-TextPrimary">
                  12K+
                </h3>
                <p className="text-TextSecondary font-inter">
                  Daily Active Learners
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                <Users2 className="w-10 h-10 text-indigo-600 mb-3" />
                <h3 className="text-3xl font-semibold text-TextPrimary">
                  800+
                </h3>
                <p className="text-TextSecondary font-inter">
                  Certified Instructors
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                <BookOpenCheck className="w-10 h-10 text-indigo-600 mb-3" />
                <h3 className="text-3xl font-semibold text-TextPrimary">
                  1,500+
                </h3>
                <p className="text-TextSecondary font-inter">
                  Courses Completed
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                <Trophy className="w-10 h-10 text-indigo-600 mb-3" />
                <h3 className="text-3xl font-semibold text-TextPrimary">98%</h3>
                <p className="text-TextSecondary font-inter">Success Rate</p>
              </div>
            </div>
          </div>

          {/* RIGHT — FEATURE GRID */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <ShieldCheck className="w-10 h-10 text-Accent mb-4" />
              <h4 className="font-semibold text-xl text-gray-900 mb-2">
                Secure Learning
              </h4>
              <p className="text-gray-600 text-sm font-inter">
                Top-tier encryption and cloud-backed safety.
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <Zap className="w-10 h-10 text-Accent mb-4" />
              <h4 className="font-semibold text-xl text-gray-900 mb-2">
                Fast Performance
              </h4>
              <p className="text-gray-600 text-sm font-inter">
                Optimized system for smooth course playback.
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <Laptop className="w-10 h-10 text-Accent mb-4" />
              <h4 className="font-semibold text-xl text-gray-900 mb-2">
                Cross-Device Support
              </h4>
              <p className="text-gray-600 text-sm font-inter">
                Access on mobile, tablet, and desktop.
              </p>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all">
              <Users2 className="w-10 h-10 text-Accent mb-4" />
              <h4 className="font-semibold text-xl text-gray-900 mb-2">
                Community Learning
              </h4>
              <p className="text-gray-600 text-sm font-inter">
                Interactive discussions and group learning.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-20 px-6">
        <div className="max-w-6xl mx-auto font-poppins">
          <div className="bg-linear-to-r from-indigo-600/90 to-blue-500/90 rounded-3xl p-10 md:p-16 text-white shadow-xl relative overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-white/10 blur-3xl opacity-20"></div>

            <div className="relative z-10 flex flex-col items-center text-center gap-6">
              <h2 className="text-3xl md:text-4xl font-semibold">
                Stay Updated With TrainCape
              </h2>

              <p className="max-w-2xl font-inter">
                Subscribe to our newsletter and get the latest course updates,
                career tips, discounts, and learning resources directly in your
                inbox.
              </p>

              {/* Newsletter Input */}
              <div className="flex flex-col md:flex-row w-full max-w-xl gap-4 mt-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-Background text-PrimaryDark shadow-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Button
                  className=""
                  onClick={handleSubscribe}
                  disabled={subscribing}
                >
                  {subscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </div>

              {/* Guarantee Text */}
              <p className="text-sm font-inter mt-3">
                We respect your privacy. No spam ever.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home1;
