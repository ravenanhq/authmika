import { Test, TestingModule } from '@nestjs/testing';
import { GroupUsersService } from './group-users.service';

describe('GroupUsersService', () => {
  let service: GroupUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupUsersService],
    }).compile();

    service = module.get<GroupUsersService>(GroupUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
