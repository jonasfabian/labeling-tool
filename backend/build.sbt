name := "backend"

version := "0.1"

scalaVersion := "2.12.10"

libraryDependencies ++= Seq(
  "com.typesafe.akka" % "akka-actor_2.12" % "2.5.25",
  "com.typesafe.akka" % "akka-stream_2.12" % "2.5.25",
  "com.typesafe.akka" % "akka-slf4j_2.12" % "2.5.25",
  "de.heikoseeberger" % "akka-http-circe_2.12" % "1.27.0",
  "com.typesafe.akka" % "akka-http_2.12" % "10.1.9",
  "com.softwaremill.akka-http-session" % "core_2.12" % "0.5.10",

  "io.circe" % "circe-core_2.12" % "0.11.1",
  "io.circe" % "circe-generic_2.12" % "0.11.1",
  "io.circe" % "circe-parser_2.12" % "0.11.1",
  "io.circe" % "circe-java8_2.12" % "0.11.1",

  "org.flywaydb" % "flyway-core" % "5.1.4",

  "org.jooq" % "jooq" % "3.11.7",
  "org.jooq" % "jooq-codegen" % "3.11.7",
  "org.jooq" % "jooq-scala_2.12" % "3.11.7",

  "org.mariadb.jdbc" % "mariadb-java-client" % "2.3.0",
  "org.scala-lang.modules" %% "scala-xml" % "1.2.0",

  "org.mindrot" % "jbcrypt" % "0.3m"
)
