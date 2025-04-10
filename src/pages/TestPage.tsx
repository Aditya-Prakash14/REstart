import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TestTimer } from "@/components/test/test-timer";
import { QuestionCard } from "@/components/test/question-card";
import { QuestionNavigator } from "@/components/test/question-navigator";
import { TestInstructions } from "@/components/test/test-instructions";
import { generateTest, calculateScore } from "@/lib/test-generator";
import { useProgress } from "@/hooks/use-progress";
import { Subject, subjects } from "@/shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Flag, Check } from "lucide-react";

export default function TestPage() {
  const [, setLocation] = useLocation();
  const { subject: encodedSubject } = useParams<{ subject: string }>();
  const subject = decodeURIComponent(encodedSubject) as Subject;
  const { updateProgress } = useProgress();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [test, setTest] = useState<Awaited<ReturnType<typeof generateTest>> | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);

  // Validate subject and redirect if invalid
  useEffect(() => {
    if (!subjects.includes(subject)) {
      console.error(`Invalid subject: "${subject}"`);
      setError(`Invalid subject: "${subject}". Please navigate to a valid subject page.`);
      setLoading(false);
    }
  }, [subject, setLocation]);

  useEffect(() => {
    async function loadTest() {
      try {
        console.log(`Loading test for subject: ${subject}`);
        setLoading(true);
        const generatedTest = await generateTest(subject);
        console.log(`Test loaded successfully for ${subject} with ${generatedTest.questions.length} questions`);
        setTest(generatedTest);
        setLoading(false);
      } catch (err) {
        console.error(`Error loading test for ${subject}:`, err);
        setError(err instanceof Error ? err.message : `Failed to load test for ${subject}`);
        setLoading(false);
      }
    }
    if (subjects.includes(subject)) {
      loadTest();
    }
  }, [subject]);

  // Monitor fullscreen status
  useEffect(() => {
    const handleFullScreenChange = () => {
      // We track this but don't use it directly - it's for potential future features
      const isInFullscreen = !!document.fullscreenElement;
      console.log("Fullscreen status changed:", isInFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const startTest = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen().catch(err => {
          console.warn('Failed to enter fullscreen:', err);
          // Continue test even if fullscreen fails
        });
      }
      setTestStarted(true);
    } catch (err) {
      console.error("Could not enter fullscreen mode:", err);
      // Allow the test to start even if fullscreen fails
      setTestStarted(true);
    }
  };

  const handleAnswerSelect = (questionId: string, answerId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
  };

  const handleMarkQuestion = () => {
    setMarkedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion)) {
        newSet.delete(currentQuestion);
      } else {
        newSet.add(currentQuestion);
      }
      return newSet;
    });
  };

  const handleSubmitTest = async () => {
    if (!test) return;
    
    const result = calculateScore(test, answers);
    setShowResults(true);

    try {
      await updateProgress(subject, {
        completedTests: 1,
        totalScore: (result.score / result.total) * 100,
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
      // We still show results even if progress update fails
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(err => {
        console.warn('Failed to exit fullscreen:', err);
      });
    }
  };

  const handleTimeUp = () => {
    handleSubmitTest();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-3 text-muted-foreground">Loading test for {subject}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-semibold text-red-500 mb-4">Error Loading Test</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => setLocation(`/subjects/${encodedSubject}`)}>
            Return to Subject Page
          </Button>
        </Card>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md">
          <h2 className="text-xl font-semibold text-amber-500 mb-4">Test Not Available</h2>
          <p className="text-muted-foreground mb-6">The test for {subject} could not be loaded. Please try again later.</p>
          <Button onClick={() => setLocation(`/subjects/${encodedSubject}`)}>
            Return to Subject Page
          </Button>
        </Card>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <TestInstructions
        duration={test?.duration || 60}
        totalQuestions={test?.questions.length || 0}
        onStart={startTest}
        subject={subject}
      />
    );
  }

  if (showResults) {
    const result = calculateScore(test, answers);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8 max-w-4xl"
      >
        <Card className="p-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Test Completed!</h2>
            <p className="text-muted-foreground">
              You scored {result.score} out of {result.total} ({Math.round((result.score / result.total) * 100)}%)
            </p>
          </div>

          <div className="space-y-8">
            {result.incorrectQuestions.map(({ question, selectedAnswer }) => (
              <QuestionCard
                key={question.id}
                question={question}
                selectedAnswer={selectedAnswer}
                correctAnswer={question.correctAnswer}
                showExplanation
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button onClick={() => setLocation(`/subjects/${encodedSubject}`)}>
              Return to Subject Page
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Get array of question indices that have been answered
  const answeredIndices = Object.keys(answers).map(id => 
    test.questions.findIndex(q => q.id === id)
  ).filter(index => index !== -1);

  // Convert Set to Array for marked questions
  const markedIndices = Array.from(markedQuestions);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <TestTimer duration={test.duration} onTimeUp={handleTimeUp} />
              <Button
                variant="outline"
                onClick={handleMarkQuestion}
                className="gap-2"
              >
                <Flag className="h-4 w-4" />
                {markedQuestions.has(currentQuestion) ? "Unmark" : "Mark"} for Review
              </Button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <QuestionCard
                  question={test.questions[currentQuestion]}
                  selectedAnswer={answers[test.questions[currentQuestion].id]}
                  onAnswerSelect={(answerId) =>
                    handleAnswerSelect(test.questions[currentQuestion].id, answerId)
                  }
                />
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestion === 0}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              {currentQuestion === test.questions.length - 1 ? (
                <Button onClick={handleSubmitTest} className="gap-2">
                  <Check className="h-4 w-4" />
                  Submit Test
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestion((prev) =>
                      Math.min(test.questions.length - 1, prev + 1)
                    )
                  }
                  className="gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Navigation</h3>
              <QuestionNavigator
                totalQuestions={test.questions.length}
                currentQuestion={currentQuestion}
                answeredQuestions={answeredIndices}
                markedQuestions={markedIndices}
                onQuestionClick={setCurrentQuestion}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-3">Summary</h3>
              <div className="bg-muted p-4 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Questions</span>
                  <span className="font-medium">{test.questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Answered</span>
                  <span className="font-medium">{Object.keys(answers).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Marked for Review</span>
                  <span className="font-medium">{markedQuestions.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Unanswered</span>
                  <span className="font-medium">
                    {test.questions.length - Object.keys(answers).length}
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={handleSubmitTest} className="w-full gap-2">
              <Check className="h-4 w-4" />
              Submit Test
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}