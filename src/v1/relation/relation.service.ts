import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Relation, RelationType } from '@prisma/client';
import { validationRelationType } from '../common/validation/schemas/relation.schema';

@Injectable()
export class RelationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addNewRelation(relationType: RelationType): Promise<Relation> {
    relationType = validationRelationType.parse(relationType);

    const relation = await this.databaseService.relation.create({
      data: {
        type: relationType,
      },
    });

    return relation;
  }
}
