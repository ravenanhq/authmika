import { Test, TestingModule } from '@nestjs/testing';
import { AuthClientsService } from './auth-clients.service';

describe('AuthClientsService', () => {
  let service: AuthClientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthClientsService],
    }).compile();

    service = module.get<AuthClientsService>(AuthClientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
