import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req, @Query('storeId') storeId?: string) {
    if (storeId) {
      return this.reviewsService.findByStore(+storeId);
    }
    return this.reviewsService.findAllForUser(req.user);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() data: any, @Request() req) {
    return this.reviewsService.create(data, req.user);
  }
}
