CREATE TABLE "user" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "username" character varying  NOT NULL UNIQUE,
  "password" character varying NOT NULL,
  "email" character varying NOT NULL,
  "role" character varying DEFAULT "customer"
);
CREATE TABLE "product" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" character varying  NOT NULL UNIQUE,
  "price" integer NOT NULL,
  "description" character varying,
  "file" character varying
);
CREATE TABLE "history" (
  "id" SERIAL NOT NULL PRIMARY KEY,
  "amount" integer NOT NULL,
  "createdAt" character varying NOT NULL,
  "userId" integer NOT NULL REFERENCES public.user(id)
);
