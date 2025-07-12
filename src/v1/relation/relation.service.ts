import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Relation, RelationType, Prisma } from '@prisma/client';

@Injectable()
export class RelationService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createRelation(
    relationType: RelationType,
    tx?: Prisma.TransactionClient,
  ): Promise<Relation> {
    const db = tx ?? this.databaseService;

    const relation = await db.relation.create({
      data: {
        type: relationType,
      },
    });

    return relation;
  }
}
