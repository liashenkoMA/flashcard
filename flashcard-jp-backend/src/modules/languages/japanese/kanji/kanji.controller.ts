import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Req,
} from '@nestjs/common';
import { KanjiService } from './kanji.service';
import { ROUTES } from '../../../../shared/constants/routes.constant';
import { Request } from 'express';
import { KanjiDto } from './kanji.schema.dto';

@Controller(ROUTES.KANJI)
export class KanjiController {
  constructor(private readonly kanjiService: KanjiService) {}

  @Post(ROUTES.KANJI_ADD)
  addKanji(@Req() request: Request, @Body() kanji: KanjiDto) {
    return this.kanjiService.addKanji(kanji, request);
  }

  @Get()
  getKanji(@Req() request: Request) {
    return this.kanjiService.getKanji(request);
  }

  @Delete(':id')
  deleteKanji(@Req() request: Request, @Param('id') kanjiId: string) {
    return this.kanjiService.deleteKanji(kanjiId, request);
  }
}
