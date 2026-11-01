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
exports.CardsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_service_1 = require("../supabase/supabase.service");
let CardsService = class CardsService {
    supabase;
    constructor(supabase) {
        this.supabase = supabase;
    }
    async getCards(params) {
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
    async getCardById(id) {
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
    async createCard(cardData) {
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
};
exports.CardsService = CardsService;
exports.CardsService = CardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supabase_service_1.SupabaseService])
], CardsService);
