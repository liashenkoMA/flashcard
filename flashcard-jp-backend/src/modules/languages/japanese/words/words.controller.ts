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
import { WordsService } from './words.service';
import { UpdateWordJpWeightDto, WordJpDto } from './words.schema.dto';
import { Request } from 'express';

@Controller(ROUTES.WORDS)
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post(ROUTES.WORDS_ADD)
  addWord(@Req() request: Request, @Body() word: WordJpDto) {
    return this.wordsService.addWord(word, request);
  }

  @Get()
  getWord(@Req() request: Request) {
    return this.wordsService.getWord(request);
  }

  @Delete(':id')
  deleteWord(@Req() request: Request, @Param('id') wordId: string) {
    return this.wordsService.deleteWord(wordId, request);
  }

  @Get(ROUTES.WORDS_GET_CATEGORY)
  getWordsCategory(@Req() request: Request) {
    return this.wordsService.getWordsCategory(request);
  }

  @Patch(ROUTES.WORDS_WEIGHT_UPDATE)
  updateWordWeight(
    @Body() word: UpdateWordJpWeightDto,
    @Req() request: Request,
  ) {
    return this.wordsService.updateWordWeight(word, request);
  }
}
