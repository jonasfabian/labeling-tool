/*
 * This file is generated by jOOQ.
 */
package jooq.db.tables.daos


import java.lang.Integer
import java.lang.Long
import java.lang.String
import java.util.List

import jooq.db.tables.Recordings
import jooq.db.tables.records.RecordingsRecord

import org.jooq.Configuration
import org.jooq.impl.DAOImpl

import scala.Array
import scala.Byte


class RecordingsDao(configuration : Configuration) extends DAOImpl[RecordingsRecord, jooq.db.tables.pojos.Recordings, Long](Recordings.RECORDINGS, classOf[jooq.db.tables.pojos.Recordings], configuration) {

  def this() = {
    this(null)
  }

  override protected def getId(o : jooq.db.tables.pojos.Recordings) : Long = {
    o.getId
  }

  def fetchById(values : Long*) : List[jooq.db.tables.pojos.Recordings] = {
    fetch(Recordings.RECORDINGS.ID, values:_*)
  }

  def fetchOneById(value : Long) : jooq.db.tables.pojos.Recordings = {
    fetchOne(Recordings.RECORDINGS.ID, value)
  }

  def fetchByText(values : String*) : List[jooq.db.tables.pojos.Recordings] = {
    fetch(Recordings.RECORDINGS.TEXT, values:_*)
  }

  def fetchByUserid(values : Integer*) : List[jooq.db.tables.pojos.Recordings] = {
    fetch(Recordings.RECORDINGS.USERID, values:_*)
  }

  def fetchByAudio(values : Array[Byte]*) : List[jooq.db.tables.pojos.Recordings] = {
    fetch(Recordings.RECORDINGS.AUDIO, values:_*)
  }
}
