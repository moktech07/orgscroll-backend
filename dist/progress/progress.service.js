"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let ProgressService = class ProgressService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async recordAttempt(userId, cardId, correct) {
        let existing = null;
        try {
            const res = await this.supabase
                .getClient()
                .from('progress')
                .select('*')
                .eq('user_id', userId)
                .eq('card_id', cardId)
                .single();
            existing = res.data;
        }
        catch (e) {
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
            if (error)
                throw new Error(`Failed to update progress: ${error.message}`);
            return data;
        }
        else {
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
            if (error)
                throw new Error(`Failed to create progress: ${error.message}`);
            return data;
        }
    }
    async getUserProgress(userId) {
        const { data, error } = await this.supabase
            .getClient()
            .from('progress')
            .select('*')
            .eq('user_id', userId);
        if (error)
            throw new Error(`Failed to fetch progress: ${error.message}`);
        return data;
    }
    async getUserStats(userId) {
        const progress = await this.getUserProgress(userId);
        const totalAttempts = progress.reduce((sum, p) => sum + p.attempts, 0);
        const totalCorrect = progress.reduce((sum, p) => sum + p.correct, 0);
        const totalXP = progress.reduce((sum, p) => sum + p.xp_earned, 0);
        return {
            totalAttempts,
            totalCorrect,
            accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
            totalXP,
            cardsCompleted: progress.length,
        };
    }
};
exports.ProgressService = ProgressService;
exports.ProgressService = ProgressService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], ProgressService);
