/*
 * This file is generated by jOOQ.
 */
package jooq.db.tables.daos


import java.lang.Integer
import java.util.List

import jooq.db.tables.Textaudioindex
import jooq.db.tables.records.TextaudioindexRecord

import org.jooq.Configuration
import org.jooq.impl.DAOImpl


class TextaudioindexDao(configuration : Configuration) extends DAOImpl[TextaudioindexRecord, jooq.db.tables.pojos.Textaudioindex, Integer](Textaudioindex.TEXTAUDIOINDEX, classOf[jooq.db.tables.pojos.Textaudioindex], configuration) {

  def this() = {
    this(null)
  }

  override protected def getId(o : jooq.db.tables.pojos.Textaudioindex) : Integer = {
    o.getId
  }

  def fetchById(values : Integer*) : List[jooq.db.tables.pojos.Textaudioindex] = {
    fetch(Textaudioindex.TEXTAUDIOINDEX.ID, values:_*)
  }

  def fetchOneById(value : Integer) : jooq.db.tables.pojos.Textaudioindex = {
    fetchOne(Textaudioindex.TEXTAUDIOINDEX.ID, value)
  }

  def fetchBySamplingrate(values : Integer*) : List[jooq.db.tables.pojos.Textaudioindex] = {
    fetch(Textaudioindex.TEXTAUDIOINDEX.SAMPLINGRATE, values:_*)
  }

  def fetchByTextstartpos(values : Integer*) : List[jooq.db.tables.pojos.Textaudioindex] = {
    fetch(Textaudioindex.TEXTAUDIOINDEX.TEXTSTARTPOS, values:_*)
  }

  def fetchByTextendpos(values : Integer*) : List[jooq.db.tables.pojos.Textaudioindex] = {
    fetch(Textaudioindex.TEXTAUDIOINDEX.TEXTENDPOS, values:_*)
  }

  def fetchByAudiostartpos(values : Integer*) : List[jooq.db.tables.pojos.Textaudioindex] = {
    fetch(Textaudioindex.TEXTAUDIOINDEX.AUDIOSTARTPOS, values:_*)
  }

  def fetchByAudioendpos(values : Integer*) : List[jooq.db.tables.pojos.Textaudioindex] = {
    fetch(Textaudioindex.TEXTAUDIOINDEX.AUDIOENDPOS, values:_*)
  }

  def fetchBySpeakerkey(values : Integer*) : List[jooq.db.tables.pojos.Textaudioindex] = {
    fetch(Textaudioindex.TEXTAUDIOINDEX.SPEAKERKEY, values:_*)
  }
}
