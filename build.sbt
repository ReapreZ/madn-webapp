name := """MADN-WA"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.13.12"

libraryDependencies += guice
libraryDependencies += "com.google.inject" % "guice" % "5.1.0"
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "6.0.0-RC2" % Test
libraryDependencies += ("com.typesafe.slick" %% "slick" % "3.5.0-M3")
  .cross(CrossVersion.for3Use2_13)
libraryDependencies += "com.typesafe.akka" %% "akka-http" % "10.2.10"
libraryDependencies += "com.typesafe.akka" %% "akka-http-core" % "10.2.10"
libraryDependencies += "com.typesafe.akka" %% "akka-parsing" % "10.2.10"
libraryDependencies += ("com.typesafe.play" %% "play-json" % "2.10.0-RC5")

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "de.htwg.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "de.htwg.binders._"
