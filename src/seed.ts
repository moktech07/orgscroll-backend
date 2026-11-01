import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const supabaseUrl = 'https://ckiziqjdjwugivoxfzlr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNraXppcWpkand1Z2l2b3hmemxyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzQ2MDYyNSwiZXhwIjoyMTA5MDM2NjI1fQ.uv3gPGfLD3LJF7pucjvdFSQj-kc2c5B88QuHHPAaL6o';

const supabase = createClient(supabaseUrl, supabaseKey);

// Hardcoded paths - simpler and more reliable
const CONTENT_PATH = '/home/swiphy/test/clorgsc/orgscroll/src/content';

async function seedCards() {
  console.log('🌱 Starting database seed...');

  if (!fs.existsSync(CONTENT_PATH)) {
    console.error('❌ Content directory not found at:', CONTENT_PATH);
    process.exit(1);
  }

  const files = fs.readdirSync(CONTENT_PATH).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} content files`);

  let totalSeeded = 0;
  let totalFailed = 0;

  for (const file of files) {
    try {
      const filePath = `${CONTENT_PATH}/${file}`;
      const rawContent = fs.readFileSync(filePath, 'utf8');
      const content = JSON.parse(rawContent);

      console.log(`\n📄 Processing ${file}: ${content.cards.length} cards`);

      for (const card of content.cards) {
        const { error } = await supabase.from('cards').upsert({
          id: card.id,
          type: card.type,
          chapter: card.chapter,
          class: card.class,
          exam: card.exam,
          difficulty: card.difficulty || 'medium',
          reviewed: card.reviewed ?? true,
          source: card.source || 'original',
          data: card.data,
        });

        if (error) {
          console.error(`  ❌ ${card.id}: ${error.message}`);
          totalFailed++;
        } else {
          totalSeeded++;
          process.stdout.write('.');
        }
      }
    } catch (e: any) {
      console.error(`\n❌ Error processing ${file}:`, e.message);
      totalFailed += 34; // rough estimate
    }
  }

  console.log(`\n\n✅ Seeding complete!`);
  console.log(`   Seeded: ${totalSeeded} cards`);
  console.log(`   Failed: ${totalFailed} cards`);
  process.exit(totalFailed > 0 ? 1 : 0);
}

seedCards().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
