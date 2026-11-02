import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  createContext,
  useContext,
} from 'react'

/* =========================================================
   CONSTANTS & STATIC DATA
   ========================================================= */

const ACCOUNTS_KEY = 'aura_accounts'
const CURRENT_USER_KEY = 'aura_current_user'

const DEFAULT_HABITS = [
  { name: 'Drink Water', description: 'Drink at least 8 glasses of water.', icon: '💧', category: 'Health', difficulty: 'Easy' },
  { name: 'Morning Run', description: 'Run or walk for 10 minutes.', icon: '🏃', category: 'Health', difficulty: 'Medium' },
  { name: 'Meditation', description: 'Meditate for 5 minutes.', icon: '🧘', category: 'Mindfulness', difficulty: 'Easy' },
  { name: 'Study DSA', description: 'Solve at least 1 DSA problem.', icon: '🧠', category: 'Study', difficulty: 'Hard' },
  { name: 'Aptitude Practice', description: 'Practice 10 aptitude questions.', icon: '🧮', category: 'Study', difficulty: 'Medium' },
  { name: 'React Practice', description: 'Complete one React concept or component.', icon: '⚛️', category: 'Career', difficulty: 'Medium' },
  { name: 'Quantum Learning', description: 'Study quantum computing for 20 minutes.', icon: '🌌', category: 'Personal Growth', difficulty: 'Hard' },
  { name: 'Read a Book', description: 'Read 5 to 10 pages.', icon: '📖', category: 'Personal Growth', difficulty: 'Easy' },
  { name: 'Stretching', description: 'Stretch for 5 minutes.', icon: '🤸', category: 'Health', difficulty: 'Easy' },
  { name: 'Sleep on Time', description: 'Sleep before 11:00 PM.', icon: '🌙', category: 'Health', difficulty: 'Medium' },
]

const CATEGORIES = ['Health', 'Study', 'Career', 'Mindfulness', 'Personal Growth']
const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const MOODS = [
  { name: 'Happy', emoji: '😊' },
  { name: 'Calm', emoji: '😌' },
  { name: 'Excited', emoji: '🤩' },
  { name: 'Motivated', emoji: '🔥' },
  { name: 'Sad', emoji: '😔' },
  { name: 'Angry', emoji: '😡' },
  { name: 'Tired', emoji: '😴' },
  { name: 'Anxious', emoji: '😟' },
  { name: 'Peaceful', emoji: '🌿' },
]

const CHALLENGES = [
  { title: 'Hydration Streak', description: 'Drink 8 glasses of water.', reward: 15 },
  { title: 'One Problem a Day', description: 'Solve one DSA problem.', reward: 15 },
  { title: 'Still Mind', description: 'Meditate for 5 minutes.', reward: 15 },
  { title: 'Page Turner', description: 'Read 10 pages of a book.', reward: 15 },
  { title: 'Digital Detox Hour', description: 'Avoid unnecessary scrolling for 1 hour.', reward: 15 },
  { title: 'Gratitude List', description: 'Write 3 things you are grateful for.', reward: 15 },
  { title: 'Ship It', description: 'Complete one React component.', reward: 15 },
  { title: 'Fresh Air Walk', description: 'Go for a 10-minute walk.', reward: 15 },
  { title: 'Quantum Leap', description: 'Study quantum computing for 20 minutes.', reward: 15 },
  { title: 'Early Lights Out', description: 'Sleep before 11 PM.', reward: 15 },
]

const ZODIAC_DATA = {
  Aries: { emoji: '♈', element: 'Fire', color: 'Red', desc: 'Bold, energetic and a natural trailblazer who leaps before looking.' },
  Taurus: { emoji: '♉', element: 'Earth', color: 'Emerald Green', desc: 'Grounded, patient and deeply loyal, with a love for comfort and beauty.' },
  Gemini: { emoji: '♊', element: 'Air', color: 'Yellow', desc: 'Curious, witty and endlessly adaptable, thriving on conversation and ideas.' },
  Cancer: { emoji: '♋', element: 'Water', color: 'Silver', desc: 'Intuitive, nurturing and fiercely protective of the people it loves.' },
  Leo: { emoji: '♌', element: 'Fire', color: 'Gold', desc: 'Confident, creative and passionate, with a warmth that draws others in.' },
  Virgo: { emoji: '♍', element: 'Earth', color: 'Navy Blue', desc: 'Thoughtful, precise and quietly driven to make things better.' },
  Libra: { emoji: '♎', element: 'Air', color: 'Rose Pink', desc: 'Charming, fair-minded and always seeking harmony and balance.' },
  Scorpio: { emoji: '♏', element: 'Water', color: 'Maroon', desc: 'Intense, resourceful and unafraid to explore what lies beneath the surface.' },
  Sagittarius: { emoji: '♐', element: 'Fire', color: 'Purple', desc: 'Adventurous, optimistic and always chasing the next horizon.' },
  Capricorn: { emoji: '♑', element: 'Earth', color: 'Charcoal Grey', desc: 'Disciplined, ambitious and steady under pressure.' },
  Aquarius: { emoji: '♒', element: 'Air', color: 'Electric Blue', desc: 'Independent, inventive and drawn to original ideas.' },
  Pisces: { emoji: '♓', element: 'Water', color: 'Sea Green', desc: 'Dreamy, empathetic and deeply in tune with feelings — its own and others\'.' },
}

const ZODIAC_TIPS = {
  Fire: {
    dos: [
      'Start the one task you\'ve been putting off first.',
      'Move your body — even a short burst of exercise.',
      'Speak up about something you actually want.',
      'Take the lead on one small decision today.',
      'Turn restlessness into one bold, useful action.',
    ],
    donts: [
      'Don\'t pick a fight over something small.',
      'Don\'t rush a decision that deserves patience.',
      'Don\'t burn out by overcommitting your energy.',
      'Don\'t interrupt — let others finish their point.',
      'Don\'t let impatience make the choice for you.',
    ],
  },
  Earth: {
    dos: [
      'Stick to your routine, even if it feels boring.',
      'Tidy or organise one small space around you.',
      'Put something concrete toward a long-term goal.',
      'Enjoy one simple, physical comfort today.',
      'Say no to something that doesn\'t serve your plan.',
    ],
    donts: [
      'Don\'t resist a change that\'s actually necessary.',
      'Don\'t overwork without a proper break.',
      'Don\'t let stubbornness close a useful conversation.',
      'Don\'t skip rest in the name of productivity.',
      'Don\'t bottle up how you\'re really feeling.',
    ],
  },
  Air: {
    dos: [
      'Have one real conversation, not just small talk.',
      'Write down the idea that\'s been circling your head.',
      'Learn one new small fact or skill today.',
      'Reach out to someone you\'ve been meaning to message.',
      'Let a change of scenery refresh your thinking.',
    ],
    donts: [
      'Don\'t overthink a decision that\'s already simple.',
      'Don\'t leave a conversation or task half-finished.',
      'Don\'t scatter your focus across too many things.',
      'Don\'t gossip about something that isn\'t yours to share.',
      'Don\'t avoid a feeling by staying busy in your head.',
    ],
  },
  Water: {
    dos: [
      'Check in on how you\'re actually feeling today.',
      'Spend a few quiet minutes alone to reset.',
      'Offer support to someone who needs it.',
      'Write a journal entry about what\'s on your mind.',
      'Trust the quiet instinct you keep coming back to.',
    ],
    donts: [
      'Don\'t take on everyone else\'s emotions as your own.',
      'Don\'t withdraw completely when you feel unsure.',
      'Don\'t let a small comment replay all day.',
      'Don\'t skip sleep — your energy depends on it today.',
      'Don\'t assume the worst before you have the facts.',
    ],
  },
}

const MOMENT_TYPES = [
  { id: 'achievement', label: 'Achievement / Success', icon: '🏆', base: 10 },
  { id: 'habit', label: 'Habit / Routine', icon: '✅', base: 5 },
  { id: 'gratitude', label: 'Gratitude', icon: '🙏', base: 5 },
  { id: 'mood', label: 'Mood Boost', icon: '😊', base: 5 },
  { id: 'social', label: 'Social Connection', icon: '🤝', base: 5 },
  { id: 'setback', label: 'Setback / Difficulty', icon: '⚡', base: -8 },
]

const IMPACT_LEVELS = [
  { id: 'low', label: 'Low — small', multiplier: 0.6 },
  { id: 'medium', label: 'Medium — noticeable', multiplier: 1 },
  { id: 'high', label: 'High — significant', multiplier: 1.5 },
  { id: 'veryhigh', label: 'Very High — major', multiplier: 2 },
]

const ZODIAC_MESSAGES = {
  Aries: 'Channel today\'s fire into one bold first step.',
  Taurus: 'Slow, steady progress still counts as progress today.',
  Gemini: 'A curious question today could open a new door.',
  Cancer: 'Protect your energy — it\'s okay to rest today.',
  Leo: 'Let your confidence lead one conversation today.',
  Virgo: 'Small, precise improvements will compound today.',
  Libra: 'Seek one moment of balance amid the noise today.',
  Scorpio: 'Trust your instincts on the harder decision today.',
  Sagittarius: 'Say yes to the thing that excites you today.',
  Capricorn: 'Discipline today is a gift to your future self.',
  Aquarius: 'Your unconventional idea deserves a try today.',
  Pisces: 'Let your intuition guide one choice today.',
}

const QUOTES = [
  'Small positive actions create powerful energy.',
  'Your energy introduces you before you even speak.',
  'Consistency is the quietest form of self-respect.',
  'A calm mind can carry a busy day.',
  'Every habit you keep is a vote for who you\'re becoming.',
  'Rest is part of the rhythm, not a break from it.',
  'Progress looks small until it doesn\'t.',
  'Your aura reflects what you feed it daily.',
  'One honest habit beats ten perfect plans.',
  'Gratitude turns an ordinary day into a good one.',
]

const THEMES = [
  { id: 'purple', name: 'Purple Aura', swatch: ['#7c5cff', '#c46bff'] },
  { id: 'blue', name: 'Blue Aura', swatch: ['#3aa0ff', '#66e0ff'] },
  { id: 'pink', name: 'Pink Aura', swatch: ['#ff6ea8', '#ff9ecb'] },
  { id: 'green', name: 'Green Aura', swatch: ['#39c98f', '#8ef0b8'] },
  { id: 'golden', name: 'Golden Aura', swatch: ['#f2b544', '#ffd98a'] },
  { id: 'cosmic', name: 'Dark Cosmic Aura', swatch: ['#6e5bff', '#1a1030'] },
]

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'habits', label: 'Habits', icon: '✅' },
  { id: 'mood', label: 'Mood', icon: '🎭' },
  { id: 'zodiac', label: 'Zodiac', icon: '✨' },
  { id: 'challenges', label: 'Challenges', icon: '🎯' },
  { id: 'journal', label: 'Journal', icon: '📓' },
  { id: 'profile', label: 'Profile', icon: '👤' },
]

/* =========================================================
   HELPERS
   ========================================================= */

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function offsetDateStr(days) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function dayOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now - start
  return Math.floor(diff / 86400000)
}

function clampScore(n) {
  return n
}

const AURA_TIERS = [
  { name: 'Novice Aura', icon: '🌱', threshold: 0, message: 'Every journey starts with one small spark.' },
  { name: 'Rising Aura', icon: '🌿', threshold: 100, message: 'Your energy is starting to build momentum.' },
  { name: 'Bronze Aura', icon: '🥉', threshold: 250, message: 'Solid and steady — you\'re building real consistency.' },
  { name: 'Silver Aura', icon: '🥈', threshold: 500, message: 'A calm, dependable glow surrounds you now.' },
  { name: 'Gold Aura', icon: '🥇', threshold: 1000, message: 'Your aura is glowing with positive energy.' },
  { name: 'Platinum Aura', icon: '💎', threshold: 2000, message: 'Radiant and resilient — you\'re on fire.' },
  { name: 'Diamond Aura', icon: '💠', threshold: 4000, message: 'Rare consistency. Your aura is cutting through.' },
  { name: 'Master Aura', icon: '👑', threshold: 8000, message: 'Mastery earned one day at a time.' },
  { name: 'Legendary Aura', icon: '🌌', threshold: 16000, message: 'Legendary status — and there\'s still no ceiling.' },
]

// After the last named tier, keep leveling up forever in fixed 8000-point steps:
// Legendary Aura I, II, III, ... infinitely. Below zero, aura fades into negative tiers.
function getAuraTier(score) {
  if (score < 0) {
    const step = 100
    const depth = Math.floor(-score / step) + 1
    const currentThreshold = -depth * step
    const nextThreshold = currentThreshold + step
    const progressPercent = Math.min(100, Math.round(((score - currentThreshold) / step) * 100))
    return {
      label: depth <= 1 ? 'Fading Aura' : `Drained Aura ${depth - 1}`,
      icon: '🌑',
      message: 'Your aura has dipped into negative energy — small positive actions will bring it back.',
      currentThreshold, nextThreshold, progressPercent,
      level: -depth,
    }
  }
  const lastNamed = AURA_TIERS[AURA_TIERS.length - 1]
  if (score < lastNamed.threshold) {
    let current = AURA_TIERS[0]
    let next = AURA_TIERS[1]
    for (let i = 0; i < AURA_TIERS.length; i++) {
      if (score >= AURA_TIERS[i].threshold) {
        current = AURA_TIERS[i]
        next = AURA_TIERS[i + 1] || null
      }
    }
    const currentThreshold = current.threshold
    const nextThreshold = next ? next.threshold : lastNamed.threshold
    const progressPercent = Math.min(100, Math.round(((score - currentThreshold) / (nextThreshold - currentThreshold)) * 100))
    return { label: current.name, icon: current.icon, message: current.message, currentThreshold, nextThreshold, progressPercent, level: AURA_TIERS.indexOf(current) + 1 }
  }
  const step = 8000
  const extra = score - lastNamed.threshold
  const levelNum = Math.floor(extra / step) + 1
  const currentThreshold = lastNamed.threshold + (levelNum - 1) * step
  const nextThreshold = currentThreshold + step
  const progressPercent = Math.min(100, Math.round(((score - currentThreshold) / step) * 100))
  return {
    label: `${lastNamed.name} ${levelNum}`,
    icon: lastNamed.icon,
    message: lastNamed.message,
    currentThreshold, nextThreshold, progressPercent,
    level: AURA_TIERS.length + levelNum - 1,
  }
}

function getZodiacSign(dobStr) {
  if (!dobStr) return null
  const d = new Date(dobStr)
  if (isNaN(d.getTime())) return null
  const month = d.getMonth() + 1
  const day = d.getDate()
  const ranges = [
    ['Capricorn', 1, 19], ['Aquarius', 2, 18], ['Pisces', 3, 20],
    ['Aries', 4, 19], ['Taurus', 5, 20], ['Gemini', 6, 20],
    ['Cancer', 7, 22], ['Leo', 8, 22], ['Virgo', 9, 22],
    ['Libra', 10, 22], ['Scorpio', 11, 21], ['Sagittarius', 12, 21],
    ['Capricorn', 12, 31],
  ]
  if (month === 1) return day <= 19 ? 'Capricorn' : 'Aquarius'
  if (month === 2) return day <= 18 ? 'Aquarius' : 'Pisces'
  if (month === 3) return day <= 20 ? 'Pisces' : 'Aries'
  if (month === 4) return day <= 19 ? 'Aries' : 'Taurus'
  if (month === 5) return day <= 20 ? 'Taurus' : 'Gemini'
  if (month === 6) return day <= 20 ? 'Gemini' : 'Cancer'
  if (month === 7) return day <= 22 ? 'Cancer' : 'Leo'
  if (month === 8) return day <= 22 ? 'Leo' : 'Virgo'
  if (month === 9) return day <= 22 ? 'Virgo' : 'Libra'
  if (month === 10) return day <= 22 ? 'Libra' : 'Scorpio'
  if (month === 11) return day <= 21 ? 'Scorpio' : 'Sagittarius'
  return day <= 21 ? 'Sagittarius' : 'Capricorn'
}

function computeStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0
  const set = new Set(completedDates)
  let streak = 0
  let cursor
  if (set.has(todayStr())) {
    cursor = 0
  } else if (set.has(offsetDateStr(-1))) {
    cursor = 1
  } else {
    return 0
  }
  while (set.has(offsetDateStr(-cursor))) {
    streak += 1
    cursor += 1
  }
  return streak
}

function loadAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function makeNewUser({ fullName, nickname, email, password, dateOfBirth, gender, city }) {
  return {
    fullName,
    nickname,
    email,
    password,
    dateOfBirth,
    gender: gender || '',
    city: city || '',
    bio: '',
    zodiac: getZodiacSign(dateOfBirth) || '',
    auraScore: 50,
    auraTheme: 'purple',
    habits: DEFAULT_HABITS.map((h) => ({
      id: uid(),
      name: h.name,
      description: h.description,
      icon: h.icon,
      category: h.category,
      difficulty: h.difficulty,
      completedDates: [],
    })),
    moodEntries: [],
    journalEntries: [],
    challengeCompletions: [],
    auraLog: [],
    createdAt: new Date().toISOString(),
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Repairs any account object that came from an older version of the app or
// got corrupted somehow, so missing/wrong-type fields never silently break scoring.
function normalizeUser(u) {
  if (!u || typeof u !== 'object') return u
  const safeScore = typeof u.auraScore === 'number' && !isNaN(u.auraScore) ? u.auraScore : 50
  return {
    ...u,
    bio: typeof u.bio === 'string' ? u.bio : '',
    auraTheme: typeof u.auraTheme === 'string' ? u.auraTheme : 'purple',
    auraScore: safeScore,
    habits: Array.isArray(u.habits) ? u.habits : [],
    moodEntries: Array.isArray(u.moodEntries) ? u.moodEntries : [],
    journalEntries: Array.isArray(u.journalEntries) ? u.journalEntries : [],
    challengeCompletions: Array.isArray(u.challengeCompletions) ? u.challengeCompletions : [],
    auraLog: Array.isArray(u.auraLog) ? u.auraLog : [],
  }
}

/* =========================================================
   CONTEXT
   ========================================================= */

const AuraContext = createContext(null)
function useAura() {
  return useContext(AuraContext)
}

/* =========================================================
   TOAST SYSTEM
   ========================================================= */

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`} onClick={() => onDismiss(t.id)}>
          <span className="toast-icon">{t.type === 'error' ? '⚠️' : t.type === 'success' ? '✨' : 'ℹ️'}</span>
          <span className="toast-text">{t.message}</span>
        </div>
      ))}
    </div>
  )
}

/* =========================================================
   AUTH SCREENS
   ========================================================= */

function AuthShell({ children }) {
  return (
    <div className="auth-wrap">
      <div className="auth-bg-glow one" />
      <div className="auth-bg-glow two" />
      <div className="auth-bg-glow three" />
      <div className="floating-particles">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className={`particle p${i % 6}`} style={{ left: `${(i * 7.3) % 100}%`, animationDelay: `${i * 0.6}s` }} />
        ))}
      </div>
      <div className="auth-card">
        <div className="brand-mark">
          <span className="brand-orb" />
          <span className="brand-name">AuraMapping</span>
        </div>
        {children}
      </div>
    </div>
  )
}

function PasswordField({ value, onChange, placeholder, id }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="field password-field">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
      />
      <button type="button" className="pw-toggle" onClick={() => setVisible((v) => !v)} tabIndex={-1}>
        {visible ? '🙈' : '👁️'}
      </button>
    </div>
  )
}

function LoginScreen({ onSwitch, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!email.trim()) errs.email = 'Email is required.'
    else if (!isValidEmail(email)) errs.email = 'Enter a valid email address.'
    if (!password) errs.password = 'Password is required.'
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onLogin(email.trim().toLowerCase(), password)
  }

  return (
    <form className="auth-form fade-in-up" onSubmit={handleSubmit}>
      <h1>Welcome back</h1>
      <p className="auth-sub">Log in to check on your aura today.</p>

      <label className="field-label" htmlFor="login-email">Email</label>
      <div className="field">
        <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      {errors.email && <div className="field-error">{errors.email}</div>}

      <label className="field-label" htmlFor="login-password">Password</label>
      <PasswordField id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
      {errors.password && <div className="field-error">{errors.password}</div>}

      <button type="submit" className="btn btn-primary btn-block">Log In</button>

      <p className="auth-switch">
        New to AuraMapping? <button type="button" onClick={onSwitch}>Create an account</button>
      </p>
    </form>
  )
}

function SignupScreen({ onSwitch, onSignup }) {
  const [form, setForm] = useState({
    fullName: '', nickname: '', email: '', password: '', confirmPassword: '',
    dateOfBirth: '', gender: '', city: '',
  })
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required.'
    if (!form.nickname.trim()) errs.nickname = 'Nickname is required.'
    if (!form.email.trim()) errs.email = 'Email is required.'
    else if (!isValidEmail(form.email)) errs.email = 'Enter a valid email address.'
    if (!form.password) errs.password = 'Password is required.'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password.'
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    if (!form.dateOfBirth) errs.dateOfBirth = 'Date of birth is required.'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    const accounts = loadAccounts()
    const emailLower = form.email.trim().toLowerCase()
    if (!errs.email && accounts.some((a) => a.email === emailLower)) {
      errs.email = 'An account with this email already exists.'
    }
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onSignup({ ...form, email: emailLower })
  }

  return (
    <form className="auth-form fade-in-up" onSubmit={handleSubmit}>
      <h1>Create your account</h1>
      <p className="auth-sub">Start mapping your energy, one day at a time.</p>

      <div className="grid-2">
        <div>
          <label className="field-label" htmlFor="su-name">Full Name</label>
          <div className="field"><input id="su-name" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Aarti Sharma" /></div>
          {errors.fullName && <div className="field-error">{errors.fullName}</div>}
        </div>
        <div>
          <label className="field-label" htmlFor="su-nick">Nickname</label>
          <div className="field"><input id="su-nick" value={form.nickname} onChange={(e) => update('nickname', e.target.value)} placeholder="Aarti" /></div>
          {errors.nickname && <div className="field-error">{errors.nickname}</div>}
        </div>
      </div>

      <label className="field-label" htmlFor="su-email">Email</label>
      <div className="field"><input id="su-email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" /></div>
      {errors.email && <div className="field-error">{errors.email}</div>}

      <div className="grid-2">
        <div>
          <label className="field-label" htmlFor="su-pw">Password</label>
          <PasswordField id="su-pw" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="At least 6 characters" />
          {errors.password && <div className="field-error">{errors.password}</div>}
        </div>
        <div>
          <label className="field-label" htmlFor="su-cpw">Confirm Password</label>
          <PasswordField id="su-cpw" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Repeat password" />
          {errors.confirmPassword && <div className="field-error">{errors.confirmPassword}</div>}
        </div>
      </div>

      <div className="grid-2">
        <div>
          <label className="field-label" htmlFor="su-dob">Date of Birth</label>
          <div className="field"><input id="su-dob" type="date" value={form.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} /></div>
          {errors.dateOfBirth && <div className="field-error">{errors.dateOfBirth}</div>}
        </div>
        <div>
          <label className="field-label" htmlFor="su-gender">Gender (optional)</label>
          <div className="field">
            <select id="su-gender" value={form.gender} onChange={(e) => update('gender', e.target.value)}>
              <option value="">Prefer not to say</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      <label className="field-label" htmlFor="su-city">City (optional)</label>
      <div className="field"><input id="su-city" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Kharar, Punjab" /></div>

      <button type="submit" className="btn btn-primary btn-block">Create Account</button>

      <p className="auth-switch">
        Already have an account? <button type="button" onClick={onSwitch}>Log in</button>
      </p>
    </form>
  )
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function TopNav({ page, setPage, user, onLogout }) {
  return (
    <header className="top-nav">
      <div className="top-nav-inner">
        <div className="brand-mark small">
          <span className="brand-orb" />
          <span className="brand-name">AuraMapping</span>
        </div>
        <nav className="nav-links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-link ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        <div className="top-nav-right">
          <span className="user-chip">{user.nickname}</span>
          <button className="btn btn-ghost" onClick={onLogout}>Log Out</button>
        </div>
      </div>
    </header>
  )
}

function BottomNav({ page, setPage }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={`bottom-nav-item ${page === item.id ? 'active' : ''}`}
          onClick={() => setPage(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}

/* =========================================================
   SHARED UI BITS
   ========================================================= */

function AuraRing({ score, percent, size = 132 }) {
  const radius = size / 2 - 10
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  return (
    <svg width={size} height={size} className="aura-ring" viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} className="ring-track" strokeWidth="10" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        className="ring-progress" strokeWidth="10" fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="47%" textAnchor="middle" className="ring-number">{score}</text>
      <text x="50%" y="64%" textAnchor="middle" className="ring-sub">AURA</text>
    </svg>
  )
}

function ProgressBar({ percent }) {
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
    </div>
  )
}

function Card({ title, icon, children, className = '' }) {
  return (
    <div className={`glass-card ${className}`}>
      {title && (
        <div className="card-head">
          {icon && <span className="card-icon">{icon}</span>}
          <h3>{title}</h3>
        </div>
      )}
      {children}
    </div>
  )
}

/* =========================================================
   CALCULATE AURA MODAL
   ========================================================= */

function CalculateAuraModal({ onClose }) {
  const { user, addAura, showToast } = useAura()
  const [momentType, setMomentType] = useState(MOMENT_TYPES[0].id)
  const [impact, setImpact] = useState(IMPACT_LEVELS[1].id)
  const [text, setText] = useState('')
  const [calculated, setCalculated] = useState(null)

  const typeObj = MOMENT_TYPES.find((m) => m.id === momentType)
  const impactObj = IMPACT_LEVELS.find((i) => i.id === impact)
  const previewPoints = Math.round(typeObj.base * impactObj.multiplier)

  function handleCalculate() {
    setCalculated(previewPoints)
  }

  function handleSave() {
    if (!text.trim()) {
      showToast('Describe what happened before saving.', 'error')
      return
    }
    const points = calculated !== null ? calculated : previewPoints
    const reason = `${typeObj.icon} ${text.trim()}`
    const updated = { ...user }
    addAura(updated, points, reason)
    showToast(
      points >= 0 ? `Aura moment saved. +${points} aura ✨` : `Aura moment saved. ${points} aura`,
      points >= 0 ? 'success' : 'info'
    )
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card fade-in-up" onClick={(e) => e.stopPropagation()}>
        <h2>Calculate Aura</h2>
        <p className="page-sub" style={{ marginBottom: 6 }}>What happened? Let's see what it's worth.</p>

        <div className="grid-2">
          <div>
            <label className="field-label">Moment Type</label>
            <div className="field">
              <select value={momentType} onChange={(e) => { setMomentType(e.target.value); setCalculated(null) }}>
                {MOMENT_TYPES.map((m) => <option key={m.id} value={m.id}>{m.icon} {m.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="field-label">Impact</label>
            <div className="field">
              <select value={impact} onChange={(e) => { setImpact(e.target.value); setCalculated(null) }}>
                {IMPACT_LEVELS.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        <label className="field-label">What happened?</label>
        <div className="field">
          <textarea
            rows={3}
            value={text}
            onChange={(e) => { setText(e.target.value); setCalculated(null) }}
            placeholder="e.g. Finished my project presentation early"
          />
        </div>

        <button className="btn btn-outline btn-block" onClick={handleCalculate}>Calculate Aura ✨</button>

        {calculated !== null && (
          <div className={`aura-calc-result ${calculated >= 0 ? 'positive' : 'negative'}`}>
            {calculated >= 0 ? '+' : ''}{calculated} aura
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Moment</button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   PAGE: DASHBOARD
   ========================================================= */

function DashboardPage() {
  const { user, setPage } = useAura()
  const [now, setNow] = useState(new Date())
  const [showCalc, setShowCalc] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const dateLabel = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const timeLabel = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })

  const quote = QUOTES[dayOfYear() % QUOTES.length]
  const level = getAuraTier(user.auraScore)

  const totalHabits = user.habits.length
  const completedToday = user.habits.filter((h) => h.completedDates.includes(todayStr())).length
  const habitPercent = totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0

  const todayMood = user.moodEntries.find((m) => m.date === todayStr())
  const challengeIndex = dayOfYear() % CHALLENGES.length
  const challenge = CHALLENGES[challengeIndex]
  const challengeDone = user.challengeCompletions.some((c) => c.date === todayStr())

  const zodiac = user.zodiac ? ZODIAC_DATA[user.zodiac] : null

  const recentMoments = [...user.auraLog].slice(-5).reverse()

  return (
    <div className="page fade-in-up">
      <div className="welcome-header">
        <div>
          <h1>{greeting}, {user.nickname} ✨</h1>
          <p className="welcome-sub">{dateLabel} · {timeLabel}</p>
        </div>
        <p className="welcome-quote">"{quote}"</p>
      </div>

      <div className="dashboard-grid">
        <Card title="Aura Score" icon="🌟" className="span-2 aura-score-card">
          <div className="aura-score-inner">
            <AuraRing score={user.auraScore} percent={level.progressPercent} />
            <div>
              <div className="aura-level-tag">{level.icon} {level.label}</div>
              <p className="aura-message">{level.message}</p>
              <p className="aura-next-hint">{level.nextThreshold - user.auraScore} points to next level</p>
              <button className="btn btn-primary" style={{ marginTop: 10 }} onClick={() => setShowCalc(true)}>
                🧮 Calculate Aura
              </button>
            </div>
          </div>
        </Card>

        <Card title="Today's Mood" icon="🎭">
          {todayMood ? (
            <div className="mini-mood">
              <span className="mini-mood-emoji">{todayMood.emoji}</span>
              <div>
                <div className="mini-mood-name">{todayMood.mood}</div>
                {todayMood.note && <p className="mini-mood-note">{todayMood.note}</p>}
              </div>
            </div>
          ) : (
            <p className="empty-hint">Not logged yet today.</p>
          )}
          <button className="btn btn-soft" onClick={() => setPage('mood')}>Log Mood</button>
        </Card>

        <Card title="Habit Progress" icon="✅">
          <div className="stat-row">
            <span className="stat-big">{habitPercent}%</span>
            <span className="stat-label">{completedToday}/{totalHabits} done today</span>
          </div>
          <ProgressBar percent={habitPercent} />
          <button className="btn btn-soft" onClick={() => setPage('habits')}>Open Habits</button>
        </Card>

        <Card title="Daily Challenge" icon="🎯">
          <div className="challenge-mini">
            <strong>{challenge.title}</strong>
            <p>{challenge.description}</p>
          </div>
          <span className={`badge ${challengeDone ? 'badge-success' : 'badge-idle'}`}>
            {challengeDone ? 'Completed today' : 'Not completed yet'}
          </span>
          <button className="btn btn-soft" onClick={() => setPage('challenges')}>Open Challenge</button>
        </Card>

        <Card title="Zodiac" icon="✨">
          {zodiac ? (
            <div className="mini-zodiac">
              <span className="mini-zodiac-emoji">{zodiac.emoji}</span>
              <div>
                <div className="mini-zodiac-name">{user.zodiac}</div>
                <p className="mini-zodiac-element">{zodiac.element} element</p>
              </div>
            </div>
          ) : <p className="empty-hint">Add your birth date in Profile.</p>}
          <button className="btn btn-soft" onClick={() => setPage('zodiac')}>View Zodiac</button>
        </Card>

        <Card title="Quick Actions" icon="⚡" className="span-2">
          <div className="quick-actions">
            <button className="btn btn-outline" onClick={() => setShowCalc(true)}>🧮 Calculate Aura</button>
            <button className="btn btn-outline" onClick={() => setPage('habits')}>✅ Mark a habit</button>
            <button className="btn btn-outline" onClick={() => setPage('mood')}>🎭 Log mood</button>
            <button className="btn btn-outline" onClick={() => setPage('journal')}>📓 Write journal</button>
            <button className="btn btn-outline" onClick={() => setPage('challenges')}>🎯 Take challenge</button>
          </div>
        </Card>

        <Card title="Recent Aura Moments" icon="🌀" className="span-2">
          {recentMoments.length === 0 ? (
            <p className="empty-hint">Your aura moments will appear here as you take action.</p>
          ) : (
            <ul className="moment-list">
              {recentMoments.map((m, i) => (
                <li key={i}>
                  <span className="moment-delta">+{m.delta}</span>
                  <span className="moment-reason">{m.reason}</span>
                  <span className="moment-date">{m.date}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="dashboard-footer-stats">
        <div><span className="foot-num">{completedToday}</span><span>Habits completed today</span></div>
        <div><span className="foot-num">{user.journalEntries.length}</span><span>Journal entries saved</span></div>
        <div><span className="foot-num">{user.moodEntries.length}</span><span>Moods logged</span></div>
      </div>

      {showCalc && <CalculateAuraModal onClose={() => setShowCalc(false)} />}
    </div>
  )
}

/* =========================================================
   PAGE: HABITS
   ========================================================= */

function HabitFormModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    name: '', description: '', icon: '🌱', category: 'Health', difficulty: 'Easy',
  })
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card fade-in-up" onClick={(e) => e.stopPropagation()}>
        <h2>{initial ? 'Edit Habit' : 'Add a New Habit'}</h2>
        <label className="field-label">Habit Name</label>
        <div className="field"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Journaling" /></div>
        <label className="field-label">Description / Example</label>
        <div className="field"><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Write 3 lines about your day" /></div>
        <div className="grid-2">
          <div>
            <label className="field-label">Icon (emoji)</label>
            <div className="field"><input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="🌱" /></div>
          </div>
          <div>
            <label className="field-label">Category</label>
            <div className="field">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
        <label className="field-label">Difficulty</label>
        <div className="field">
          <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
            {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!form.name.trim()) return
              onSave(form)
            }}
          >
            Save Habit
          </button>
        </div>
      </div>
    </div>
  )
}

function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const done = habit.completedDates.includes(todayStr())
  const streak = computeStreak(habit.completedDates)
  return (
    <div className={`habit-card ${done ? 'habit-done' : ''}`}>
      <div className="habit-top">
        <span className="habit-icon">{habit.icon}</span>
        <div className="habit-info">
          <div className="habit-name">{habit.name}</div>
          <div className="habit-desc">{habit.description}</div>
        </div>
        <button className={`check-circle ${done ? 'checked' : ''}`} onClick={() => onToggle(habit)} aria-label="Toggle habit completion">
          {done && <span className="check-mark">✓</span>}
        </button>
      </div>
      <div className="habit-meta">
        <span className="pill">{habit.category}</span>
        <span className={`pill pill-${habit.difficulty.toLowerCase()}`}>{habit.difficulty}</span>
        <span className="pill pill-streak">🔥 {streak} day streak</span>
      </div>
      <div className="habit-actions">
        <button className="link-btn" onClick={() => onEdit(habit)}>Edit</button>
        <button className="link-btn link-danger" onClick={() => onDelete(habit)}>Delete</button>
      </div>
    </div>
  )
}

function HabitsPage() {
  const { user, persistUser, showToast, addAura } = useAura()
  const [modal, setModal] = useState(null) // 'new' | habit object | null
  const [filter, setFilter] = useState('All')

  const totalHabits = user.habits.length
  const completedToday = user.habits.filter((h) => h.completedDates.includes(todayStr())).length
  const percent = totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0

  function toggleHabit(habit) {
    const done = habit.completedDates.includes(todayStr())
    const updatedHabits = user.habits.map((h) => {
      if (h.id !== habit.id) return h
      if (done) {
        return { ...h, completedDates: h.completedDates.filter((d) => d !== todayStr()) }
      }
      return { ...h, completedDates: [...h.completedDates, todayStr()] }
    })
    if (done) {
      persistUser({ ...user, habits: updatedHabits })
      showToast(`"${habit.name}" unmarked for today.`, 'info')
    } else {
      const updated = { ...user, habits: updatedHabits }
      addAura(updated, 5, `Completed "${habit.name}"`)
      showToast(`Nice! "${habit.name}" complete. +5 aura`, 'success')
    }
  }

  function saveHabit(form) {
    let updatedHabits
    if (form.id) {
      updatedHabits = user.habits.map((h) => (h.id === form.id ? { ...h, ...form } : h))
      showToast('Habit updated.', 'success')
    } else {
      updatedHabits = [...user.habits, { ...form, id: uid(), completedDates: [] }]
      showToast('New habit added.', 'success')
    }
    persistUser({ ...user, habits: updatedHabits })
    setModal(null)
  }

  function deleteHabit(habit) {
    persistUser({ ...user, habits: user.habits.filter((h) => h.id !== habit.id) })
    showToast(`"${habit.name}" removed.`, 'info')
  }

  const filtered = filter === 'All' ? user.habits : user.habits.filter((h) => h.category === filter)

  return (
    <div className="page fade-in-up">
      <div className="page-head">
        <div>
          <h1>Habits</h1>
          <p className="page-sub">{completedToday} of {totalHabits} completed today · {percent}%</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal('new')}>+ Add Habit</button>
      </div>

      <ProgressBar percent={percent} />

      <div className="filter-row">
        {['All', ...CATEGORIES].map((c) => (
          <button key={c} className={`chip ${filter === c ? 'chip-active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="habits-grid">
        {filtered.map((h) => (
          <HabitCard key={h.id} habit={h} onToggle={toggleHabit} onEdit={(hb) => setModal(hb)} onDelete={deleteHabit} />
        ))}
        {filtered.length === 0 && <p className="empty-hint">No habits in this category yet.</p>}
      </div>

      {modal && (
        <HabitFormModal
          initial={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveHabit}
        />
      )}
    </div>
  )
}

/* =========================================================
   PAGE: MOOD
   ========================================================= */

function MoodPage() {
  const { user, persistUser, showToast } = useAura()
  const todayEntry = user.moodEntries.find((m) => m.date === todayStr())
  const [selected, setSelected] = useState(todayEntry ? todayEntry.mood : '')
  const [note, setNote] = useState(todayEntry ? todayEntry.note : '')

  useEffect(() => {
    setSelected(todayEntry ? todayEntry.mood : '')
    setNote(todayEntry ? todayEntry.note : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayEntry?.mood])

  function saveMood() {
    if (!selected) {
      showToast('Please select a mood first.', 'error')
      return
    }
    const moodObj = MOODS.find((m) => m.name === selected)
    const entry = { id: todayEntry ? todayEntry.id : uid(), date: todayStr(), mood: selected, emoji: moodObj.emoji, note }
    const others = user.moodEntries.filter((m) => m.date !== todayStr())
    persistUser({ ...user, moodEntries: [...others, entry] })
    showToast(todayEntry ? 'Mood updated.' : 'Mood saved for today.', 'success')
  }

  function deleteEntry(id) {
    persistUser({ ...user, moodEntries: user.moodEntries.filter((m) => m.id !== id) })
    showToast('Mood entry removed.', 'info')
  }

  const history = [...user.moodEntries].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="page fade-in-up">
      <div className="page-head"><div><h1>Mood Tracker</h1><p className="page-sub">How are you feeling today?</p></div></div>

      <Card>
        <div className="mood-grid">
          {MOODS.map((m) => (
            <button
              key={m.name}
              className={`mood-option ${selected === m.name ? 'mood-selected' : ''}`}
              onClick={() => setSelected(m.name)}
            >
              <span className="mood-emoji">{m.emoji}</span>
              <span>{m.name}</span>
            </button>
          ))}
        </div>
        <label className="field-label">Add a short note (optional)</label>
        <div className="field">
          <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="What's on your mind?" />
        </div>
        <button className="btn btn-primary" onClick={saveMood}>{todayEntry ? 'Update Mood' : 'Save Mood'}</button>
      </Card>

      <h2 className="section-title">Mood History</h2>
      <div className="mood-history">
        {history.length === 0 && <p className="empty-hint">No moods logged yet.</p>}
        {history.map((m) => (
          <div key={m.id} className="mood-history-card">
            <span className="mood-history-emoji">{m.emoji}</span>
            <div className="mood-history-info">
              <div className="mood-history-top"><strong>{m.mood}</strong><span>{m.date}</span></div>
              {m.note && <p>{m.note}</p>}
            </div>
            <button className="link-btn link-danger" onClick={() => deleteEntry(m.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   PAGE: ZODIAC
   ========================================================= */

function ZodiacPage() {
  const { user } = useAura()
  const sign = user.zodiac
  const data = sign ? ZODIAC_DATA[sign] : null
  const today = new Date()
  const dateLabel = today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

  let dos = []
  let donts = []
  if (data) {
    const tips = ZODIAC_TIPS[data.element]
    const doIndex = dayOfYear() % tips.dos.length
    const dontIndex = (dayOfYear() + 2) % tips.donts.length
    dos = [tips.dos[doIndex], tips.dos[(doIndex + 1) % tips.dos.length], tips.dos[(doIndex + 2) % tips.dos.length]]
    donts = [tips.donts[dontIndex], tips.donts[(dontIndex + 1) % tips.donts.length], tips.donts[(dontIndex + 2) % tips.donts.length]]
  }

  return (
    <div className="page fade-in-up">
      <div className="page-head"><div><h1>Zodiac</h1><p className="page-sub">A fun way to reflect — not a scientific forecast.</p></div></div>

      {!data ? (
        <Card><p className="empty-hint">Add your date of birth in your Profile to see your zodiac sign.</p></Card>
      ) : (
        <>
          <div className="zodiac-hero">
            <div className="zodiac-float">
              <span className="zodiac-emoji-big">{data.emoji}</span>
            </div>
            <div className="zodiac-details">
              <h2>{sign}</h2>
              <p className="zodiac-desc">{data.desc}</p>
              <div className="zodiac-facts">
                <div><span>Element</span><strong>{data.element}</strong></div>
                <div><span>Lucky Color</span><strong>{data.color}</strong></div>
              </div>
              <div className="zodiac-message">
                <strong>Today's Message</strong>
                <p>{ZODIAC_MESSAGES[sign]}</p>
              </div>
            </div>
          </div>

          <Card title={`Today's Do's & Don'ts — ${dateLabel}`} icon="🗓️">
            <div className="dos-donts-grid">
              <div className="dos-col">
                <div className="dos-donts-head do-head">Do today</div>
                <ul>
                  {dos.map((d, i) => <li key={i}>✅ {d}</li>)}
                </ul>
              </div>
              <div className="donts-col">
                <div className="dos-donts-head dont-head">Avoid today</div>
                <ul>
                  {donts.map((d, i) => <li key={i}>🚫 {d}</li>)}
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}

      <p className="disclaimer">Astrology is presented here purely for fun and self-reflection — it is not scientifically validated.</p>
    </div>
  )
}

/* =========================================================
   PAGE: CHALLENGES
   ========================================================= */

function ChallengesPage() {
  const { user, addAura, showToast } = useAura()
  const index = dayOfYear() % CHALLENGES.length
  const challenge = CHALLENGES[index]
  const doneToday = user.challengeCompletions.some((c) => c.date === todayStr())

  function complete() {
    if (doneToday) return
    const updated = {
      ...user,
      challengeCompletions: [...user.challengeCompletions, { date: todayStr(), title: challenge.title }],
    }
    addAura(updated, challenge.reward, `Completed challenge "${challenge.title}"`)
    showToast(`Congratulations! Challenge complete. +${challenge.reward} aura 🎉`, 'success')
  }

  const history = [...user.challengeCompletions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 10)

  return (
    <div className="page fade-in-up">
      <div className="page-head"><div><h1>Daily Challenge</h1><p className="page-sub">One meaningful challenge, every day.</p></div></div>

      <Card className={`challenge-card ${doneToday ? 'challenge-complete' : ''}`}>
        <div className="challenge-reward">+{challenge.reward} aura</div>
        <h2>{challenge.title}</h2>
        <p>{challenge.description}</p>
        <button className="btn btn-primary btn-block" disabled={doneToday} onClick={complete}>
          {doneToday ? '✓ Completed Today' : 'Mark as Complete'}
        </button>
      </Card>

      <h2 className="section-title">Recent Completions</h2>
      <div className="mood-history">
        {history.length === 0 && <p className="empty-hint">No challenges completed yet.</p>}
        {history.map((c, i) => (
          <div key={i} className="mood-history-card">
            <span className="mood-history-emoji">🎯</span>
            <div className="mood-history-info">
              <div className="mood-history-top"><strong>{c.title}</strong><span>{c.date}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   PAGE: JOURNAL
   ========================================================= */

const JOURNAL_TYPES = ['Thought', 'Gratitude', 'Achievement', 'Feeling', 'Personal Goal']

function JournalPage() {
  const { user, persistUser, addAura, showToast } = useAura()
  const [type, setType] = useState('Thought')
  const [text, setText] = useState('')
  const [mood, setMood] = useState('')
  const [editingId, setEditingId] = useState(null)

  function resetForm() {
    setType('Thought'); setText(''); setMood(''); setEditingId(null)
  }

  function saveEntry() {
    if (!text.trim()) {
      showToast('Please write something before saving.', 'error')
      return
    }
    if (editingId) {
      const updated = {
        ...user,
        journalEntries: user.journalEntries.map((j) => (j.id === editingId ? { ...j, type, text, mood } : j)),
      }
      persistUser(updated)
      showToast('Journal entry updated.', 'success')
    } else {
      const entry = { id: uid(), date: todayStr(), type, text, mood, auraPoints: 5 }
      const updated = { ...user, journalEntries: [...user.journalEntries, entry] }
      addAura(updated, 5, 'Added a journal entry')
      showToast('Journal entry saved. +5 aura ✨', 'success')
    }
    resetForm()
  }

  function editEntry(entry) {
    setEditingId(entry.id); setType(entry.type); setText(entry.text); setMood(entry.mood || '')
  }

  function deleteEntry(id) {
    persistUser({ ...user, journalEntries: user.journalEntries.filter((j) => j.id !== id) })
    showToast('Journal entry deleted.', 'info')
  }

  const entries = [...user.journalEntries].sort((a, b) => (a.date < b.date ? 1 : -1))

  return (
    <div className="page fade-in-up">
      <div className="page-head"><div><h1>Aura Journal</h1><p className="page-sub">Capture today's thought, gratitude or goal.</p></div></div>

      <Card>
        <label className="field-label">Entry Type</label>
        <div className="field">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {JOURNAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <label className="field-label">Your Entry</label>
        <div className="field">
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Today I completed one DSA problem and felt productive." />
        </div>
        <label className="field-label">Mood (optional)</label>
        <div className="field">
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="">No mood selected</option>
            {MOODS.map((m) => <option key={m.name} value={m.name}>{m.emoji} {m.name}</option>)}
          </select>
        </div>
        <div className="modal-actions">
          {editingId && <button className="btn btn-ghost" onClick={resetForm}>Cancel Edit</button>}
          <button className="btn btn-primary" onClick={saveEntry}>{editingId ? 'Update Entry' : 'Save Entry'}</button>
        </div>
      </Card>

      <h2 className="section-title">Your Entries</h2>
      <div className="journal-list">
        {entries.length === 0 && <p className="empty-hint">No journal entries yet.</p>}
        {entries.map((j) => (
          <div key={j.id} className="journal-card">
            <div className="journal-card-top">
              <span className="pill">{j.type}</span>
              {j.mood && <span className="pill">{MOODS.find((m) => m.name === j.mood)?.emoji} {j.mood}</span>}
              <span className="journal-date">{j.date}</span>
            </div>
            <p>{j.text}</p>
            <div className="habit-actions">
              <button className="link-btn" onClick={() => editEntry(j)}>Edit</button>
              <button className="link-btn link-danger" onClick={() => deleteEntry(j.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* =========================================================
   PAGE: PROFILE
   ========================================================= */

function ProfilePage() {
  const { user, persistUser, showToast, onLogout } = useAura()
  const [form, setForm] = useState({
    fullName: user.fullName, nickname: user.nickname, dateOfBirth: user.dateOfBirth,
    city: user.city, bio: user.bio,
  })

  const completedHabits = user.habits.filter((h) => h.completedDates.includes(todayStr())).length

  function save() {
    const zodiac = getZodiacSign(form.dateOfBirth) || user.zodiac
    persistUser({ ...user, ...form, zodiac })
    showToast('Profile updated.', 'success')
  }

  function changeTheme(themeId) {
    persistUser({ ...user, auraTheme: themeId })
    showToast('Theme updated.', 'success')
  }

  return (
    <div className="page fade-in-up">
      <div className="page-head"><div><h1>Profile</h1><p className="page-sub">Manage your account and aura preferences.</p></div></div>

      <div className="profile-grid">
        <Card title="Overview" icon="👤">
          <ul className="profile-stats">
            <li><span>Email</span><strong>{user.email}</strong></li>
            <li><span>Zodiac</span><strong>{user.zodiac || '—'}</strong></li>
            <li><span>Aura Score</span><strong>{user.auraScore}</strong></li>
            <li><span>Aura Level</span><strong>{getAuraTier(user.auraScore).icon} {getAuraTier(user.auraScore).label}</strong></li>
            <li><span>Total Habits</span><strong>{user.habits.length}</strong></li>
            <li><span>Completed Today</span><strong>{completedHabits}</strong></li>
            <li><span>Journal Entries</span><strong>{user.journalEntries.length}</strong></li>
            <li><span>Current Theme</span><strong>{THEMES.find((t) => t.id === user.auraTheme)?.name}</strong></li>
          </ul>
          <button className="btn btn-ghost btn-block" onClick={onLogout}>Log Out</button>
        </Card>

        <Card title="Edit Details" icon="✏️">
          <label className="field-label">Full Name</label>
          <div className="field"><input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} /></div>
          <label className="field-label">Nickname</label>
          <div className="field"><input value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} /></div>
          <label className="field-label">Date of Birth</label>
          <div className="field"><input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} /></div>
          <label className="field-label">City</label>
          <div className="field"><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
          <label className="field-label">Bio</label>
          <div className="field"><textarea rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A short line about you" /></div>
          <button className="btn btn-primary" onClick={save}>Save Changes</button>
        </Card>

        <Card title="Aura Theme" icon="🎨" className="span-2">
          <div className="theme-grid">
            {THEMES.map((t) => (
              <button
                key={t.id}
                className={`theme-swatch ${user.auraTheme === t.id ? 'theme-active' : ''}`}
                style={{ background: `linear-gradient(135deg, ${t.swatch[0]}, ${t.swatch[1]})` }}
                onClick={() => changeTheme(t.id)}
              >
                {user.auraTheme === t.id && <span className="theme-check">✓</span>}
                <span className="theme-label">{t.name}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

/* =========================================================
   MAIN APP
   ========================================================= */

function AppShell() {
  const { user, page, setPage, onLogout } = useAura()
  const pages = {
    dashboard: <DashboardPage />,
    habits: <HabitsPage />,
    mood: <MoodPage />,
    zodiac: <ZodiacPage />,
    challenges: <ChallengesPage />,
    journal: <JournalPage />,
    profile: <ProfilePage />,
  }
  return (
    <div className={`app-shell theme-${user.auraTheme}`}>
      <div className="aura-glow-bg" />
      <TopNav page={page} setPage={setPage} user={user} onLogout={onLogout} />
      <main className="app-main">{pages[page]}</main>
      <BottomNav page={page} setPage={setPage} />
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [authScreen, setAuthScreen] = useState('login')
  const [page, setPage] = useState('dashboard')
  const [toasts, setToasts] = useState([])
  const [ready, setReady] = useState(false)
  const timers = useRef({})

  useEffect(() => {
    const email = localStorage.getItem(CURRENT_USER_KEY)
    if (email) {
      const accounts = loadAccounts()
      const found = accounts.find((a) => a.email === email)
      if (found) setUser(normalizeUser(found))
    }
    setReady(true)
  }, [])

  function showToast(message, type = 'info') {
    const id = uid()
    setToasts((t) => [...t, { id, message, type }])
    timers.current[id] = setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3200)
  }

  function dismissToast(id) {
    setToasts((t) => t.filter((x) => x.id !== id))
    if (timers.current[id]) clearTimeout(timers.current[id])
  }

  function persistUser(updatedUser) {
    const clean = normalizeUser(updatedUser)
    setUser(clean)
    const accounts = loadAccounts()
    const next = accounts.some((a) => a.email === clean.email)
      ? accounts.map((a) => (a.email === clean.email ? clean : a))
      : [...accounts, clean]
    saveAccounts(next)
  }

  function addAura(updatedUser, delta, reason) {
    const newScore = clampScore(updatedUser.auraScore + delta)
    const withLog = {
      ...updatedUser,
      auraScore: newScore,
      auraLog: [...updatedUser.auraLog, { date: todayStr(), delta, reason }],
    }
    persistUser(withLog)
  }

  function handleSignup(form) {
    const newUser = makeNewUser(form)
    const accounts = loadAccounts()
    saveAccounts([...accounts, newUser])
    localStorage.setItem(CURRENT_USER_KEY, newUser.email)
    setUser(newUser)
    setPage('dashboard')
    showToast(`Welcome to AuraMapping, ${newUser.nickname}! ✨`, 'success')
  }

  function handleLogin(email, password) {
    const accounts = loadAccounts()
    const found = accounts.find((a) => a.email === email)
    if (!found) {
      showToast('No account found with this email.', 'error')
      return
    }
    if (found.password !== password) {
      showToast('Incorrect password. Please try again.', 'error')
      return
    }
    localStorage.setItem(CURRENT_USER_KEY, found.email)
    const normalized = normalizeUser(found)
    setUser(normalized)
    setPage('dashboard')
    showToast(`Welcome back, ${normalized.nickname}!`, 'success')
  }

  function handleLogout() {
    localStorage.removeItem(CURRENT_USER_KEY)
    setUser(null)
    setAuthScreen('login')
    showToast('You have been logged out.', 'info')
  }

  if (!ready) return null

  if (!user) {
    return (
      <>
        <AuthShell>
          {authScreen === 'login' ? (
            <LoginScreen onSwitch={() => setAuthScreen('signup')} onLogin={handleLogin} />
          ) : (
            <SignupScreen onSwitch={() => setAuthScreen('login')} onSignup={handleSignup} />
          )}
        </AuthShell>
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    )
  }

  return (
    <AuraContext.Provider value={{ user, persistUser, addAura, showToast, page, setPage, onLogout: handleLogout }}>
      <AppShell />
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </AuraContext.Provider>
  )
}
