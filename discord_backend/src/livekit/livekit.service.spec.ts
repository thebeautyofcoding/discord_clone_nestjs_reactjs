import { Test, TestingModule } from '@nestjs/testing';
import { LivekitService } from './livekit.service';

describe('LivekitService', () => {
  let service: LivekitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LivekitService],
    }).compile();

    service = module.get<LivekitService>(LivekitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
