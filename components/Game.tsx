'use client';

// ═══════════════════════════════════════════════════════════════════════════════
// STRATEGIC COMMAND: TOTAL CONTROL - MAIN GAME COMPONENT
// CR AudioViz AI - Henderson Standard
// ═══════════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGameStore } from '@/lib/store';
import { UNIT_TYPES, DEFENSE_TYPES, BUILDING_TYPES, SPELL_TYPES, CAMPAIGN_LEVELS } from '@/lib/game-data';
import { GEM_PACKAGES, GAME_CONFIG } from '@/lib/game-data-shop';
import type { Unit, Defense, Building, Projectile, SpellEffect, CampaignLevel } from '@/types';

// ─────────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────────

const TILE_SIZE = GAME_CONFIG.TILE_SIZE;
const MAP_WIDTH = GAME_CONFIG.MAP_WIDTH;
const MAP_HEIGHT = GAME_CONFIG.MAP_HEIGHT;
const CANVAS_WIDTH = MAP_WIDTH * TILE_SIZE;
const CANVAS_HEIGHT = MAP_HEIGHT * TILE_SIZE;

// ─────────────────────────────────────────────────────────────────────────────────
// MAIN GAME COMPONENT
// ─────────────────────────────────────────────────────────────────────────────────

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const [isClient, setIsClient] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    gameState,
    setGameState,
    profile,
    battle,
    initBattle,
    deployUnit,
    updateUnits,
    updateDefenses,
    updateBuildings,
    updateBattleTime,
    updateBattleStats,
    addProjectile,
    removeProjectile,
    addSpellEffect,
    removeSpellEffect,
    selectedUnits,
    selectUnits,
    clearSelection,
    selectedUnitType,
    setSelectedUnitType,
    activeSpell,
    setActiveSpell,
    targetMode,
    setTargetMode,
    isPaused,
    togglePause,
    notification,
    showNotification,
    addGold,
    addElixir,
    addGems,
    addExperience,
    updateLevelProgress,
    levelProgress,
    generateId,
  } = useGameStore();

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────────
  // GAME LOOP
  // ─────────────────────────────────────────────────────────────────────────────────

  const gameLoop = useCallback((timestamp: number) => {
    if (!canvasRef.current || isPaused || battle.status !== 'active') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Update game state
    updateGameState(deltaTime);
    
    // Render
    render(ctx);

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [isPaused, battle.status]);

  // Start game loop when battle is active
  useEffect(() => {
    if (gameState === 'battle' && battle.status === 'active') {
      lastTimeRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, battle.status, gameLoop]);

  // ─────────────────────────────────────────────────────────────────────────────────
  // GAME STATE UPDATE
  // ─────────────────────────────────────────────────────────────────────────────────

  const updateGameState = (deltaTime: number) => {
    const now = performance.now();
    
    // Update battle time
    const newTime = battle.battleTime - deltaTime / 1000;
    if (newTime <= 0) {
      // Time's up - check victory/defeat
      checkBattleEnd();
      return;
    }
    updateBattleTime(newTime);

    // Update units
    const updatedUnits = battle.units.map(unit => {
      if (unit.hp <= 0 || unit.frozen) return unit;

      let newUnit = { ...unit };
      
      // Apply spell effects
      const rageEffect = battle.spellEffects.find(e => 
        e.type === 'rage' && 
        Math.hypot(unit.x - e.x, unit.y - e.y) <= e.radius
      );
      const hasteEffect = battle.spellEffects.find(e => 
        e.type === 'haste' && 
        Math.hypot(unit.x - e.x, unit.y - e.y) <= e.radius
      );
      
      newUnit.damageMult = rageEffect ? (rageEffect.damageBoost || 1.5) : 1;
      newUnit.speedMult = hasteEffect ? 2 : (rageEffect ? 1.3 : 1);

      // Find target
      if (!newUnit.targetEntity) {
        const target = findTarget(newUnit);
        if (target) {
          newUnit.targetEntity = target.uniqId;
          newUnit.targetX = target.x;
          newUnit.targetY = target.y;
        }
      }

      // Move towards target
      if (newUnit.targetX !== null && newUnit.targetY !== null) {
        const dx = newUnit.targetX - newUnit.x;
        const dy = newUnit.targetY - newUnit.y;
        const dist = Math.hypot(dx, dy);
        const attackRange = newUnit.range;

        if (dist > attackRange) {
          const speed = (newUnit.speed * newUnit.speedMult * deltaTime) / 1000;
          newUnit.x += (dx / dist) * speed;
          newUnit.y += (dy / dist) * speed;
          newUnit.isMoving = true;
        } else {
          newUnit.isMoving = false;
          // Attack
          if (now - newUnit.lastAttack >= newUnit.attackSpeed) {
            performAttack(newUnit);
            newUnit.lastAttack = now;
          }
        }
      }

      return newUnit;
    }).filter(u => u.hp > 0);

    // Update defenses
    const updatedDefenses = battle.defenses.map(defense => {
      if (defense.hp <= 0 || defense.frozen) return defense;

      let newDefense = { ...defense };
      
      // Find target unit
      const targetUnit = battle.units.find(u => {
        if (u.hp <= 0) return false;
        const dist = Math.hypot(u.x - defense.x, u.y - defense.y);
        if (dist > defense.range) return false;
        if (defense.minRange && dist < defense.minRange) return false;
        if (u.flying && !defense.targetAir) return false;
        if (!u.flying && !defense.targetGround) return false;
        return true;
      });

      if (targetUnit && now - newDefense.lastAttack >= defense.attackSpeed) {
        // Create projectile
        addProjectile({
          id: generateId(),
          x: defense.x,
          y: defense.y,
          targetX: targetUnit.x,
          targetY: targetUnit.y,
          targetUnitId: targetUnit.uniqId,
          damage: defense.damage * (defense.id === 'inferno' ? (1 + newDefense.infernoStacks * 0.5) : 1),
          color: defense.color,
          splash: defense.splashRadius,
          isEnemy: true,
        });
        
        newDefense.lastAttack = now;
        if (defense.id === 'inferno') {
          newDefense.infernoStacks = Math.min(newDefense.infernoStacks + 1, 5);
        }
      }

      return newDefense;
    }).filter(d => d.hp > 0);

    // Update projectiles
    battle.projectiles.forEach(proj => {
      const dx = proj.targetX - proj.x;
      const dy = proj.targetY - proj.y;
      const dist = Math.hypot(dx, dy);
      
      if (dist < 0.5) {
        // Hit target
        if (proj.isEnemy && proj.targetUnitId) {
          const targetIndex = updatedUnits.findIndex(u => u.uniqId === proj.targetUnitId);
          if (targetIndex !== -1) {
            const armor = updatedUnits[targetIndex].armor || 0;
            const damage = Math.max(proj.damage - armor, proj.damage * 0.2);
            updatedUnits[targetIndex] = {
              ...updatedUnits[targetIndex],
              hp: updatedUnits[targetIndex].hp - damage,
            };
            
            if (updatedUnits[targetIndex].hp <= 0) {
              updateBattleStats({ unitsLost: battle.stats.unitsLost + 1 });
            }
          }
        }
        removeProjectile(proj.id);
      }
    });

    // Update spell effects (remove expired)
    battle.spellEffects.forEach(effect => {
      if (now > effect.endTime) {
        removeSpellEffect(effect.id);
      }
    });

    // Calculate destruction percentage
    const totalHP = (battle.level?.buildings.length || 0) * 200 + 
                   (battle.level?.defenses.length || 0) * 150;
    const currentHP = updatedBuildings.reduce((sum, b) => sum + b.hp, 0) +
                     updatedDefenses.reduce((sum, d) => sum + d.hp, 0);
    const destruction = Math.round(((totalHP - currentHP) / totalHP) * 100);
    
    updateBattleStats({ destructionPercent: destruction });

    // Update state
    updateUnits(updatedUnits);
    updateDefenses(updatedDefenses);
    
    // Check win/lose conditions
    checkBattleEnd();
  };

  // ─────────────────────────────────────────────────────────────────────────────────
  // COMBAT HELPERS
  // ─────────────────────────────────────────────────────────────────────────────────

  const findTarget = (unit: Unit) => {
    // Giants target buildings first
    if (unit.targetBuildings) {
      const building = battle.buildings
        .filter(b => b.hp > 0)
        .sort((a, b) => {
          const distA = Math.hypot(a.x - unit.x, a.y - unit.y);
          const distB = Math.hypot(b.x - unit.x, b.y - unit.y);
          return distA - distB;
        })[0];
      if (building) return building;
    }

    // Find nearest defense
    const defense = battle.defenses
      .filter(d => d.hp > 0)
      .sort((a, b) => {
        const distA = Math.hypot(a.x - unit.x, a.y - unit.y);
        const distB = Math.hypot(b.x - unit.x, b.y - unit.y);
        return distA - distB;
      })[0];
    
    if (defense) return defense;

    // Find nearest building
    return battle.buildings
      .filter(b => b.hp > 0)
      .sort((a, b) => {
        const distA = Math.hypot(a.x - unit.x, a.y - unit.y);
        const distB = Math.hypot(b.x - unit.x, b.y - unit.y);
        return distA - distB;
      })[0];
  };

  const performAttack = (unit: Unit) => {
    const damage = unit.damage * unit.damageMult;
    
    // Find target entity
    let target = battle.defenses.find(d => d.uniqId === unit.targetEntity);
    if (!target) {
      target = battle.buildings.find(b => b.uniqId === unit.targetEntity) as any;
    }
    
    if (!target || target.hp <= 0) {
      // Clear target
      updateUnits(battle.units.map(u => 
        u.uniqId === unit.uniqId 
          ? { ...u, targetEntity: null, targetX: null, targetY: null }
          : u
      ));
      return;
    }

    // Apply damage
    const isDefense = battle.defenses.some(d => d.uniqId === target!.uniqId);
    
    if (isDefense) {
      const newDefenses = battle.defenses.map(d => 
        d.uniqId === target!.uniqId ? { ...d, hp: d.hp - damage } : d
      );
      updateDefenses(newDefenses);
      
      if (target.hp - damage <= 0) {
        updateBattleStats({ defensesDestroyed: battle.stats.defensesDestroyed + 1 });
      }
    } else {
      const newBuildings = battle.buildings.map(b =>
        b.uniqId === target!.uniqId ? { ...b, hp: b.hp - damage } : b
      );
      updateBuildings(newBuildings);
      
      if (target.hp - damage <= 0) {
        updateBattleStats({ buildingsDestroyed: battle.stats.buildingsDestroyed + 1 });
      }
    }

    updateBattleStats({ damageDealt: battle.stats.damageDealt + damage });
  };

  const checkBattleEnd = () => {
    const townHall = battle.buildings.find(b => b.id === 'townhall');
    const allDestroyed = battle.buildings.every(b => b.hp <= 0) && 
                        battle.defenses.every(d => d.hp <= 0);
    const destruction = battle.stats.destructionPercent;

    // Victory conditions
    if ((townHall && townHall.hp <= 0) || allDestroyed || destruction >= 100) {
      endBattle('victory');
    }
    // Defeat conditions
    else if (battle.battleTime <= 0 && destruction < 50) {
      endBattle('defeat');
    }
    else if (battle.units.length === 0 && 
             battle.deployQueue.every(q => q.count === 0) && 
             destruction < 50) {
      endBattle('defeat');
    }
  };

  const endBattle = (result: 'victory' | 'defeat') => {
    if (!battle.level) return;
    
    const destruction = battle.stats.destructionPercent;
    const stars = destruction >= 100 ? 3 : 
                  destruction >= 75 ? 2 : 
                  destruction >= 50 ? 1 : 0;
    
    if (result === 'victory' || stars > 0) {
      // Calculate rewards
      const goldReward = Math.floor(battle.level.goldReward * (stars / 3));
      const elixirReward = Math.floor(battle.level.elixirReward * (stars / 3));
      const gemsReward = stars === 3 ? battle.level.gemsReward : 0;
      const xpReward = Math.floor(battle.level.experienceReward * (stars / 3));
      
      addGold(goldReward);
      addElixir(elixirReward);
      addGems(gemsReward);
      addExperience(xpReward);
      
      updateLevelProgress(
        battle.level.id, 
        stars, 
        destruction, 
        Math.floor(battle.battleTime)
      );
      
      setGameState('victory');
    } else {
      setGameState('defeat');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────────
  // RENDERING
  // ─────────────────────────────────────────────────────────────────────────────────

  const render = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid
    ctx.strokeStyle = '#2a2a4e';
    ctx.lineWidth = 1;
    for (let x = 0; x <= MAP_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * TILE_SIZE, 0);
      ctx.lineTo(x * TILE_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= MAP_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * TILE_SIZE);
      ctx.lineTo(CANVAS_WIDTH, y * TILE_SIZE);
      ctx.stroke();
    }

    // Draw deployment zone
    ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
    ctx.fillRect(0, 0, GAME_CONFIG.DEPLOYMENT_ZONE_WIDTH * TILE_SIZE, CANVAS_HEIGHT);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(GAME_CONFIG.DEPLOYMENT_ZONE_WIDTH * TILE_SIZE, 0);
    ctx.lineTo(GAME_CONFIG.DEPLOYMENT_ZONE_WIDTH * TILE_SIZE, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw buildings
    battle.buildings.forEach(building => {
      if (building.hp <= 0) return;
      
      const x = building.x * TILE_SIZE;
      const y = building.y * TILE_SIZE;
      const w = (building.width || 1) * TILE_SIZE;
      const h = (building.height || 1) * TILE_SIZE;
      
      // Building body
      ctx.fillStyle = building.color;
      ctx.fillRect(x, y, w, h);
      
      // Border
      ctx.strokeStyle = building.isCore ? '#FFD700' : '#666';
      ctx.lineWidth = building.isCore ? 3 : 1;
      ctx.strokeRect(x, y, w, h);
      
      // Icon
      ctx.font = `${TILE_SIZE * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(building.icon, x + w / 2, y + h / 2);
      
      // Health bar
      drawHealthBar(ctx, x, y - 8, w, building.hp, building.maxHp);
    });

    // Draw defenses
    battle.defenses.forEach(defense => {
      if (defense.hp <= 0) return;
      
      const x = defense.x * TILE_SIZE;
      const y = defense.y * TILE_SIZE;
      const size = TILE_SIZE * 0.8;
      
      // Defense body
      ctx.fillStyle = defense.color;
      ctx.beginPath();
      ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Icon
      ctx.font = `${TILE_SIZE * 0.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(defense.icon, x + TILE_SIZE / 2, y + TILE_SIZE / 2);
      
      // Health bar
      drawHealthBar(ctx, x, y - 8, TILE_SIZE, defense.hp, defense.maxHp);
      
      // Range indicator (when selected)
      if (defense.currentTarget) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, defense.range * TILE_SIZE, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw spell effects
    battle.spellEffects.forEach(effect => {
      const x = effect.x * TILE_SIZE;
      const y = effect.y * TILE_SIZE;
      const radius = effect.radius * TILE_SIZE;
      
      ctx.fillStyle = effect.type === 'rage' ? 'rgba(239, 68, 68, 0.3)' :
                     effect.type === 'heal' ? 'rgba(34, 197, 94, 0.3)' :
                     effect.type === 'freeze' ? 'rgba(14, 165, 233, 0.3)' :
                     effect.type === 'haste' ? 'rgba(244, 114, 182, 0.3)' :
                     'rgba(139, 92, 246, 0.3)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = effect.type === 'rage' ? 'rgba(239, 68, 68, 0.8)' :
                       effect.type === 'heal' ? 'rgba(34, 197, 94, 0.8)' :
                       effect.type === 'freeze' ? 'rgba(14, 165, 233, 0.8)' :
                       effect.type === 'haste' ? 'rgba(244, 114, 182, 0.8)' :
                       'rgba(139, 92, 246, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw units
    battle.units.forEach(unit => {
      if (unit.hp <= 0) return;
      
      const x = unit.x * TILE_SIZE;
      const y = unit.y * TILE_SIZE;
      const size = TILE_SIZE * 0.7;
      const isSelected = selectedUnits.includes(unit.uniqId);
      
      // Selection indicator
      if (isSelected) {
        ctx.strokeStyle = '#22C55E';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, size / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      // Unit body
      ctx.fillStyle = unit.color;
      ctx.beginPath();
      ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, size / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Border
      ctx.strokeStyle = unit.rageBoost ? '#EF4444' : '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Icon
      ctx.font = `${TILE_SIZE * 0.4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(unit.icon, x + TILE_SIZE / 2, y + TILE_SIZE / 2);
      
      // Health bar
      drawHealthBar(ctx, x, y - 8, TILE_SIZE, unit.hp, unit.maxHp);
      
      // Flying indicator
      if (unit.flying) {
        ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
        ctx.beginPath();
        ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2 - 5, size / 2 + 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw projectiles
    battle.projectiles.forEach(proj => {
      const x = proj.x * TILE_SIZE;
      const y = proj.y * TILE_SIZE;
      
      ctx.fillStyle = proj.color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw drag selection box
    if (isDragging && dragStart && dragEnd) {
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)';
      ctx.fillStyle = 'rgba(34, 197, 94, 0.1)';
      ctx.lineWidth = 2;
      const x = Math.min(dragStart.x, dragEnd.x);
      const y = Math.min(dragStart.y, dragEnd.y);
      const w = Math.abs(dragEnd.x - dragStart.x);
      const h = Math.abs(dragEnd.y - dragStart.y);
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
    }
  };

  const drawHealthBar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    hp: number,
    maxHp: number
  ) => {
    const percent = hp / maxHp;
    const barWidth = width * 0.8;
    const barX = x + (width - barWidth) / 2;
    
    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, y, barWidth, 4);
    
    // Health
    ctx.fillStyle = percent > 0.6 ? '#22C55E' : percent > 0.3 ? '#F59E0B' : '#EF4444';
    ctx.fillRect(barX, y, barWidth * percent, 4);
  };

  // ─────────────────────────────────────────────────────────────────────────────────
  // INPUT HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────────

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || battle.status !== 'active') return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / TILE_SIZE;
    const y = (e.clientY - rect.top) / TILE_SIZE;

    // Active spell
    if (activeSpell) {
      castSpell(activeSpell, x, y);
      setActiveSpell(null);
      return;
    }

    // Target mode - assign target to selected units
    if (targetMode && selectedUnits.length > 0) {
      const target = findEntityAt(x, y);
      if (target) {
        const newUnits = battle.units.map(u => 
          selectedUnits.includes(u.uniqId)
            ? { ...u, targetEntity: target.uniqId, targetX: target.x, targetY: target.y }
            : u
        );
        updateUnits(newUnits);
        showNotification('Target assigned!', 'success');
      } else {
        // Move to position
        const newUnits = battle.units.map(u =>
          selectedUnits.includes(u.uniqId)
            ? { ...u, targetEntity: null, targetX: x, targetY: y }
            : u
        );
        updateUnits(newUnits);
      }
      setTargetMode(false);
      return;
    }

    // Check if clicking on a unit to select
    const clickedUnit = battle.units.find(u => {
      const dist = Math.hypot(u.x - x, u.y - y);
      return dist < 0.5 && u.hp > 0;
    });

    if (clickedUnit) {
      if (e.shiftKey) {
        // Add to selection
        if (selectedUnits.includes(clickedUnit.uniqId)) {
          selectUnits(selectedUnits.filter(id => id !== clickedUnit.uniqId));
        } else {
          selectUnits([...selectedUnits, clickedUnit.uniqId]);
        }
      } else {
        selectUnits([clickedUnit.uniqId]);
      }
      return;
    }

    // Deploy unit in deployment zone
    if (x <= GAME_CONFIG.DEPLOYMENT_ZONE_WIDTH) {
      deployUnit(x, y, selectedUnitType);
    } else {
      clearSelection();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!dragStart) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const dist = Math.hypot(current.x - dragStart.x, current.y - dragStart.y);
    
    if (dist > 10) {
      setIsDragging(true);
      setDragEnd(current);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && dragStart && dragEnd) {
      // Select units in box
      const minX = Math.min(dragStart.x, dragEnd.x) / TILE_SIZE;
      const maxX = Math.max(dragStart.x, dragEnd.x) / TILE_SIZE;
      const minY = Math.min(dragStart.y, dragEnd.y) / TILE_SIZE;
      const maxY = Math.max(dragStart.y, dragEnd.y) / TILE_SIZE;
      
      const unitsInBox = battle.units
        .filter(u => u.hp > 0 && u.x >= minX && u.x <= maxX && u.y >= minY && u.y <= maxY)
        .map(u => u.uniqId);
      
      if (unitsInBox.length > 0) {
        selectUnits(unitsInBox);
      }
    }
    
    setDragStart(null);
    setDragEnd(null);
    setIsDragging(false);
  };

  // ─────────────────────────────────────────────────────────────────────────────────
  // SPELL CASTING
  // ─────────────────────────────────────────────────────────────────────────────────

  const castSpell = (spellId: string, x: number, y: number) => {
    const spell = SPELL_TYPES[spellId];
    if (!spell) return;
    
    // Check if we can afford the spell
    if (spell.costType === 'elixir') {
      if ((profile?.elixir || 0) < spell.cost) {
        showNotification('Not enough elixir!', 'error');
        return;
      }
    }

    const effectId = generateId();
    
    switch (spellId) {
      case 'lightning':
        // Instant damage
        battle.defenses.forEach(d => {
          if (Math.hypot(d.x - x, d.y - y) <= spell.radius) {
            updateDefenses(battle.defenses.map(def => 
              def.uniqId === d.uniqId ? { ...def, hp: def.hp - (spell.damage || 150) } : def
            ));
          }
        });
        showNotification('Lightning Strike! ⚡', 'success');
        break;
        
      case 'heal':
        // Instant heal
        updateUnits(battle.units.map(u => {
          if (Math.hypot(u.x - x, u.y - y) <= spell.radius) {
            return { ...u, hp: Math.min(u.maxHp, u.hp + (spell.healAmount || 100)) };
          }
          return u;
        }));
        showNotification('Units healed! 💚', 'success');
        break;
        
      case 'rage':
      case 'haste':
      case 'freeze':
        // Duration effects
        addSpellEffect({
          id: effectId,
          type: spellId,
          x,
          y,
          radius: spell.radius,
          endTime: performance.now() + (spell.duration || 5000),
          damageBoost: spell.damageBoost,
          speedBoost: spell.speedBoost,
        });
        
        if (spellId === 'freeze') {
          // Freeze defenses and units in radius
          updateDefenses(battle.defenses.map(d => {
            if (Math.hypot(d.x - x, d.y - y) <= spell.radius) {
              return { ...d, frozen: true };
            }
            return d;
          }));
          
          // Unfreeze after duration
          setTimeout(() => {
            updateDefenses(battle.defenses.map(d => ({ ...d, frozen: false })));
          }, spell.duration || 4000);
        }
        break;
    }
    
    updateBattleStats({ spellsUsed: battle.stats.spellsUsed + 1 });
  };

  const findEntityAt = (x: number, y: number) => {
    // Check defenses first
    const defense = battle.defenses.find(d => 
      d.hp > 0 && Math.hypot(d.x - x, d.y - y) < 1
    );
    if (defense) return defense;
    
    // Check buildings
    return battle.buildings.find(b => 
      b.hp > 0 && 
      x >= b.x && x <= b.x + (b.width || 1) &&
      y >= b.y && y <= b.y + (b.height || 1)
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────────
  // KEYBOARD CONTROLS
  // ─────────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'battle') return;
      
      const unitKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
      const spellKeys = { q: 'lightning', w: 'heal', e: 'rage', r: 'freeze' };
      
      if (unitKeys.includes(e.key)) {
        const availableUnits = Object.keys(UNIT_TYPES).filter(
          type => battle.deployQueue.some(q => q.type === type)
        );
        const index = parseInt(e.key) - 1;
        if (index >= 0 && index < availableUnits.length) {
          setSelectedUnitType(availableUnits[index]);
          clearSelection();
        }
      }
      
      if (e.key.toLowerCase() in spellKeys) {
        setActiveSpell(spellKeys[e.key.toLowerCase() as keyof typeof spellKeys]);
      }
      
      if (e.key === 'a' || e.key === 'A') {
        if (selectedUnits.length > 0) {
          setTargetMode(true);
          showNotification('Click target to attack', 'info');
        }
      }
      
      if (e.key === 's' || e.key === 'S') {
        // Stop selected units
        updateUnits(battle.units.map(u => 
          selectedUnits.includes(u.uniqId)
            ? { ...u, targetEntity: null, targetX: null, targetY: null }
            : u
        ));
      }
      
      if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
      
      if (e.key === 'Escape') {
        clearSelection();
        setActiveSpell(null);
        setTargetMode(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, selectedUnits, battle.deployQueue]);

  // ─────────────────────────────────────────────────────────────────────────────────
  // RENDER UI
  // ─────────────────────────────────────────────────────────────────────────────────

  if (!isClient) {
    return (
      <div className="min-h-screen bg-game-darker flex items-center justify-center">
        <div className="text-2xl text-amber-400">Loading...</div>
      </div>
    );
  }

  // Main Menu
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-game-pattern flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-display font-bold text-gradient-gold mb-2">
            STRATEGIC COMMAND
          </h1>
          <p className="text-xl text-purple-400 font-bold">TOTAL CONTROL</p>
          <div className="brand-badge mt-4">
            Powered by CR AudioViz AI
          </div>
        </div>
        
        {/* Resources */}
        <div className="flex gap-4 mb-8">
          <div className="card-game px-4 py-2 flex items-center gap-2">
            <span>💰</span>
            <span className="resource-gold">{profile?.gold.toLocaleString()}</span>
          </div>
          <div className="card-game px-4 py-2 flex items-center gap-2">
            <span>🧪</span>
            <span className="resource-elixir">{profile?.elixir.toLocaleString()}</span>
          </div>
          <div className="card-game px-4 py-2 flex items-center gap-2">
            <span>💎</span>
            <span className="resource-gems">{profile?.gems}</span>
          </div>
        </div>

        {/* Player Stats */}
        <div className="card-game p-4 mb-8 text-center">
          <div className="text-sm text-slate-400">Commander Level</div>
          <div className="text-3xl font-bold text-amber-400">{profile?.player_level}</div>
          <div className="text-sm text-slate-400 mt-2">
            ⭐ {profile?.total_stars} Stars | 🏆 {profile?.battles_won} Wins
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => setGameState('campaign')}
            className="btn-primary text-xl py-4"
          >
            ⚔️ Campaign
          </button>
          <button
            onClick={() => setGameState('shop')}
            className="btn-secondary"
          >
            🏪 Shop
          </button>
          <button
            onClick={() => window.open('https://craudiovizai.com', '_blank')}
            className="btn-ghost text-sm"
          >
            🌟 Explore CR AudioViz AI Platform
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>© 2026 CR AudioViz AI, LLC</p>
          <p>Your Story. Our Design.</p>
        </div>
      </div>
    );
  }

  // Campaign Level Select
  if (gameState === 'campaign') {
    const chapters = [1, 2, 3, 4, 5];
    
    return (
      <div className="min-h-screen bg-game-pattern p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setGameState('menu')}
              className="btn-ghost"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-display font-bold text-amber-400">CAMPAIGN</h1>
            <div className="flex gap-2">
              <span className="resource-gold">💰 {profile?.gold.toLocaleString()}</span>
              <span className="resource-gems">💎 {profile?.gems}</span>
            </div>
          </div>

          {/* Chapters */}
          {chapters.map(chapter => (
            <div key={chapter} className="mb-8">
              <h2 className="text-xl font-bold text-purple-400 mb-4">
                Chapter {chapter}: {
                  chapter === 1 ? 'Training Grounds' :
                  chapter === 2 ? 'Mortar Mayhem' :
                  chapter === 3 ? 'Inferno Fortress' :
                  chapter === 4 ? 'Eagle\'s Nest' :
                  'Final Campaign'
                }
              </h2>
              
              <div className="grid grid-cols-5 gap-3">
                {CAMPAIGN_LEVELS.filter(l => l.chapter === chapter).map(level => {
                  const progress = levelProgress[level.id];
                  const stars = progress?.stars || 0;
                  const prevLevel = CAMPAIGN_LEVELS.find(l => l.id === level.id - 1);
                  const unlocked = level.id === 1 || (prevLevel && (levelProgress[prevLevel.id]?.stars || 0) > 0);
                  
                  return (
                    <button
                      key={level.id}
                      onClick={() => unlocked && initBattle(level)}
                      disabled={!unlocked}
                      className={`
                        card-game-hover p-3 text-center transition-all
                        ${unlocked ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}
                        ${stars === 3 ? 'border-amber-500' : ''}
                      `}
                    >
                      <div className="text-2xl mb-1">{unlocked ? '⚔️' : '🔒'}</div>
                      <div className="text-xs font-bold truncate">{level.name}</div>
                      <div className="text-lg mt-1">
                        {[1, 2, 3].map(s => (
                          <span key={s} className={s <= stars ? 'star-earned' : 'star-empty'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <div className={`
                        text-xs mt-1 px-2 py-0.5 rounded border
                        difficulty-${level.difficulty.toLowerCase()}
                      `}>
                        {level.difficulty}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Battle Screen
  if (gameState === 'battle') {
    return (
      <div className="min-h-screen bg-game-darker flex flex-col">
        {/* Top HUD */}
        <div className="bg-slate-900/80 p-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setGameState('menu')} className="btn-ghost text-sm px-2 py-1">
              ✕ Exit
            </button>
            <div className="text-amber-400 font-bold">
              {battle.level?.name}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-lg font-mono">
              ⏱️ {Math.floor(battle.battleTime)}s
            </div>
            <div className="text-green-400">
              💥 {battle.stats.destructionPercent}%
            </div>
            <button
              onClick={togglePause}
              className={`btn-ghost text-sm px-2 py-1 ${isPaused ? 'bg-amber-500/20' : ''}`}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
          </div>
        </div>

        {/* Main Battle Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="border-2 border-slate-700 rounded-lg cursor-crosshair canvas-crisp"
            />
            
            {/* Pause Overlay */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <div className="text-4xl mb-4">⏸️</div>
                  <div className="text-2xl font-bold text-amber-400">PAUSED</div>
                  <div className="text-slate-400 mt-2">Press SPACE to resume</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom HUD - Unit Selection & Spells */}
        <div className="bg-slate-900/80 p-3">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Units */}
            <div className="flex gap-2">
              {battle.deployQueue.map((item, index) => {
                const unit = UNIT_TYPES[item.type];
                const isSelected = selectedUnitType === item.type;
                
                return (
                  <button
                    key={item.type}
                    onClick={() => setSelectedUnitType(item.type)}
                    disabled={item.count === 0}
                    className={`
                      w-14 h-14 rounded-lg flex flex-col items-center justify-center
                      transition-all border-2
                      ${isSelected ? 'border-green-500 bg-green-500/20' : 'border-slate-700 bg-slate-800'}
                      ${item.count === 0 ? 'opacity-50' : 'hover:border-slate-500'}
                    `}
                  >
                    <span className="text-xl">{unit.icon}</span>
                    <span className="text-xs font-bold">{item.count}</span>
                    <span className="text-[10px] text-slate-400">{index + 1}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Units Info */}
            {selectedUnits.length > 0 && (
              <div className="card-game px-3 py-2 flex items-center gap-3">
                <span className="text-green-400">{selectedUnits.length} selected</span>
                <button
                  onClick={() => setTargetMode(true)}
                  className={`btn-ghost text-sm px-2 py-1 ${targetMode ? 'bg-red-500/20' : ''}`}
                >
                  🎯 Attack (A)
                </button>
                <button
                  onClick={() => {
                    updateUnits(battle.units.map(u =>
                      selectedUnits.includes(u.uniqId)
                        ? { ...u, targetEntity: null, targetX: null, targetY: null }
                        : u
                    ));
                  }}
                  className="btn-ghost text-sm px-2 py-1"
                >
                  ⏹️ Stop (S)
                </button>
              </div>
            )}

            {/* Spells */}
            <div className="flex gap-2">
              {battle.level?.availableSpells.slice(0, 4).map((spellId, index) => {
                const spell = SPELL_TYPES[spellId];
                const keys = ['Q', 'W', 'E', 'R'];
                const isActive = activeSpell === spellId;
                
                return (
                  <button
                    key={spellId}
                    onClick={() => setActiveSpell(isActive ? null : spellId)}
                    className={`
                      w-12 h-12 rounded-lg flex flex-col items-center justify-center
                      transition-all border-2
                      ${isActive ? 'border-purple-500 bg-purple-500/20' : 'border-slate-700 bg-slate-800'}
                      hover:border-purple-400
                    `}
                  >
                    <span className="text-lg">{spell.icon}</span>
                    <span className="text-[10px] text-slate-400">{keys[index]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls Help */}
        <div className="bg-slate-900 p-2 text-center text-xs text-slate-500">
          Click in green zone to deploy | Click unit to select | Drag to box-select | 
          A: Attack mode | S: Stop | Space: Pause | Q/W/E/R: Spells
        </div>
      </div>
    );
  }

  // Victory Screen
  if (gameState === 'victory') {
    const stars = battle.stats.destructionPercent >= 100 ? 3 :
                  battle.stats.destructionPercent >= 75 ? 2 :
                  battle.stats.destructionPercent >= 50 ? 1 : 0;
    
    return (
      <div className="min-h-screen bg-game-pattern flex items-center justify-center p-4">
        <div className="card-game p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-display font-bold text-gradient-gold mb-4">
            VICTORY!
          </h1>
          
          {/* Stars */}
          <div className="text-5xl mb-6">
            {[1, 2, 3].map(s => (
              <span 
                key={s} 
                className={`inline-block ${s <= stars ? 'star-earned animate-star-pop' : 'star-empty'}`}
                style={{ animationDelay: `${s * 0.2}s` }}
              >
                ★
              </span>
            ))}
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-left">
            <div className="card-game p-3">
              <div className="text-slate-400 text-sm">Destruction</div>
              <div className="text-xl font-bold text-green-400">
                {battle.stats.destructionPercent}%
              </div>
            </div>
            <div className="card-game p-3">
              <div className="text-slate-400 text-sm">Time</div>
              <div className="text-xl font-bold text-amber-400">
                {Math.floor((battle.level?.timeLimit || 180) - battle.battleTime)}s
              </div>
            </div>
            <div className="card-game p-3">
              <div className="text-slate-400 text-sm">Units Deployed</div>
              <div className="text-xl font-bold">{battle.stats.unitsDeployed}</div>
            </div>
            <div className="card-game p-3">
              <div className="text-slate-400 text-sm">Damage Dealt</div>
              <div className="text-xl font-bold text-red-400">
                {battle.stats.damageDealt.toLocaleString()}
              </div>
            </div>
          </div>
          
          {/* Rewards */}
          <div className="flex justify-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl">💰</div>
              <div className="resource-gold">+{Math.floor((battle.level?.goldReward || 0) * (stars / 3))}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl">🧪</div>
              <div className="resource-elixir">+{Math.floor((battle.level?.elixirReward || 0) * (stars / 3))}</div>
            </div>
            {stars === 3 && (
              <div className="text-center">
                <div className="text-2xl">💎</div>
                <div className="resource-gems">+{battle.level?.gemsReward || 0}</div>
              </div>
            )}
          </div>
          
          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setGameState('campaign')}
              className="btn-ghost flex-1"
            >
              Campaign
            </button>
            <button
              onClick={() => battle.level && initBattle(battle.level)}
              className="btn-secondary flex-1"
            >
              Replay
            </button>
            {battle.level && CAMPAIGN_LEVELS[battle.level.id] && (
              <button
                onClick={() => {
                  const nextLevel = CAMPAIGN_LEVELS.find(l => l.id === (battle.level?.id || 0) + 1);
                  if (nextLevel) initBattle(nextLevel);
                }}
                className="btn-primary flex-1"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Defeat Screen
  if (gameState === 'defeat') {
    return (
      <div className="min-h-screen bg-game-pattern flex items-center justify-center p-4">
        <div className="card-game p-8 text-center max-w-md w-full">
          <div className="text-6xl mb-4">💀</div>
          <h1 className="text-3xl font-display font-bold text-red-500 mb-4">
            DEFEAT
          </h1>
          
          <p className="text-slate-400 mb-6">
            You need at least 50% destruction to earn stars.
            <br />
            Destruction: {battle.stats.destructionPercent}%
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={() => setGameState('campaign')}
              className="btn-ghost flex-1"
            >
              Campaign
            </button>
            <button
              onClick={() => battle.level && initBattle(battle.level)}
              className="btn-primary flex-1"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Shop Screen
  if (gameState === 'shop') {
    return (
      <div className="min-h-screen bg-game-pattern p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setGameState('menu')}
              className="btn-ghost"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-display font-bold text-amber-400">SHOP</h1>
            <div className="flex gap-4">
              <span className="resource-gold">💰 {profile?.gold.toLocaleString()}</span>
              <span className="resource-elixir">🧪 {profile?.elixir.toLocaleString()}</span>
              <span className="resource-gems">💎 {profile?.gems}</span>
            </div>
          </div>

          {/* Gem Packages */}
          <h2 className="text-xl font-bold text-purple-400 mb-4">💎 Gem Packages</h2>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {GEM_PACKAGES.map(pkg => (
              <div
                key={pkg.id}
                className={`
                  card-game-hover p-4 text-center relative
                  ${pkg.isPopular ? 'border-amber-500' : ''}
                  ${pkg.isBestValue ? 'border-green-500' : ''}
                `}
              >
                {pkg.isPopular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                    POPULAR
                  </div>
                )}
                {pkg.isBestValue && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                    BEST VALUE
                  </div>
                )}
                <div className="text-4xl mb-2">💎</div>
                <div className="text-2xl font-bold text-pink-400">{pkg.gems.toLocaleString()}</div>
                {pkg.bonusGems > 0 && (
                  <div className="text-sm text-green-400">+{pkg.bonusGems} Bonus!</div>
                )}
                <button className="btn-primary w-full mt-3">
                  ${pkg.price.toFixed(2)}
                </button>
              </div>
            ))}
          </div>

          {/* Platform Cross-Sell */}
          <div className="card-game p-6 text-center bg-gradient-to-r from-amber-500/10 to-purple-500/10 border-amber-500/30">
            <div className="text-3xl mb-2">🌟</div>
            <h3 className="text-xl font-bold text-amber-400 mb-2">
              Explore the Full CR AudioViz AI Platform
            </h3>
            <p className="text-slate-400 mb-4">
              Access comprehensive creative tools, AI assistants, and more with your account!
            </p>
            <button
              onClick={() => window.open('https://craudiovizai.com', '_blank')}
              className="btn-secondary"
            >
              Visit Platform →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Helper to get updated buildings (used in game loop)
const updatedBuildings: Building[] = [];
