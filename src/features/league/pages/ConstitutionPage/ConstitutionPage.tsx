import { PixelCard } from '@/shared/components/PixelCard/PixelCard'
import styles from './ConstitutionPage.module.css'

const SECTIONS = [
  {
    title: 'League Format',
    emoji: '🏟️',
    description: 'MSG FFL is a 12-team, head-to-head league playing 14 regular-season weeks.',
    rules: [
      'Platform: Sleeper · Scoring: half-PPR with decimal points to two places.',
      "Weekly lineups lock individually at each player's scheduled kickoff.",
      'Standings tie-breakers: overall record ➝ points for ➝ head-to-head ➝ coin flip.',
    ],
  },
  {
    title: 'Draft & Keepers',
    emoji: '🧠',
    description: 'Annual snake draft that rewards preparation, not auto-draft naps.',
    rules: [
      'Draft order is reverse order of prior-season finish after playoffs.',
      'Managers must pre-rank or attend live; repeated no-shows can be auto-assigned the worst pick slot next year.',
      'No keepers for 2024; league can vote (8+ approvals) to introduce a 1-keeper system for the next season.',
    ],
  },
  {
    title: 'Roster Construction',
    emoji: '🧩',
    description: 'Know the slots before you tilt-drop a starting RB.',
    rules: [
      'Starters: 1 QB, 2 RB, 2 WR, 1 TE, 2 FLEX (RB/WR/TE), 1 K, 1 DEF.',
      'Bench: 6 spots plus 2 IR slots (NFL Out, IR, or PUP designations only).',
      'Waiver-limit: none, but reckless churn that exploits scoring bugs can be vetoed.',
    ],
  },
  {
    title: 'Scoring Highlights',
    emoji: '📈',
    description: 'Full breakdown lives in Sleeper; cliff notes here.',
    rules: [
      'Passing TDs: 4 pts · Rushing/Receiving TDs: 6 pts · 0.5 pt per reception.',
      'Bonuses: +3 for 300 passing yards, +3 for 100 rushing or receiving yards.',
      'Negative scoring: -2 per INT/fumble lost, -1 per missed FG under 40 yards.',
    ],
  },
  {
    title: 'Waivers & Free Agency',
    emoji: '🧾',
    description: 'FAAB ensures hustle beats waiver priority flukes.',
    rules: [
      'Each team starts with 200 FAAB dollars; bids are blind and process daily at 9am MT.',
      'First-come, first-served pickups open after the daily processing window.',
      'FAAB trades are allowed but must involve players/picks and are capped at 50 FAAB per transaction.',
    ],
  },
  {
    title: 'Trades',
    emoji: '🔁',
    description: 'Move pieces, not the goalposts.',
    rules: [
      'Trades process after a 24-hour review window; commissioner only vetoes collusion or tanking.',
      'Trade deadline: kickoff of Week 12 games.',
      'Future draft picks (next season only) may be traded but must stay balanced (same number of picks each side).',
    ],
  },
  {
    title: 'Playoffs & Consolation',
    emoji: '🏆',
    description: 'Pressure season.',
    rules: [
      'Top 6 make playoffs: seeds 1-2 earn byes; weeks 15-17 determine the champion.',
      'Bottom 6 enter the Toilet Bowl; winner secures first pick, loser films the draft-day hype video.',
      'Playoff seeding locks after Week 14—no reseeding.',
    ],
  },
  {
    title: 'Conduct & Competition',
    emoji: '📜',
    description: 'We chirp, but we keep it competitive.',
    rules: [
      'Start active lineups—two intentional zeros equals loss of next available FAAB replenishment.',
      'No tanking or point-dumping; commissioner can reverse moves and issue sanctions.',
      'League votes (simple majority) resolve disputes not covered here; commissioner breaks ties.',
    ],
  },
  {
    title: 'Finance & Payouts',
    emoji: '💸',
    description: 'Put your money where your roster is.',
    rules: [
      'Buy-in: $150 due by draft day (Venmo or cash).',
      'Payouts: 1st $900, 2nd $300, 3rd $150, Toilet Bowl champ $150, Regular-season points leader $150.',
      'Non-payment by Week 1 freezes roster moves until dues clear.',
    ],
  },
  {
    title: 'Commissioner Clause',
    emoji: '🧑‍⚖️',
    description: 'Because chaos needs an adult.',
    rules: [
      'Commissioner can pause transactions during platform outages or scoring audits.',
      'Emergency rule changes require 8+ manager approvals and take effect the following week.',
      'Constitution updates require an offseason vote; mid-season tweaks are for bug fixes only.',
    ],
  },
]

export function ConstitutionPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.kicker}>LEAGUE GOVERNANCE</p>
        <h2 className={styles.title}>⚖️ MSG FFL Constitution</h2>
        <p className={styles.subtitle}>These bylaws keep the chaos fun, the trash talk fair, and the champion legit.</p>
      </header>

      <div className={styles.grid}>
        {SECTIONS.map(({ title, rules, emoji, description }) => (
          <PixelCard key={title} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.emoji} aria-hidden="true">
                {emoji}
              </span>
              <div>
                <h4 className={styles.sectionTitle}>{title}</h4>
                <p className={styles.sectionDescription}>{description}</p>
              </div>
            </div>
            <ol className={styles.ruleList}>
              {rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
          </PixelCard>
        ))}
      </div>
    </div>
  )
}
