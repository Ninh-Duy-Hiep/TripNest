import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { GetGuestsDto } from './dto/get-guests.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('guests')
  @ApiOperation({
    summary: 'Get list of guest users with pagination or full list',
  })
  @ApiResponse({ status: 200, description: 'Return list of guest users' })
  findAllGuests(@Query() query: GetGuestsDto) {
    return this.usersService.findAllGuests(query);
  }
}
