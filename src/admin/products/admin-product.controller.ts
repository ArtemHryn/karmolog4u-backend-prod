import { BadRequestException, Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminMeditationService } from './meditations/admin-meditation.service';
import { AdminGuidesAndBooksService } from './guides_and_books/admin-guides_and_books.service';
import { AdminWebinarsService } from './webinars/admin-webinars.service';
import { Roles } from 'src/role/roles.decorator';
import { Role } from 'src/role/role.enum';
import { GiftService } from './gift/gift.service';

@ApiBearerAuth()
@ApiTags('product')
@Roles(Role.Admin)
@Controller('admin/products')
export class AdminProductController {
  constructor(
    private adminMeditationService: AdminMeditationService,
    private adminWebinarService: AdminWebinarsService,
    private adminGuidesAndBooksService: AdminGuidesAndBooksService,
    private giftService: GiftService,
  ) {}

  @Get('product-count')
  @ApiOperation({ summary: 'Get count of each product' })
  @ApiResponse({
    status: 200,
    description: 'get count of product ',
    type: Number,
  })
  @ApiResponse({ status: 400, description: 'something wrong' })
  async getProductCount(): Promise<any> {
    try {
      const meditations =
        await this.adminMeditationService.getMeditationCount();
      const webinars = await this.adminWebinarService.getWebinarCount();
      const guidesAndBooks =
        await this.adminGuidesAndBooksService.getGuidesAndBooksCount();
      const gifts = await this.giftService.getGiftsCount();
      return {
        meditations,
        webinars,
        'guides-and-books': guidesAndBooks,
        gifts,
      };
    } catch (error) {
      throw new BadRequestException('Something wrong');
    }
  }
}
