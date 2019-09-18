/*
 * This file is generated by jOOQ.
 */
package jooq.db.tables.daos


import java.lang.Integer
import java.time.LocalDateTime
import java.util.List

import jooq.db.tables.Userandtextaudioindex
import jooq.db.tables.records.UserandtextaudioindexRecord

import org.jooq.Configuration
import org.jooq.impl.DAOImpl


class UserandtextaudioindexDao(configuration : Configuration) extends DAOImpl[UserandtextaudioindexRecord, jooq.db.tables.pojos.Userandtextaudioindex, Integer](Userandtextaudioindex.USERANDTEXTAUDIOINDEX, classOf[jooq.db.tables.pojos.Userandtextaudioindex], configuration) {

  def this() = {
    this(null)
  }

  override protected def getId(o : jooq.db.tables.pojos.Userandtextaudioindex) : Integer = {
    o.getId
  }

  def fetchById(values : Integer*) : List[jooq.db.tables.pojos.Userandtextaudioindex] = {
    fetch(Userandtextaudioindex.USERANDTEXTAUDIOINDEX.ID, values:_*)
  }

  def fetchOneById(value : Integer) : jooq.db.tables.pojos.Userandtextaudioindex = {
    fetchOne(Userandtextaudioindex.USERANDTEXTAUDIOINDEX.ID, value)
  }

  def fetchByUserid(values : Integer*) : List[jooq.db.tables.pojos.Userandtextaudioindex] = {
    fetch(Userandtextaudioindex.USERANDTEXTAUDIOINDEX.USERID, values:_*)
  }

  def fetchByTextaudioindexid(values : Integer*) : List[jooq.db.tables.pojos.Userandtextaudioindex] = {
    fetch(Userandtextaudioindex.USERANDTEXTAUDIOINDEX.TEXTAUDIOINDEXID, values:_*)
  }

  def fetchByTime(values : LocalDateTime*) : List[jooq.db.tables.pojos.Userandtextaudioindex] = {
    fetch(Userandtextaudioindex.USERANDTEXTAUDIOINDEX.TIME, values:_*)
  }
}
