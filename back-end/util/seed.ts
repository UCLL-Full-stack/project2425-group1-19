// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

//Om de .env te laden voor dat main wordt opgeroepen.
dotenv.config();

const prisma = new PrismaClient();

const main = async () => {
    console.log("Resetting database")
    await prisma.item.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.shoppingList.deleteMany();
    await prisma.user.deleteMany();

    console.log("Creating data")

    const user1 = await prisma.user.create({
        data: {
            username: 'admin',
            password: await bcrypt.hash('Admin123!', 12),
            role: 'admin',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'johndoe',
            password: await bcrypt.hash('Password123!', 12),
            role: 'adult',
        },
    });

    const user3 = await prisma.user.create({
        data: {
            username: 'janedoe',
            password: await bcrypt.hash('Password123!', 12),
            role: 'child',
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
            privacy: 'public',
            items: {
                create: [
                    {
                        name: 'Apples',
                        description: 'Delicious red apples',
                        price: 3.99,
                        urgency: 'high',
                    },
                    {
                        name: 'Bananas',
                        description: 'Fresh yellow bananas',
                        price: 1.99,
                        urgency: 'low',
                    },
                ],
            },
        },
    });

    const shoppingList2 = await prisma.shoppingList.create({
        data: {
            name: 'Party Supplies',
            privacy: 'adultOnly',
            items: {
                create: [
                    {
                        name: 'Chips',
                        description: 'Crunchy potato chips',
                        price: 2.99,
                        urgency: 'mid',
                    },
                    {
                        name: 'Soda',
                        description: 'Refreshing soda drinks',
                        price: 4.99,
                        urgency: 'high',
                    },
                    {
                        name: 'Plastic Cups',
                        description: 'Pack of 50 plastic cups',
                        price: 3.99,
                        urgency: 'mid',
                    },
                    {
                        name: 'Napkins',
                        description: 'Pack of 100 napkins',
                        price: 1.99,
                        urgency: 'low',
                    },
                ],
            },
        },
    });

    const shoppingList3 = await prisma.shoppingList.create({
        data: {
            name: 'Office Supplies',
            privacy: 'private',
            owner: 'admin',
            items: {
                create: [
                    {
                        name: 'Printer Paper',
                        description: '500 sheets of printer paper',
                        price: 5.99,
                        urgency: 'high',
                    },
                    {
                        name: 'Pens',
                        description: 'Pack of 20 blue pens',
                        price: 4.99,
                        urgency: 'mid',
                    },
                    {
                        name: 'Stapler',
                        description: 'Heavy-duty stapler',
                        price: 9.99,
                        urgency: 'low',
                    },
                    {
                        name: 'Notebooks',
                        description: 'Pack of 5 notebooks',
                        price: 7.99,
                        urgency: 'mid',
                    },
                ],
            },
        },
    });

    const shoppingList4 = await prisma.shoppingList.create({
        data: {
            name: 'Children\'s Party',
            privacy: 'public',
            items: {
                create: [
                    {
                        name: 'Balloons',
                        description: 'Colorful balloons for decoration',
                        price: 2.99,
                        urgency: 'high',
                    },
                    {
                        name: 'Cake',
                        description: 'Chocolate birthday cake',
                        price: 15.99,
                        urgency: 'high',
                    },
                    {
                        name: 'Party Hats',
                        description: 'Pack of 10 party hats',
                        price: 3.99,
                        urgency: 'low',
                    },
                    {
                        name: 'Juice Boxes',
                        description: 'Pack of 20 juice boxes',
                        price: 6.99,
                        urgency: 'mid',
                    },
                ],
            },
        },
    });

    const shoppingList5 = await prisma.shoppingList.create({
        data: {
            name: 'Adult Only Gathering',
            privacy: 'adultOnly',
            items: {
                create: [
                    {
                        name: 'Wine',
                        description: 'Bottle of red wine',
                        price: 12.99,
                        urgency: 'high',
                    },
                    {
                        name: 'Cheese Platter',
                        description: 'Assorted cheese platter',
                        price: 19.99,
                        urgency: 'mid',
                    },
                    {
                        name: 'Crackers',
                        description: 'Box of gourmet crackers',
                        price: 4.99,
                        urgency: 'low',
                    },
                    {
                        name: 'Fruit Tray',
                        description: 'Assorted fresh fruit tray',
                        price: 14.99,
                        urgency: 'mid',
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
    