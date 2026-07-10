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
import { Request } from 'express';
import { UpdateWordKrWeightDto, WordKrDto } from './krWords.schema.dto';
import { WordsKrService } from './krWords.service';

@Controller(ROUTES.WORDS_KO)
export class WordsKrController {
  constructor(private readonly wordsKrService: WordsKrService) {}

  @Post(ROUTES.WORDS_KO_ADD)
  addWord(@Req() request: Request, @Body() word: WordKrDto) {
    return this.wordsKrService.addWord(request, word);
  }

  @Get()
  getWord(@Req() request: Request) {
    return this.wordsKrService.getWord(request);
  }

  @Delete(':id')
  deleteWord(@Req() request: Request, @Param('id') wordId: string) {
    return this.wordsKrService.deleteWord(request, wordId);
  }

  @Get(ROUTES.WORDS_KO_GET_CATEGORY)
  getWordsCategory(@Req() request: Request) {
    return this.wordsKrService.getWordsCategory(request);
  }

  @Patch(ROUTES.WORDS_KO_WEIGHT_UPDATE)
  updateWordWeight(
    @Body() word: UpdateWordKrWeightDto,
    @Req() request: Request,
  ) {
    return this.wordsKrService.updateWordWeight(request, word);
  }
}
