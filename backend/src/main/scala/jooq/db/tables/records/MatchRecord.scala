/*
 * This file is generated by jOOQ.
 */
package jooq.db.tables.records


import java.lang.Double
import java.lang.Integer

import jooq.db.tables.Match

import org.jooq.Field
import org.jooq.Record1
import org.jooq.Record5
import org.jooq.Row5
import org.jooq.impl.UpdatableRecordImpl


class MatchRecord extends UpdatableRecordImpl[MatchRecord](Match.MATCH) with Record5[Integer, Double, Double, Double, Double] {

  def setMatchid(value : Integer) : Unit = {
    set(0, value)
  }

  def getMatchid : Integer = {
    val r = get(0)
    if (r == null) null else r.asInstanceOf[Integer]
  }

  def setAudiostart(value : Double) : Unit = {
    set(1, value)
  }

  def getAudiostart : Double = {
    val r = get(1)
    if (r == null) null else r.asInstanceOf[Double]
  }

  def setAudioend(value : Double) : Unit = {
    set(2, value)
  }

  def getAudioend : Double = {
    val r = get(2)
    if (r == null) null else r.asInstanceOf[Double]
  }

  def setTextstart(value : Double) : Unit = {
    set(3, value)
  }

  def getTextstart : Double = {
    val r = get(3)
    if (r == null) null else r.asInstanceOf[Double]
  }

  def setTextend(value : Double) : Unit = {
    set(4, value)
  }

  def getTextend : Double = {
    val r = get(4)
    if (r == null) null else r.asInstanceOf[Double]
  }

  // -------------------------------------------------------------------------
  // Primary key information
  // -------------------------------------------------------------------------
  override def key : Record1[Integer] = {
    return super.key.asInstanceOf[ Record1[Integer] ]
  }

  // -------------------------------------------------------------------------
  // Record5 type implementation
  // -------------------------------------------------------------------------

  override def fieldsRow : Row5[Integer, Double, Double, Double, Double] = {
    super.fieldsRow.asInstanceOf[ Row5[Integer, Double, Double, Double, Double] ]
  }

  override def valuesRow : Row5[Integer, Double, Double, Double, Double] = {
    super.valuesRow.asInstanceOf[ Row5[Integer, Double, Double, Double, Double] ]
  }
  override def field1 : Field[Integer] = Match.MATCH.MATCHID
  override def field2 : Field[Double] = Match.MATCH.AUDIOSTART
  override def field3 : Field[Double] = Match.MATCH.AUDIOEND
  override def field4 : Field[Double] = Match.MATCH.TEXTSTART
  override def field5 : Field[Double] = Match.MATCH.TEXTEND
  override def component1 : Integer = getMatchid
  override def component2 : Double = getAudiostart
  override def component3 : Double = getAudioend
  override def component4 : Double = getTextstart
  override def component5 : Double = getTextend
  override def value1 : Integer = getMatchid
  override def value2 : Double = getAudiostart
  override def value3 : Double = getAudioend
  override def value4 : Double = getTextstart
  override def value5 : Double = getTextend

  override def value1(value : Integer) : MatchRecord = {
    setMatchid(value)
    this
  }

  override def value2(value : Double) : MatchRecord = {
    setAudiostart(value)
    this
  }

  override def value3(value : Double) : MatchRecord = {
    setAudioend(value)
    this
  }

  override def value4(value : Double) : MatchRecord = {
    setTextstart(value)
    this
  }

  override def value5(value : Double) : MatchRecord = {
    setTextend(value)
    this
  }

  override def values(value1 : Integer, value2 : Double, value3 : Double, value4 : Double, value5 : Double) : MatchRecord = {
    this.value1(value1)
    this.value2(value2)
    this.value3(value3)
    this.value4(value4)
    this.value5(value5)
    this
  }

  def this(matchid : Integer, audiostart : Double, audioend : Double, textstart : Double, textend : Double) = {
    this()

    set(0, matchid)
    set(1, audiostart)
    set(2, audioend)
    set(3, textstart)
    set(4, textend)
  }
}