"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrations = exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://ckiziqjdjwugivoxfzlr.supabase.co';
const supabaseKey = 'sb_publishable_6y0JRlOpgUnkXlSOGfdwug_fN6M_q3H';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
// SQL migrations to run in Supabase SQL Editor
exports.migrations = `
-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  chapter TEXT NOT NULL,
  class INTEGER NOT NULL,
  exam TEXT NOT NULL,
  difficulty TEXT,
  reviewed BOOLEAN DEFAULT true,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  data JSONB NOT NULL
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  card_id TEXT REFERENCES cards(id),
  attempts INTEGER DEFAULT 0,
  correct INTEGER DEFAULT 0,
  last_attempted TIMESTAMP,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_cards_chapter ON cards(chapter);
CREATE INDEX IF NOT EXISTS idx_cards_exam ON cards(exam);
CREATE INDEX IF NOT EXISTS idx_cards_class ON cards(class);
CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_card ON progress(card_id);
`;
