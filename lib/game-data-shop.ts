// ═══════════════════════════════════════════════════════════════════════════════
// GAME DATA CONSTANTS - PART 2
// Shop Items, Daily Rewards, Achievements, Battle Pass
// CR AudioViz AI - Henderson Standard
// ═══════════════════════════════════════════════════════════════════════════════

import type { GemPackage, DailyReward, Achievement, BattlePass, ShopItem } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────────
// GEM PACKAGES (Stripe Integration)
// ─────────────────────────────────────────────────────────────────────────────────

export const GEM_PACKAGES: GemPackage[] = [
  {
    id: 'gems_100',
    gems: 100,
    bonusGems: 0,
    price: 0.99,
    stripePriceId: 'price_gems_100',
  },
  {
    id: 'gems_500',
    gems: 500,
    bonusGems: 50,
    price: 4.99,
    stripePriceId: 'price_gems_500',
    isPopular: true,
  },
  {
    id: 'gems_1200',
    gems: 1200,
    bonusGems: 200,
    price: 9.99,
    stripePriceId: 'price_gems_1200',
  },
  {
    id: 'gems_2500',
    gems: 2500,
    bonusGems: 500,
    price: 19.99,
    stripePriceId: 'price_gems_2500',
    isBestValue: true,
  },
  {
    id: 'gems_6500',
    gems: 6500,
    bonusGems: 1500,
    price: 49.99,
    stripePriceId: 'price_gems_6500',
  },
  {
    id: 'gems_14000',
    gems: 14000,
    bonusGems: 4000,
    price: 99.99,
    stripePriceId: 'price_gems_14000',
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// DAILY REWARDS (30-Day Cycle)
// ─────────────────────────────────────────────────────────────────────────────────

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, reward: { type: 'gold', value: 500 }, isMilestone: false },
  { day: 2, reward: { type: 'elixir', value: 500 }, isMilestone: false },
  { day: 3, reward: { type: 'gold', value: 750 }, isMilestone: false },
  { day: 4, reward: { type: 'elixir', value: 750 }, isMilestone: false },
  { day: 5, reward: { type: 'gems', value: 10 }, isMilestone: true },
  { day: 6, reward: { type: 'gold', value: 1000 }, isMilestone: false },
  { day: 7, reward: { type: 'gems', value: 25 }, isMilestone: true },
  { day: 8, reward: { type: 'elixir', value: 1000 }, isMilestone: false },
  { day: 9, reward: { type: 'gold', value: 1250 }, isMilestone: false },
  { day: 10, reward: { type: 'gems', value: 30 }, isMilestone: true },
  { day: 11, reward: { type: 'elixir', value: 1250 }, isMilestone: false },
  { day: 12, reward: { type: 'gold', value: 1500 }, isMilestone: false },
  { day: 13, reward: { type: 'elixir', value: 1500 }, isMilestone: false },
  { day: 14, reward: { type: 'gems', value: 50 }, isMilestone: true },
  { day: 15, reward: { type: 'gold', value: 2000 }, isMilestone: false },
  { day: 16, reward: { type: 'elixir', value: 2000 }, isMilestone: false },
  { day: 17, reward: { type: 'gold', value: 2500 }, isMilestone: false },
  { day: 18, reward: { type: 'elixir', value: 2500 }, isMilestone: false },
  { day: 19, reward: { type: 'gold', value: 3000 }, isMilestone: false },
  { day: 20, reward: { type: 'gems', value: 75 }, isMilestone: true },
  { day: 21, reward: { type: 'gems', value: 100 }, isMilestone: true },
  { day: 22, reward: { type: 'gold', value: 5000 }, isMilestone: false },
  { day: 23, reward: { type: 'elixir', value: 5000 }, isMilestone: false },
  { day: 24, reward: { type: 'gold', value: 7500 }, isMilestone: false },
  { day: 25, reward: { type: 'elixir', value: 7500 }, isMilestone: false },
  { day: 26, reward: { type: 'gold', value: 10000 }, isMilestone: false },
  { day: 27, reward: { type: 'elixir', value: 10000 }, isMilestone: false },
  { day: 28, reward: { type: 'gems', value: 150 }, isMilestone: true },
  { day: 29, reward: { type: 'gold', value: 15000 }, isMilestone: false },
  { day: 30, reward: { type: 'gems', value: 300 }, isMilestone: true },
];

// ─────────────────────────────────────────────────────────────────────────────────
// ACHIEVEMENTS (50 Achievements)
// ─────────────────────────────────────────────────────────────────────────────────

export const ACHIEVEMENTS: Achievement[] = [
  // Battle Achievements
  { id: 'first_blood', name: 'First Blood', description: 'Win your first battle', icon: '⚔️', category: 'battle', requirement: 1, reward: { type: 'gems', value: 10 }, isHidden: false },
  { id: 'battle_veteran', name: 'Battle Veteran', description: 'Win 50 battles', icon: '🎖️', category: 'battle', requirement: 50, reward: { type: 'gems', value: 50 }, isHidden: false },
  { id: 'war_hero', name: 'War Hero', description: 'Win 200 battles', icon: '🏆', category: 'battle', requirement: 200, reward: { type: 'gems', value: 150 }, isHidden: false },
  { id: 'legendary_commander', name: 'Legendary Commander', description: 'Win 500 battles', icon: '👑', category: 'battle', requirement: 500, reward: { type: 'gems', value: 500 }, isHidden: false },
  { id: 'perfect_victory', name: 'Perfect Victory', description: 'Win with all units surviving', icon: '💯', category: 'battle', requirement: 1, reward: { type: 'gems', value: 25 }, isHidden: false },
  { id: 'speedrunner', name: 'Speedrunner', description: 'Win a battle in under 60 seconds', icon: '⚡', category: 'battle', requirement: 1, reward: { type: 'gems', value: 30 }, isHidden: false },
  { id: 'three_star_general', name: 'Three Star General', description: 'Get 3 stars on 10 levels', icon: '⭐', category: 'battle', requirement: 10, reward: { type: 'gems', value: 100 }, isHidden: false },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Get 3 stars on all 25 levels', icon: '🌟', category: 'battle', requirement: 25, reward: { type: 'gems', value: 500 }, isHidden: false },
  
  // Collection Achievements
  { id: 'unit_collector', name: 'Unit Collector', description: 'Unlock 5 different units', icon: '📦', category: 'collection', requirement: 5, reward: { type: 'gems', value: 25 }, isHidden: false },
  { id: 'army_builder', name: 'Army Builder', description: 'Unlock all common units', icon: '🏗️', category: 'collection', requirement: 4, reward: { type: 'gems', value: 50 }, isHidden: false },
  { id: 'rare_finder', name: 'Rare Finder', description: 'Unlock all rare units', icon: '💎', category: 'collection', requirement: 3, reward: { type: 'gems', value: 75 }, isHidden: false },
  { id: 'epic_hunter', name: 'Epic Hunter', description: 'Unlock all epic units', icon: '🔮', category: 'collection', requirement: 3, reward: { type: 'gems', value: 100 }, isHidden: false },
  { id: 'legendary_seeker', name: 'Legendary Seeker', description: 'Unlock all legendary units', icon: '🌈', category: 'collection', requirement: 3, reward: { type: 'gems', value: 200 }, isHidden: false },
  { id: 'spell_master', name: 'Spell Master', description: 'Unlock all spells', icon: '📚', category: 'collection', requirement: 8, reward: { type: 'gems', value: 150 }, isHidden: false },
  
  // Progression Achievements
  { id: 'level_5', name: 'Rising Star', description: 'Reach player level 5', icon: '🌱', category: 'progression', requirement: 5, reward: { type: 'gold', value: 1000 }, isHidden: false },
  { id: 'level_10', name: 'Experienced', description: 'Reach player level 10', icon: '🌿', category: 'progression', requirement: 10, reward: { type: 'gems', value: 50 }, isHidden: false },
  { id: 'level_20', name: 'Skilled', description: 'Reach player level 20', icon: '🌳', category: 'progression', requirement: 20, reward: { type: 'gems', value: 100 }, isHidden: false },
  { id: 'level_50', name: 'Master', description: 'Reach player level 50', icon: '🏔️', category: 'progression', requirement: 50, reward: { type: 'gems', value: 250 }, isHidden: false },
  { id: 'level_100', name: 'Legend', description: 'Reach player level 100', icon: '🌋', category: 'progression', requirement: 100, reward: { type: 'gems', value: 1000 }, isHidden: false },
  { id: 'chapter_1', name: 'Training Complete', description: 'Complete Chapter 1', icon: '📖', category: 'progression', requirement: 1, reward: { type: 'gems', value: 25 }, isHidden: false },
  { id: 'chapter_2', name: 'Mortar Master', description: 'Complete Chapter 2', icon: '📗', category: 'progression', requirement: 1, reward: { type: 'gems', value: 50 }, isHidden: false },
  { id: 'chapter_3', name: 'Inferno Survivor', description: 'Complete Chapter 3', icon: '📘', category: 'progression', requirement: 1, reward: { type: 'gems', value: 75 }, isHidden: false },
  { id: 'chapter_4', name: 'Eagle Slayer', description: 'Complete Chapter 4', icon: '📙', category: 'progression', requirement: 1, reward: { type: 'gems', value: 100 }, isHidden: false },
  { id: 'chapter_5', name: 'Campaign Champion', description: 'Complete all chapters', icon: '📕', category: 'progression', requirement: 1, reward: { type: 'gems', value: 500 }, isHidden: false },
  
  // Social Achievements
  { id: 'clan_member', name: 'Team Player', description: 'Join a clan', icon: '🤝', category: 'social', requirement: 1, reward: { type: 'gems', value: 20 }, isHidden: false },
  { id: 'clan_leader', name: 'Born Leader', description: 'Create a clan', icon: '👔', category: 'social', requirement: 1, reward: { type: 'gems', value: 50 }, isHidden: false },
  { id: 'generous', name: 'Generous', description: 'Donate troops 10 times', icon: '🎁', category: 'social', requirement: 10, reward: { type: 'gems', value: 30 }, isHidden: false },
  { id: 'philanthropist', name: 'Philanthropist', description: 'Donate troops 100 times', icon: '💝', category: 'social', requirement: 100, reward: { type: 'gems', value: 100 }, isHidden: false },
  
  // Special Achievements
  { id: 'early_bird', name: 'Early Bird', description: 'Play during launch week', icon: '🐦', category: 'special', requirement: 1, reward: { type: 'gems', value: 100 }, isHidden: false },
  { id: 'daily_warrior', name: 'Daily Warrior', description: 'Log in 7 days in a row', icon: '📅', category: 'special', requirement: 7, reward: { type: 'gems', value: 50 }, isHidden: false },
  { id: 'dedicated', name: 'Dedicated', description: 'Log in 30 days in a row', icon: '🗓️', category: 'special', requirement: 30, reward: { type: 'gems', value: 200 }, isHidden: false },
  { id: 'whale', name: 'Supporter', description: 'Make your first purchase', icon: '💎', category: 'special', requirement: 1, reward: { type: 'gems', value: 100 }, isHidden: false },
  { id: 'vip', name: 'VIP', description: 'Purchase Battle Pass', icon: '⭐', category: 'special', requirement: 1, reward: { type: 'gems', value: 50 }, isHidden: false },
  
  // Hidden Achievements
  { id: 'underdog', name: 'Underdog', description: 'Win with only 3 units', icon: '🐕', category: 'special', requirement: 1, reward: { type: 'gems', value: 75 }, isHidden: true },
  { id: 'dragon_rider', name: 'Dragon Rider', description: 'Win using only dragons', icon: '🐲', category: 'special', requirement: 1, reward: { type: 'gems', value: 100 }, isHidden: true },
  { id: 'spell_only', name: 'Magic Touch', description: 'Destroy Town Hall with spells only', icon: '✨', category: 'special', requirement: 1, reward: { type: 'gems', value: 150 }, isHidden: true },
  { id: 'no_losses', name: 'Invincible', description: 'Complete 10 battles without losing a unit', icon: '🛡️', category: 'special', requirement: 10, reward: { type: 'gems', value: 200 }, isHidden: true },
];

// ─────────────────────────────────────────────────────────────────────────────────
// BATTLE PASS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

export const CURRENT_BATTLE_PASS: BattlePass = {
  id: 'season_1',
  season: 1,
  name: 'Season of Conquest',
  description: 'The first season of Strategic Command brings exclusive rewards!',
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-03-01T00:00:00Z',
  premiumPrice: 499, // gems
  maxTier: 50,
  rewards: [
    // Tier 1-10
    { tier: 1, freeReward: { type: 'gold', value: 1000 }, premiumReward: { type: 'gems', value: 20 } },
    { tier: 2, freeReward: { type: 'elixir', value: 1000 }, premiumReward: { type: 'gold', value: 5000 } },
    { tier: 3, freeReward: { type: 'gold', value: 1500 }, premiumReward: { type: 'elixir', value: 5000 } },
    { tier: 4, freeReward: { type: 'elixir', value: 1500 }, premiumReward: { type: 'gems', value: 30 } },
    { tier: 5, freeReward: { type: 'gems', value: 10 }, premiumReward: { type: 'skin', value: 1, itemId: 'skin_warrior_gold' } },
    { tier: 6, freeReward: { type: 'gold', value: 2000 }, premiumReward: { type: 'gold', value: 10000 } },
    { tier: 7, freeReward: { type: 'elixir', value: 2000 }, premiumReward: { type: 'elixir', value: 10000 } },
    { tier: 8, freeReward: { type: 'gold', value: 2500 }, premiumReward: { type: 'gems', value: 40 } },
    { tier: 9, freeReward: { type: 'elixir', value: 2500 }, premiumReward: { type: 'avatar', value: 1, itemId: 'avatar_knight' } },
    { tier: 10, freeReward: { type: 'gems', value: 20 }, premiumReward: { type: 'skin', value: 1, itemId: 'skin_archer_fire' } },
    // Tier 11-20
    { tier: 11, freeReward: { type: 'gold', value: 3000 }, premiumReward: { type: 'gold', value: 15000 } },
    { tier: 12, freeReward: { type: 'elixir', value: 3000 }, premiumReward: { type: 'elixir', value: 15000 } },
    { tier: 13, freeReward: { type: 'gold', value: 3500 }, premiumReward: { type: 'gems', value: 50 } },
    { tier: 14, freeReward: { type: 'elixir', value: 3500 }, premiumReward: { type: 'title', value: 1, itemId: 'title_champion' } },
    { tier: 15, freeReward: { type: 'gems', value: 30 }, premiumReward: { type: 'skin', value: 1, itemId: 'skin_tank_diamond' } },
    { tier: 16, freeReward: { type: 'gold', value: 4000 }, premiumReward: { type: 'gold', value: 20000 } },
    { tier: 17, freeReward: { type: 'elixir', value: 4000 }, premiumReward: { type: 'elixir', value: 20000 } },
    { tier: 18, freeReward: { type: 'gold', value: 4500 }, premiumReward: { type: 'gems', value: 60 } },
    { tier: 19, freeReward: { type: 'elixir', value: 4500 }, premiumReward: { type: 'avatar', value: 1, itemId: 'avatar_dragon' } },
    { tier: 20, freeReward: { type: 'gems', value: 40 }, premiumReward: { type: 'skin', value: 1, itemId: 'skin_mage_cosmic' } },
    // Tier 21-30
    { tier: 21, freeReward: { type: 'gold', value: 5000 }, premiumReward: { type: 'gold', value: 25000 } },
    { tier: 22, freeReward: { type: 'elixir', value: 5000 }, premiumReward: { type: 'elixir', value: 25000 } },
    { tier: 23, freeReward: { type: 'gold', value: 6000 }, premiumReward: { type: 'gems', value: 75 } },
    { tier: 24, freeReward: { type: 'elixir', value: 6000 }, premiumReward: { type: 'title', value: 1, itemId: 'title_conqueror' } },
    { tier: 25, freeReward: { type: 'gems', value: 50 }, premiumReward: { type: 'skin', value: 1, itemId: 'skin_giant_inferno' } },
    { tier: 26, freeReward: { type: 'gold', value: 7000 }, premiumReward: { type: 'gold', value: 30000 } },
    { tier: 27, freeReward: { type: 'elixir', value: 7000 }, premiumReward: { type: 'elixir', value: 30000 } },
    { tier: 28, freeReward: { type: 'gold', value: 8000 }, premiumReward: { type: 'gems', value: 100 } },
    { tier: 29, freeReward: { type: 'elixir', value: 8000 }, premiumReward: { type: 'avatar', value: 1, itemId: 'avatar_phoenix' } },
    { tier: 30, freeReward: { type: 'gems', value: 75 }, premiumReward: { type: 'skin', value: 1, itemId: 'skin_dragon_shadow' } },
    // Tier 31-40
    { tier: 31, freeReward: { type: 'gold', value: 9000 }, premiumReward: { type: 'gold', value: 40000 } },
    { tier: 32, freeReward: { type: 'elixir', value: 9000 }, premiumReward: { type: 'elixir', value: 40000 } },
    { tier: 33, freeReward: { type: 'gold', value: 10000 }, premiumReward: { type: 'gems', value: 125 } },
    { tier: 34, freeReward: { type: 'elixir', value: 10000 }, premiumReward: { type: 'title', value: 1, itemId: 'title_warlord' } },
    { tier: 35, freeReward: { type: 'gems', value: 100 }, premiumReward: { type: 'skin', value: 1, itemId: 'skin_healer_divine' } },
    { tier: 36, freeReward: { type: 'gold', value: 12000 }, premiumReward: { type: 'gold', value: 50000 } },
    { tier: 37, freeReward: { type: 'elixir', value: 12000 }, premiumReward: { type: 'elixir', value: 50000 } },
    { tier: 38, freeReward: { type: 'gold', value: 15000 }, premiumReward: { type: 'gems', value: 150 } },
    { tier: 39, freeReward: { type: 'elixir', value: 15000 }, premiumReward: { type: 'avatar', value: 1, itemId: 'avatar_legend' } },
    { tier: 40, freeReward: { type: 'gems', value: 150 }, premiumReward: { type: 'skin', value: 1, itemId: 'skin_wizard_arcane' } },
    // Tier 41-50
    { tier: 41, freeReward: { type: 'gold', value: 20000 }, premiumReward: { type: 'gold', value: 75000 } },
    { tier: 42, freeReward: { type: 'elixir', value: 20000 }, premiumReward: { type: 'elixir', value: 75000 } },
    { tier: 43, freeReward: { type: 'gold', value: 25000 }, premiumReward: { type: 'gems', value: 200 } },
    { tier: 44, freeReward: { type: 'elixir', value: 25000 }, premiumReward: { type: 'title', value: 1, itemId: 'title_supreme' } },
    { tier: 45, freeReward: { type: 'gems', value: 200 }, premiumReward: { type: 'skin', value: 1, itemId: 'skin_golem_crystal' } },
    { tier: 46, freeReward: { type: 'gold', value: 30000 }, premiumReward: { type: 'gold', value: 100000 } },
    { tier: 47, freeReward: { type: 'elixir', value: 30000 }, premiumReward: { type: 'elixir', value: 100000 } },
    { tier: 48, freeReward: { type: 'gold', value: 40000 }, premiumReward: { type: 'gems', value: 300 } },
    { tier: 49, freeReward: { type: 'elixir', value: 40000 }, premiumReward: { type: 'avatar', value: 1, itemId: 'avatar_supreme' } },
    { tier: 50, freeReward: { type: 'gems', value: 500 }, premiumReward: { type: 'skin', value: 1, itemId: 'skin_phoenix_celestial' } },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────────
// SPECIAL SHOP ITEMS
// ─────────────────────────────────────────────────────────────────────────────────

export const SHOP_ITEMS: ShopItem[] = [
  // Starter Bundles
  {
    id: 'starter_pack',
    name: 'Starter Pack',
    description: 'Perfect for new commanders! Includes gems, gold, and elixir.',
    type: 'bundle',
    price: 4.99,
    priceType: 'usd',
    value: 500,
    bonusValue: 5000, // gold
    icon: '🎁',
    stripePriceId: 'price_starter_pack',
    isLimitedTime: true,
  },
  {
    id: 'legendary_bundle',
    name: 'Legendary Bundle',
    description: 'Unlock all legendary units instantly!',
    type: 'bundle',
    price: 29.99,
    priceType: 'usd',
    value: 3,
    icon: '🌟',
    stripePriceId: 'price_legendary_bundle',
    isBestValue: true,
  },
  // Battle Pass
  {
    id: 'battle_pass_premium',
    name: 'Premium Battle Pass',
    description: 'Unlock premium rewards track for Season 1!',
    type: 'battle_pass',
    price: 499,
    priceType: 'gems',
    value: 1,
    icon: '🏆',
  },
  // Resource Boosters
  {
    id: 'gold_boost',
    name: 'Gold Rush',
    description: '2x Gold rewards for 24 hours',
    type: 'gold',
    price: 50,
    priceType: 'gems',
    value: 24,
    icon: '💰',
  },
  {
    id: 'elixir_boost',
    name: 'Elixir Surge',
    description: '2x Elixir rewards for 24 hours',
    type: 'elixir',
    price: 50,
    priceType: 'gems',
    value: 24,
    icon: '🧪',
  },
  // Energy Refills
  {
    id: 'energy_refill',
    name: 'Battle Energy',
    description: 'Restore 5 battle attempts',
    type: 'bundle',
    price: 25,
    priceType: 'gems',
    value: 5,
    icon: '⚡',
  },
];

// ─────────────────────────────────────────────────────────────────────────────────
// EXPERIENCE & LEVELING
// ─────────────────────────────────────────────────────────────────────────────────

export const LEVEL_XP_REQUIREMENTS: number[] = [
  0,      // Level 1
  100,    // Level 2
  250,    // Level 3
  500,    // Level 4
  850,    // Level 5
  1300,   // Level 6
  1850,   // Level 7
  2500,   // Level 8
  3250,   // Level 9
  4100,   // Level 10
  5050,   // Level 11
  6100,   // Level 12
  7250,   // Level 13
  8500,   // Level 14
  9850,   // Level 15
  11300,  // Level 16
  12850,  // Level 17
  14500,  // Level 18
  16250,  // Level 19
  18100,  // Level 20
  // Continue pattern: each level requires ~10% more XP
];

// Generate levels up to 100
for (let i = LEVEL_XP_REQUIREMENTS.length; i <= 100; i++) {
  const prevXP = LEVEL_XP_REQUIREMENTS[i - 1];
  LEVEL_XP_REQUIREMENTS.push(Math.floor(prevXP * 1.1));
}

// ─────────────────────────────────────────────────────────────────────────────────
// GAME CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────────

export const GAME_CONFIG = {
  // Battle settings
  TILE_SIZE: 40,
  MAP_WIDTH: 20,
  MAP_HEIGHT: 14,
  DEFAULT_BATTLE_TIME: 180,
  DEPLOYMENT_ZONE_WIDTH: 5,
  
  // Daily limits
  FREE_DAILY_BATTLES: 5,
  MAX_DAILY_BATTLES: 50,
  
  // Economy
  STARTING_GOLD: 1000,
  STARTING_ELIXIR: 1000,
  STARTING_GEMS: 50,
  
  // Clan settings
  MIN_CLAN_NAME_LENGTH: 3,
  MAX_CLAN_NAME_LENGTH: 15,
  MAX_CLAN_MEMBERS: 50,
  CLAN_CREATION_COST: 500, // gems
  
  // Battle Pass
  XP_PER_TIER: 500,
  
  // Platform integration
  PLATFORM_NAME: 'CR AudioViz AI',
  PLATFORM_URL: 'https://craudiovizai.com',
  CREDITS_CONVERSION_RATE: 100, // 100 platform credits = 1 gem
};

export default {
  GEM_PACKAGES,
  DAILY_REWARDS,
  ACHIEVEMENTS,
  CURRENT_BATTLE_PASS,
  SHOP_ITEMS,
  LEVEL_XP_REQUIREMENTS,
  GAME_CONFIG,
};
