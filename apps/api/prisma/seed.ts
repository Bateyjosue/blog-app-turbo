import { faker } from '@faker-js/faker';
import { PrismaClient } from '../../../node_modules/@prisma/client';

const prisma = new PrismaClient();

type UserCreateInput = {
  name: string;
  email: string;
  bio: string;
  avatar: string;
};

type PostCreateInput = {
  title: string;
  slug: string;
  content: string;
  thumbnail: string;
  published: boolean;
  authorId: number;
};
async function main() {
  const users: UserCreateInput[] = Array.from({ length: 10 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    bio: faker.lorem.sentence(),
    avatar: faker.image.avatar(),
  }));

  await prisma.user.createMany({
    data: users,
  });

  // seed post too
  const posts: PostCreateInput[] = Array.from({ length: 10 }).map(() => ({
    title: faker.lorem.sentence(),
    slug: generateSlug(faker.lorem.sentence()),
    content: faker.lorem.paragraph(3),
    thumbnail: faker.image.urlLoremFlickr(),
    published: true,
    authorId: faker.number.int({ min: 1, max: 10 }),
  }));

  await Promise.all(
    posts.map(async (post: PostCreateInput) => {
      await prisma.post.create({
        data: {
          ...post,
          comments: {
            createMany: {
              data: Array.from({ length: 10 }).map(() => ({
                content: faker.lorem.sentence(),
                authorId: faker.number.int({ min: 1, max: 10 }),
              })),
            },
          },
        },
      });
    }),
  );

  // seed comment too
  const comments = Array.from({ length: 10 }).map(() => ({
    content: faker.lorem.sentence(),
    postId: faker.number.int({ min: 1, max: 10 }),
    authorId: faker.number.int({ min: 1, max: 10 }),
  }));

  await prisma.comment.createMany({
    data: comments,
  });
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
}

main()
  .then(() => {
    prisma.$disconnect();
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error seeding database:', error);
    prisma.$disconnect();
    process.exit(1);
  });
