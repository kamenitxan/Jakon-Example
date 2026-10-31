package example.pages

import cz.kamenitxan.jakon.core.custom_pages.{AbstractCustomPage, CustomPage}
import cz.kamenitxan.jakon.core.database.DBHelper
import example.entity.DocsPage
import example.pages.LlmsPage.*
import example.service.PageService

import scala.jdk.CollectionConverters.*

/**
 * Renders documentation for LLMs from the same pages as the HTML docs, see https://llmstxt.org
 *  - llms.txt (template llms): index with a short description of every page
 *  - page/{name}.txt (template llms_page): markdown of one page
 *  - llms-full.txt (template llms_full): all pages in one file
 */
@CustomPage
class LlmsPage extends AbstractCustomPage {

	override def generate(): Unit = {
		DBHelper.withDbConnection(implicit conn => {
			val mainPages = PageService.getMainPages().map(toEntry)
			val allPages = mainPages.flatMap(p => p +: p.children.asScala.toSeq)

			engine.render("llms", "llms.txt", Map[String, AnyRef](
				"title" -> Title,
				"summary" -> Summary,
				"mainPages" -> mainPages.asJava
			))
			allPages.foreach(p => {
				engine.render("llms_page", p.url.stripPrefix("/") + ".txt", Map[String, AnyRef]("page" -> p))
			})
			engine.render("llms_full", "llms-full.txt", Map[String, AnyRef]("allPages" -> allPages.asJava))
		})
	}
}

object LlmsPage {
	private val Title = "Jakon"
	private val Summary = "Jakon is a static web generator with web administration, written in Scala. " +
		"It renders pages from templates and database data and also serves dynamic pages (pagelets), JSON APIs and an administration."
	private val HtmlLink = "\\]\\((/page/[a-z_]+)\\.html".r

	/** Page prepared for the llms templates */
	case class LlmsEntry(title: String, url: String, description: String, text: String, children: java.util.List[LlmsEntry])

	private def toEntry(p: DocsPage): LlmsEntry = {
		LlmsEntry(p.title, p.url, description(p), text(p), p.children.asScala.map(toEntry).asJava)
	}

	/** markdown of the page, links to other pages point to the text versions */
	private def text(p: DocsPage): String = {
		HtmlLink.replaceAllIn(p.content, m => s"](${m.group(1)}.txt").replace("\r\n", "\n").trim
	}

	/** first sentence of the first paragraph without markdown, used as description in the index */
	private def description(p: DocsPage): String = {
		val paragraph = p.content.replace("\r\n", "\n").split("\n").map(_.trim)
			.find(l => l.nonEmpty && !l.startsWith("#") && !l.startsWith("`") && !l.startsWith("|") && !l.startsWith("-"))
			.getOrElse("")
			.replaceAll("\\[([^]]*)]\\([^)]*\\)", "$1")
			.replace("`", "").replace("*", "")
		val sentenceEnd = paragraph.indexOf(". ")
		val sentence = if (sentenceEnd > 0) paragraph.substring(0, sentenceEnd + 1) else paragraph
		if (sentence.length > 200) sentence.take(197) + "..." else sentence
	}
}
