import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, User as UserIcon } from "lucide-react";
import ProgressBar from "../components/ui/ProgressBar";
import OptionCard from "../components/questionnaire/OptionCard";
import GlassCard from "../components/ui/GlassCard";
import { Spinner } from "../components/ui/LoadingSkeleton";
import { QUESTIONS } from "../utils/questionnaireData";
import { recommendService } from "../services/movieService";

const initialAnswers = { mood: "", genres: [], language: "", runtime: "", releasePeriod: "", favoriteActor: "" };

export default function Questionnaire() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialAnswers);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const question = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const canProceed = question.optional
    ? true
    : question.multi
    ? answers[question.key].length > 0
    : Boolean(answers[question.key]);

  const selectSingle = (value) => setAnswers((a) => ({ ...a, [question.key]: value }));

  const toggleMulti = (value) => {
    setAnswers((a) => {
      const current = a[question.key];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...a, [question.key]: next };
    });
  };

  const goNext = async () => {
    if (!canProceed) return;
    if (isLast) {
      await handleSubmit();
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step === 0) return;
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const data = await recommendService.getRecommendations(answers);
      sessionStorage.setItem("cinematch_recommendations", JSON.stringify(data));
      navigate("/discover", { state: { fromQuestionnaire: true } });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[85vh] flex-col items-center px-4 py-14">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-gradient-glow" />

      <div className="mb-10 w-full max-w-2xl">
        <ProgressBar current={step + 1} total={QUESTIONS.length} />
      </div>

      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.key}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="mb-8 text-center">
              <span className="mb-3 inline-flex items-center gap-1.5 rounded-full glass px-3 py-1 text-xs font-semibold text-accent">
                <Sparkles className="h-3.5 w-3.5" /> Question {step + 1} of {QUESTIONS.length}
              </span>
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{question.title}</h1>
              <p className="mt-2 text-sm text-white/55">{question.subtitle}</p>
            </div>

            {question.isText ? (
              <GlassCard className="mx-auto max-w-md p-6">
                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={answers.favoriteActor}
                    onChange={(e) => setAnswers((a) => ({ ...a, favoriteActor: e.target.value }))}
                    placeholder="e.g. Zendaya, Timothée Chalamet..."
                    className="input-glass pl-11"
                  />
                </div>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {question.options.map((opt) => {
                  const selected = question.multi
                    ? answers[question.key].includes(opt.value)
                    : answers[question.key] === opt.value;
                  return (
                    <OptionCard
                      key={opt.value}
                      icon={opt.icon}
                      label={opt.label}
                      selected={selected}
                      onClick={() => (question.multi ? toggleMulti(opt.value) : selectSingle(opt.value))}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && <p className="mt-6 text-center text-sm text-red-400">{error}</p>}
      </div>

      {/* Sticky so Back/Next are always reachable, even on the long genre grid, without scrolling */}
      <div className="sticky bottom-4 z-20 mt-10 w-full max-w-2xl">
        <div className="glass-card flex items-center justify-between px-4 py-3">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="btn-secondary text-sm disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          <button
            onClick={goNext}
            disabled={!canProceed || submitting}
            className="btn-primary text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (
              <>
                <Spinner className="h-4 w-4 border-white/40 border-t-white" /> Finding movies...
              </>
            ) : isLast ? (
              <>
                Get Recommendations <Sparkles className="h-4 w-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
