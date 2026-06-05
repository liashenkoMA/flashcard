import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.schema.dto';
import { ROUTES } from '../../shared/constants/routes.constant';
import { Request } from 'express';

@Controller(ROUTES.USER)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }

  @Get()
  getUser(@Req() request: Request) {
    return this.userService.getUser(request);
  }

  @Patch(ROUTES.USER_UPDATE)
  updateUser(@Body() userData: UpdateUserDto, @Req() request: Request) {
    return this.userService.updateUser(userData, request);
  }

  @Delete()
  deleteUser(@Req() request: Request) {
    return this.userService.deleteUser(request);
  }
}
