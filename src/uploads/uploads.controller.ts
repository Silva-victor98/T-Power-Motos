import {
  Controller,
  Post,
  Param,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  Req,
  Get,
  Delete,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';
import { UploadsService } from './uploads.service';
import { AuthGuard } from '@nestjs/passport';

const MAX_FILE_SIZE = parseInt(process.env.UPLOAD_MAX_FILE_SIZE || String(25 * 1024 * 1024), 10);

function imageFileFilter(req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new BadRequestException('Tipo de arquivo não permitido'), false);
}

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('products/:id')
  async list(@Param('id') id: string) {
    const productId = parseInt(id, 10);
    return this.uploadsService.listFiles(productId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('products/:id/photos')
  @UseInterceptors(
    FilesInterceptor('photos', 50, {
      storage: diskStorage({
        destination: (req: Request, file, cb) => {
          const productId = req.params.id;
          const uploadPath = join(process.cwd(), 'uploads', 'products', String(productId));
          if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname.replace(/\s+/g, '_')}`;
          cb(null, unique);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadPhotos(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
    if (!req.user || (req.user as any).role !== 'ADMIN') {
      throw new BadRequestException('Permissão negada');
    }
    const productId = parseInt(id, 10);
    if (!files || files.length === 0) throw new BadRequestException('Nenhum arquivo enviado');
    const filenames = files.map(f => f.filename);
    const updated = await this.uploadsService.addImagesToProduct(productId, filenames);
    return { ok: true, images: updated.images };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('products/:id/thumbnail')
  @UseInterceptors(
    FilesInterceptor('thumbnail', 1, {
      storage: diskStorage({
        destination: (req: Request, file, cb) => {
          const productId = req.params.id;
          const uploadPath = join(process.cwd(), 'uploads', 'products', String(productId));
          if (!existsSync(uploadPath)) mkdirSync(uploadPath, { recursive: true });
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname.replace(/\s+/g, '_')}`;
          cb(null, unique);
        },
      }),
      fileFilter: imageFileFilter,
      limits: { fileSize: MAX_FILE_SIZE },
    }),
  )
  async uploadThumbnail(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[], @Req() req: Request) {
    if (!req.user || (req.user as any).role !== 'ADMIN') {
      throw new BadRequestException('Permissão negada');
    }
    const productId = parseInt(id, 10);
    const file = (files && files[0]) || null;
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');
    const updated = await this.uploadsService.setThumbnail(productId, file.filename);
    return { ok: true, images: updated.images };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('products/:id/photos/:filename')
  async deleteFile(@Param('id') id: string, @Param('filename') filename: string, @Req() req: Request) {
    if (!req.user || (req.user as any).role !== 'ADMIN') {
      throw new BadRequestException('Permissão negada');
    }
    const productId = parseInt(id, 10);
    await this.uploadsService.deleteFile(productId, filename);
    return { ok: true };
  }
}