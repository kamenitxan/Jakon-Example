import sbtassembly.AssemblyPlugin.autoImport.assembly

val V = new {
	val Scala = "3.9.0"
	val jakon = "0.8.0-SNAPSHOT"
}
val projectName = "jakonExample"
val projectVersion = "1.0.0"

scalaVersion := V.Scala
organization := "cz.kamenitxan"
name := projectName
version := projectVersion


ThisBuild / resolvers += Resolver.mavenLocal
ThisBuild / resolvers += "Artifactory" at "https://nexus.kamenitxan.eu/repository/jakon/"


val Dependencies = new {

	lazy val backend = Seq(
		libraryDependencies ++=
			Seq(
				"cz.kamenitxan" %% "jakon" % V.jakon changing(),
				"org.scalatest" %% "scalatest" % "3.2.20" % "test",
				"org.seleniumhq.selenium" % "htmlunit3-driver" % "4.51.0" % "test"
			)
	)

	lazy val tests = Def.settings(
	)
}

lazy val root = (project in file(".")).aggregate(backend)


lazy val backend = (project in file("modules/backend"))
	.settings(Dependencies.backend)
	.settings(Dependencies.tests)
	.settings(commonBuildSettings)
	.settings(
		name := projectName,
		Compile / mainClass := Some("example.Main"),
		Test / fork := true
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
