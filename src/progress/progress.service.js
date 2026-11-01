"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressService = void 0;
const common_1 = require("@nestjs/common");
let ProgressService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProgressService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            ProgressService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        supabase;
        constructor(supabase) {
            this.supabase = supabase;
        }
        async recordAttempt(userId, cardId, correct) {
            const { data: existing } = await this.supabase
                .getClient()
                .from('progress')
                .select('*')
                .eq('user_id', userId)
                .eq('card_id', cardId)
                .single()
                .catch(() => ({ data: null }));
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
    return ProgressService = _classThis;
})();
exports.ProgressService = ProgressService;
