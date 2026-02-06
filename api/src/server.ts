import { fastify } from "fastify";
import cors from "@fastify/cors";
import {
  validatorCompiler,
  serializerCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import cookie from "@fastify/cookie";

import { userRoutes } from "./routes/user.routes";
import fastifyJwtPlugin from "./plugins/jwt";
import { authRoutes } from "./routes/auth.routes";
import { editionRoutes } from "./routes/edition.routes";
import { calendarRoutes } from "./routes/calendar.routes";
import { attendanceRoutes } from "./routes/attendance.routes";
import { classRoutes } from "./routes/class.routes";
import { studentRoutes } from "./routes/student.routes";
import { courseRoutes } from "./routes/course.routes";
import { moduleRoutes } from "./routes/module.routes";
import { chapterRoutes } from "./routes/chapter.routes";
import { candidateRoutes } from "./routes/candidate.routes";
import { interviewRoutes } from "./routes/interview.routes";
import { quizzRoutes } from "./routes/quizz.routes";
import { quizzItemsRoutes } from "./routes/quizz-item.routes";
import { exerciseRoutes } from "./routes/exercise.route";
import { countryRoutes } from "./routes/country.routes";
import { locationRoutes } from "./routes/location.routes";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler); // Diz ao fastify que será usado zod para fazer as validações de entrada
app.setSerializerCompiler(serializerCompiler); //Diz ao fastify que será usado o zod para fazer a serialização dos dados de saida

app.register(cors, {
  origin: true,
  methods: ["GET", "PUT", "POST", "DELETE"],
});

app.register(cookie, {
  secret: "my-s3cr3t-cookie", // opcional (para assinar cookies)
});
app.register(fastifyJwtPlugin);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "B4F Platform Documenting API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "none",
    deepLinking: false,
  },
});

app.register(userRoutes, { prefix: "/users" });
app.register(authRoutes, { prefix: "/auth" });
app.register(editionRoutes, { prefix: "/editions" });
app.register(calendarRoutes, { prefix: "/calendars" });
app.register(attendanceRoutes, { prefix: "/attendance" });
app.register(classRoutes, { prefix: "/classes" });
app.register(studentRoutes, { prefix: "/students" });
app.register(courseRoutes, { prefix: "/courses" });
app.register(moduleRoutes, { prefix: "/modules" });
app.register(chapterRoutes, { prefix: "/chapters" });
app.register(candidateRoutes, { prefix: "/candidates" });
app.register(interviewRoutes, { prefix: "/interviews" });
app.register(quizzRoutes, { prefix: "/quizzes" });
app.register(quizzItemsRoutes, { prefix: "/quizz-items" });
app.register(exerciseRoutes, { prefix: "/exercises" });
app.register(countryRoutes, { prefix: "/countries" });
app.register(locationRoutes, { prefix: "/locations" });

app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log(`Server running at port ${3333}`);
});
