import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { join } from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  async ensureProduct(productId: number) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async addImagesToProduct(productId: number, filenames: string[]) {
    await this.ensureProduct(productId);
    const urls = filenames.map(f => `/uploads/products/${productId}/${f}`);
    const product = await this.prisma.product.update({
      where: { id: productId },
      data: { images: { push: urls } as any },
    });
    return product;
  }

  async setThumbnail(productId: number, filename: string) {
    const product = await this.ensureProduct(productId);
    const thumbUrl = `/uploads/products/${productId}/${filename}`;
    const images = product.images || [];
    const updatedImages = images.includes(thumbUrl) ? images : [thumbUrl, ...images];
    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: { images: updatedImages },
    });
    return updated;
  }

  async listFiles(productId: number) {
    const dir = join(process.cwd(), 'uploads', 'products', String(productId));
    try {
      const files = await fs.readdir(dir);
      return files.map(f => `/uploads/products/${productId}/${f}`);
    } catch (e) {
      return [];
    }
  }

  async deleteFile(productId: number, filename: string) {
    const filePath = join(process.cwd(), 'uploads', 'products', String(productId), filename);
    try {
      await fs.unlink(filePath);
    } catch (e) {
      // ignore missing
    }
    const product = await this.ensureProduct(productId);
    const images = (product.images || []).filter(i => !i.endsWith(`/${filename}`));
    await this.prisma.product.update({ where: { id: productId }, data: { images } });
    return { ok: true };
  }
}