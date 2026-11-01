"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const cards_controller_1 = require("./cards/cards.controller");
const cards_service_1 = require("./cards/cards.service");
const progress_controller_1 = require("./progress/progress.controller");
const progress_service_1 = require("./progress/progress.service");
const supabase_service_1 = require("./supabase/supabase.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [cards_controller_1.CardsController, progress_controller_1.ProgressController],
        providers: [cards_service_1.CardsService, progress_service_1.ProgressService, supabase_service_1.SupabaseService],
    })
], AppModule);
