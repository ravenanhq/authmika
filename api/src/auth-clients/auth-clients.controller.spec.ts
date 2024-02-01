import { Test, TestingModule } from '@nestjs/testing';
import { AuthClientsController } from './auth-clients.controller';

describe('AuthClientsController', () => {
  let controller: AuthClientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthClientsController],
    }).compile();

    controller = module.get<AuthClientsController>(AuthClientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
