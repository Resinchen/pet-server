import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitDB1612087514453 implements MigrationInterface {
  name = 'InitDB1612087514453'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TABLE "games" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "version" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "count_players" integer NOT NULL DEFAULT '0', "authorId" uuid, CONSTRAINT "UQ_06734e8b047d4cd535598fcde0e" UNIQUE ("title"), CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE TYPE "files_type_enum" AS ENUM('image', 'script', 'sound', 'sprite')`
    )
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "url" character varying NOT NULL, "version" integer NOT NULL, "type" "files_type_enum" NOT NULL DEFAULT 'image', "gameId" uuid, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "games" ADD CONSTRAINT "FK_b20acae7b9db8ba0ea27faab6b9" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_f93ef8f36ea020d137a3bb5b6ca" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "files" DROP CONSTRAINT "FK_f93ef8f36ea020d137a3bb5b6ca"`
    )
    await queryRunner.query(
      `ALTER TABLE "games" DROP CONSTRAINT "FK_b20acae7b9db8ba0ea27faab6b9"`
    )
    await queryRunner.query(`DROP TABLE "files"`)
    await queryRunner.query(`DROP TYPE "files_type_enum"`)
    await queryRunner.query(`DROP TABLE "games"`)
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
