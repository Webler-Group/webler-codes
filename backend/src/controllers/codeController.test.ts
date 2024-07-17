import { CodeLanguage, Prisma, Tag } from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";
import { createCode } from "./codeController";
import { Response } from "express";
import { prisma } from "../services/database";
import * as bcrypt from 'bcryptjs';

beforeAll(async () => {
    await prisma.user.create({
        data: {
            id: BigInt(1),
            email: "tester@test.com",
            username: "tester",
            password: bcrypt.hashSync("a1b2c3", 10),
            isVerified: true
        }
    });

    await prisma.tag.createMany({
        data: [
            {name: "TagA", authorId: BigInt(1)},
            {name: "TagB", authorId: BigInt(1)}
        ]
    })
});

afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteTags = prisma.tag.deleteMany();

    await prisma.$transaction([
        deleteUsers,
        deleteTags
    ]);

    await prisma.$disconnect();
});

test("Should create new code", async () => {

    const request = {
        body: {
            title: "Title",
            tags: ["TagA", "TagB"],
            language: CodeLanguage.C,
            source: ""
        },
        user: {
            id: BigInt(1)
        }
    } as AuthRequest;

    const response = {
        json: jest.fn((data) => {
            result = { ...result, ...data };
        })
    } as  unknown as Response;

    let result = {};

    await createCode(request, response);

    expect(result).toMatchObject({
        success: true,
        data: {
            title: "Title",
            tags: [{ name: "TagA" }, { name: "TagB" }],
            codeLanguage: CodeLanguage.C
        }
    });
});