import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MIP } from '../entities/mips.entity';
import { PullRequest } from '../entities/pull-request.entity';
import { MIPsController } from '../mips.controller';

import { GithubService } from './github.service';
import { MarkedService } from './marked.service';
import { MIPsService } from './mips.service';
import { ParseMIPsService } from './parse-mips.service';
import { PullRequestService } from './pull-requests.service';


describe('Parse MIPs service', () => {
  let service: ParseMIPsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MIPsController],
      providers: [
        ParseMIPsService,
        MIPsService,
        ConfigService,
        GithubService,
        MarkedService,
        PullRequestService,
        {
          provide: "SimpleGitService",
          useValue: {
            cloneRepository: jest.fn(),
            getFiles: jest.fn(),
            pull: jest.fn(),
          },
        },
        {
          provide: getModelToken(MIP.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            countDocuments: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken(PullRequest.name),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            countDocuments: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },       
      ],
    }).compile();

    service = module.get<ParseMIPsService>(ParseMIPsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  
  describe('Parse Preamble', () => {
    it('should return the empty preamble', async () => {
      const data = ``;

      const preamble = service.parsePreamble(data);
      expect(preamble).toMatchObject({});  
      
    });

  });
  
});
