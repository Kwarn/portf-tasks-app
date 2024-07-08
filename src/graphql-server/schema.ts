import {
  intArg,
  makeSchema,
  objectType,
  asNexusMethod,
  nonNull,
  stringArg,
} from "nexus";
import { DateTimeResolver } from "graphql-scalars";
import { Context } from "./context";
import path from "path";

export const DateTime = asNexusMethod(DateTimeResolver, "date");

export const schema = makeSchema({
  types: [
    DateTime,
    objectType({
      name: "Query",
      definition(t) {
        t.field("getTask", {
          type: "Task",
          args: {
            id: nonNull(intArg()),
          },
          resolve: (_parent, { id }, ctx) => {
            return ctx.prisma.task.findUnique({
              where: { id },
              include: { subTasks: true },
            });
          },
        });

        t.list.field("getTasks", {
          type: "Task",
          resolve: async (_parent, _args, ctx) => {
            const tasks = await ctx.prisma.task.findMany();

            const tasksWithSubTaskCount = await Promise.all(
              tasks.map(async (task) => {
                const subTaskCount = await ctx.prisma.subTask.count({
                  where: { taskId: task.id },
                });
                const subTasks = await ctx.prisma.subTask.findMany({
                  where: { taskId: task.id },
                });
                return { ...task, subTaskCount, subTasks };
              })
            );

            return tasksWithSubTaskCount;
          },
        });
      },
    }),
    objectType({
      name: "Mutation",
      definition(t) {
        t.nonNull.field("createTask", {
          type: "Task",
          args: {
            title: nonNull(stringArg()),
            description: stringArg(),
            status: nonNull(stringArg()),
          },
          resolve: async (_, args, ctx: Context) => {
            const newTask = await ctx.prisma.task.create({
              data: {
                title: args.title,
                description: args.description ?? "",
                status: args.status,
                createdAt: new Date(),
              },
              include: { subTasks: true },
            });
            return newTask;
          },
        });

        t.field("createSubTask", {
          type: "SubTask",
          args: {
            taskId: nonNull(intArg()),
            title: nonNull(stringArg()),
            description: stringArg(),
            status: nonNull(stringArg()),
          },
          resolve: async (_, { taskId, title, description, status }, ctx) => {
            const subTask = await ctx.prisma.subTask.create({
              data: {
                taskId,
                title,
                description,
                status,
              },
              include: {
                task: true,
              },
            });
            return subTask;
          },
        });
      },
    }),
    objectType({
      name: "Task",
      definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("title");
        t.string("description");
        t.nonNull.string("status");
        t.nonNull.field("createdAt", { type: "DateTime" });
        t.nonNull.list.field("subTasks", { type: "SubTask" });
        t.nonNull.int("subTaskCount", {
          resolve: (parent, _args, ctx: Context) => {
            return ctx.prisma.subTask.count({
              where: { taskId: parent.id },
            });
          },
        });
      },
    }),
    objectType({
      name: "SubTask",
      definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("title");
        t.string("description");
        t.nonNull.string("status");
        t.nonNull.field("createdAt", { type: "DateTime" });
        t.nonNull.int("taskId");
        t.field("task", {
          type: "Task",
          resolve: (parent, _args, ctx: Context) => {
            return ctx.prisma.task.findUnique({
              where: { id: parent.taskId },
              include: { subTasks: true },
            });
          },
        });
      },
    }),
  ],
  outputs: {
    schema: path.join(process.cwd(), "src", "graphql-server", "schema.graphql"),
    typegen: path.join(process.cwd(), "src", "graphql-server", "types.ts"),
  },
  contextType: {
    module: path.join(process.cwd(), "src", "graphql-server", "context.ts"),
    export: "Context",
  },
  sourceTypes: {
    modules: [
      {
        module: "@prisma/client",
        alias: "prisma",
      },
    ],
  },
});
