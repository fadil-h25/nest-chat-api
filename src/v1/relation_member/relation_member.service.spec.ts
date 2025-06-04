import { Test, TestingModule } from '@nestjs/testing';
import { RelationMemberService } from './relation_member.service';

describe('RelationMemberService', () => {
  let service: RelationMemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelationMemberService],
    }).compile();

    service = module.get<RelationMemberService>(RelationMemberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
