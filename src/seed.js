"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const supabaseUrl = 'https://ckiziqjdjwugivoxfzlr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraXppcWpkand1Z2l2b3hmemxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzQ2MDYyNSwiZXhwIjoyMTA5MDM2NjI1fQ.uv3gPGfLD3LJF7pucjvdFSQj-kc2c5B88QuHHPAaL6o';
const supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
const CONTENT_DIR = path.join(__dirname, '../../../orgscroll/src/content');
async function seed() {
    console.log('🌱 Starting database seed from local content files...');
    if (!fs.existsSync(CONTENT_DIR)) {
        console.error('Content directory not found:', CONTENT_DIR);
        return;
    }
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'));
    let totalSeeded = 0;
    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`Processing chapter: ${content.chapter} (${content.cards.length} cards)...`);
        for (const card of content.cards) {
            const payload = {
                id: card.id,
                type: card.type,
                chapter: card.chapter,
                class: card.class,
                exam: card.exam,
                difficulty: card.difficulty || 'medium',
                reviewed: card.reviewed ?? true,
                source: card.source || 'original',
                data: card.data,
            };
            const { error } = await supabase
                .from('cards')
                .upsert(payload, { onConflict: 'id' });
            if (error) {
                console.error(`❌ Failed to seed card ${card.id}:`, error.message);
            }
            else {
                totalSeeded++;
            }
        }
    }
    console.log(`✨ Successfully seeded ${totalSeeded} cards into Supabase!`);
}
seed().catch(console.error);
