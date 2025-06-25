import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Relation, RelationType, Prisma } from '@prisma/client';
import { validationRelationType } from '../common/validation/schemas/relation.schema';

@Injectable()
export class RelationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async addNewRelation(
    relationType: RelationType,
    tx?: Prisma.TransactionClient,
  ): Promise<Relation> {
    const db = tx ?? this.databaseService;

    relationType = validationRelationType.parse(relationType);

    const relation = await db.relation.create({
      data: {
        type: relationType,
      },
    });

    return relation;
  }
}
