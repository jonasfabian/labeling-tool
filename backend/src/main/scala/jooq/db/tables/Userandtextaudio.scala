/*
 * This file is generated by jOOQ.
 */
package jooq.db.tables


import java.lang.Class
import java.lang.Long
import java.lang.String
import java.util.Arrays
import java.util.List

import jooq.db.Indexes
import jooq.db.Keys
import jooq.db.LabelingTool
import jooq.db.tables.records.UserandtextaudioRecord

import org.jooq.Field
import org.jooq.ForeignKey
import org.jooq.Identity
import org.jooq.Index
import org.jooq.Name
import org.jooq.Record
import org.jooq.Schema
import org.jooq.Table
import org.jooq.TableField
import org.jooq.UniqueKey
import org.jooq.impl.DSL
import org.jooq.impl.Internal
import org.jooq.impl.TableImpl

import scala.Array


object Userandtextaudio {

  val USERANDTEXTAUDIO = new Userandtextaudio
}

class Userandtextaudio(
  alias : Name,
  child : Table[_ <: Record],
  path : ForeignKey[_ <: Record, UserandtextaudioRecord],
  aliased : Table[UserandtextaudioRecord],
  parameters : Array[ Field[_] ]
)
extends TableImpl[UserandtextaudioRecord](
  alias,
  LabelingTool.LABELING_TOOL,
  child,
  path,
  aliased,
  parameters,
  DSL.comment("")
)
{

  override def getRecordType : Class[UserandtextaudioRecord] = {
    classOf[UserandtextaudioRecord]
  }

  val ID : TableField[UserandtextaudioRecord, Long] = createField("id", org.jooq.impl.SQLDataType.BIGINT.nullable(false).identity(true), "")

  val USERID : TableField[UserandtextaudioRecord, Long] = createField("userId", org.jooq.impl.SQLDataType.BIGINT.defaultValue(org.jooq.impl.DSL.field("NULL", org.jooq.impl.SQLDataType.BIGINT)), "")

  val TEXTAUDIOID : TableField[UserandtextaudioRecord, String] = createField("textAudioId", org.jooq.impl.SQLDataType.VARCHAR(100).defaultValue(org.jooq.impl.DSL.field("NULL", org.jooq.impl.SQLDataType.VARCHAR)), "")

  val TIME : TableField[UserandtextaudioRecord, String] = createField("time", org.jooq.impl.SQLDataType.VARCHAR(100).defaultValue(org.jooq.impl.DSL.field("NULL", org.jooq.impl.SQLDataType.VARCHAR)), "")

  def this() = {
    this(DSL.name("userandtextaudio"), null, null, null, null)
  }

  def this(alias : String) = {
    this(DSL.name(alias), null, null, jooq.db.tables.Userandtextaudio.USERANDTEXTAUDIO, null)
  }

  def this(alias : Name) = {
    this(alias, null, null, jooq.db.tables.Userandtextaudio.USERANDTEXTAUDIO, null)
  }

  private def this(alias : Name, aliased : Table[UserandtextaudioRecord]) = {
    this(alias, null, null, aliased, null)
  }

  def this(child : Table[_ <: Record], key : ForeignKey[_ <: Record, UserandtextaudioRecord]) = {
    this(Internal.createPathAlias(child, key), child, key, jooq.db.tables.Userandtextaudio.USERANDTEXTAUDIO, null)
  }

  override def getSchema : Schema = LabelingTool.LABELING_TOOL

  override def getIndexes : List[ Index ] = {
    return Arrays.asList[ Index ](Indexes.USERANDTEXTAUDIO_PRIMARY, Indexes.USERANDTEXTAUDIO_UNI)
  }

  override def getIdentity : Identity[UserandtextaudioRecord, Long] = {
    Keys.IDENTITY_USERANDTEXTAUDIO
  }

  override def getPrimaryKey : UniqueKey[UserandtextaudioRecord] = {
    Keys.KEY_USERANDTEXTAUDIO_PRIMARY
  }

  override def getKeys : List[ UniqueKey[UserandtextaudioRecord] ] = {
    return Arrays.asList[ UniqueKey[UserandtextaudioRecord] ](Keys.KEY_USERANDTEXTAUDIO_PRIMARY, Keys.KEY_USERANDTEXTAUDIO_UNI)
  }

  override def as(alias : String) : Userandtextaudio = {
    new Userandtextaudio(DSL.name(alias), this)
  }

  override def as(alias : Name) : Userandtextaudio = {
    new Userandtextaudio(alias, this)
  }

  override def rename(name : String) : Userandtextaudio = {
    new Userandtextaudio(DSL.name(name), null)
  }

  override def rename(name : Name) : Userandtextaudio = {
    new Userandtextaudio(name, null)
  }
}
