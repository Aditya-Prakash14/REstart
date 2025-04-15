import { useAuth } from "@/hooks/use-auth";
import { useProgress } from "@/hooks/use-progress";
import { Redirect, Link, useLocation } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FileText, GraduationCap, BookOpen, BrainCircuit, Award, Target,
  ChevronRight, Clock, Copy, Check, CreditCard, ScrollText,
  LayoutDashboard, BookOpenCheck, LogOut, Menu, X,
  Bell, User, Search, Calendar, Network, Code, Users, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { subjects } from "@/shared/schema";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

const icons = {
  "Basic Mathematics": FileText,
  "Advanced Mathematics": GraduationCap,
  "English": BookOpen,
  "Logical Reasoning": BrainCircuit,
} as const;

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Subjects", icon: BookOpenCheck, href: "/subjects" },
  { name: "Certificates", icon: Award, href: "/certificates" },
  { name: "Mock Tests", icon: Target, href: "/full-mock-test" },
  { name: "Exam Dates", icon: Calendar, href: "/exam-dates" },
  { name: "Support", icon: MessageSquare, href: "/support" },
];

const interviewSidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Interview Prep", icon: BrainCircuit, href: "/interview-prep" },
  { name: "Mock Interviews", icon: Target, href: "/mock-interviews" },
  { name: "Resources", icon: BookOpen, href: "/interview-resources" },
  { name: "Schedule", icon: Calendar, href: "/interview-schedule" },
];

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const { progress } = useProgress();
  const [copied, setCopied] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  // User data verification and personalization
  const userData = {
    name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student',
    email: user?.email || '',
    needsInterviewPrep: user?.user_metadata?.needs_interview_prep || false,
    examAttempt: user?.user_metadata?.exam_attempt || null,
    referralCode: user?.user_metadata?.referral_code || '',
    lastLogin: user?.last_sign_in_at || new Date().toISOString(),
    studyStreak: user?.user_metadata?.study_streak || 0,
    totalStudyTime: user?.user_metadata?.total_study_time || 0,
    completedTopics: user?.user_metadata?.completed_topics || [],
    isNsatRegistered: user?.user_metadata?.is_nsat_registered || false,
    interviewPrepProgress: user?.user_metadata?.interview_prep_progress || {
      technical: 0,
      systemDesign: 0,
      dsa: 0,
      softSkills: 0,
      mockInterviews: 0
    }
  };

  const currentSidebarItems = userData.needsInterviewPrep ? interviewSidebarItems : sidebarItems;

  // Handle sidebar for mobile view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCopyLink = async () => {
    const referralLink = "https://www.newtonschool.co/newton-school-of-technology-nst/apply-referral?utm_source=referral&utm_medium=santoshpuvvada13&utm_campaign=btech-computer-science-portal-referral";
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/auth" />;
  }

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!progress) return 0;
    
    let totalCompleted = 0;
    let totalPossible = 0;
    
    subjects.forEach(subject => {
      const subjectProgress = progress[subject];
      if (subjectProgress) {
        totalCompleted += subjectProgress.completedMaterials.length;
        totalPossible += 10; // Assuming 10 materials per subject
      }
    });
    
    return totalPossible > 0 ? (totalCompleted / totalPossible) * 100 : 0;
  };

  // Calculate average score across all subjects
  const calculateAverageScore = () => {
    if (!progress) return 0;
    
    let totalScore = 0;
    let totalSubjectsWithTests = 0;
    
    subjects.forEach(subject => {
      const subjectProgress = progress[subject];
      if (subjectProgress && subjectProgress.completedTests > 0) {
        totalScore += subjectProgress.totalScore / subjectProgress.completedTests;
        totalSubjectsWithTests++;
      }
    });
    
    return totalSubjectsWithTests > 0 ? totalScore / totalSubjectsWithTests : 0;
  };

  const overallProgress = calculateOverallProgress();
  const averageScore = calculateAverageScore();

  return (
    <>
      <div className="min-h-screen bg-background flex flex-col lg:flex-row">
        {/* Mobile Header */}
        <header className="lg:hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <img
                src="https://media-hosting.imagekit.io//e60a0a3fac904c2a/WhatsApp_Image_2025-01-26_at_20.14.19-removebg-preview%20(3).png?Expires=1834242508&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=nVFdXSeeo14FtjV6G~ppAgawYVuWM5ZBFu3VmE~6EUH79Qe3QJ479US4D8pggGisa~3D5nKS0ICnJFBkwZyIV8iDLMX6LMTxPnoH9OkOnaYACbTTPgISyWVxr33MreB2LGvj0ePD5wi-weKMOaF-jYY9nr0AXGiYtUbOpCvRgws7RsDMKcTtO8xA~HP9Jim90PxyNhfp1842BWY~GDnlguAKH87V-Q-5RB8JJ6q~-wO9gX-ScIP26GqRVmXMQPmo4uuA6JH4fVvc1MjUKbBHtQBZ-3xFP0pAJax3I2lVLNX1EP2kHTpJuUTwwnLBCnkMNwst3BinXaixwg6I~kdkLw__"
                alt="REstart LMS"
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut && signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:relative fixed inset-y-0 left-0 z-40 w-64 lg:w-72 bg-background border-r shadow-sm pt-5 pb-2 flex flex-col"
            >
              <div className="px-6 mb-6 flex items-center justify-between">
                <img
                  src="https://media-hosting.imagekit.io//e60a0a3fac904c2a/WhatsApp_Image_2025-01-26_at_20.14.19-removebg-preview%20(3).png?Expires=1834242508&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=nVFdXSeeo14FtjV6G~ppAgawYVuWM5ZBFu3VmE~6EUH79Qe3QJ479US4D8pggGisa~3D5nKS0ICnJFBkwZyIV8iDLMX6LMTxPnoH9OkOnaYACbTTPgISyWVxr33MreB2LGvj0ePD5wi-weKMOaF-jYY9nr0AXGiYtUbOpCvRgws7RsDMKcTtO8xA~HP9Jim90PxyNhfp1842BWY~GDnlguAKH87V-Q-5RB8JJ6q~-wO9gX-ScIP26GqRVmXMQPmo4uuA6JH4fVvc1MjUKbBHtQBZ-3xFP0pAJax3I2lVLNX1EP2kHTpJuUTwwnLBCnkMNwst3BinXaixwg6I~kdkLw__"
                  alt="REstart LMS"
                  className="h-8 w-auto"
                />
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="px-3 mb-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-background pl-8 pr-4 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="px-3 space-y-1 flex-1">
                {currentSidebarItems.map((item, index) => {
                  const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
                  const ItemIcon = item.icon;
                  
                  return (
                    <Link href={item.href} key={index}>
                      <div 
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <ItemIcon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-5 rounded-full bg-primary"></div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
              
              <div className="mt-auto px-3">
                <Card className="bg-primary/5 border-primary/10 overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar>
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="font-medium truncate">{user.user_metadata?.full_name || user.email}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => signOut && signOut()}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Page header */}
            <header className="hidden lg:flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {userData.name}</h1>
                <p className="text-muted-foreground">
                  {userData.needsInterviewPrep 
                    ? "Continue your interview preparation journey" 
                    : "Track your progress and prepare for the NSAT exam"}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last login: {new Date(userData.lastLogin).toLocaleDateString()}</span>
                  {userData.studyStreak > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-green-500">🔥 {userData.studyStreak} day streak</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-60 bg-background pl-8 pr-4 py-2"
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 cursor-pointer">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut && signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {/* Mobile welcome section */}
            <div className="lg:hidden mb-6">
              <h1 className="text-xl font-bold">Welcome back, {userData.name}</h1>
              <p className="text-sm text-muted-foreground">
                {userData.needsInterviewPrep 
                  ? "Continue your interview preparation journey" 
                  : "Track your progress and prepare for the NSAT exam"}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Last login: {new Date(userData.lastLogin).toLocaleDateString()}</span>
                {userData.studyStreak > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-green-500">🔥 {userData.studyStreak} day streak</span>
                  </>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {userData.needsInterviewPrep ? (
                <>
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Mock Interviews</h3>
                          <p className="text-2xl font-bold">{userData.interviewPrepProgress.mockInterviews}/10</p>
                        </div>
                      </div>
                      <Progress value={userData.interviewPrepProgress.mockInterviews * 10} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/10">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Overall Progress</h3>
                          <p className="text-2xl font-bold">
                            {Math.round(
                              (userData.interviewPrepProgress.technical + 
                               userData.interviewPrepProgress.systemDesign + 
                               userData.interviewPrepProgress.dsa + 
                               userData.interviewPrepProgress.softSkills) / 4
                            )}%
                          </p>
                        </div>
                      </div>
                      <Progress 
                        value={
                          (userData.interviewPrepProgress.technical + 
                           userData.interviewPrepProgress.systemDesign + 
                           userData.interviewPrepProgress.dsa + 
                           userData.interviewPrepProgress.softSkills) / 4
                        } 
                        className="h-2 bg-green-500/20" 
                      />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/10">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Study Time</h3>
                          <p className="text-2xl font-bold">{Math.round(userData.totalStudyTime / 60)}h</p>
                        </div>
                      </div>
                      <Progress value={Math.min((userData.totalStudyTime / 100) * 100, 100)} className="h-2 bg-orange-500/20" />
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/10">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Target className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Overall Progress</h3>
                          <p className="text-2xl font-bold">{Math.round(overallProgress)}%</p>
                        </div>
                      </div>
                      <Progress value={overallProgress} className="h-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-green-500/10">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Award className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Average Score</h3>
                          <p className="text-2xl font-bold">{Math.round(averageScore)}%</p>
                        </div>
                      </div>
                      <Progress value={averageScore} className="h-2 bg-green-500/20" />
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500/5 to-orange-500/10 border-orange-500/10">
                    <CardContent className="pt-5 pb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm text-muted-foreground">Study Time</h3>
                          <p className="text-2xl font-bold">47h</p>
                        </div>
                      </div>
                      <Progress value={70} className="h-2 bg-orange-500/20" />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Referral Section - Only show if user is not registered for NSAT */}
            {!userData.isNsatRegistered && (
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 mb-8 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-1">
                      <h2 className="text-xl font-bold text-blue-600 mb-2">Get a waiver on your NSAT exam of flat INR 300!</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Share our referral link with your friends joining the NSAT preparation program and get a waiver on the NSAT exam (worth ₹900)!
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a 
                          href="https://www.newtonschool.co/newton-school-of-technology-nst/apply-referral?utm_source=referral&utm_medium=santoshpuvvada13&utm_campaign=btech-computer-science-portal-referral"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto"
                        >
                          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            Use Referral Link <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </a>
                        <Button 
                          variant="outline" 
                          className="w-full sm:w-auto" 
                          onClick={handleCopyLink}
                        >
                          {copied ? (
                            <>
                              <Check className="mr-2 h-4 w-4" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" /> Copy Referral Link
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center justify-center bg-blue-100 p-6">
                      <img 
                        src="/referral-illustration.svg" 
                        alt="Refer a friend"
                        className="w-40 h-40 object-contain"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Content Tabs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {userData.needsInterviewPrep ? (
                <>
                  {/* Interview Prep Section */}
                  <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Interview Preparation</h2>
                      <Link href="/interview-prep">
                        <Button variant="ghost" size="sm">
                          View All <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { 
                          title: "Technical Interview", 
                          icon: BrainCircuit, 
                          progress: userData.interviewPrepProgress.technical,
                          topics: userData.completedTopics.filter((t: string) => t.startsWith('technical'))
                        },
                        { 
                          title: "System Design", 
                          icon: Network, 
                          progress: userData.interviewPrepProgress.systemDesign,
                          topics: userData.completedTopics.filter((t: string) => t.startsWith('system'))
                        },
                        { 
                          title: "DSA Practice", 
                          icon: Code, 
                          progress: userData.interviewPrepProgress.dsa,
                          topics: userData.completedTopics.filter((t: string) => t.startsWith('dsa'))
                        },
                        { 
                          title: "Soft Skills", 
                          icon: Users, 
                          progress: userData.interviewPrepProgress.softSkills,
                          topics: userData.completedTopics.filter((t: string) => t.startsWith('soft'))
                        },
                      ].map((item, index) => (
                        <Link href={`/interview-prep/${item.title.toLowerCase().replace(/\s+/g, '-')}`} key={index}>
                          <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full">
                            <CardContent className="p-5">
                              <div className="flex items-start gap-4 mb-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <item.icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold mb-1 truncate">{item.title}</h3>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Award className="h-3 w-3" />
                                    <span>{item.progress}% complete</span>
                                  </div>
                                  {item.topics.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {item.topics.slice(0, 3).map((topic: string, i: number) => (
                                        <span key={i} className="px-2 py-0.5 rounded-full bg-primary/10 text-xs text-primary">
                                          {topic}
                                        </span>
                                      ))}
                                      {item.topics.length > 3 && (
                                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-xs text-primary">
                                          +{item.topics.length - 3} more
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Progress value={item.progress} className="h-1.5" />
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Mock Interviews */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Upcoming Sessions</h2>
                    <Card className="border-2 border-blue-600 shadow-md relative overflow-hidden">
                      <CardContent className="pt-5">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Technical Interview</h3>
                            <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Data Structures & Algorithms</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>System Design Basics</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Join Session</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </>
              ) : (
                <>
                  {/* Subjects section - 2/3 width on large screens */}
                  <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Your Subjects</h2>
                      <Link href="/subjects">
                        <Button variant="ghost" size="sm">
                          View All <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subjects.slice(0, 4).map((subject, index) => {
                        const subjectProgress = progress?.[subject] || {
                          completedTests: 0,
                          totalScore: 0,
                          completedMaterials: [],
                        };

                        const Icon = icons[subject];
                        const encodedSubject = encodeURIComponent(subject);

                        return (
                          <Link href={`/subjects/${encodedSubject}`} key={index}>
                            <Card className="hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer h-full">
                              <CardContent className="p-5">
                                <div className="flex items-start gap-4 mb-4">
                                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Icon className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1 truncate">{subject}</h3>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Award className="h-3 w-3" />
                                      <span>{subjectProgress.completedTests} tests completed</span>
                                    </div>
                                  </div>
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </div>

                                <div className="space-y-2">
                                  <div>
                                    <div className="flex justify-between mb-1 text-xs">
                                      <span className="text-muted-foreground">Progress</span>
                                      <span className="font-medium">
                                        {subjectProgress.completedMaterials.length}/10
                                      </span>
                                    </div>
                                    <Progress
                                      value={subjectProgress.completedMaterials.length * 10}
                                      className="h-1.5"
                                    />
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">
                                      Average Score
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                        subjectProgress.completedTests
                                          ? 'bg-green-500/10 text-green-500'
                                          : 'bg-muted text-muted-foreground'
                                      }`}>
                                        {subjectProgress.completedTests
                                          ? `${Math.round(
                                              subjectProgress.totalScore / subjectProgress.completedTests
                                            )}%`
                                          : 'No tests'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Packages Highlight - 1/3 width on large screens */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Popular Packages</h2>
                    <div className="space-y-4">
                      <Card className="border-2 border-blue-600 shadow-md relative overflow-hidden">
                        <div className="absolute -right-10 top-6 w-40 transform rotate-45 bg-blue-600 text-white text-center py-1 text-xs font-medium">
                          Popular
                        </div>
                        <CardContent className="pt-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                              <Award className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Premium Package</h3>
                              <div className="flex flex-col">
                                <p className="text-lg font-bold">₹200 <span className="text-xs font-normal text-muted-foreground">with referral</span></p>
                                <p className="text-xs text-muted-foreground line-through">₹1999 regular price</p>
                              </div>
                            </div>
                          </div>
                          <ul className="space-y-1 mb-4 text-sm">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>1 NSAT exam attempt</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>2 live doubt sessions per week</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>Interview prep session</span>
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Link href="/checkout/premium">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">Choose Plan</Button>
                          </Link>
                        </CardFooter>
                      </Card>

                      <Card className="border-2 border-purple-600 shadow-md relative overflow-hidden">
                        <div className="absolute -right-10 top-6 w-40 transform rotate-45 bg-purple-600 text-white text-center py-1 text-xs font-medium">
                          Complete
                        </div>
                        <CardContent className="pt-5">
                          <div className="flex items-start gap-3 mb-4">
                            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                              <Target className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">Ultimate Package</h3>
                              <div className="flex flex-col">
                                <p className="text-lg font-bold">₹500 <span className="text-xs font-normal text-muted-foreground">with referral</span></p>
                                <p className="text-xs text-muted-foreground line-through">₹3499 regular price</p>
                              </div>
                            </div>
                          </div>
                          <ul className="space-y-1 mb-4 text-sm">
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>1 NSAT exam attempt</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>All subject chapterwise mock tests</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>Two live doubt sessions per week</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>24-hour doubt solution guarantee</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>Interview prep session</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>Google Summer of Code preparation</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>Tech career guidance & mentorship</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>Free sessions on new technologies</span>
                            </li>
                          </ul>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <Link href="/checkout/ultimate">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">Choose Plan</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mock Test CTA */}
            <Card className="bg-gradient-to-br from-violet-500/5 to-violet-500/10 border-violet-500/20 mb-8">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <Target className="h-6 w-6 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Getting the hang of it, try yourself out?</h3>
                      <p className="text-sm text-muted-foreground">Take a full mock test to assess your preparation level for the NSAT exam.</p>
                    </div>
                  </div>
                  <Link href="/full-mock-test">
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white w-full md:w-auto">
                      Start Mock Test
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Certificates and Mock Tests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

              {/* Interview Resources */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">Interview Resources</h3>
                    </div>
                    <Link href="/interview-resources">
                      <Button variant="ghost" size="sm">
                        View All
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium mb-1">Technical Interview Guide</h4>
                          <p className="text-xs text-muted-foreground">Basic Intro to Coding and Computer Science</p>
                        </div>
                        <div className="bg-white rounded-full h-9 w-9 flex items-center justify-center border border-blue-200">
                          <p className="text-xs font-bold text-blue-600">{userData.interviewPrepProgress.technical}%</p>
                        </div>
                      </div>
                      <Progress value={userData.interviewPrepProgress.technical} className="h-1.5 mb-2" />
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                          {userData.interviewPrepProgress.technical < 100 ? `${Math.round(100 - userData.interviewPrepProgress.technical)}% more to unlock` : 'Resource unlocked!'}
                        </p>
                        <Link href="/interview-resources/technical">
                          <Button 
                            variant={userData.interviewPrepProgress.technical < 100 ? "outline" : "default"} 
                            size="sm"
                            disabled={userData.interviewPrepProgress.technical < 100}
                          >
                            {userData.interviewPrepProgress.technical < 100 ? 'Locked' : 'View'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium mb-1">Soft Skills Guide</h4>
                          <p className="text-xs text-muted-foreground">Complete communication and presentation materials</p>
                        </div>
                        <div className="bg-white rounded-full h-9 w-9 flex items-center justify-center border border-blue-200">
                          <p className="text-xs font-bold text-blue-600">{userData.interviewPrepProgress.softSkills}%</p>
                        </div>
                      </div>
                      <Progress value={userData.interviewPrepProgress.softSkills} className="h-1.5 mb-2" />
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                          {userData.interviewPrepProgress.softSkills < 100 ? `${Math.round(100 - userData.interviewPrepProgress.softSkills)}% more to unlock` : 'Resource unlocked!'}
                        </p>
                        <Link href="/interview-resources/soft-skills">
                          <Button 
                            variant={userData.interviewPrepProgress.softSkills < 100 ? "outline" : "default"} 
                            size="sm"
                            disabled={userData.interviewPrepProgress.softSkills < 100}
                          >
                            {userData.interviewPrepProgress.softSkills < 100 ? 'Locked' : 'View'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Upcoming Exam */}
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/20 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold">Upcoming NSAT Exam</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-center px-3 py-2 bg-primary/5 rounded-lg">
                        <p className="text-xs text-muted-foreground">MAY</p>
                        <p className="text-2xl font-bold">15</p>
                        <p className="text-xs text-muted-foreground">2023</p>
                      </div>
                      <div className="px-3">
                        <h4 className="font-medium">NSAT Entrance Examination</h4>
                        <p className="text-sm text-muted-foreground">Online • 10:00 AM - 1:00 PM</p>
                      </div>
                      <div>
                        <Button size="sm">Details</Button>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border p-4 mb-4">
                      <h4 className="font-medium mb-2">Exam Registration Status</h4>
                      <div className="flex gap-2 mb-2">
                        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: '33%' }}></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Register</span>
                        <span className="font-medium text-green-500">Completed</span>
                        <span>Payment</span>
                        <span>ID Card</span>
                      </div>
                    </div>
                    
                    <Link href="/checkout">
                      <Button className="w-full">Complete Registration</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Cards */}
            {userData.needsInterviewPrep ? (
              <>
                <Card className="bg-gradient-to-br from-violet-500/5 to-violet-500/10 border-violet-500/20 mb-8">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-violet-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Ready for a Mock Interview?</h3>
                          <p className="text-sm text-muted-foreground">Practice with our expert interviewers and get detailed feedback.</p>
                        </div>
                      </div>
                      <Link href="/mock-interviews">
                        <Button className="bg-violet-600 hover:bg-violet-700 text-white w-full md:w-auto">
                          Schedule Interview
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <ScrollText className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Your Certificates</h3>
                          <p className="text-sm text-muted-foreground">View your interview preparation certificates and achievements.</p>
                        </div>
                      </div>
                      <Link href="/certificates">
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full md:w-auto">
                          View Certificates
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                <Card className="bg-gradient-to-br from-violet-500/5 to-violet-500/10 border-violet-500/20 mb-8">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center">
                          <Users className="h-6 w-6 text-violet-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Ready for a Mock Interview?</h3>
                          <p className="text-sm text-muted-foreground">Practice with our expert interviewers and get detailed feedback.</p>
                        </div>
                      </div>
                      <Link href="/mock-interviews">
                        <Button className="bg-violet-600 hover:bg-violet-700 text-white w-full md:w-auto">
                          Schedule Interview
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-500/5 to-amber-500/10 border-amber-500/20">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center">
                          <ScrollText className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">Your Certificates</h3>
                          <p className="text-sm text-muted-foreground">View your interview preparation certificates and achievements.</p>
                        </div>
                      </div>
                      <Link href="/certificates">
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white w-full md:w-auto">
                          View Certificates
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </main>

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
}