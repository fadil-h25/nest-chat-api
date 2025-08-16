import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { DatabaseModule } from '../../database/database.module';
import { RelationGateway } from './relation.gateway';

@Module({
  providers: [RelationService, RelationGateway],
  imports: [DatabaseModule],
  exports: [RelationService],
})
export class RelationModule {}
