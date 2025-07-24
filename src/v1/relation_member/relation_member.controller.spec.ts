import { Test, TestingModule } from '@nestjs/testing';
import { RelationMemberController } from './relation_member.controller';

describe('RelationMemberController', () => {
  let controller: RelationMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelationMemberController],
    }).compile();

    controller = module.get<RelationMemberController>(RelationMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
