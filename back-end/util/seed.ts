// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { set } from 'date-fns';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.item.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.shoppingList.deleteMany({});
    await prisma.user.deleteMany();

    const item = await prisma.item.create({
        data: {
            name: 'Apples',
            description: 'delicious fruit',
            price: 10, // Add a price value
        },
    });

    const item2 = await prisma.item.create({
        data: {
            name: 'Bananas',
            description: 'delicious fruit',
            price: 20,
        },
    });

    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            password: await bcrypt.hash('admin123', 12),
            role: 'admin',
        },
    });

};