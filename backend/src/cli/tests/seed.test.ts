// tests/adminSetup.test.ts

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {main} from "../seed"
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../../utils/globals';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      upsert: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
    Role: {
      USER: 'USER',
      CREATOR: 'CREATOR',
      MODERATOR: 'MODERATOR',
      ADMIN: 'ADMIN',
    },
  };
});

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn().mockReturnValue('hashedPassword'),
}));

jest.mock('../../utils/globals', () => ({
  ADMIN_EMAIL: 'admin@example.com',
  ADMIN_PASSWORD: 'password123',
}));

describe('Admin Setup Script', () => {
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create or update the admin user', async () => {
    const adminData = {
      email: ADMIN_EMAIL,
      username: 'weblercodes',
      password: 'hashedPassword',
      isVerified: true,
      roles: [Role.USER, Role.CREATOR, Role.MODERATOR, Role.ADMIN],
      level: 25,
    };

    await main();

    expect(bcrypt.hashSync).toHaveBeenCalledWith(ADMIN_PASSWORD, 10);
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { email: ADMIN_EMAIL },
      create: adminData,
      update: adminData,
    });
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should handle errors', async () => {
    const error = new Error('Test Error');
    prisma.user.upsert.mockRejectedValueOnce(error);

    await expect(main()).rejects.toThrow('Test Error');
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should hash the admin password', async () => {
    await main();
    expect(bcrypt.hashSync).toHaveBeenCalledWith(ADMIN_PASSWORD, 10);
  });

  it('should create a new admin user if not existing', async () => {
    prisma.user.upsert.mockResolvedValueOnce({
      email: ADMIN_EMAIL,
      username: 'weblercodes',
      password: 'hashedPassword',
      isVerified: true,
      roles: [Role.USER, Role.CREATOR, Role.MODERATOR, Role.ADMIN],
      level: 25,
    });
  
    await main();
  
    expect(prisma.user.upsert).toHaveBeenCalledWith({
      where: { email: ADMIN_EMAIL },
      create: expect.objectContaining({ email: ADMIN_EMAIL }),
      update: expect.objectContaining({ email: ADMIN_EMAIL }),
    });
  });

  it('should throw an error if ADMIN_EMAIL is missing', async () => {
    delete process.env.ADMIN_EMAIL;
    await expect(main()).rejects.toThrow('Missing ADMIN_EMAIL');
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if ADMIN_PASSWORD is missing', async () => {
    delete process.env.ADMIN_PASSWORD;
    await expect(main()).rejects.toThrow('Missing ADMIN_PASSWORD');
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should disconnect from the database after operation', async () => {
    await main();
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should disconnect from the database even if there is an error', async () => {
    prisma.user.upsert.mockRejectedValueOnce(new Error('Test Error'));
    await expect(main()).rejects.toThrow('Test Error');
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should handle errors during the upsert operation', async () => {
    prisma.user.upsert.mockRejectedValueOnce(new Error('Database Error'));
    await expect(main()).rejects.toThrow('Database Error');
    expect(prisma.$disconnect).toHaveBeenCalledTimes(1);
  });
});
