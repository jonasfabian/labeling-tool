/*
 * This file is generated by jOOQ.
 */
package jooq.db.tables.records


import java.lang.Integer
import java.lang.String

import jooq.db.tables.Chat

import org.jooq.Field
import org.jooq.Record1
import org.jooq.Record2
import org.jooq.Row2
import org.jooq.impl.UpdatableRecordImpl


class ChatRecord extends UpdatableRecordImpl[ChatRecord](Chat.CHAT) with Record2[Integer, String] {

  def setId(value : Integer) : Unit = {
    set(0, value)
  }

  def getId : Integer = {
    val r = get(0)
    if (r == null) null else r.asInstanceOf[Integer]
  }

  def setChatname(value : String) : Unit = {
    set(1, value)
  }

  def getChatname : String = {
    val r = get(1)
    if (r == null) null else r.asInstanceOf[String]
  }

  // -------------------------------------------------------------------------
  // Primary key information
  // -------------------------------------------------------------------------
  override def key : Record1[Integer] = {
    return super.key.asInstanceOf[ Record1[Integer] ]
  }

  // -------------------------------------------------------------------------
  // Record2 type implementation
  // -------------------------------------------------------------------------

  override def fieldsRow : Row2[Integer, String] = {
    super.fieldsRow.asInstanceOf[ Row2[Integer, String] ]
  }

  override def valuesRow : Row2[Integer, String] = {
    super.valuesRow.asInstanceOf[ Row2[Integer, String] ]
  }
  override def field1 : Field[Integer] = Chat.CHAT.ID
  override def field2 : Field[String] = Chat.CHAT.CHATNAME
  override def component1 : Integer = getId
  override def component2 : String = getChatname
  override def value1 : Integer = getId
  override def value2 : String = getChatname

  override def value1(value : Integer) : ChatRecord = {
    setId(value)
    this
  }

  override def value2(value : String) : ChatRecord = {
    setChatname(value)
    this
  }

  override def values(value1 : Integer, value2 : String) : ChatRecord = {
    this.value1(value1)
    this.value2(value2)
    this
  }

  def this(id : Integer, chatname : String) = {
    this()

    set(0, id)
    set(1, chatname)
  }
}