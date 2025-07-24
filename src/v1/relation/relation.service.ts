import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { Relation, RelationType, Prisma } from '@prisma/client';
import { UpdateRelationRequest } from './dto/request/relation-http-request.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { createLoggerMeta } from '../utils/logger/logger.util';

@Injectable()
export class RelationService {
  constructor(
    private readonly databaseService: DatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async createRelation(
    relationType: RelationType,
    tx?: Prisma.TransactionClient,
  ): Promise<Relation> {
    this.logger.debug(
      'createRelation method called',
      createLoggerMeta('relation', RelationService.name),
    );
    const db = tx ?? this.databaseService;

    const relation = await db.relation.create({
      data: {
        type: relationType,
      },
    });

    return relation;
  }

  async updateLastMessageId(
    data: UpdateRelationRequest,
    tx?: Prisma.TransactionClient,
  ) {
    this.logger.debug(
      'updateLastMessageId method called',
      createLoggerMeta('relation', RelationService.name),
    );
    const db = tx ?? this.databaseService;

    return await db.relation.update({
      where: {
        id: data.id,
      },
      data: {
        lastMessageId: data.lastMessageId,
      },
    });
  }
}
