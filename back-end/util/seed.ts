// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

//Om de .env te laden voor dat main wordt opgeroepen.
dotenv.config();

const prisma = new PrismaClient();

const main = async () => {
    await prisma.item.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.shoppingList.deleteMany();
    await prisma.user.deleteMany();

    const user1 = await prisma.user.create({
        data: {
            username: 'admin',
            password: await bcrypt.hash('admin123', 12),
            role: 'admin',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'johndoe',
            password: await bcrypt.hash('password123', 12),
            role: 'adult',
        },
    });

    const profile1 = await prisma.profile.create({
        data: {
            email: 'john.doe@example.com',
            name: 'John',
            lastName: 'Doe',
            userId: user2.id,
        },
    });

    const profile2 = await prisma.profile.create({
        data: {
            email: 'jane.doe@example.com',
            name: 'Jane',
            lastName: 'Doe',
            userId: user2.id,
        },
    });

    const shoppingList1 = await prisma.shoppingList.create({
        data: {
            name: 'Weekly Groceries',
            items: {
                create: [
                    {
                        name: 'Apples',
                        description: 'Delicious red apples',
                        price: 3.99,
                        urgency: 'High Priority',
                    },
                    {
                        name: 'Bananas',
                        description: 'Fresh yellow bananas',
                        price: 1.99,
                        urgency: 'Low Priority',
                    },
                ],
            },
        },
    });

    const shoppingList2 = await prisma.shoppingList.create({
        data: {
            name: 'Party Supplies',
            items: {
                create: [
                    {
                        name: 'Chips',
                        description: 'Crunchy potato chips',
                        price: 2.99,
                        urgency: 'Not a Priority',
                    },
                    {
                        name: 'Soda',
                        description: 'Refreshing soda drinks',
                        price: 4.99,
                        urgency: 'High Priority',
                    },
                ],
            },
        },
    });

    console.log('Seeding completed successfully');
};

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
    