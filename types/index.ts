// ═══════════════════════════════════════════════════════════════════════════════
// STRATEGIC COMMAND: TOTAL CONTROL - TYPE DEFINITIONS
// CR AudioViz AI - Henderson Standard
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────────
// USER & AUTH TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface GameProfile {
  id: string;
  user_id: string;
  username: string;
  player_level: number;
  experience: number;
  gold: number;
  elixir: number;
  gems: number;
  total_stars: number;
  total_battles: number;
  battles_won: number;
  clan_id?: string;
  trophy_count: number;
  battle_pass_tier: number;
  battle_pass_premium: boolean;
  last_daily_reward: string | null;
  daily_battles_remaining: number;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// UNIT TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface UnitType {
  id: string;
  name: string;
  description: string;
  hp: number;
  maxHp: number;
  damage: number;
  range: number;
  speed: number;
  attackSpeed: number;
  armor: number;
  cost: number;
  costType: 'gold' | 'elixir' | 'gems';
  color: string;
  icon: string;
  tier: 'common' | 'rare' | 'epic' | 'legendary';
  unlockLevel: number;
  isPremium: boolean;
  splashRadius?: number;
  healAmount?: number;
  flying?: boolean;
  targetBuildings?: boolean;
  abilities?: UnitAbility[];
}

export interface UnitAbility {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  effect: 'damage' | 'heal' | 'buff' | 'debuff' | 'summon';
  value: number;
  radius?: number;
  duration?: number;
}

export interface Unit extends UnitType {
visibleuniqId: string;
  x: number;
  y: number;
  targetX: number | null;
  targetY: number | null;
  targetEntity: string | null;
  lastAttack: number;
  isMoving: boolean;
  rageBoost: number | null;
  frozen: boolean;
  damageMult: number;
  speedMult: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// DEFENSE TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface DefenseType {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  damage: number;
  range: number;
  minRange?: number;
  attackSpeed: number;
  color: string;
  icon: string;
  targetAir: boolean;
  targetGround: boolean;
  splashRadius?: number;
  damageRamp?: number;
}

export interface Defense extends DefenseType {
  uniqId: string;
  x: number;
  y: number;
  currentTarget: string | null;
  lastAttack: number;
  infernoStacks: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// BUILDING TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface BuildingType {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  color: string;
  icon: string;
  width: number;
  height: number;
  isCore?: boolean;
  resourceValue?: number;
}

export interface Building extends BuildingType {
  uniqId: string;
  x: number;
  y: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SPELL TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface SpellType {
  id: string;
  name: string;
  description: string;
  cost: number;
  costType: 'gold' | 'elixir' | 'gems';
  radius: number;
  icon: string;
  color: string;
  cooldown: number;
  unlockLevel: number;
  isPremium: boolean;
  damage?: number;
  healAmount?: number;
  damageBoost?: number;
  speedBoost?: number;
  duration?: number;
}

export interface SpellEffect {
  id: string;
  type: string;
  x: number;
  y: number;
  radius: number;
  endTime: number;
  damageBoost?: number;
  speedBoost?: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CAMPAIGN & LEVEL TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface CampaignLevel {
  id: number;
  chapter: number;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert' | 'Legendary';
  goldReward: number;
  elixirReward: number;
  gemsReward: number;
  experienceReward: number;
  maxUnits: number;
  timeLimit: number;
  defenses: LevelDefense[];
  buildings: LevelBuilding[];
  availableUnits: string[];
  availableSpells: string[];
  starRequirements: {
    one: number;   // Destruction % for 1 star
    two: number;   // Destruction % for 2 stars
    three: number; // Destruction % for 3 stars (usually 100)
  };
  specialConditions?: string[];
}

export interface LevelDefense {
  type: string;
  x: number;
  y: number;
  level?: number;
}

export interface LevelBuilding {
  type: string;
  x: number;
  y: number;
  level?: number;
}

export interface LevelProgress {
  id: string;
  user_id: string;
  level_id: number;
  stars: number;
  best_time: number;
  best_destruction: number;
  attempts: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// BATTLE TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface BattleState {
  status: 'preparing' | 'active' | 'paused' | 'victory' | 'defeat';
  level: CampaignLevel | null;
  units: Unit[];
  defenses: Defense[];
  buildings: Building[];
  selectedUnits: string[];
  deployQueue: DeployQueueItem[];
  spellEffects: SpellEffect[];
  projectiles: Projectile[];
  explosions: Explosion[];
  battleTime: number;
  stats: BattleStats;
}

export interface DeployQueueItem {
  type: string;
  count: number;
  maxCount: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  damage: number;
  targetId?: string;
  targetUnitId?: string;
  color: string;
  splash?: number;
  isEnemy: boolean;
}

export interface Explosion {
  id: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  startTime: number;
  duration: number;
}

export interface BattleStats {
  damageDealt: number;
  buildingsDestroyed: number;
  defensesDestroyed: number;
  unitsDeployed: number;
  unitsLost: number;
  spellsUsed: number;
  destructionPercent: number;
}

export interface BattleResult {
  id: string;
  user_id: string;
  level_id: number;
  stars: number;
  destruction_percent: number;
  time_remaining: number;
  gold_earned: number;
  elixir_earned: number;
  gems_earned: number;
  experience_earned: number;
  units_deployed: number;
  units_lost: number;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// SHOP & MONETIZATION TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  type: 'gems' | 'gold' | 'elixir' | 'unit' | 'spell' | 'skin' | 'bundle' | 'battle_pass';
  price: number;
  priceType: 'usd' | 'gems';
  value: number;
  bonusValue?: number;
  bonusPercent?: number;
  icon: string;
  imageUrl?: string;
  stripePriceId?: string;
  paypalPlanId?: string;
  isPopular?: boolean;
  isBestValue?: boolean;
  isLimitedTime?: boolean;
  expiresAt?: string;
}

export interface GemPackage {
  id: string;
  gems: number;
  bonusGems: number;
  price: number;
  stripePriceId: string;
  isPopular?: boolean;
  isBestValue?: boolean;
}

export interface Purchase {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  amount: number;
  price: number;
  currency: string;
  payment_provider: 'stripe' | 'paypal' | 'credits';
  payment_id: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// BATTLE PASS TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface BattlePass {
  id: string;
  season: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  premiumPrice: number;
  maxTier: number;
  rewards: BattlePassReward[];
}

export interface BattlePassReward {
  tier: number;
  freeReward?: Reward;
  premiumReward?: Reward;
}

export interface Reward {
  type: 'gold' | 'elixir' | 'gems' | 'unit' | 'spell' | 'skin' | 'avatar' | 'title';
  value: number;
  itemId?: string;
}

export interface UserBattlePass {
  id: string;
  user_id: string;
  season: number;
  current_tier: number;
  current_xp: number;
  is_premium: boolean;
  claimed_free_rewards: number[];
  claimed_premium_rewards: number[];
  purchased_at?: string;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CLAN TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface Clan {
  id: string;
  name: string;
  tag: string;
  description: string;
  badge_id: string;
  leader_id: string;
  trophy_count: number;
  member_count: number;
  max_members: number;
  min_trophies: number;
  is_public: boolean;
  war_wins: number;
  war_losses: number;
  created_at: string;
  updated_at: string;
}

export interface ClanMember {
  id: string;
  clan_id: string;
  user_id: string;
  role: 'leader' | 'co-leader' | 'elder' | 'member';
  donations: number;
  donations_received: number;
  joined_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// DAILY REWARDS & ACHIEVEMENTS
// ─────────────────────────────────────────────────────────────────────────────────

export interface DailyReward {
  day: number;
  reward: Reward;
  isMilestone: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'battle' | 'collection' | 'social' | 'progression' | 'special';
  requirement: number;
  reward: Reward;
  isHidden: boolean;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  progress: number;
  completed: boolean;
  completed_at?: string;
  claimed: boolean;
  claimed_at?: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// LEADERBOARD TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url?: string;
  trophy_count: number;
  clan_name?: string;
  player_level: number;
}

// ─────────────────────────────────────────────────────────────────────────────────
// CR AUDIOVIZ AI INTEGRATION TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface PlatformCredits {
  user_id: string;
  balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
}

export interface CrossSellEvent {
  id: string;
  user_id: string;
  source_app: string;
  target_app: string;
  event_type: 'view' | 'click' | 'conversion';
  metadata?: Record<string, unknown>;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────────
// API RESPONSE TYPES
// ─────────────────────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
