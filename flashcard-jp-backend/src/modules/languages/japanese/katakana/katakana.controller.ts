import { ROUTES } from '@/src/shared/constants/routes.constant';
import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { KatakanaService } from './katakana.service';
import { Request } from 'express';
import {
  UpdateKatakanaDto,
  UpdateKatakanaWeightDto,
} from './katakana.schema.dto';

@Controller(ROUTES.KATAKANA)
export class KatakanaController {
  constructor(private readonly katakanaService: KatakanaService) {}

  @Get()
  getKatakana(@Req() request: Request) {
    return this.katakanaService.getKatakana(request);
  }

  @Patch(ROUTES.KATAKANA_UPDATE)
  updateKatakana(@Body() katakana: UpdateKatakanaDto, @Req() request: Request) {
    return this.katakanaService.updateKatakana(katakana, request);
  }

  @Patch(ROUTES.KATAKANA_WEIGHT_UPDATE)
  updateKatakanaWeight(
    @Body() katakana: UpdateKatakanaWeightDto,
    @Req() request: Request,
  ) {
    return this.katakanaService.updateKatakanaWeight(katakana, request);
  }
}
