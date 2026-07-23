import {
  Smile, Heart, Zap, Ghost, Brain, Compass,
  Swords, Laugh, Drama, Skull, Rocket, AlarmClockOff,
  Sparkles, Film, Clock3, Clock, Clock9,
  History as HistoryIcon, CalendarDays, CalendarClock, CalendarRange,
  Globe2, User,
} from "lucide-react";

// Each question drives one screen of the "one question at a time" flow.
// `multi: true` allows selecting more than one option (used for genres).
export const QUESTIONS = [
  {
    key: "mood",
    title: "What's your mood tonight?",
    subtitle: "We'll tune the whole list around this feeling.",
    multi: false,
    options: [
      { value: "happy", label: "Happy & Light", icon: Smile },
      { value: "romantic", label: "Romantic", icon: Heart },
      { value: "thrilled", label: "Thrilled", icon: Zap },
      { value: "scared", label: "Scared", icon: Ghost },
      { value: "thoughtful", label: "Thoughtful", icon: Brain },
      { value: "adventurous", label: "Adventurous", icon: Compass },
    ],
  },
  {
    key: "genres",
    title: "Pick a few genres you love",
    subtitle: "Select as many as you like.",
    multi: true,
    options: [
      { value: "action", label: "Action", icon: Swords },
      { value: "comedy", label: "Comedy", icon: Laugh },
      { value: "drama", label: "Drama", icon: Drama },
      { value: "horror", label: "Horror", icon: Skull },
      { value: "romance", label: "Romance", icon: Heart },
      { value: "sci-fi", label: "Sci-Fi", icon: Rocket },
      { value: "thriller", label: "Thriller", icon: AlarmClockOff },
      { value: "animation", label: "Animation", icon: Sparkles },
      { value: "documentary", label: "Documentary", icon: Film },
    ],
  },
  {
    key: "language",
    title: "Any language preference?",
    subtitle: "We'll prioritize films in this language.",
    multi: false,
    options: [
      { value: "en", label: "English", icon: Globe2 },
      { value: "hi", label: "Hindi", icon: Globe2 },
      { value: "ko", label: "Korean", icon: Globe2 },
      { value: "es", label: "Spanish", icon: Globe2 },
      { value: "fr", label: "French", icon: Globe2 },
      { value: "ja", label: "Japanese", icon: Globe2 },
    ],
  },
  {
    key: "runtime",
    title: "How much time do you have?",
    subtitle: "Pick your ideal runtime.",
    multi: false,
    options: [
      { value: "short", label: "Under 100 min", icon: Clock3 },
      { value: "medium", label: "90–130 min", icon: Clock },
      { value: "long", label: "120 min+", icon: Clock9 },
    ],
  },
  {
    key: "releasePeriod",
    title: "Which era of film?",
    subtitle: "We'll match the release window.",
    multi: false,
    options: [
      { value: "classic", label: "Classics (90s)", icon: HistoryIcon },
      { value: "2000s", label: "2000s", icon: CalendarDays },
      { value: "2010s", label: "2010s", icon: CalendarClock },
      { value: "recent", label: "2020 & Beyond", icon: CalendarRange },
    ],
  },
  {
    key: "favoriteActor",
    title: "A favorite actor? (optional)",
    subtitle: "Type a name, or skip this step.",
    multi: false,
    isText: true,
    optional: true,
    icon: User,
  },
];
