import { Injectable } from '@nestjs/common';
import { CreateMomentDto } from './dto/create-moment.dto';
import { UpdateMomentDto } from './dto/update-moment.dto';
import { DatabaseService } from '../database/database.service';
import { MomentEntity, MomentLabelEntity } from '@app/deep-orm';

@Injectable()
export class MomentService {
  constructor(private readonly database: DatabaseService) {}
  async create(files: object[], createMomentDto: CreateMomentDto) {
    const user = await this.database.userRepo.findOne({
      where: {
        id: Number(createMomentDto.userId) || 0,
      },
    });
    const moment = new MomentEntity();

    if (files.length) {
      const filenames = new Set([
        ...files.map((item) => (item as { filename: string }).filename),
      ]);
      const filenamesStr = JSON.stringify(filenames);
      moment.images = filenamesStr;
    }
    moment.content = createMomentDto.content;
    moment.user = user;
    const momentLables = await Promise.all(
      createMomentDto.labels?.map(async (tag) => {
        const momentLabelExisting = await this.database.entityManager.findOne(
          MomentLabelEntity,
          {
            where: {
              name: tag,
            },
          },
        );
        if (momentLabelExisting) return momentLabelExisting;
        const momentLable = new MomentLabelEntity();
        momentLable.name = tag;
        return await this.database.entityManager.save(
          MomentLabelEntity,
          momentLable,
        );
      }),
    );
    moment.momentLabels = momentLables;
    return this.database.momentEntityRepo.insert(moment);
  }

  findAll() {
    return `This action returns all moment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} moment`;
  }

  update(id: number, _updateMomentDto: UpdateMomentDto) {
    return `This action updates a #${id} moment`;
  }

  remove(id: number) {
    return `This action removes a #${id} moment`;
  }
}
