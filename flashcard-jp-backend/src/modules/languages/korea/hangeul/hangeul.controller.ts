import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { HangeulService } from './hangeul.service';
import { ROUTES } from '../../../../shared/constants/routes.constant';
import { Request } from 'express';
import { UpdateHangeulDto, UpdateHangeulWeightDto } from './hangeul.schema.dto';

@Controller(ROUTES.HANGEUL)
export class HangeulController {
  constructor(private readonly hangeulService: HangeulService) {}

  @Get()
  getHangeul(@Req() request: Request) {
    return this.hangeulService.getHangeul(request);
  }

  @Patch(ROUTES.HANGEUL_UPDATE)
  updateHangeul(@Req() request: Request, @Body() hanguel: UpdateHangeulDto) {
    return this.hangeulService.updateHangeul(request, hanguel);
  }

  @Patch(ROUTES.HANGEUL_WEIGHT_UPDATE)
  updateHanguelWeight(
    @Req() request: Request,
    @Body() hanguel: UpdateHangeulWeightDto,
  ) {
    return this.hangeulService.updateHangeulWeight(request, hanguel);
  }
}
