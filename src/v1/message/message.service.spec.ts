import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { RelationType } from '@prisma/client';
import { CreateMessageRequestDto } from './dto/request/create-message-request.dto';

describe('MessageService', () => {
  let service: MessageService;

  // Mock dependencies
  const mockLogger = {
    info: jest.fn(),
    debug: jest.fn(),
  };

  const mockDatabaseService = {
    $transaction: jest.fn(),
    message: {
      create: jest.fn(),
    },
  };

  const mockRelationService = {
    createRelation: jest.fn(),
  };

  const mockRelationMemberService = {
    createRelationMembers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: 'WINSTON_MODULE_PROVIDER',
          useValue: mockLogger,
        },
        {
          provide: 'DatabaseService',
          useValue: mockDatabaseService,
        },
        {
          provide: 'RelationService',
          useValue: mockRelationService,
        },
        {
          provide: 'RelationMemberService',
          useValue: mockRelationMemberService,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe('createFirstMessage', () => {
    it('should create relation, members and message', async () => {
      const data = {
        content: 'hello',
        ownerId: 1,
        targetId: 2,
        relationType: RelationType.PRIVATE,
      };

      const fakeRelation = { id: 123 };
      const fakeMessage = {
        id: 456,
        content: 'hello',
        relationId: 123,
        ownerId: 1,
      };

      mockRelationService.createRelation.mockResolvedValue(fakeRelation);
      mockRelationMemberService.createRelationMembers.mockResolvedValue(
        undefined,
      );
      mockDatabaseService.message.create.mockResolvedValue(fakeMessage);

      const result = await service.createFirstMessage(
        data,
        mockDatabaseService,
      );

      expect(mockRelationService.createRelation).toHaveBeenCalledWith(
        data.relationType,
      );
      expect(
        mockRelationMemberService.createRelationMembers,
      ).toHaveBeenCalledWith([
        { relationId: fakeRelation.id, userId: data.ownerId },
        { relationId: fakeRelation.id, userId: data.targetId },
      ]);
      expect(mockDatabaseService.message.create).toHaveBeenCalledWith({
        data: {
          content: data.content,
          relationId: fakeRelation.id,
          ownerId: data.ownerId,
        },
        select: expect.any(Object),
      });
      expect(result).toEqual(fakeMessage);
    });
  });

  describe('createMessage', () => {
    it('should call createFirstMessage if relationId is null', async () => {
      const data = {
        content: 'hello',
        ownerId: 1,
        targetId: 2,
        relationType: 'friend',
        relationId: null,
      };

      const fakeMessage: CreateMessageRequestDto = {
        content: 'aaa',
        ownerId: 1,
        relationType: RelationType.PRIVATE,
        targetId: 2,
        isRead: false,
        relationId: 1,
      };

      // Mock $transaction to call createFirstMessage inside
      mockDatabaseService.$transaction.mockImplementation(async (callback) => {
        return callback(mockDatabaseService);
      });

      // Spy on createFirstMessage
      const spyCreateFirstMessage = jest
        .spyOn(service, 'createFirstMessage')
        .mockResolvedValue(fakeMessage);

      const result = await service.createMessage(data as any);

      expect(mockDatabaseService.$transaction).toHaveBeenCalled();
      expect(spyCreateFirstMessage).toHaveBeenCalledWith(
        data,
        mockDatabaseService,
      );
      expect(result).toEqual(fakeMessage);
    });

    it('should create message directly if relationId is not null', async () => {
      const data = {
        content: 'hello',
        ownerId: 1,
        relationId: 99,
      };

      const fakeMessage = {
        id: 101,
        content: 'hello',
        relationId: 99,
        ownerId: 1,
      };

      mockDatabaseService.message.create.mockResolvedValue(fakeMessage);

      const result = await service.createMessage(data as any);

      expect(mockDatabaseService.message.create).toHaveBeenCalledWith({
        data: {
          content: data.content,
          relationId: data.relationId,
          ownerId: data.ownerId,
        },
        select: expect.any(Object),
      });
      expect(result).toEqual(fakeMessage);
    });
  });
});
