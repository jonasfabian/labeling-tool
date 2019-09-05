/*
 * This file is generated by jOOQ.
 */
package jooq.db


import java.util.ArrayList
import java.util.Arrays
import java.util.List

import jooq.db.tables.Audio
import jooq.db.tables.Avatar
import jooq.db.tables.Chat
import jooq.db.tables.Chatmember
import jooq.db.tables.Chatmessage
import jooq.db.tables.FlywaySchemaHistory
import jooq.db.tables.Textaudioindex
import jooq.db.tables.Transcript
import jooq.db.tables.User
import jooq.db.tables.Userandtextaudioindex

import org.jooq.Catalog
import org.jooq.Table
import org.jooq.impl.SchemaImpl


object LabelingTool {

  val LABELING_TOOL = new LabelingTool
}

class LabelingTool extends SchemaImpl("labeling-tool", DefaultCatalog.DEFAULT_CATALOG) {

  override def getCatalog : Catalog = DefaultCatalog.DEFAULT_CATALOG

  override def getTables : List[Table[_]] = {
    val result = new ArrayList[Table[_]]
    result.addAll(getTables0)
    result
  }

  private def getTables0(): List[Table[_]] = {
    return Arrays.asList[Table[_]](
      Audio.AUDIO,
      Avatar.AVATAR,
      Chat.CHAT,
      Chatmember.CHATMEMBER,
      Chatmessage.CHATMESSAGE,
      FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY,
      Textaudioindex.TEXTAUDIOINDEX,
      Transcript.TRANSCRIPT,
      User.USER,
      Userandtextaudioindex.USERANDTEXTAUDIOINDEX)
  }
}
