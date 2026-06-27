import { clerkPlugin, getAuth } from "@clerk/fastify";
import type { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";

const authPlugin: FastifyPluginAsync = fp(async (fastify) => {
  // Register the Clerk Fastify plugin. It automatically parses tokens 
  // on every request and decorates the request object.
  await fastify.register(clerkPlugin);

  // You can optionally add a global hook here if you want ALL routes protected by default,
  // but it's usually better to apply protection on a per-route or per-plugin basis.
});

export default authPlugin;
