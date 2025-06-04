import { Module } from '@nestjs/common';
import { RelationService } from './relation.service';
import { DatabaseModule } from '../../database/database.module';

@Module({
  providers: [RelationService],
  imports: [DatabaseModule],
})
export class RelationModule {}
