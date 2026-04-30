import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService;

  beforeEach(async () => {
    mockUserService = {
      createUser: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('createUser', async () => {
    const dto = {
      name: 'Иван',
      email: 'test@mail.ru',
      password: '123',
    };

    const response = {
      data: 'Спасибо за регистрацию, пользователь успешно создан!',
    };

    mockUserService.createUser.mockResolvedValue(response);

    const result = await controller.createUser(dto);

    expect(mockUserService.createUser).toHaveBeenCalledWith(dto);
    expect(result).toEqual(response);
  });

  it('getUser', async () => {
    const request = {
      cookies: { session_flashcard: 'token' },
    } as any;

    const user = {
      name: 'Иван',
      email: 'test@mail.ru',
    };

    mockUserService.getUser.mockResolvedValue(user);

    const result = await controller.getUser(request);

    expect(mockUserService.getUser).toHaveBeenCalledWith(request);
    expect(result).toEqual(user);
  });

  it('updatehUser', async () => {
    const request = {
      cookies: { session_flashcard: 'token' },
    } as any;

    const dto = {
      name: 'Максим',
      email: 'new@mail.ru',
      currentPassword: '123',
    };

    const response = {
      name: 'Максим',
      email: 'new@mail.ru',
    };

    mockUserService.updateUser.mockResolvedValue(response);

    const result = await controller.updatehUser(dto as any, request);

    expect(mockUserService.updateUser).toHaveBeenCalledWith(dto, request);
    expect(result).toEqual(response);
  });

  it('deleteUser', async () => {
    const request = {
      cookies: { session_flashcard: 'token' },
    } as any;

    mockUserService.deleteUser.mockResolvedValue(undefined);

    const result = await controller.deleteUser(request);

    expect(mockUserService.deleteUser).toHaveBeenCalledWith(request);
    expect(result).toBeUndefined();
  });
});
