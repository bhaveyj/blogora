import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Hono } from 'hono'
import { verify } from 'hono/jwt';
import { postInput, postUpdate } from '@bhaveyj/blogora-common';

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_SECRET: string
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use("/*", async (c, next) => {
    const authHeader = c.req.header('Authorization') || '';
    const user = await verify(authHeader, c.env.JWT_SECRET);
    try {
        if (user) {
            c.set('userId', user.id as string);
            await next();
        } else {
            c.status(403);
                return c.json({
                    error: "Unauthorized"
                })
            }
        }
     catch (e) {
        c.status(403);
        return c.json({
            error: "Unauthorized"
        })
    }
})



blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = postInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({ error: "invalid input" });
    }
    const authorId = c.get('userId');
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const post = await prisma.post.create({
    data: {
        title: body.title,
        content: body.content,
        authorId: authorId
    }
})
    return c.json({
        id: post.id
    })
})

blogRouter.put('/', async (c) => {
	const body = await c.req.json();
    const { success } = postUpdate.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({ error: "invalid input" });
    }
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())

const post = await prisma.post.update({
    where: {
        id: body.id
    },
    data: {
        title: body.title,
        content: body.content,
    }
})
    return c.json({
        id: post.id
    })
})

blogRouter.get('/bulk', async (c) => {
	const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
    const posts = await prisma.post.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });
    return c.json({
        posts
    })
})

blogRouter.get('/:id', async (c) => {
	const id = c.req.param('id');
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
}).$extends(withAccelerate())
try {
    const post = await prisma.post.findFirst({
        where: {
            id: id
        }
    })
    return c.json({
        post
    })
} catch (e) {
    c.status(411);
    return c.json({
        error: "error while fetching post"
    })
}
})





