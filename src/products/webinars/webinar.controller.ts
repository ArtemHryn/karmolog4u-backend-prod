import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { WebinarService } from './webinar.service';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WebinarEntity } from 'src/admin/products/webinars/dto/webinar-entity.dto';
import mongoose from 'mongoose';

@Controller()
export class WebinarController {
  constructor(private webinarService: WebinarService) {}

  @Public()
  @Get('get-all')
  @ApiOperation({ summary: 'Get meditation prevue' })
  @ApiResponse({
    status: 200,
    description: 'get-meditation',
    type: Array,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async getMeditation() {
    try {
      return await this.webinarService.findPrevueWebinar();
    } catch (error) {
      throw new NotFoundException('Webinars not found');
    }
  }

  @Public()
  @Get('get/:id')
  @ApiOperation({ summary: 'Get meditation by id' })
  @ApiResponse({
    status: 200,
    description: 'get-meditation',
    type: WebinarEntity,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async getMeditationById(@Param('id') id: string) {
    try {
      const webinarId = new mongoose.Types.ObjectId(id.toString());
      const meditation = await this.webinarService.findWebinarById(webinarId);
      return meditation;
    } catch (error) {
      throw new NotFoundException('Webinar not found');
    }
  }
}
