import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ProgressService {
  constructor(private supabase: SupabaseService) {}

  async recordAttempt(userId: string, cardId: string, correct: boolean) {
    let existing: any = null;
    try {
      const res = await this.supabase
        .getClient()
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('card_id', cardId)
        .single();
      existing = res.data;
    } catch (e) {
      existing = null;
    }

    const xpEarned = correct ? 10 : 0;

    if (existing) {
      const { data, error } = await this.supabase
        .getClient()
        .from('progress')
        .update({
          attempts: existing.attempts + 1,
          correct: existing.correct + (correct ? 1 : 0),
          xp_earned: existing.xp_earned + xpEarned,
          last_attempted: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new Error(`Failed to update progress: ${error.message}`);
      return data;
    } else {
      const { data, error } = await this.supabase
        .getClient()
        .from('progress')
        .insert([
          {
            id: `${userId}_${cardId}_${Date.now()}`,
            user_id: userId,
            card_id: cardId,
            attempts: 1,
            correct: correct ? 1 : 0,
            xp_earned: xpEarned,
            last_attempted: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw new Error(`Failed to create progress: ${error.message}`);
      return data;
    }
  }

  async getUserProgress(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('progress')
      .select('*')
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to fetch progress: ${error.message}`);
    return data;
  }

  async getUserStats(userId: string) {
    const progress = await this.getUserProgress(userId);
    const totalAttempts = progress.reduce((sum: number, p: any) => sum + p.attempts, 0);
    const totalCorrect = progress.reduce((sum: number, p: any) => sum + p.correct, 0);
    const totalXP = progress.reduce((sum: number, p: any) => sum + p.xp_earned, 0);

    return {
      totalAttempts,
      totalCorrect,
      accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
      totalXP,
      cardsCompleted: progress.length,
    };
  }
}
