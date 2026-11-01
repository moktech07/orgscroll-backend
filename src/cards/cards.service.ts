import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CardsService {
  constructor(private supabase: SupabaseService) {}

  async getCards(params: {
    exam?: 'jee' | 'neet' | 'both';
    class?: 11 | 12 | 'both';
    chapter?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = this.supabase.getClient().from('cards').select('*');

    if (params.exam && params.exam !== 'both') {
      query = query.or(`exam.eq.${params.exam},exam.eq.both`);
    }

    if (params.class && params.class !== 'both') {
      query = query.or(`class.eq.${params.class},class.eq.both`);
    }

    if (params.chapter) {
      query = query.eq('chapter', params.chapter);
    }

    query = query.eq('reviewed', true).order('id');

    if (params.limit) {
      query = query.limit(params.limit);
    }
    if (params.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 20) - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch cards: ${error.message}`);
    }

    return data;
  }

  async getCardById(id: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('cards')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Card not found: ${error.message}`);
    }

    return data;
  }

  async createCard(cardData: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from('cards')
      .insert([cardData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create card: ${error.message}`);
    }

    return data;
  }
}
