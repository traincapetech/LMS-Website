import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { BookOpen, Lightbulb, Trophy, Play, ChevronRight } from "lucide-react";



const Teach1 = () => {
  const [activeTab, setActiveTab] = useState("plan");
  const navigate = useNavigate();
  const [count, setCount] = useState({
    students: 0,
    languages: 0,
    enrollments: 0,
    countries: 0,
    customers: 0,
  });

  useEffect(() => {
    const targets= {
      students: 80,
      languages: 75,
      enrollments: 1100,
      countries: 180,
      customers: 17200,
    };

    const interval = setInterval(() => {
      setCount((prev) => {
        const updated = { ...prev };
        Object.entries(targets).forEach(([key, value]) => {
          if (prev[key] < value) {
            updated[key] = Math.min(prev[key] + Math.ceil(value / 50), value);
          }
        });
        return updated;
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const reasons = [
    {
      icon: BookOpen,
      title: "Teach your way",
      desc: "Publish the course you want, in the way you want, and always have control of your own content.",
    },
    {
      icon: Lightbulb,
      title: "Inspire learners",
      desc: "Teach what you know and help learners explore their interests, gain new skills, and advance their careers.",
    },
    {
      icon: Trophy,
      title: "Get rewarded",
      desc: "Expand your professional network, build your expertise, and earn money on each paid enrollment.",
    },
  ];

  const stats = [
    { value: `${count.students}M`, label: "Students" },
    { value: `${count.languages}+`, label: "Languages" },
    { value: `${(count.enrollments / 1000).toFixed(1)}B`, label: "Enrollments" },
    { value: `${count.countries}+`, label: "Countries" },
    { value: `${count.customers.toLocaleString()}+`, label: "Enterprise customers" },
  ];

  const tabContent = {
    plan: {
      title: "Plan your curriculum",
      content: [
        "You start with your passion and knowledge. Then choose a promising topic with the help of our Marketplace Insights tool.",
        "The way that you teach — what you bring to it — is up to you.",
      ],
      helpTitle: "How we help you",
      helpContent:
        "We offer plenty of resources on how to create your first course. And, our instructor dashboard and curriculum pages help keep you organized.",
    },
    record: {
      title: "Record your video",
      content: [
        "Use basic tools like a smartphone or a DSLR camera. Add a good microphone and you're ready to share your knowledge.",
        "If you don't like being on camera, just capture your screen. Either way, we have resources to help.",
      ],
      helpTitle: "How we help you",
      helpContent:
        "Our support team is available to help you throughout the process and provide feedback on test videos.",
    },
    launch: {
      title: "Launch your course",
      content: [
        "Gather your first ratings and reviews by promoting your course through social media and your professional networks.",
        "Your course will be discovered organically as we feature it on our marketplace.",
      ],
      helpTitle: "How we help you",
      helpContent:
        "Our custom coupon tool lets you offer enrollment incentives while our global promotions drive traffic to courses.",
    },
  };

  return (
    <div className="min-h-screen bg-background font-poppins pt-20">
      {/* Hero Section */}
      <div className="">
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 gradient-hero opacity-95" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        
        <div className="container relative z-10 mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl  font-normal text-primary-foreground">
                Come teach
                <span className="block text-gradient">with us</span>
              </h1>
              <p className=" text-lg text-primary-foreground/80 font-light font-inter max-w-xl">
                Become an instructor and change lives — including your own
              </p>
              <button
                className="btn-primary text-md group"
                onClick={() => navigate("/form")}
              >
                Start Instructor Application
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="relative animate-slide-in-right" style={{ animationDelay: "0.3s" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/hero-instructor.jpg"
                  alt="Instructor teaching online"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent" />
              </div>
              
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-xl animate-scale-in" style={{ animationDelay: "0.6s" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <Play className="w-6 h-6 text-primary-foreground fill-current" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Join over</p>
                    <p className="font-bold text-foreground">70K+ Instructors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reasons Section */}
      <section className="py-24 px-6 bg-card">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-medium text-center mb-16 text-foreground">
            So many reasons to <span className="text-gradient">start</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {reasons.map((item, idx) => (
              <div
                key={item.title}
                className="group bg-background rounded-2xl p-8 card-hover border border-border/50"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-inter leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Counters Section */}
      <section className="py-20 px-6 gradient-hero">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {stats.map((item) => (
              <div
                key={item.label}
                className="text-center group"
              >
                <h3 className="text-4xl md:text-5xl font-normal text-primary-foreground mb-2 group-hover:text-gradient transition-colors">
                  {item.value}
                </h3>
                <p className="text-primary-foreground/70 font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Begin Section */}
      <section className="py-24 px-6 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-medium text-center mb-16 text-foreground">
            How to <span className="text-gradient">begin</span>
          </h2>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {(["plan", "record", "launch"]).map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 rounded-full text-md transition-all duration-300 ${
                  activeTab === tab
                    ? "gradient-primary text-primary-foreground shadow-glow"
                    : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tabContent[tab].title}
              </button>
            ))}
          </div>
          
          {/* Tab Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center font-inter">
            <div className="space-y-6 animate-fade-in" key={activeTab}>
              {tabContent[activeTab].content.map((text, idx) => (
                <p key={idx} className="text-lg text-muted-foreground leading-relaxed">
                  {text}
                </p>
              ))}
              
              <div className="pt-6 border-t border-border">
                <h4 className="text-xl font-instrument font-bold text-foreground mb-3">
                  {tabContent[activeTab].helpTitle}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {tabContent[activeTab].helpContent}
                </p>
              </div>
            </div>
            
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/hero-instructor.jpg"
                alt={tabContent[activeTab].title}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 gradient-hero relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
        
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-primary-foreground mb-6">
            Become an instructor today
          </h2>
          <p className="font-inter text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join one of the world's largest online learning marketplaces.
          </p>
          <button
            className="bg-card text-foreground px-6 py-2 rounded-xl font-semibold text-md transition-all duration-300 hover:scale-105 hover:shadow-xl group"
            onClick={() => navigate("/form")}
          >
            Get started
            <ChevronRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Teach1;
