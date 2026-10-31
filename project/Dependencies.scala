import sbt.*
import sbt.Keys.*

object V {
	val Scala = "3.3.6"
	val jakon = "0.8.0-SNAPSHOT"
}

object Dependencies {

	lazy val backend = Seq(
		libraryDependencies ++=
			Seq(
				("cz.kamenitxan" %% "jakon" % V.jakon).changing(),
				"org.scalatest" %% "scalatest" % "3.2.20" % "test",
				"org.seleniumhq.selenium" % "htmlunit3-driver" % "4.51.0" % "test"
			)
	)

	lazy val tests = Def.settings(
	)
}
