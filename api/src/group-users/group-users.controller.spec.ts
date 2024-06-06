import { Test, TestingModule } from '@nestjs/testing';
import { GroupUsersController } from './group-users.controller';

describe('GroupUsersController', () => {
  let controller: GroupUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupUsersController],
    }).compile();

    controller = module.get<GroupUsersController>(GroupUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
