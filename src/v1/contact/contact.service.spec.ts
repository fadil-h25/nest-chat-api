import { Test, TestingModule } from '@nestjs/testing';
import { ContactService } from './contact.service';
import { DatabaseService } from '../../database/database.service';
import { AddNewContactDto } from '../common/validation/schemas/contact.schema';

describe('ContactService', () => {
  let contactService: ContactService;
  let databaseService: DatabaseService;

  const mockDatabaseService = {
    contact: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    contactService = module.get<ContactService>(ContactService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call databaseService.contact.create', async () => {
    const dto: AddNewContactDto = {
      name: 'Budi',
      ownerId: 1,
      targetId: 2,
    };

    await contactService.addNewContact(dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(databaseService.contact.create).toHaveBeenCalled();
  });

  it('should call create with correct data', async () => {
    const dto: AddNewContactDto = {
      name: 'Budi',
      ownerId: 1,
      targetId: 2,
    };

    await contactService.addNewContact(dto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(databaseService.contact.create).toHaveBeenCalledWith({
      data: dto,
    });
  });
});
