import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Get()
  async getCards(
    @Query('exam') exam?: 'jee' | 'neet' | 'both',
    @Query('class') classParam?: string,
    @Query('chapter') chapter?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const classVal = classParam ? (classParam === 'both' ? 'both' : parseInt(classParam)) : undefined;
    return this.cardsService.getCards({
      exam,
      class: classVal as any,
      chapter,
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
    });
  }

  @Get(':id')
  async getCard(@Param('id') id: string) {
    return this.cardsService.getCardById(id);
  }

  @Post()
  async createCard(@Body() cardData: any) {
    return this.cardsService.createCard(cardData);
  }
}
