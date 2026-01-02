// ═══════════════════════════════════════════════════════════════════════════════
// GAME STATE STORE (ZUSTAND)
// Strategic Command: Total Control
// CR AudioViz AI - Henderson Standard
// ═══════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  GameProfile, 
  BattleState, 
  Unit, 
  Defense, 
  Building, 
  CampaignLevel,
  LevelProgress,
  SpellEffect,
  Projectile,
  Explosion,
  DeployQueueItem
} from '@/types';
import { GAME_CONFIG } from './game-data-shop';

// ─────────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────────

interface GameStore {
  // User & Profile
  userId: string | null;
  profile: GameProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Game State
  gameState: 'menu' | 'campaign' | 'battle' | 'shop' | 'clan' | 'settings' | 'victory' | 'defeat';
  currentLevel: CampaignLevel | null;
  levelProgress: Record<number, LevelProgress>;
  
  // Battle State
  battle: BattleState;
  
  // Selection State
  selectedUnits: string[];
  selectedUnitType: string;
  activeSpell: string | null;
  targetMode: boolean;
  
  // UI State
  isPaused: boolean;
  showTutorial: boolean;
  notification: { message: string; type: 'info' | 'success' | 'error' | 'warning' } | null;
  hoveredEntity: { type: string; entity: unknown } | null;
  
  // Actions - Auth
  setUser: (userId: string | null) => void;
  setProfile: (profile: GameProfile | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Actions - Navigation
  setGameState: (state: GameStore['gameState']) => void;
  
  // Actions - Battle
  initBattle: (level: CampaignLevel) => void;
  deployUnit: (x: number, y: number, unitType: string) => void;
  updateUnits: (units: Unit[]) => void;
  updateDefenses: (defenses: Defense[]) => void;
  updateBuildings: (buildings: Building[]) => void;
  addProjectile: (projectile: Projectile) => void;
  removeProjectile: (id: string) => void;
  addExplosion: (explosion: Explosion) => void;
  removeExplosion: (id: string) => void;
  addSpellEffect: (effect: SpellEffect) => void;
  removeSpellEffect: (id: string) => void;
  updateBattleTime: (time: number) => void;
  updateBattleStats: (stats: Partial<BattleState['stats']>) => void;
  
  // Actions - Selection
  selectUnits: (unitIds: string[]) => void;
  clearSelection: () => void;
  setSelectedUnitType: (type: string) => void;
  setActiveSpell: (spell: string | null) => void;
  setTargetMode: (enabled: boolean) => void;
  
  // Actions - UI
  togglePause: () => void;
  setShowTutorial: (show: boolean) => void;
  showNotification: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void;
  clearNotification: () => void;
  setHoveredEntity: (entity: { type: string; entity: unknown } | null) => void;
  
  // Actions - Resources
  addGold: (amount: number) => void;
  addElixir: (amount: number) => void;
  addGems: (amount: number) => void;
  spendGold: (amount: number) => boolean;
  spendElixir: (amount: number) => boolean;
  spendGems: (amount: number) => boolean;
  addExperience: (amount: number) => void;
  
  // Actions - Progress
  updateLevelProgress: (levelId: number, stars: number, destruction: number, time: number) => void;
  
  // Utility
  generateId: () => string;
  reset: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────────

const initialBattleState: BattleState = {
  status: 'preparing',
  level: null,
  units: [],
  defenses: [],
  buildings: [],
  selectedUnits: [],
  deployQueue: [],
  spellEffects: [],
  projectiles: [],
  explosions: [],
  battleTime: GAME_CONFIG.DEFAULT_BATTLE_TIME,
  stats: {
    damageDealt: 0,
    buildingsDestroyed: 0,
    defensesDestroyed: 0,
    unitsDeployed: 0,
    unitsLost: 0,
    spellsUsed: 0,
    destructionPercent: 0,
  },
};

const initialProfile: GameProfile = {
  id: '',
  user_id: '',
  username: 'Commander',
  player_level: 1,
  experience: 0,
  gold: GAME_CONFIG.STARTING_GOLD,
  elixir: GAME_CONFIG.STARTING_ELIXIR,
  gems: GAME_CONFIG.STARTING_GEMS,
  total_stars: 0,
  total_battles: 0,
  battles_won: 0,
  trophy_count: 0,
  battle_pass_tier: 0,
  battle_pass_premium: false,
  last_daily_reward: null,
  daily_battles_remaining: GAME_CONFIG.FREE_DAILY_BATTLES,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// ─────────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────────

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial State
      userId: null,
      profile: initialProfile,
      isAuthenticated: false,
      isLoading: true,
      gameState: 'menu',
      currentLevel: null,
      levelProgress: {},
      battle: initialBattleState,
      selectedUnits: [],
      selectedUnitType: 'warrior',
      activeSpell: null,
      targetMode: false,
      isPaused: false,
      showTutorial: true,
      notification: null,
      hoveredEntity: null,
      
      // Auth Actions
      setUser: (userId) => set({ userId, isAuthenticated: !!userId }),
      setProfile: (profile) => set({ profile: profile || initialProfile }),
      setLoading: (loading) => set({ isLoading: loading }),
      
      // Navigation Actions
      setGameState: (gameState) => set({ gameState }),
      
      // Battle Actions
      initBattle: (level) => {
        const { UNIT_TYPES, DEFENSE_TYPES, BUILDING_TYPES } = require('./game-data');
        
        // Create defenses from level data
        const defenses: Defense[] = level.defenses.map((d) => ({
          uniqId: get().generateId(),
          ...DEFENSE_TYPES[d.type],
          x: d.x,
          y: d.y,
          currentTarget: null,
          lastAttack: 0,
          infernoStacks: 0,
        }));
        
        // Create buildings from level data
        const buildings: Building[] = level.buildings.map((b) => ({
          uniqId: get().generateId(),
          ...BUILDING_TYPES[b.type],
          x: b.x,
          y: b.y,
        }));
        
        // Create deploy queue based on available units
        const deployQueue: DeployQueueItem[] = level.availableUnits.map((type) => {
          const unitData = UNIT_TYPES[type];
          const maxCount = type === 'giant' || type === 'golem' ? 2 : 
                          type === 'dragon' || type === 'phoenix' ? 3 :
                          type === 'wizard' || type === 'ninja' ? 4 :
                          type === 'tank' || type === 'healer' || type === 'mage' ? 5 :
                          10;
          return { type, count: maxCount, maxCount };
        });
        
        set({
          currentLevel: level,
          gameState: 'battle',
          battle: {
            ...initialBattleState,
            status: 'active',
            level,
            defenses,
            buildings,
            deployQueue,
            battleTime: level.timeLimit,
          },
          selectedUnits: [],
          activeSpell: null,
          targetMode: false,
          isPaused: false,
        });
      },
      
      deployUnit: (x, y, unitType) => {
        const { battle, profile } = get();
        const { UNIT_TYPES } = require('./game-data');
        
        const queueItem = battle.deployQueue.find((q) => q.type === unitType);
        if (!queueItem || queueItem.count <= 0) return;
        
        if (x > GAME_CONFIG.DEPLOYMENT_ZONE_WIDTH) {
          get().showNotification('Deploy units in the green zone!', 'error');
          return;
        }
        
        const unitData = UNIT_TYPES[unitType];
        const newUnit: Unit = {
          ...unitData,
          uniqId: get().generateId(),
          x,
          y,
          targetX: null,
          targetY: null,
          targetEntity: null,
          lastAttack: 0,
          isMoving: false,
          rageBoost: null,
          frozen: false,
          damageMult: 1,
          speedMult: 1,
        };
        
        set({
          battle: {
            ...battle,
            units: [...battle.units, newUnit],
            deployQueue: battle.deployQueue.map((q) =>
              q.type === unitType ? { ...q, count: q.count - 1 } : q
            ),
            stats: {
              ...battle.stats,
              unitsDeployed: battle.stats.unitsDeployed + 1,
            },
          },
        });
      },
      
      updateUnits: (units) => set((state) => ({
        battle: { ...state.battle, units },
      })),
      
      updateDefenses: (defenses) => set((state) => ({
        battle: { ...state.battle, defenses },
      })),
      
      updateBuildings: (buildings) => set((state) => ({
        battle: { ...state.battle, buildings },
      })),
      
      addProjectile: (projectile) => set((state) => ({
        battle: {
          ...state.battle,
          projectiles: [...state.battle.projectiles, projectile],
        },
      })),
      
      removeProjectile: (id) => set((state) => ({
        battle: {
          ...state.battle,
          projectiles: state.battle.projectiles.filter((p) => p.id !== id),
        },
      })),
      
      addExplosion: (explosion) => set((state) => ({
        battle: {
          ...state.battle,
          explosions: [...state.battle.explosions, explosion],
        },
      })),
      
      removeExplosion: (id) => set((state) => ({
        battle: {
          ...state.battle,
          explosions: state.battle.explosions.filter((e) => e.id !== id),
        },
      })),
      
      addSpellEffect: (effect) => set((state) => ({
        battle: {
          ...state.battle,
          spellEffects: [...state.battle.spellEffects, effect],
        },
      })),
      
      removeSpellEffect: (id) => set((state) => ({
        battle: {
          ...state.battle,
          spellEffects: state.battle.spellEffects.filter((e) => e.id !== id),
        },
      })),
      
      updateBattleTime: (time) => set((state) => ({
        battle: { ...state.battle, battleTime: time },
      })),
      
      updateBattleStats: (stats) => set((state) => ({
        battle: {
          ...state.battle,
          stats: { ...state.battle.stats, ...stats },
        },
      })),
      
      // Selection Actions
      selectUnits: (unitIds) => set({ selectedUnits: unitIds }),
      clearSelection: () => set({ selectedUnits: [], targetMode: false, activeSpell: null }),
      setSelectedUnitType: (type) => set({ selectedUnitType: type }),
      setActiveSpell: (spell) => set({ activeSpell: spell, targetMode: false }),
      setTargetMode: (enabled) => set({ targetMode: enabled, activeSpell: null }),
      
      // UI Actions
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
      setShowTutorial: (show) => set({ showTutorial: show }),
      showNotification: (message, type = 'info') => {
        set({ notification: { message, type } });
        setTimeout(() => get().clearNotification(), 3000);
      },
      clearNotification: () => set({ notification: null }),
      setHoveredEntity: (entity) => set({ hoveredEntity: entity }),
      
      // Resource Actions
      addGold: (amount) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          gold: state.profile.gold + amount,
        } : null,
      })),
      
      addElixir: (amount) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          elixir: state.profile.elixir + amount,
        } : null,
      })),
      
      addGems: (amount) => set((state) => ({
        profile: state.profile ? {
          ...state.profile,
          gems: state.profile.gems + amount,
        } : null,
      })),
      
      spendGold: (amount) => {
        const { profile } = get();
        if (!profile || profile.gold < amount) {
          get().showNotification('Not enough gold!', 'error');
          return false;
        }
        set({
          profile: { ...profile, gold: profile.gold - amount },
        });
        return true;
      },
      
      spendElixir: (amount) => {
        const { profile } = get();
        if (!profile || profile.elixir < amount) {
          get().showNotification('Not enough elixir!', 'error');
          return false;
        }
        set({
          profile: { ...profile, elixir: profile.elixir - amount },
        });
        return true;
      },
      
      spendGems: (amount) => {
        const { profile } = get();
        if (!profile || profile.gems < amount) {
          get().showNotification('Not enough gems!', 'error');
          return false;
        }
        set({
          profile: { ...profile, gems: profile.gems - amount },
        });
        return true;
      },
      
      addExperience: (amount) => {
        const { profile } = get();
        if (!profile) return;
        
        const { LEVEL_XP_REQUIREMENTS } = require('./game-data-shop');
        let newXP = profile.experience + amount;
        let newLevel = profile.player_level;
        
        // Check for level ups
        while (newLevel < 100 && newXP >= LEVEL_XP_REQUIREMENTS[newLevel]) {
          newXP -= LEVEL_XP_REQUIREMENTS[newLevel];
          newLevel++;
          get().showNotification(`Level Up! You are now level ${newLevel}!`, 'success');
        }
        
        set({
          profile: {
            ...profile,
            experience: newXP,
            player_level: newLevel,
          },
        });
      },
      
      // Progress Actions
      updateLevelProgress: (levelId, stars, destruction, time) => {
        const { levelProgress, profile } = get();
        const existing = levelProgress[levelId];
        
        // Only update if better
        if (!existing || stars > existing.stars) {
          set({
            levelProgress: {
              ...levelProgress,
              [levelId]: {
                id: get().generateId(),
                user_id: profile?.user_id || '',
                level_id: levelId,
                stars,
                best_time: time,
                best_destruction: destruction,
                attempts: (existing?.attempts || 0) + 1,
                completed_at: new Date().toISOString(),
                created_at: existing?.created_at || new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            },
            profile: profile ? {
              ...profile,
              total_stars: profile.total_stars + (stars - (existing?.stars || 0)),
            } : null,
          });
        }
      },
      
      // Utility
      generateId: () => Math.random().toString(36).substring(2, 11),
      
      reset: () => set({
        userId: null,
        profile: initialProfile,
        isAuthenticated: false,
        gameState: 'menu',
        currentLevel: null,
        levelProgress: {},
        battle: initialBattleState,
        selectedUnits: [],
        selectedUnitType: 'warrior',
        activeSpell: null,
        targetMode: false,
        isPaused: false,
        showTutorial: true,
        notification: null,
        hoveredEntity: null,
      }),
    }),
    {
      name: 'strategic-command-storage',
      partialize: (state) => ({
        profile: state.profile,
        levelProgress: state.levelProgress,
        showTutorial: state.showTutorial,
      }),
    }
  )
);

export default useGameStore;
