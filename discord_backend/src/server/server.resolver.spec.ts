import { Test, TestingModule } from '@nestjs/testing';
import { ServerResolver } from './server.resolver';

describe('ServerResolver', () => {
  let resolver: ServerResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerResolver],
    }).compile();

    resolver = module.get<ServerResolver>(ServerResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
