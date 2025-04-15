import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  GraduationCap,
  BrainCircuit,
  ArrowRight,
  Users,
  BookOpen,
  Target,
  Trophy,
  ChevronDown,
  Sparkles,
  Star,
  Clock,
  Loader2,
  MousePointer,
  Lightbulb,
  Award,
  MessageSquare,
  X,
  MapPin,
  Building,
  School,
  Briefcase,
  ExternalLink,
  Heart,
  CreditCard,
  Share2,
  Download,
  Check,
  Copy
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const float = {
  y: [-10, 10],
  transition: {
    y: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  },
};

const PageLoader = () => (
  <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Loader2 className="h-12 w-12 text-primary" />
      </motion.div>
      <p className="text-muted-foreground animate-pulse">Loading amazing content...</p>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 200 }}
        transition={{ duration: 1, repeat: Infinity }}
        className="h-1 bg-primary rounded-full"
      />
    </motion.div>
  </div>
);

// Interactive Mouse follower component
const MouseFollower = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isVisible]);
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 0.2,
            x: mousePosition.x - 15,
            y: mousePosition.y - 15
          }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed w-8 h-8 rounded-full bg-primary pointer-events-none z-50 mix-blend-difference"
          style={{ left: 0, top: 0 }}
        />
      )}
    </AnimatePresence>
  );
};

// Simplified TiltCard component without animations
const TiltCard = ({ children, className }: { children: React.ReactNode, className: string }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-full">
        {children}
      </div>
    </div>
  );
};

// Parallax section
const ParallaxSection = ({ children, depth = 0.2 }: { children: React.ReactNode, depth?: number }) => {
  const [offsetY, setOffsetY] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const { top } = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (top < windowHeight && top > -sectionRef.current.offsetHeight) {
        setOffsetY((top / windowHeight) * 100);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div ref={sectionRef} className="relative overflow-hidden">
      <motion.div
        style={{
          y: offsetY * depth,
          transition: "transform 0.1s ease-out",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// Particles background component
const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
  }>>([]);
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        setDimensions({ width, height });
        
        // Create particles
        const particleCount = Math.floor(width * height / 20000);
        particlesRef.current = Array.from({ length: particleCount }).map(() => ({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        }));
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    if (!ctx) return;
    
    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);
      
      particlesRef.current.forEach(particle => {
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = dimensions.width;
        if (particle.x > dimensions.width) particle.x = 0;
        if (particle.y < 0) particle.y = dimensions.height;
        if (particle.y > dimensions.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 125, 255, ${particle.opacity})`;
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
    />
  );
};

// Scrolling highlight effect for text
const ScrollHighlightText = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (textRef.current) {
      observer.observe(textRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={textRef} className={`relative inline-block ${className || ''}`}>
      <span
        className={`relative z-10 ${
          isVisible ? "bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent" : ""
        }`}
      >
        {children}
      </span>
      {isVisible && (
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="absolute bottom-0 left-0 h-1 bg-primary/30 z-0"
        />
      )}
    </div>
  );
};

// Support Us section
const SupportUsSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const handleCopyUPI = () => {
    navigator.clipboard.writeText("nst@upi");
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };
  
  const handleDownloadQR = () => {
    // Create a link element
    const downloadLink = document.createElement("a");
    downloadLink.href = "/qr-code.png"; // Replace with your actual QR code image path
    downloadLink.download = "nst-donation-qr.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  
  return (
    <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/10">
      <div className="container mx-auto px-4">
        <div className="py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <p className="text-sm font-medium">Support our mission to make REstart better and get you the best NSAT guidanace</p>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:bg-primary/10"
            >
              {isExpanded ? "Hide" : "Support Us"} 
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </Button>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="space-y-2">
                    <h3 className="font-medium">Why Support Us?</h3>
                    <p className="text-sm text-muted-foreground">
                      Your support helps us create more life-changing content and grow REstart into a movement. Every contribution counts 💙
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        Empower
                      </Badge>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Sustain
                      </Badge>
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                        Grow
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="bg-white p-3 rounded-lg shadow-md">
                      <img 
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=nst@upi&pn=NST%20Education&cu=INR" 
                        alt="Donation QR Code" 
                        className="w-32 h-32 object-contain"
                      />
                      <p className="text-xs text-center mt-2 font-medium">Scan to support</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">UPI ID: nst@upi</p>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={handleCopyUPI}
                      >
                        {copySuccess ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8"
                        onClick={handleDownloadQR}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download QR
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8"
                        onClick={() => {
                          navigator.share({
                            title: 'Support NST Education',
                            text: 'Support NST Education for quality NSAT preparation',
                            url: window.location.href,
                          }).catch(err => console.error('Error sharing:', err));
                        }}
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function HomePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeChatbot, setActiveChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', message: 'Hello! How can I help you with your NSAT preparation?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  
  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(scrollPercent);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Simulate loading of resources with a randomized loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, Math.random() * 500 + 800); // Between 800-1300ms

    return () => clearTimeout(timer);
  }, []);
  
  // Handle chatbot interaction
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    setChatMessages(prev => [...prev, { sender: 'user', message: userInput }]);
    setUserInput('');
    
    // Simulate response
    setTimeout(() => {
      const responses = [
        "We have comprehensive study materials for NSAT preparation.",
        "Our expert mentors can guide you through the preparation process.",
        "Have you tried our practice tests? They're designed to match the actual NSAT pattern.",
        "Is there a specific subject you need help with?",
        "I recommend starting with our diagnostic test to identify your strengths and areas for improvement."
      ];
      
      setChatMessages(prev => [
        ...prev, 
        { sender: 'bot', message: responses[Math.floor(Math.random() * responses.length)] }
      ]);
    }, 1000);
  };
  
  // Add this function to show a notification
  const showNotification = (message: string) => {
    toast({
      title: "Information",
      description: message,
      variant: "default",
    });
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <PageLoader />}
      </AnimatePresence>
      
      <MouseFollower />
      <ParticlesBackground />
      
      {/* Progress indicator */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-primary z-50"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: isLoading ? 1 : 0 }}
        className="min-h-screen bg-gradient-to-b from-background to-background/95"
        ref={mainRef}
      >
        <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <motion.img
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
                src="https://media-hosting.imagekit.io//e60a0a3fac904c2a/WhatsApp_Image_2025-01-26_at_20.14.19-removebg-preview%20(3).png?Expires=1834242508&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=nVFdXSeeo14FtjV6G~ppAgawYVuWM5ZBFu3VmE~6EUH79Qe3QJ479US4D8pggGisa~3D5nKS0ICnJFBkwZyIV8iDLMX6LMTxPnoH9OkOnaYACbTTPgISyWVxr33MreB2LGvj0ePD5wi-weKMOaF-jYY9nr0AXGiYtUbOpCvRgws7RsDMKcTtO8xA~HP9Jim90PxyNhfp1842BWY~GDnlguAKH87V-Q-5RB8JJ6q~-wO9gX-ScIP26GqRVmXMQPmo4uuA6JH4fVvc1MjUKbBHtQBZ-3xFP0pAJax3I2lVLNX1EP2kHTpJuUTwwnLBCnkMNwst3BinXaixwg6I~kdkLw__"
                alt="REstart LMS"
                className="h-10 w-auto"
              />
              
            </Link>
            
            
             
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-4"
            >
              {user ? (
                <Link href="/dashboard">
                  <Button 
                    className="w-full sm:w-auto bg-customBlue hover:bg-customBlue/90 relative overflow-hidden group transition-all duration-300 ease-out hover:scale-105 shadow-lg hover:shadow-customBlue/25"
                    size="lg"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/25 to-primary/0"
            animate={{
                        x: ['-200%', '200%'],
            }}
            transition={{
                        duration: 2,
              repeat: Infinity,
                        ease: "linear",
                      }}
                    />
      <motion.div
                      className="relative z-10 flex items-center gap-2"
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
                    Go to Dashboard
                      </span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </motion.div>
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
        <Button 
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 relative overflow-hidden group transition-all duration-300 ease-out hover:scale-105 shadow-lg hover:shadow-primary/25"
          size="lg"
        >
          <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/25 to-primary/0"
            animate={{
              x: ['-200%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
                    <motion.div
                      className="relative z-10 flex items-center gap-2"
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 after:ease-in-out group-hover:after:origin-bottom-left group-hover:after:scale-x-100">
                    Get Started
                      </span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </motion.div>
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </header>

        <main className="pt-24">
          {/* Add the Support Us section at the top */}
          <SupportUsSection />
          
          {/* Enhanced Hero Section */}
          <section className="min-h-screen flex items-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            
              {/* Animated particles */}
              <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
            <motion.div 
                    key={i}
                    className="absolute rounded-full bg-primary/10"
            style={{
                      width: Math.random() * 100 + 50,
                      height: Math.random() * 100 + 50,
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                    }}
              animate={{
                      y: [0, Math.random() * 100 - 50],
                      opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                      duration: Math.random() * 10 + 10,
                repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                    NSAT Preparation Platform
                  </Badge>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    <span className="text-foreground">Master the </span>
                    <span className="text-primary relative text-customBlue">
                      NSAT
                      <motion.div
                        className="absolute -bottom-2 left-0 h-2 bg-primary/30 w-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
                    <span className="text-foreground"> with Confidence</span>
                  </h1>
                  
                  <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-xl">
                    Personalized learning paths, expert-designed content, and advanced analytics to help you excel in your NSAT exam.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/auth">
                      <Button size="lg" className="bg-customBlue hover:bg-customBlue/90 text-white font-medium">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-primary/20 text-primary hover:bg-primary/10"
                      onClick={() => {
                        document.getElementById('features')?.scrollIntoView({ 
                          behavior: 'smooth',
                          block: 'start'
                        });
                      }}
                    >
                      Explore Features
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-8 flex items-center gap-6">
                    <div className="flex -space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden">
                          <img 
                            src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                            alt="User avatar" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">4.9/5</span> from over 2,000 students
                      </p>
                    </div>
                  </div>
            </motion.div>

            <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative"
                >
                  <div className="relative z-10 bg-card rounded-xl overflow-hidden border border-border shadow-xl">
                    <img 
                      src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop" 
                      alt="Student studying" 
                      className="w-full h-80 object-cover"
                    />
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">Comprehensive NSAT Preparation</h3>
                      <p className="text-muted-foreground mb-4">
                        Our platform covers all NSAT subjects with detailed study materials, practice tests, and personalized feedback.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <FileText className="h-4 w-4 text-blue-500" />
                          </div>
                          <span className="text-sm">Study Materials</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Target className="h-4 w-4 text-green-500" />
                          </div>
                          <span className="text-sm">Practice Tests</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <BrainCircuit className="h-4 w-4 text-purple-500" />
                          </div>
                          <span className="text-sm">AI Assistance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-amber-500" />
                          </div>
                          <span className="text-sm">Performance Tracking</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating elements */}
                    
                    
                    
                  </div>
                  
                  {/* Background decorative elements */}
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
          </motion.div>
              </div>
            </div>
          </section>
          
          <section id="features" className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                  Our Features
                </Badge>
                <h2 className="text-4xl font-bold mb-4">
                  <ScrollHighlightText>Why Choose Our Platform</ScrollHighlightText>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Discover the tools and resources that will help you excel in your NSAT preparation
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Personalized Learning Path",
                    description: "Customized study plans based on your strengths and weaknesses",
                    icon: Lightbulb,
                    color: "blue",
                    details: [
                      "Adaptive learning algorithms",
                      "Progress tracking and analytics",
                      "Personalized recommendations"
                    ]
                  },
                  {
                    title: "Expert-Designed Content",
                    description: "Comprehensive materials created by NSAT specialists",
                    icon: BookOpen,
                    color: "green",
                    details: [
                      "Up-to-date with latest exam patterns",
                      "Comprehensive coverage of all topics",
                      "Clear explanations and examples"
                    ]
                  },
                  {
                    title: "Interactive Practice Tests",
                    description: "Realistic mock exams with detailed performance analysis",
                    icon: FileText,
                    color: "purple",
                    details: [
                      "Timed tests simulating exam conditions",
                      "Detailed solution explanations",
                      "Performance analytics and insights"
                    ]
                  },
                  {
                    title: "Progress Tracking",
                    description: "Monitor your improvement with advanced analytics",
                    icon: Target,
                    color: "amber",
                    details: [
                      "Visual progress dashboards",
                      "Strength and weakness analysis",
                      "Improvement recommendations"
                    ]
                  },
                  {
                    title: "Community Support",
                    description: "Connect with peers and mentors for collaborative learning",
                    icon: Users,
                    color: "pink",
                    details: [
                      "Discussion forums for doubt clearing",
                      "Peer study groups",
                      "Expert mentorship opportunities"
                    ]
                  },
                  {
                    title: "24/7 Accessibility",
                    description: "Learn anytime, anywhere with our flexible platform",
                    icon: Clock,
                    color: "orange",
                    details: [
                      "Mobile and desktop compatibility",
                      "Offline access to downloaded materials",
                      "Cloud synchronization across devices"
                    ]
                }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="group"
                    onMouseEnter={() => setActiveFeature(index)}
                    onMouseLeave={() => setActiveFeature(null)}
                  >
                    <Card className={`h-full overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${
                      feature.color === 'blue' ? 'from-blue-500/5 to-blue-500/10 border-blue-500/10' :
                      feature.color === 'green' ? 'from-green-500/5 to-green-500/10 border-green-500/10' :
                      feature.color === 'purple' ? 'from-purple-500/5 to-purple-500/10 border-purple-500/10' :
                      feature.color === 'amber' ? 'from-amber-500/5 to-amber-500/10 border-amber-500/10' :
                      feature.color === 'pink' ? 'from-pink-500/5 to-pink-500/10 border-pink-500/10' :
                      'from-orange-500/5 to-orange-500/10 border-orange-500/10'
                    }`}>
                      <CardContent className="p-6 relative">
                        <motion.div
                          className={`absolute -right-8 -top-8 w-24 h-24 rounded-full ${
                            feature.color === 'blue' ? 'bg-blue-500/10' :
                            feature.color === 'green' ? 'bg-green-500/10' :
                            feature.color === 'purple' ? 'bg-purple-500/10' :
                            feature.color === 'amber' ? 'bg-amber-500/10' :
                            feature.color === 'pink' ? 'bg-pink-500/10' :
                            'bg-orange-500/10'
                          }`}
                    animate={{
                            scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                            ease: "easeInOut" 
                          }}
                        />
                        
                        <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${
                          feature.color === 'blue' ? 'bg-blue-500/10' :
                          feature.color === 'green' ? 'bg-green-500/10' :
                          feature.color === 'purple' ? 'bg-purple-500/10' :
                          feature.color === 'amber' ? 'bg-amber-500/10' :
                          feature.color === 'pink' ? 'bg-pink-500/10' :
                          'bg-orange-500/10'
                        }`}>
                          <feature.icon className={`h-6 w-6 ${
                            feature.color === 'blue' ? 'text-blue-500' :
                            feature.color === 'green' ? 'text-green-500' :
                            feature.color === 'purple' ? 'text-purple-500' :
                            feature.color === 'amber' ? 'text-amber-500' :
                            feature.color === 'pink' ? 'text-pink-500' :
                            'text-orange-500'
                          }`} />
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground mb-4">{feature.description}</p>
                        
                        <AnimatePresence>
                          {activeFeature === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-border/50"
                            >
                              <ul className="space-y-2">
                                {feature.details.map((detail, dIndex) => (
                                  <motion.li
                                    key={dIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: dIndex * 0.1 }}
                                    className="flex items-center gap-2 text-sm"
                                  >
                                    <div className={`h-1.5 w-1.5 rounded-full ${
                                      feature.color === 'blue' ? 'bg-blue-500' :
                                      feature.color === 'green' ? 'bg-green-500' :
                                      feature.color === 'purple' ? 'bg-purple-500' :
                                      feature.color === 'amber' ? 'bg-amber-500' :
                                      feature.color === 'pink' ? 'bg-pink-500' :
                                      'bg-orange-500'
                                    }`} />
                                    {detail}
                                  </motion.li>
                                ))}
                              </ul>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`mt-4 ${
                                  feature.color === 'blue' ? 'text-blue-500 hover:bg-blue-500/10' :
                                  feature.color === 'green' ? 'text-green-500 hover:bg-green-500/10' :
                                  feature.color === 'purple' ? 'text-purple-500 hover:bg-purple-500/10' :
                                  feature.color === 'amber' ? 'text-amber-500 hover:bg-amber-500/10' :
                                  feature.color === 'pink' ? 'text-pink-500 hover:bg-pink-500/10' :
                                  'text-orange-500 hover:bg-orange-500/10'
                                }`}
                                onClick={() => showNotification(`Learn more about ${feature.title}`)}
                              >
                                Learn more
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                  </motion.div>
                          )}
          </AnimatePresence>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                </div>
            </div>
          </section>

          <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
                <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold mb-4">
                  <ScrollHighlightText>What makes us different</ScrollHighlightText>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Expect nothing but the finest experience of preparation with our platform. We are committed to providing you with the best resources and support to help you succeed.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Interactive Learning",
                    description: "Engage with dynamic content that adapts to your learning style",
                    icon: MousePointer,
                    delay: 0.1
                  },
                  {
                    title: "Expert Guidance",
                    description: "Learn from instructors with years of experience in NSAT preparation",
                    icon: Lightbulb,
                    delay: 0.2
                  },
                  {
                    title: "Proven Results",
                    description: "Join thousands of successful students who achieved their goals",
                    icon: Award,
                    delay: 0.3
                  },
                  {
                    title: "Personalized Feedback",
                    description: "Receive detailed analysis of your performance and areas for improvement",
                    icon: MessageSquare,
                    delay: 0.4
                  },
                  {
                    title: "Comprehensive Coverage",
                    description: "All subjects and topics covered in depth with practice materials",
                    icon: BookOpen,
                    delay: 0.5
                  },
                  {
                    title: "Goal-Oriented Approach",
                    description: "Structured learning paths designed to maximize your score",
                    icon: Target,
                    delay: 0.6
                  }
                ].map((feature, index) => (
                    <motion.div
                      key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: feature.delay }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-card p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300"
                  >
                    <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    </motion.div>
                  ))}
              </div>
            </div>
          </section>
          
          <ParallaxSection depth={0.4}>
            <section className="py-20 bg-muted/30 relative overflow-hidden">
              <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:w-1/2"
                  >
                    <h2 className="text-4xl font-bold mb-4">
                      <ScrollHighlightText>Track Your Progress</ScrollHighlightText>
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Our advanced analytics help you understand your strengths and weaknesses,
                      allowing you to focus your efforts where they matter most.
                    </p>
                    
                    <div className="space-y-4">
                      {[
                        { label: "Detailed Performance Reports", icon: Trophy },
                        { label: "Personalized Study Plans", icon: Target },
                        { label: "Regular Mock Tests", icon: FileText }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="rounded-full w-8 h-8 bg-primary/20 flex items-center justify-center">
                            <item.icon className="h-4 w-4 text-primary" />
                          </div>
                          <span>{item.label}</span>
                </motion.div>
                      ))}
                    </div>

                <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="mt-8"
                >
                  <Link href="/auth">
                        <Button className="bg-primary/90 hover:bg-primary">
                          Start Tracking Now
                          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
                      </Link>
      </motion.div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:w-1/2"
                  >
                    <TiltCard className="w-full">
                      <div className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-xl">
                        <div className="p-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20">
                          <div className="bg-card p-4 rounded-t-lg flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <div className="ml-2 text-sm text-muted-foreground">Progress Dashboard</div>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="mb-6">
                            <h4 className="text-lg font-medium mb-2">Subject Performance</h4>
                            <div className="space-y-3">
                              {[
                                { subject: "Basic Mathematics", progress: 85 },
                                { subject: "Advanced Mathematics", progress: 72 },
                                { subject: "English", progress: 90 },
                                { subject: "Logical Reasoning", progress: 78 }
                              ].map((item, index) => (
                                <div key={index} className="space-y-1">
                                  <div className="flex justify-between text-sm">
                                    <span>{item.subject}</span>
                                    <span className="font-medium">{item.progress}%</span>
                                  </div>
                                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${item.progress}%` }}
                                      viewport={{ once: true }}
                                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                                      className="h-full bg-primary"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-medium mb-2">Recent Activity</h4>
                            <div className="space-y-2">
                              {[
                                { activity: "Completed Advanced Math Quiz", time: "2 hours ago" },
                                { activity: "Watched English Comprehension Tutorial", time: "Yesterday" },
                                { activity: "Solved 15 Practice Problems", time: "2 days ago" }
                              ].map((item, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 10 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true }}
                                  transition={{ delay: 0.8 + index * 0.1 }}
                                  className="flex justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                  <span className="text-sm">{item.activity}</span>
                                  <span className="text-xs text-muted-foreground">{item.time}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                </div>
              </div>
            </section>
          </ParallaxSection>
          
          {/* Campus Section */}
          <ParallaxSection depth={0.3}>
            <section className="py-20 relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
              
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
                    Our Locations
                  </Badge>
                  <h2 className="text-4xl font-bold mb-4">
                    <ScrollHighlightText>NST Campuses</ScrollHighlightText>
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Experience our state-of-the-art facilities designed for optimal learning
                  </p>
                </motion.div>
                
                {/* Add an interactive map with campus locations */}
                <div className="mb-16 relative h-[400px] rounded-xl overflow-hidden shadow-xl">
                <iframe 
                    src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3490.1523393397647!2d77.0874287758143!3d28.982856468085476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390db1e3451de103%3A0xf3b49ff0baac646f!2sRishihood%20University!5e0!3m2!1sen!2sin!4v1744658435505!5m2!1sen!2sin"
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 p-4 bg-background/80 backdrop-blur-md rounded-lg border border-border/50">
                    <h3 className="text-lg font-semibold mb-2">NST Campus Locations</h3>
                    <p className="text-sm text-muted-foreground">
                      Visit NST campuses in Sonipat and Pune to experience it firsthand.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                        <MapPin className="h-3 w-3 mr-1" />
                        Sonipat
                      </Badge>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <MapPin className="h-3 w-3 mr-1" />
                        Pune
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Campus cards with enhanced interactivity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    {
                      city: "Sonipat",
                      address: "NST, RU Campus, Sonipat, Haryana",
                      image: "https://cdn.prod.website-files.com/661123dea3c6c677a806b8b2/662a7109368cae0dea68859e_64956528607323070bb62108_NST%20Open%20Graph.webp",
                      features: ["Modern Classrooms", "Digital Library", "Discussion Rooms"]
                    },
                    {
                      city: "Pune",
                      address: "NST ADYPU Campus, Pune, Maharashtra",
                      image: "https://pimwp.s3-accelerate.amazonaws.com/2024/06/1Xs6Cnys-Untitled-design-18.jpg",
                      features: ["24/7 Study Center", "Mock Test Facility", "Counseling Services"]
                    }
                  ].map((campus, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <TiltCard className="h-full">
                        <Card className="h-full overflow-hidden border-none shadow-lg">
                          <div className="relative h-64 overflow-hidden">
                            <img 
                              src={campus.image} 
                              alt={campus.city} 
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <h3 className="text-xl font-bold">{campus.city}</h3>
                              </div>
                              <p className="text-sm text-white/80">{campus.address}</p>
                            </div>
                          </div>
                        </Card>
                      </TiltCard>
                </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </ParallaxSection>

          {/* Founders Section */}
          <ParallaxSection depth={0.2}>
            <section className="py-20 bg-muted/30 relative overflow-hidden">
              <div className="container mx-auto px-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl font-bold mb-4">
                    <ScrollHighlightText>Meet the Team</ScrollHighlightText>
                  </h2>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      name: "Chiranjeev Agrawal",
                      role: "CEO",
                      bio: "Visionary leader with extensive experience in education technology and NSAT preparation.",
                      image: "/ceo.png",
                      achievements: ["Education Innovator", "Tech Entrepreneur",]
                    },
                    {
                      name: "Sahil Khan",
                      role: "Managing Director",
                      bio: "Strategic leader focused on expanding educational access and improving student outcomes.",
                      image: "/md.png",
                      achievements: ["Education Management", "Operational Excellence"]
                    },
                    {
                      name: "Aditya Prakash",
                      role: "CTO",
                      bio: "Technology expert specializing in educational platforms and adaptive learning systems.",
                      image: "/cto.png",
                      achievements: ["Full-Stack Developer", "AI Learning Systems", "EdTech Innovation"]
                    }
                  ].map((founder, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-card rounded-xl overflow-hidden border border-border/50 shadow-lg"
                    >
                      <div className="relative h-64 overflow-hidden">
                        <img 
                          src={founder.image} 
                          alt={founder.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-xl font-bold">{founder.name}</h3>
                          <p className="text-sm text-primary">{founder.role}</p>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <p className="text-muted-foreground mb-4">{founder.bio}</p>
                        
                        <div className="space-y-2">
                          {founder.achievements.map((achievement, aIndex) => (
                            <div key={aIndex} className="flex items-center gap-2 text-sm">
                              <div className="flex-shrink-0">
                                {aIndex === 0 ? (
                                  <School className="h-4 w-4 text-primary" />
                                ) : aIndex === 1 ? (
                                  <Briefcase className="h-4 w-4 text-primary" />
                                ) : (
                                  <Users className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <span>{achievement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
              </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </ParallaxSection>
          
          {/* FAQ Section */}
          <section className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold mb-4">
                  <ScrollHighlightText>Frequently Asked Questions</ScrollHighlightText>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Find answers to common questions about our NSAT preparation program
                </p>
              </motion.div>
              
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="space-y-4">
                  {[
                    {
                      question: "How is REstart LMS different from other NSAT preparation platforms?",
                      answer: "REstart LMS offers a comprehensive approach with personalized learning paths, advanced analytics, expert-designed content, and interactive practice sessions. Our platform adapts to your learning style and focuses on your specific areas of improvement."
                    },
                    {
                      question: "How long does it take to prepare for the NSAT exam?",
                      answer: "The preparation time varies based on your current knowledge level and target score. On average, students spend 3-6 months preparing for the NSAT exam. Our platform provides a personalized study plan that optimizes your preparation time."
                    },
                    {
                      question: "Do you offer live classes or is it all self-paced?",
                      answer: "We offer a hybrid model. Our core curriculum is available for self-paced learning, but we also conduct regular live sessions for doubt clearing, advanced topics, and test strategies. Premium subscribers get access to one-on-one mentoring sessions."
                    },
                    {
                      question: "How accurate are your mock tests compared to the actual NSAT?",
                      answer: "Our mock tests are designed by former NSAT examiners and experts who understand the exam pattern thoroughly. We regularly update our question bank based on the latest exam trends and have a 95% pattern match with the actual NSAT exam."
                    },
                    {
                      question: "Can I access the platform on mobile devices?",
                      answer: "Yes, REstart LMS is fully responsive and works seamlessly on smartphones and tablets. We also offer dedicated apps for iOS and Android devices that allow offline access to downloaded study materials."
                    },
                    {
                      question: "What if I need help or have questions during my preparation?",
                      answer: "We provide multiple support channels including 24/7 chat support, regular doubt-clearing sessions, community forums, and email support. Premium users also get direct access to subject matter experts for personalized guidance."
                    }
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AccordionItem value={`item-${index}`} className="border border-border/50 rounded-lg overflow-hidden">
                        <AccordionTrigger className="px-4 py-4 hover:bg-muted/50 transition-colors">
                          <span className="text-left font-medium">{faq.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2 text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 text-center"
                >
                  <p className="text-muted-foreground mb-4">Still have questions? Contact our support team</p>
                  <Link href="/support">
                    <Button className="bg-primary/90 hover:bg-primary">
                      Contact Support
                      <MessageSquare className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
        
        {/* Floating chat button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Button
            onClick={() => setActiveChatbot(!activeChatbot)}
            className="w-14 h-14 rounded-full bg-customBlue shadow-lg hover:shadow-xl hover:bg-customBlue/90 transition-all"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </motion.div>
        
        {/* Chatbot interface */}
        <AnimatePresence>
          {activeChatbot && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-24 right-6 w-80 h-96 bg-card rounded-lg shadow-xl border border-border z-40 overflow-hidden flex flex-col"
            >
              <div className="p-3 bg-primary/10 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <h3 className="font-medium">NSAT Assistant</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setActiveChatbot(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.sender === 'bot'
                          ? 'bg-muted text-foreground'
                          : 'bg-customBlue text-primary-foreground'
                      }`}
                    >
                      {msg.message}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="p-3 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about NSAT prep..."
                    className="flex-1 bg-muted/50 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-customBlue hover:bg-customBlue/90"
                    size="icon"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
