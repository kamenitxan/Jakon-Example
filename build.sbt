val projectName = "jakonExample"
val projectVersion = "1.0.0"

scalaVersion := V.Scala
organization := "cz.kamenitxan"
name := s"$projectName-root"
version := projectVersion


ThisBuild / resolvers += Resolver.mavenLocal
ThisBuild / resolvers += "Artifactory" at "https://nexus.kamenitxan.eu/repository/jakon/"


lazy val root = (project in file(".")).aggregate(backend)


lazy val backend = (project in file("modules/backend"))
	.settings(Dependencies.backend)
	.settings(Dependencies.tests)
	.settings(commonBuildSettings)
	.enablePlugins(JavaAppPackaging)
	.enablePlugins(DockerPlugin)
	.settings(
		name := projectName,
		Compile / mainClass := Some("example.Main"),
		Test / fork := true,
		Universal / javaOptions ++= Seq(
			"--port 8080",
			"--mode prod"
		),
		Docker / packageName := "tauroadmin-example"
	)

lazy val commonBuildSettings: Seq[Def.Setting[?]] = Seq(
	scalaVersion := V.Scala,
	organization := "cz.kamenitxan",
	name := projectName,
	version := V.jakon,
	startYear := Some(2015)
)

ThisBuild / scalafixDependencies += "com.github.liancheng" %% "organize-imports" % "0.6.0"
ThisBuild / semanticdbEnabled := false
ThisBuild / scalacOptions += "-deprecation"
ThisBuild / assembly / assemblyMergeStrategy := {
	case PathList("module-info.class") => MergeStrategy.discard
	case x if x.endsWith("module-info.class") => MergeStrategy.discard
	case x if x.endsWith("BuildInfo$.class") => MergeStrategy.discard
	case x if x.endsWith("log4j2.xml") => MergeStrategy.first
	case x =>
		val oldStrategy = (ThisBuild / assemblyMergeStrategy).value
		oldStrategy(x)
}

Test / fork := true
Test / testForkedParallel := false
Test / parallelExecution:= false
Test / logBuffered := false

val scalafixRules = Seq(
	"OrganizeImports",
	"DisableSyntax",
	"LeakingImplicitClassVal",
	"NoValInForComprehension"
).mkString(" ")

val CICommands = Seq(
	"clean",
	"backend/compile",
	"backend/test",
	s"scalafix --check $scalafixRules"
).mkString(";")

val PrepareCICommands = Seq(
	s"scalafix $scalafixRules"
).mkString(";")

addCommandAlias("ci", CICommands)
addCommandAlias("preCI", PrepareCICommands)
