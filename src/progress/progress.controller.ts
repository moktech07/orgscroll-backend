import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Post('attempt')
  async recordAttempt(
    @Body() body: { userId: string; cardId: string; correct: boolean }
  ) {
    return this.progressService.recordAttempt(body.userId, body.cardId, body.correct);
  }

  @Get('user/:userId')
  async getUserProgress(@Param('userId') userId: string) {
    return this.progressService.getUserProgress(userId);
  }

  @Get('stats/:userId')
  async getUserStats(@Param('userId') userId: string) {
    return this.progressService.getUserStats(userId);
  }
}
