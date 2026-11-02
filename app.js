
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const db = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

let user = null;
let events = [];
let habits = [];
let xp = 0;

const $ = id => document.getElementById(id);

const today = () => new Date().toISOString().slice(0, 10);

const points = (category, impact) => {
  if (category === "positive") return impact * 7;
  if (category === "negative") return impact * -7;
  return 0;
};

function level() {
  if (xp < 100) return "Aura Explorer";
  if (xp < 300) return "Aura Starter";
  if (xp < 600) return "Aura Glow";
  if (xp < 1000) return "Aura Master";
  return "Aura Legend";
}

function dailyAura() {
  const total = events
    .filter(e => e.created_at.slice(0, 10) === today())
    .reduce((sum, e) => sum + e.points, 0);

  return Math.max(0, Math.min(100, 50 + total));
}

function showMessage(id, text) {
  $(id).textContent = text;
}

// AUTH
$("signupBtn").onclick = async () => {
  const email = $("email").value;
  const password = $("password").value;

  const { error } = await db.auth.signUp({
    email,
    password
  });

  showMessage(
    "authMessage",
    error ? error.message : "Account created! Check email if confirmation is enabled."
  );
};

$("loginBtn").onclick = async () => {
  const email = $("email").value;
  const password = $("password").value;

  const { data, error } = await db.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showMessage("authMessage", error.message);
    return;
  }

  user = data.user;
  await startApp();
};

$("logoutBtn").onclick = async () => {
  await db.auth.signOut();
  location.reload();
};

async function startApp() {
  $("authScreen").classList.add("hidden");
  $("appScreen").classList.remove("hidden");
  $("logoutBtn").classList.remove("hidden");

  await loadEvents();
  await loadHabits();
  render();
}

// LOAD EVENTS
async function loadEvents() {
  const { data, error } = await db
    .from("aura_events")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (!error) events = data || [];
}

// ADD MOMENT
$("addMomentBtn").onclick = async () => {
  const moment = $("moment").value.trim();
  const category = $("category").value;
  const impact = Number($("impact").value);

  if (!moment) {
    showMessage("momentMessage", "Moment likho pehle 😭");
    return;
  }

  const change = points(category, impact);

  const { data, error } = await db
    .from("aura_events")
    .insert({
      user_id: user.id,
      moment,
      category,
      impact,
      points: change
    })
    .select()
    .single();

  if (error) {
    showMessage("momentMessage", error.message);
    return;
  }

  events.unshift(data);
  xp += 5;

  $("moment").value = "";
  showMessage(
    "momentMessage",
    `${change >= 0 ? "+" : ""}${change} Aura · +5 XP ✨`
  );

  render();
};

// HABITS
async function loadHabits() {
  const { data, error } = await db
    .from("habits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at");

  if (!error) habits = data || [];
}

$("addHabitBtn").onclick = () => {
  $("habitForm").classList.toggle("hidden");
};

$("saveHabitBtn").onclick = async () => {
  const name = $("habitName").value.trim();
  const icon = $("habitIcon").value || "✨";
  const habitXP = Number($("habitXP").value) || 10;

  if (!name) return;

  const { data, error } = await db
    .from("habits")
    .insert({
      user_id: user.id,
      name,
      icon,
      xp: habitXP
    })
    .select()
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  habits.push(data);

  $("habitName").value = "";
  $("habitForm").classList.add("hidden");

  render();
};

// COMPLETE HABIT
async function completeHabit(habit) {
  const { error } = await db
    .from("habit_logs")
    .insert({
      user_id: user.id,
      habit_id: habit.id,
      completed_on: today()
    });

  if (error) {
    if (error.code === "23505") {
      alert("Already completed today!");
    } else {
      alert(error.message);
    }
    return;
  }

  xp += habit.xp;
  render();
}

// RENDER
function render() {
  const score = dailyAura();

  $("auraScore").textContent = score;
  $("auraLevel").textContent = level();
  $("xp").textContent = xp;
  $("xpBar").style.width = (xp % 100) + "%";

  $("auraMessage").textContent =
    score >= 80 ? "✨ Main character energy!" :
    score >= 60 ? "💜 Good vibes, keep going." :
    score >= 40 ? "🌿 Balanced energy." :
    "🫶 Low day? Rest and reset.";

  $("eventList").innerHTML = events
    .filter(e => e.created_at.slice(0, 10) === today())
    .map(e => `
      <div class="event">
        <div>${e.category === "positive" ? "✨" :
          e.category === "negative" ? "😵" : "🌿"}
          ${escapeHTML(e.moment)}
        </div>
        <b class="${e.points >= 0 ? "positive" : "negative"}">
          ${e.points > 0 ? "+" : ""}${e.points}
        </b>
      </div>
    `).join("") || `<p class="muted">No moments yet.</p>`;

  $("habitList").innerHTML = habits.map(h => `
    <div class="habit">
      <span>${h.icon}</span>
      <span style="flex:1">${escapeHTML(h.name)}</span>
      <small>+${h.xp} XP</small>
      <button class="small-btn" onclick='completeHabit(${JSON.stringify(h)})'>
        ✓
      </button>
    </div>
  `).join("") || `<p class="muted">Add your first habit!</p>`;

  renderWeekly();
  renderMonthly();
  renderRewards();
}

function renderWeekly() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);

    const total = events
      .filter(e => e.created_at.slice(0, 10) === date)
      .reduce((sum, e) => sum + e.points, 0);

    days.push({ date, score: Math.max(0, Math.min(100, 50 + total)) });
  }

  const avg = Math.round(
    days.reduce((sum, d) => sum + d.score, 0) / 7
  );

  $("weeklyAvg").textContent = avg;

  $("weeklyChart").innerHTML = days.map(d => `
    <div class="chart-bar" style="height:${d.score}%">
      <span>${d.date.slice(8)}</span>
    </div>
  `).join("");
}

function renderMonthly() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const days = new Date(year, month + 1, 0).getDate();

  const values = [];

  for (let i = 1; i <= days; i++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

    const total = events
      .filter(e => e.created_at.slice(0, 10) === date)
      .reduce((sum, e) => sum + e.points, 0);

    values.push(Math.max(0, Math.min(100, 50 + total)));
  }

  $("monthlyAvg").textContent = Math.round(
    values.reduce((a, b) => a + b, 0) / days
  );

  $("monthlyCalendar").innerHTML = values.map((v, i) => `
    <div class="day" title="Day ${i + 1}: ${v}">
      ${i + 1}
      <br>
      <small>${v}</small>
    </div>
  `).join("");
}

function renderRewards() {
  const rewards = [
    ["🎤", "Class Confidence", "Log a nervous class moment", 20],
    ["💻", "DSA Warrior", "Complete DSA practice", 50],
    ["🧘", "Inner Peace", "Meditation streak", 30],
    ["🏃", "Move Your Aura", "Run or stretch", 30],
    ["📖", "Night Reader", "Read before sleeping", 30]
  ];

  $("rewardsList").innerHTML = rewards.map(r => `
    <div class="reward">
      <span style="font-size:28px">${r[0]}</span>
      <div style="flex:1">
        <b>${r[1]}</b>
        <p class="muted">${r[2]}</p>
        <small>+${r[3]} XP</small>
      </div>
    </div>
  `).join("");
}

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));
}

// TABS
document.querySelectorAll("[data-tab]").forEach(button => {
  button.onclick = () => {
    document.querySelectorAll(".tab-content")
      .forEach(s => s.classList.add("hidden"));

    document.querySelectorAll("[data-tab]")
      .forEach(b => b.classList.remove("active"));

    $(button.dataset.tab).classList.remove("hidden");
    button.classList.add("active");
  };
});

// CHECK SESSION
(async () => {
  const { data } = await db.auth.getSession();

  if (data.session) {
    user = data.session.user;
    await startApp();
  }
})();