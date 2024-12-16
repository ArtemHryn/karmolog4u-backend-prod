import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import { Public } from 'src/common/decorators/isPublic.decorator';

@Controller()
export class ImageController {
  @Public()
  @Get(':imageName')
  getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = path.join(__dirname, '..', 'covers', imageName);
    console.log(imagePath);

    return res.sendFile(imagePath);
  }
}
