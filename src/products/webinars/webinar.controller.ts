import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { WebinarService } from './webinar.service';
import { Public } from 'src/common/decorators/isPublic.decorator';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WebinarEntity } from 'src/admin/products/webinars/dto/webinar-entity.dto';
import mongoose from 'mongoose';

@ApiTags('webinars')
@Controller('products/webinars')
export class WebinarController {
  constructor(private webinarService: WebinarService) {}

  @Public()
  @Get('get-all')
  @ApiOperation({ summary: 'Get webinar prevue' })
  @ApiResponse({
    status: 200,
    description: 'get-webinar',
    type: [WebinarEntity],
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async getMeditation(): Promise<WebinarEntity[]> {
    try {
      return await this.webinarService.findPrevueWebinar();
    } catch (error) {
      throw new NotFoundException('Webinars not found');
    }
  }

  @Public()
  @Get('get/:id')
  @ApiOperation({ summary: 'Get webinar by id' })
  @ApiResponse({
    status: 200,
    description: 'get-webinar',
    type: WebinarEntity,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async getMeditationById(@Param('id') id: string): Promise<WebinarEntity> {
    try {
      const webinarId = new mongoose.Types.ObjectId(id.toString());
      const webinar = await this.webinarService.findWebinarById(webinarId);
      return webinar;
    } catch (error) {
      throw new NotFoundException('Webinar not found');
    }
  }
}
