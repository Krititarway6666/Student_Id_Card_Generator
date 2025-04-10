import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { IdCardIcon, Image, CheckCircle, School, PenSquare, Download, ChevronRight } from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 10
    }
  }
};

// Background animation elements
const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {/* Animated gradient circles */}
    <motion.div 
      className="absolute top-[10%] left-[15%] w-64 h-64 rounded-full bg-blue-200/20 blur-3xl"
      animate={{ 
        x: [0, 30, 0], 
        y: [0, 15, 0], 
        scale: [1, 1.1, 1] 
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        repeatType: "reverse" 
      }}
    />
    <motion.div 
      className="absolute top-[40%] right-[10%] w-72 h-72 rounded-full bg-indigo-300/20 blur-3xl"
      animate={{ 
        x: [0, -20, 0], 
        y: [0, 20, 0], 
        scale: [1, 1.15, 1] 
      }}
      transition={{ 
        duration: 15, 
        repeat: Infinity, 
        repeatType: "reverse" 
      }}
    />
    <motion.div 
      className="absolute bottom-[15%] left-[25%] w-80 h-80 rounded-full bg-purple-200/20 blur-3xl"
      animate={{ 
        x: [0, 25, 0], 
        y: [0, -15, 0], 
        scale: [1, 1.05, 1] 
      }}
      transition={{ 
        duration: 18, 
        repeat: Infinity, 
        repeatType: "reverse" 
      }}
    />
  </div>
);

// Tutorial carousel slides
const tutorialSteps = [
  {
    title: "Fill Student Information",
    description: "Enter student details including name, roll number, class grade, and upload a photo.",
    icon: <PenSquare className="h-10 w-10 text-blue-500" />
  },
  {
    title: "Choose Template Style",
    description: "Select between classic and modern ID card templates to match your school's branding.",
    icon: <School className="h-10 w-10 text-blue-500" />
  },
  {
    title: "Customize and Preview",
    description: "Add additional details like bus route and allergies, then preview your ID card.",
    icon: <IdCardIcon className="h-10 w-10 text-blue-500" />
  },
  {
    title: "Download and Save",
    description: "Download the ID card as a PNG image or save it for future use.",
    icon: <Download className="h-10 w-10 text-blue-500" />
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      <BackgroundAnimation />
      
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <IdCardIcon className="h-8 w-8 text-blue-600 mr-2" />
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ID Card Generator
          </span>
        </div>
        <Link href="/generator">
          <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
        </Link>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between py-12 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="md:w-1/2">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Smart Student <br /> ID Card Generator
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 mb-8 leading-relaxed"
              variants={itemVariants}
            >
              Create professional student ID cards in minutes with our easy-to-use generator. 
              Choose from beautiful templates, customize details, and download instantly.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Link href="/generator">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg shadow-lg transition-all flex items-center group">
                  Create ID Card
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center"
            variants={itemVariants}
          >
            <div className="relative">
              <motion.div 
                className="w-64 h-96 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 rotate-6 z-10 absolute"
                initial={{ rotate: 6 }}
                animate={{ rotate: [6, 8, 6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-blue-600 text-white p-3 rounded-t-lg mb-2">
                  <div className="text-lg font-bold">SCHOOL NAME</div>
                </div>
                <div className="flex justify-center">
                  <div className="h-20 w-20 bg-gray-200 rounded-full mb-2"></div>
                </div>
                <div className="text-center text-sm mb-3">
                  <div className="font-bold">Student Name</div>
                  <div>Class X - A</div>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Roll Number:</span>
                    <span>12345</span>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="w-64 h-96 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-2xl p-4 -rotate-3 relative"
                initial={{ rotate: -3 }}
                animate={{ rotate: [-3, -6, -3] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <div className="text-white text-lg font-bold">MODERN ACADEMY</div>
                </div>
                <div className="flex justify-center mt-4">
                  <div className="h-24 w-24 bg-white/20 rounded-full"></div>
                </div>
                <div className="text-center text-white mt-3 mb-2">
                  <div className="font-bold text-lg">Jane Smith</div>
                  <div className="text-white/80">Science - Grade XI</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Features Section */}
        <motion.div 
          className="py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {tutorialSteps.map((step, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="h-full border-none shadow-md hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className="mb-4 p-3 bg-blue-50 rounded-full">
                        {step.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center mt-8 gap-2">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div 
          className="py-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-10 shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Student ID Cards?</h2>
            <p className="text-blue-100 mb-8 text-lg">Generate professional ID cards in just a few steps.</p>
            <Link href="/generator">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 text-lg">
                Start Generating Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
      
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Smart Student ID Card Generator. All rights reserved.</p>
          <p className="mt-2 text-sm">A tool for schools and educational institutions.</p>
        </div>
      </footer>
    </div>
  );
}