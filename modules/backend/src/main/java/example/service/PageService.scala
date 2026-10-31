package example.service

import java.sql.Connection
import cz.kamenitxan.jakon.core.database.DBHelper
import example.entity.DocsPage

import scala.jdk.CollectionConverters.*

object PageService {
	// language=SQL
	private val MAIN_PAGES: String = "SELECT * FROM DocsPage WHERE parent_id IS NULL ORDER BY objectOrder"
	// language=SQL
	private val CHILD_PAGES: String = "SELECT * FROM DocsPage WHERE parent_id = ? ORDER BY objectOrder"

	def getMainPages()(implicit conn: Connection): Seq[DocsPage] = {
		val stmt = conn.createStatement()
		val mainPages = DBHelper.select(stmt, MAIN_PAGES, classOf[DocsPage])
		stmt.close()
		mainPages.map(qr => {
			qr.entity.url = qr.entity.createUrl
			qr.entity.children = getChildren(qr.entity.id).asJava
			qr.entity
		})
	}

	private def getChildren(parentId: Int)(implicit conn: Connection): Seq[DocsPage] = {
		val stmt = conn.prepareStatement(CHILD_PAGES)
		stmt.setInt(1, parentId)
		val children = DBHelper.select(stmt, classOf[DocsPage])
		stmt.close()
		children.map(qr => {
			qr.entity.url = qr.entity.createUrl
			qr.entity
		})
	}
}
