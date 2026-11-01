import { Module } from '@nestjs/common';
import { CardsController } from './cards/cards.controller';
import { CardsService } from './cards/cards.service';
import { ProgressController } from './progress/progress.controller';
import { ProgressService } from './progress/progress.service';
import { SupabaseService } from './supabase/supabase.service';

@Module({
  imports: [],
  controllers: [CardsController, ProgressController],
  providers: [CardsService, ProgressService, SupabaseService],
})
export class AppModule {}
