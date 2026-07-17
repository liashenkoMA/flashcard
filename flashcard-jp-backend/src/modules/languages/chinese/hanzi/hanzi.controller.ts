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
import { HanziService } from './hanzi.service';
import { ROUTES } from '../../../../shared/constants/routes.constant';
import { HanziDto, UpdateHanziWeightDto } from './hanzi.schema.dto';
import { Request } from 'express';

@Controller(ROUTES.HANZI)
export class HanziController {
  constructor(private readonly hanziService: HanziService) {}

  @Post(ROUTES.HANZI_ADD)
  addHanzi(@Req() request: Request, @Body() hanzi: HanziDto) {
    return this.hanziService.addHanzi(hanzi, request);
  }

  @Get()
  getHanzi(@Req() request: Request) {
    return this.hanziService.getHanzi(request);
  }

  @Delete(':id')
  deleteHanzi(@Req() request: Request, @Param('id') hanziId: string) {
    return this.hanziService.deleteHanzi(hanziId, request);
  }

  @Get(ROUTES.HANZI_GET_CATEGORY)
  getHanziCategory(@Req() request: Request) {
    return this.hanziService.getHanziCategory(request);
  }

  @Patch(ROUTES.HANZI_WEIGHT_UPDATE)
  updateHanziWeight(
    @Body() hanzi: UpdateHanziWeightDto,
    @Req() request: Request,
  ) {
    return this.hanziService.updateHanziWeight(hanzi, request);
  }
}
