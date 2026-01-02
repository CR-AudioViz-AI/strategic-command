-- ═══════════════════════════════════════════════════════════════════════════════
-- STRATEGIC COMMAND: TOTAL CONTROL
-- DATABASE SCHEMA FOR SUPABASE
-- CR AudioViz AI - Henderson Standard
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────────
-- GAME PROFILES TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_game_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username TEXT NOT NULL DEFAULT 'Commander',
  player_level INTEGER NOT NULL DEFAULT 1,
  experience INTEGER NOT NULL DEFAULT 0,
  gold INTEGER NOT NULL DEFAULT 1000,
  elixir INTEGER NOT NULL DEFAULT 1000,
  gems INTEGER NOT NULL DEFAULT 50,
  total_stars INTEGER NOT NULL DEFAULT 0,
  total_battles INTEGER NOT NULL DEFAULT 0,
  battles_won INTEGER NOT NULL DEFAULT 0,
  clan_id UUID REFERENCES public.sc_clans(id) ON DELETE SET NULL,
  trophy_count INTEGER NOT NULL DEFAULT 0,
  battle_pass_tier INTEGER NOT NULL DEFAULT 0,
  battle_pass_premium BOOLEAN NOT NULL DEFAULT FALSE,
  last_daily_reward TIMESTAMPTZ,
  daily_battles_remaining INTEGER NOT NULL DEFAULT 5,
  login_streak INTEGER NOT NULL DEFAULT 0,
  last_login TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- LEVEL PROGRESS TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_level_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level_id INTEGER NOT NULL,
  stars INTEGER NOT NULL DEFAULT 0 CHECK (stars >= 0 AND stars <= 3),
  best_time INTEGER NOT NULL DEFAULT 0,
  best_destruction INTEGER NOT NULL DEFAULT 0 CHECK (best_destruction >= 0 AND best_destruction <= 100),
  attempts INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- BATTLE RESULTS TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_battle_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level_id INTEGER NOT NULL,
  stars INTEGER NOT NULL DEFAULT 0,
  destruction_percent INTEGER NOT NULL DEFAULT 0,
  time_remaining INTEGER NOT NULL DEFAULT 0,
  gold_earned INTEGER NOT NULL DEFAULT 0,
  elixir_earned INTEGER NOT NULL DEFAULT 0,
  gems_earned INTEGER NOT NULL DEFAULT 0,
  experience_earned INTEGER NOT NULL DEFAULT 0,
  units_deployed INTEGER NOT NULL DEFAULT 0,
  units_lost INTEGER NOT NULL DEFAULT 0,
  damage_dealt INTEGER NOT NULL DEFAULT 0,
  spells_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- CLANS TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_clans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  tag TEXT NOT NULL UNIQUE,
  description TEXT,
  badge_id TEXT NOT NULL DEFAULT 'default',
  leader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  trophy_count INTEGER NOT NULL DEFAULT 0,
  member_count INTEGER NOT NULL DEFAULT 1,
  max_members INTEGER NOT NULL DEFAULT 50,
  min_trophies INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN NOT NULL DEFAULT TRUE,
  war_wins INTEGER NOT NULL DEFAULT 0,
  war_losses INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- CLAN MEMBERS TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_clan_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clan_id UUID REFERENCES public.sc_clans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'co-leader', 'elder', 'member')),
  donations INTEGER NOT NULL DEFAULT 0,
  donations_received INTEGER NOT NULL DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(clan_id, user_id)
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- USER ACHIEVEMENTS TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  claimed BOOLEAN NOT NULL DEFAULT FALSE,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- USER BATTLE PASS TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_user_battle_pass (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  season INTEGER NOT NULL,
  current_tier INTEGER NOT NULL DEFAULT 0,
  current_xp INTEGER NOT NULL DEFAULT 0,
  is_premium BOOLEAN NOT NULL DEFAULT FALSE,
  claimed_free_rewards INTEGER[] NOT NULL DEFAULT '{}',
  claimed_premium_rewards INTEGER[] NOT NULL DEFAULT '{}',
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, season)
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- PURCHASES TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_provider TEXT NOT NULL CHECK (payment_provider IN ('stripe', 'paypal', 'credits', 'gems')),
  payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- DAILY REWARDS TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_daily_rewards_claimed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  reward_type TEXT NOT NULL,
  reward_value INTEGER NOT NULL,
  claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, day_number, claimed_at::DATE)
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- UNLOCKED UNITS TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_unlocked_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  unit_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, unit_id)
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- UNLOCKED SPELLS TABLE
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.sc_unlocked_spells (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  spell_id TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, spell_id)
);

-- ─────────────────────────────────────────────────────────────────────────────────
-- LEADERBOARD VIEW
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW public.sc_leaderboard AS
SELECT 
  p.id,
  p.user_id,
  p.username,
  p.player_level,
  p.trophy_count,
  p.total_stars,
  p.battles_won,
  c.name as clan_name,
  ROW_NUMBER() OVER (ORDER BY p.trophy_count DESC, p.total_stars DESC) as rank
FROM public.sc_game_profiles p
LEFT JOIN public.sc_clans c ON p.clan_id = c.id
ORDER BY p.trophy_count DESC, p.total_stars DESC;

-- ─────────────────────────────────────────────────────────────────────────────────
-- INDEXES
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_sc_profiles_user ON public.sc_game_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_sc_profiles_trophy ON public.sc_game_profiles(trophy_count DESC);
CREATE INDEX IF NOT EXISTS idx_sc_level_progress_user ON public.sc_level_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_sc_battle_results_user ON public.sc_battle_results(user_id);
CREATE INDEX IF NOT EXISTS idx_sc_battle_results_created ON public.sc_battle_results(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sc_clans_trophy ON public.sc_clans(trophy_count DESC);
CREATE INDEX IF NOT EXISTS idx_sc_clan_members_clan ON public.sc_clan_members(clan_id);
CREATE INDEX IF NOT EXISTS idx_sc_clan_members_user ON public.sc_clan_members(user_id);
CREATE INDEX IF NOT EXISTS idx_sc_achievements_user ON public.sc_user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_sc_purchases_user ON public.sc_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_sc_purchases_status ON public.sc_purchases(status);

-- ─────────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.sc_game_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sc_level_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sc_battle_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sc_clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sc_clan_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sc_user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sc_user_battle_pass ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sc_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sc_daily_rewards_claimed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sc_unlocked_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sc_unlocked_spells ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON public.sc_game_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.sc_game_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.sc_game_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Level Progress: Users can only access their own
CREATE POLICY "Users can view own progress" ON public.sc_level_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON public.sc_level_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.sc_level_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Battle Results: Users can only access their own
CREATE POLICY "Users can view own battles" ON public.sc_battle_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own battles" ON public.sc_battle_results FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Clans: Everyone can view, members can update
CREATE POLICY "Clans are viewable by everyone" ON public.sc_clans FOR SELECT USING (true);
CREATE POLICY "Leaders can update clan" ON public.sc_clans FOR UPDATE USING (auth.uid() = leader_id);
CREATE POLICY "Anyone can create clan" ON public.sc_clans FOR INSERT WITH CHECK (auth.uid() = leader_id);

-- Clan Members: Members can view their clan, only leaders can modify
CREATE POLICY "Clan members viewable" ON public.sc_clan_members FOR SELECT USING (true);
CREATE POLICY "Users can join clans" ON public.sc_clan_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave clans" ON public.sc_clan_members FOR DELETE USING (auth.uid() = user_id);

-- Achievements: Users can only access their own
CREATE POLICY "Users can view own achievements" ON public.sc_user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own achievements" ON public.sc_user_achievements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.sc_user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Battle Pass: Users can only access their own
CREATE POLICY "Users can view own battle pass" ON public.sc_user_battle_pass FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own battle pass" ON public.sc_user_battle_pass FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own battle pass" ON public.sc_user_battle_pass FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Purchases: Users can only view their own
CREATE POLICY "Users can view own purchases" ON public.sc_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert purchases" ON public.sc_purchases FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily Rewards: Users can only access their own
CREATE POLICY "Users can view own daily rewards" ON public.sc_daily_rewards_claimed FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can claim daily rewards" ON public.sc_daily_rewards_claimed FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Unlocked Units: Users can only access their own
CREATE POLICY "Users can view own units" ON public.sc_unlocked_units FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can unlock units" ON public.sc_unlocked_units FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Unlocked Spells: Users can only access their own
CREATE POLICY "Users can view own spells" ON public.sc_unlocked_spells FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can unlock spells" ON public.sc_unlocked_spells FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────────
-- TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────────

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sc_profiles_updated_at
  BEFORE UPDATE ON public.sc_game_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sc_level_progress_updated_at
  BEFORE UPDATE ON public.sc_level_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sc_clans_updated_at
  BEFORE UPDATE ON public.sc_clans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sc_achievements_updated_at
  BEFORE UPDATE ON public.sc_user_achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sc_battle_pass_updated_at
  BEFORE UPDATE ON public.sc_user_battle_pass
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_sc()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.sc_game_profiles (user_id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'Commander'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: This trigger should be created if you want auto-profile creation
-- CREATE TRIGGER on_auth_user_created_sc
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_sc();

-- ─────────────────────────────────────────────────────────────────────────────────
-- FUNCTIONS
-- ─────────────────────────────────────────────────────────────────────────────────

-- Get or create game profile
CREATE OR REPLACE FUNCTION public.get_or_create_sc_profile(p_user_id UUID)
RETURNS public.sc_game_profiles AS $$
DECLARE
  profile public.sc_game_profiles;
BEGIN
  SELECT * INTO profile FROM public.sc_game_profiles WHERE user_id = p_user_id;
  
  IF profile IS NULL THEN
    INSERT INTO public.sc_game_profiles (user_id)
    VALUES (p_user_id)
    RETURNING * INTO profile;
  END IF;
  
  RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update clan member count
CREATE OR REPLACE FUNCTION public.update_clan_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.sc_clans SET member_count = member_count + 1 WHERE id = NEW.clan_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.sc_clans SET member_count = member_count - 1 WHERE id = OLD.clan_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_clan_count
  AFTER INSERT OR DELETE ON public.sc_clan_members
  FOR EACH ROW EXECUTE FUNCTION public.update_clan_member_count();

-- ─────────────────────────────────────────────────────────────────────────────────
-- GRANT PERMISSIONS
-- ─────────────────────────────────────────────────────────────────────────────────

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
