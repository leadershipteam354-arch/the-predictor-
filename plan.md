# Implementation Plan - Kalaharian Trading Bot Upgrade (CRT & SMC)

The user wants to upgrade the existing "Kalaharian" trading bot with advanced strategies: **Candle Range Theory (CRT)** and **Smart Money Concepts (SMC)**. Additionally, the bot should support multilingual signal logs in **Setswana, English, and Sekgalagadi**, with a focus on private access ("signals get assess to me only no everyone").

## Scope Summary
- **Strategy Implementation**: Implement CRT (Liquidity sweeps, AMD - Accumulation, Manipulation, Distribution) and SMC (BOS - Break of Structure, CHoCH - Change of Character, Order Blocks, FVGs) in the trading logic.
- **Multilingual Support**: Add localization for the bot's activity log and signal alerts in Setswana, English, and Sekgalagadi.
- **Privacy Layer**: Implement a simulated "Private Access" mechanism (Auth/Session-based) to ensure signals are only accessible to the authorized user.
- **UI Updates**: Enhance the `ActivityTerminal` and `BotControl` to reflect these new strategies and language options.

## Auth & RLS model
**Auth in scope:** yes
**Model:** supabase_auth
**RLS strategy:** `auth.uid()` will be used to restrict access to the `trading_signals` and `bot_settings` tables.
**Frontend implication:** The dashboard should redirect to a login/signup flow if no session is present. Private signals will only be fetched for the logged-in `user_id`.

## Migration baseline
**Local migrations in project:** none
**User confirmed proceed on connected DB:** not_applicable (Greenfield Supabase setup for this feature)

## Affected Areas
- **Backend (Supabase)**: New tables for `trading_signals` and `user_settings`. RLS policies to restrict data to the owner.
- **Hooks**: `useKalaharianRobot.ts` needs a major update to include CRT/SMC logic and fetch/persist signals to Supabase.
- **Components**: 
    - `BotControl.tsx`: Add strategy selectors for CRT/SMC and language selector.
    - `ActivityTerminal.tsx`: Update to render multilingual signals.
- **Localization**: Create a dictionary for trading terms in Setswana and Sekgalagadi.

## Proposed Phases

### Phase 1: Supabase Infrastructure (supabase_engineer)
- Create `trading_signals` table: `id, user_id, asset_symbol, type (BOS/CHOCH/CRT), message_en, message_tn, message_kg, created_at`.
- Create `bot_settings` table: `user_id, language, enabled_strategies (array), risk_level`.
- Enable RLS on both tables with `auth.uid() = user_id` policies.
- Add initial seed data or just the schema.

### Phase 2: Core Strategy Logic (frontend_engineer)
- Update `src/hooks/useKalaharianRobot.ts` to implement CRT and SMC detection logic.
- CRT: Detect if current candle sweeps the high/low of the previous candle and returns to range.
- SMC: Track higher highs/lows for BOS/CHoCH detection.
- Integrate `@supabase/supabase-js` for real-time signal persistence.

### Phase 3: Multilingual & UI Updates (frontend_engineer)
- Create a localization utility `src/lib/i18n.ts` containing the translation maps for English, Setswana, and Sekgalagadi.
- Update `BotControl.tsx` with language and strategy toggles.
- Update `ActivityTerminal.tsx` to display the message based on the selected language.

### Phase 4: Privacy & Auth Flow (frontend_engineer)
- Implement a basic Auth wrapper/gate in `App.tsx` using Supabase Auth.
- Ensure the "Signals access to me only" requirement is met by filtering queries by user session.

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. supabase_engineer — Setup schema and RLS for private signal storage.
2. frontend_engineer — Implement trading logic, localization, and Auth UI.

**Per-agent instructions:**
### 1. supabase_engineer
- **Phases:** Phase 1
- **Scope:** Create `trading_signals` and `bot_settings` tables with RLS.
- **Files:** `supabase/migrations/<timestamp>_trading_init.sql`
- **Depends on:** none
- **Acceptance criteria:** Tables exist in Supabase; `anon` role cannot read signals; `authenticated` role can only read their own signals.

### 2. frontend_engineer
- **Phases:** Phase 2, 3, 4
- **Scope:** 
    1. Run `bun add @supabase/supabase-js`.
    2. Implement CRT/SMC logic in `useKalaharianRobot.ts`.
    3. Add multilingual support (Setswana, Sekgalagadi).
    4. Build Auth UI gate.
- **Files:** `src/hooks/useKalaharianRobot.ts`, `src/components/KalaharianBot/BotControl.tsx`, `src/components/KalaharianBot/ActivityTerminal.tsx`, `src/App.tsx`, `src/lib/i18n.ts`.
- **Depends on:** Phase 1
- **Acceptance criteria:** Bot identifies BOS/CHoCH/CRT signals; Signals appear in the terminal in the selected language; Logged-out users see no data.
