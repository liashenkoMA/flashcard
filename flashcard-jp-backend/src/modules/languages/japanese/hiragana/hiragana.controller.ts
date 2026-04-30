import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { ROUTES } from '../../../../shared/constants/routes.constant';
import { HiraganaService } from './hiragana.service';
import { Request } from 'express';
import { UpdateHiraganaDto } from './hiragana.schema.dto';

@Controller(ROUTES.HIRAGANA)
export class HiraganaController {
  constructor(private readonly hiraganaService: HiraganaService) {}

  @Get()
  getHiragana(@Req() request: Request) {
    return this.hiraganaService.getHiragana(request);
  }

  @Patch(ROUTES.HIRAGANA_UPDATE)
  updateHiragana(@Body() hiragana: UpdateHiraganaDto, @Req() request: Request) {
    return this.hiraganaService.updateHiragana(hiragana, request);
  }
}
