/*
 * This file is generated by jOOQ.
 */
package jooq.db.tables.daos


import java.lang.Long
import java.lang.String
import java.util.List

import jooq.db.tables.Userandtextaudio
import jooq.db.tables.records.UserandtextaudioRecord

import org.jooq.Configuration
import org.jooq.impl.DAOImpl


class UserandtextaudioDao(configuration : Configuration) extends DAOImpl[UserandtextaudioRecord, jooq.db.tables.pojos.Userandtextaudio, Long](Userandtextaudio.USERANDTEXTAUDIO, classOf[jooq.db.tables.pojos.Userandtextaudio], configuration) {

  def this() = {
    this(null)
  }

  override protected def getId(o : jooq.db.tables.pojos.Userandtextaudio) : Long = {
    o.getId
  }

  def fetchById(values : Long*) : List[jooq.db.tables.pojos.Userandtextaudio] = {
    fetch(Userandtextaudio.USERANDTEXTAUDIO.ID, values:_*)
  }

  def fetchOneById(value : Long) : jooq.db.tables.pojos.Userandtextaudio = {
    fetchOne(Userandtextaudio.USERANDTEXTAUDIO.ID, value)
  }

  def fetchByUserid(values : Long*) : List[jooq.db.tables.pojos.Userandtextaudio] = {
    fetch(Userandtextaudio.USERANDTEXTAUDIO.USERID, values:_*)
  }

  def fetchByTextaudioid(values : String*) : List[jooq.db.tables.pojos.Userandtextaudio] = {
    fetch(Userandtextaudio.USERANDTEXTAUDIO.TEXTAUDIOID, values:_*)
  }

  def fetchByTime(values : String*) : List[jooq.db.tables.pojos.Userandtextaudio] = {
    fetch(Userandtextaudio.USERANDTEXTAUDIO.TIME, values:_*)
  }
}
