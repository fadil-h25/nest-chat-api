import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Relation, RelationType } from '@prisma/client';
import { validationRelationType } from '../common/validation/schemas/relation.schema';

@Injectable()
export class RelationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addNewRelation(relationType: RelationType): Promise<Relation> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    relationType = validationRelationType.parse(relationType);
    // langsung pakai parameter relationType
    const relation = await this.databaseService.relation.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        type: relationType,
      },
    });

    return relation;
  }
}
