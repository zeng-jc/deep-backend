import { Injectable } from '@nestjs/common';
import { CreateMomentDto } from './dto/create-moment.dto';
import { UpdateMomentDto } from './dto/update-moment.dto';
import { DatabaseService } from '../database/database.service';
import { MomentEntity, MomentLabelEntity } from '@app/deep-orm';
import { configLoader } from '@app/common';

@Injectable()
export class MomentService {
  constructor(private readonly database: DatabaseService) {}
  async create(files: Express.Multer.File[], createMomentDto: CreateMomentDto) {
    const user = await this.database.userRepo.findOne({
      where: {
        id: Number(createMomentDto.userId) || 0,
      },
    });
    const moment = new MomentEntity();

    if (files.length) {
      const filenames = [...files.map((item) => item.filename)];
      moment.images = filenames;
    }
    moment.content = createMomentDto.content;
    moment.user = user;
    const momentLableIds = await Promise.all(
      createMomentDto.labels?.map(async (tag) => {
        const momentLabelExisting = await this.database.entityManager.findOne(
          MomentLabelEntity,
          {
            where: {
              name: tag,
            },
          },
        );
        if (momentLabelExisting) return momentLabelExisting.id;
        const momentLable = new MomentLabelEntity();
        momentLable.name = tag;
        const momentLabel = await this.database.entityManager.save(
          MomentLabelEntity,
          momentLable,
        );
        return momentLabel.id;
      }),
    );
    const momentInfo = await this.database.momentEntityRepo.save(moment);
    const rels = [];
    for (const id of momentLableIds) {
      rels.push({
        labelId: id,
        momentId: momentInfo.id,
      });
    }
    return this.database.momentLabelRelsRepo.insert(rels);
  }

  findAll() {
    return `This action returns all moment`;
  }

  async findOne(id: number, protocol: string) {
    const momentEntity = await this.database.momentEntityRepo.findOne({
      where: {
        id,
      },
      relations: ['labels'],
    });

    const { host, port } = configLoader<{ host: string; port: number }>(
      'cmsService',
    );
    momentEntity.images = momentEntity?.images.map(
      (item) => `${protocol}://${host}:${port}/${item}`,
    );
    return momentEntity;
  }

  update(id: number, _updateMomentDto: UpdateMomentDto) {
    return `This action updates a #${id} moment`;
  }

  remove(id: number) {
    return `This action removes a #${id} moment`;
  }
}
