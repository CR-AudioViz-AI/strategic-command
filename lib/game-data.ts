// ═══════════════════════════════════════════════════════════════════════════════
// GAME DATA - UNITS, DEFENSES, BUILDINGS, SPELLS, LEVELS
// Strategic Command: Total Control - CR AudioViz AI
// ═══════════════════════════════════════════════════════════════════════════════

import type { UnitType, DefenseType, BuildingType, SpellType, CampaignLevel } from '@/types';

export const UNIT_TYPES: Record<string, UnitType> = {
  warrior: { id: 'warrior', name: 'Warrior', description: 'Melee fighter', hp: 100, maxHp: 100, damage: 15, range: 1.5, speed: 2, attackSpeed: 1000, armor: 5, cost: 50, costType: 'gold', color: '#3B82F6', icon: '⚔️', tier: 'common', unlockLevel: 1, isPremium: false },
  archer: { id: 'archer', name: 'Archer', description: 'Ranged unit', hp: 60, maxHp: 60, damage: 20, range: 5, speed: 2.5, attackSpeed: 1200, armor: 2, cost: 75, costType: 'gold', color: '#10B981', icon: '🏹', tier: 'common', unlockLevel: 1, isPremium: false },
  scout: { id: 'scout', name: 'Scout', description: 'Fast unit', hp: 40, maxHp: 40, damage: 10, range: 1.5, speed: 4, attackSpeed: 800, armor: 0, cost: 40, costType: 'gold', color: '#F59E0B', icon: '🏃', tier: 'common', unlockLevel: 2, isPremium: false },
  tank: { id: 'tank', name: 'Tank', description: 'Heavy unit', hp: 200, maxHp: 200, damage: 25, range: 2, speed: 1, attackSpeed: 1500, armor: 15, cost: 150, costType: 'elixir', color: '#6366F1', icon: '🛡️', tier: 'rare', unlockLevel: 3, isPremium: false },
  healer: { id: 'healer', name: 'Healer', description: 'Heals units', hp: 45, maxHp: 45, damage: 0, range: 3, speed: 2, attackSpeed: 1500, armor: 1, cost: 100, costType: 'elixir', color: '#EC4899', icon: '💚', tier: 'rare', unlockLevel: 4, isPremium: false, healAmount: 15 },
  mage: { id: 'mage', name: 'Mage', description: 'Splash damage', hp: 50, maxHp: 50, damage: 35, range: 4, speed: 1.8, attackSpeed: 2000, armor: 1, cost: 125, costType: 'elixir', color: '#8B5CF6', icon: '✨', tier: 'rare', unlockLevel: 5, isPremium: false, splashRadius: 1.5 },
  giant: { id: 'giant', name: 'Giant', description: 'Targets buildings', hp: 350, maxHp: 350, damage: 40, range: 1.5, speed: 0.8, attackSpeed: 2000, armor: 20, cost: 250, costType: 'elixir', color: '#DC2626', icon: '👹', tier: 'epic', unlockLevel: 7, isPremium: false, targetBuildings: true },
  dragon: { id: 'dragon', name: 'Dragon', description: 'Flying unit', hp: 180, maxHp: 180, damage: 30, range: 3, speed: 2.2, attackSpeed: 1400, armor: 8, cost: 200, costType: 'elixir', color: '#F97316', icon: '🐉', tier: 'epic', unlockLevel: 8, isPremium: false, flying: true, splashRadius: 1 },
  ninja: { id: 'ninja', name: 'Shadow Ninja', description: 'Fast assassin', hp: 55, maxHp: 55, damage: 45, range: 1.5, speed: 3.5, attackSpeed: 1000, armor: 0, cost: 150, costType: 'gems', color: '#1F2937', icon: '🥷', tier: 'epic', unlockLevel: 10, isPremium: true },
  golem: { id: 'golem', name: 'Stone Golem', description: 'Very tanky', hp: 500, maxHp: 500, damage: 30, range: 1.5, speed: 0.6, attackSpeed: 2500, armor: 25, cost: 300, costType: 'gems', color: '#78716C', icon: '🗿', tier: 'legendary', unlockLevel: 12, isPremium: true },
  phoenix: { id: 'phoenix', name: 'Phoenix', description: 'Flying fire', hp: 120, maxHp: 120, damage: 40, range: 3.5, speed: 2.8, attackSpeed: 1200, armor: 5, cost: 250, costType: 'gems', color: '#EF4444', icon: '🔥', tier: 'legendary', unlockLevel: 15, isPremium: true, flying: true, splashRadius: 0.8 },
  wizard: { id: 'wizard', name: 'Grand Wizard', description: 'Powerful magic', hp: 65, maxHp: 65, damage: 50, range: 4.5, speed: 1.6, attackSpeed: 1800, armor: 2, cost: 175, costType: 'gems', color: '#7C3AED', icon: '🧙', tier: 'legendary', unlockLevel: 18, isPremium: true },
};

export const DEFENSE_TYPES: Record<string, DefenseType> = {
  cannon: { id: 'cannon', name: 'Cannon', hp: 150, maxHp: 150, damage: 30, range: 5, attackSpeed: 1500, color: '#374151', icon: '💥', targetAir: false, targetGround: true },
  archer_tower: { id: 'archer_tower', name: 'Archer Tower', hp: 100, maxHp: 100, damage: 15, range: 7, attackSpeed: 800, color: '#92400E', icon: '🗼', targetAir: true, targetGround: true },
  mortar: { id: 'mortar', name: 'Mortar', hp: 120, maxHp: 120, damage: 45, range: 8, minRange: 3, attackSpeed: 3000, color: '#4B5563', icon: '💣', splashRadius: 2, targetAir: false, targetGround: true },
  inferno: { id: 'inferno', name: 'Inferno Tower', hp: 200, maxHp: 200, damage: 5, damageRamp: 2, range: 6, attackSpeed: 200, color: '#7C2D12', icon: '🔥', targetAir: true, targetGround: true },
  air_defense: { id: 'air_defense', name: 'Air Defense', hp: 100, maxHp: 100, damage: 50, range: 8, attackSpeed: 1200, color: '#1E40AF', icon: '🎯', targetAir: true, targetGround: false },
  tesla: { id: 'tesla', name: 'Hidden Tesla', hp: 80, maxHp: 80, damage: 35, range: 5, attackSpeed: 1000, color: '#FCD34D', icon: '⚡', targetAir: true, targetGround: true },
  xbow: { id: 'xbow', name: 'X-Bow', hp: 180, maxHp: 180, damage: 12, range: 10, attackSpeed: 400, color: '#991B1B', icon: '🏹', targetAir: true, targetGround: true },
  eagle: { id: 'eagle', name: 'Eagle Artillery', hp: 250, maxHp: 250, damage: 80, range: 15, minRange: 6, attackSpeed: 4000, splashRadius: 2.5, color: '#1E3A8A', icon: '🦅', targetAir: true, targetGround: true },
};

export const BUILDING_TYPES: Record<string, BuildingType> = {
  townhall: { id: 'townhall', name: 'Town Hall', hp: 500, maxHp: 500, color: '#FCD34D', icon: '🏰', width: 2, height: 2, isCore: true },
  barracks: { id: 'barracks', name: 'Barracks', hp: 200, maxHp: 200, color: '#9CA3AF', icon: '🏠', width: 1.5, height: 1.5, resourceValue: 100 },
  gold_mine: { id: 'gold_mine', name: 'Gold Mine', hp: 150, maxHp: 150, color: '#FBBF24', icon: '⛏️', width: 1.5, height: 1.5, resourceValue: 250 },
  elixir_pump: { id: 'elixir_pump', name: 'Elixir Pump', hp: 150, maxHp: 150, color: '#A78BFA', icon: '🧪', width: 1.5, height: 1.5, resourceValue: 250 },
  gold_storage: { id: 'gold_storage', name: 'Gold Storage', hp: 250, maxHp: 250, color: '#F59E0B', icon: '🏦', width: 1.5, height: 1.5, resourceValue: 500 },
  elixir_storage: { id: 'elixir_storage', name: 'Elixir Storage', hp: 250, maxHp: 250, color: '#8B5CF6', icon: '🏺', width: 1.5, height: 1.5, resourceValue: 500 },
  wall: { id: 'wall', name: 'Wall', hp: 300, maxHp: 300, color: '#6B7280', icon: '🧱', width: 1, height: 1 },
  army_camp: { id: 'army_camp', name: 'Army Camp', hp: 100, maxHp: 100, color: '#059669', icon: '⛺', width: 2, height: 2, resourceValue: 50 },
};

export const SPELL_TYPES: Record<string, SpellType> = {
  lightning: { id: 'lightning', name: 'Lightning', description: 'Instant damage', damage: 150, radius: 1.5, cost: 100, costType: 'elixir', icon: '⚡', color: '#FBBF24', cooldown: 0, unlockLevel: 1, isPremium: false },
  heal: { id: 'heal', name: 'Heal', description: 'Heal units', healAmount: 100, radius: 2, cost: 75, costType: 'elixir', icon: '💚', color: '#10B981', cooldown: 0, unlockLevel: 2, isPremium: false },
  rage: { id: 'rage', name: 'Rage', description: 'Boost damage/speed', damageBoost: 1.5, speedBoost: 1.3, radius: 3, duration: 8000, cost: 100, costType: 'elixir', icon: '😤', color: '#DC2626', cooldown: 0, unlockLevel: 4, isPremium: false },
  freeze: { id: 'freeze', name: 'Freeze', description: 'Freeze enemies', radius: 2.5, duration: 4000, cost: 80, costType: 'elixir', icon: '❄️', color: '#06B6D4', cooldown: 0, unlockLevel: 6, isPremium: false },
  earthquake: { id: 'earthquake', name: 'Earthquake', description: '% building damage', damage: 25, radius: 3.5, cost: 125, costType: 'elixir', icon: '🌋', color: '#78350F', cooldown: 0, unlockLevel: 8, isPremium: false },
  haste: { id: 'haste', name: 'Haste', description: 'Speed boost', speedBoost: 2, radius: 2, duration: 6000, cost: 60, costType: 'elixir', icon: '💨', color: '#F472B6', cooldown: 0, unlockLevel: 5, isPremium: false },
  clone: { id: 'clone', name: 'Clone', description: 'Copy units', radius: 2, duration: 15000, cost: 150, costType: 'gems', icon: '👥', color: '#A855F7', cooldown: 0, unlockLevel: 12, isPremium: true },
  invisibility: { id: 'invisibility', name: 'Invisibility', description: 'Hide units', radius: 2.5, duration: 5000, cost: 100, costType: 'gems', icon: '👻', color: '#94A3B8', cooldown: 0, unlockLevel: 15, isPremium: true },
};

// Generate 25 Campaign Levels
export const CAMPAIGN_LEVELS: CampaignLevel[] = Array.from({ length: 25 }, (_, i) => {
  const id = i + 1;
  const chapter = Math.ceil(id / 5);
  const difficulty: CampaignLevel['difficulty'] = id <= 5 ? 'Easy' : id <= 10 ? 'Medium' : id <= 15 ? 'Hard' : id <= 20 ? 'Expert' : 'Legendary';
  const names = ['First Steps', 'Double Trouble', 'Wall Breakers', 'Tank Time', 'Chapter Boss', 'Splash Zone', 'Magic Touch', 'Giant Assault', 'Air Raid', 'Mortar Boss', 'Burning Heat', 'Tesla Trap', 'X-Bow Gauntlet', 'Golem Rampage', 'Inferno Boss', 'Long Range', 'Phoenix Rising', 'Wizard Academy', 'Multi-Front', 'Eagle Boss', 'Last Stand', 'Fortress Doom', 'Death Valley', 'Judgment Day', 'FINAL BATTLE'];
  
  return {
    id,
    chapter,
    name: names[i] || `Level ${id}`,
    description: `Chapter ${chapter} - Stage ${((id - 1) % 5) + 1}`,
    difficulty,
    goldReward: 500 + i * 200,
    elixirReward: 500 + i * 200,
    gemsReward: id % 5 === 0 ? 20 + chapter * 10 : 5,
    experienceReward: 100 + i * 50,
    maxUnits: 10 + i * 2,
    timeLimit: 180 + chapter * 10,
    defenses: [
      { type: 'cannon', x: 10, y: 7 },
      ...(id > 3 ? [{ type: 'archer_tower', x: 12, y: 5 }] : []),
      ...(id > 6 ? [{ type: 'mortar', x: 8, y: 9 }] : []),
      ...(id > 10 ? [{ type: 'inferno', x: 14, y: 7 }] : []),
      ...(id > 15 ? [{ type: 'eagle', x: 16, y: 6 }] : []),
    ],
    buildings: [
      { type: 'townhall', x: 16, y: 6 },
      { type: 'gold_mine', x: 6, y: 4 },
      ...(id > 5 ? [{ type: 'elixir_pump', x: 6, y: 10 }] : []),
    ],
    availableUnits: Object.keys(UNIT_TYPES).slice(0, Math.min(4 + Math.floor(i / 3), 12)),
    availableSpells: Object.keys(SPELL_TYPES).slice(0, Math.min(2 + Math.floor(i / 4), 8)),
    starRequirements: { one: 50, two: 75, three: 100 },
  };
});
