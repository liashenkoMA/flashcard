import { ROUTES } from '../../../../shared/constants/routes.constant';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { WordCnService } from './wordsCn.service';
import { UpdateWordCnWeightDto, WordCnDto } from './wordsCn.schema.dto';
import { Request } from 'express';

@Controller(ROUTES.WORDS_ZH)
export class WordCnController {
  constructor(private readonly wordsCnService: WordCnService) {}

  @Post(ROUTES.WORDS_ZH_ADD)
  addWord(@Req() request: Request, @Body() word: WordCnDto) {
    return this.wordsCnService.addWord(request, word);
  }

  @Get()
  getWord(@Req() request: Request) {
    return this.wordsCnService.getWord(request);
  }

  @Delete(':id')
  deleteWord(@Req() request: Request, @Param('id') wordId: string) {
    return this.wordsCnService.deleteWord(request, wordId);
  }

  @Get(ROUTES.WORDS_ZH_GET_CATEGORY)
  getWordsCategory(@Req() request: Request) {
    return this.wordsCnService.getWordsCategory(request);
  }

  @Patch(ROUTES.WORDS_ZH_WEIGHT_UPDATE)
  updateWordWeight(
    @Body() word: UpdateWordCnWeightDto,
    @Req() request: Request,
  ) {
    return this.wordsCnService.updateWordWeight(request, word);
  }
}
