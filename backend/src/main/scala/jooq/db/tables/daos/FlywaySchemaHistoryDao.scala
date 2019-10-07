/*
 * This file is generated by jOOQ.
 */
package jooq.db.tables.daos


import java.lang.Byte
import java.lang.Integer
import java.lang.String
import java.time.LocalDateTime
import java.util.List

import jooq.db.tables.FlywaySchemaHistory
import jooq.db.tables.records.FlywaySchemaHistoryRecord

import org.jooq.Configuration
import org.jooq.impl.DAOImpl


class FlywaySchemaHistoryDao(configuration : Configuration) extends DAOImpl[FlywaySchemaHistoryRecord, jooq.db.tables.pojos.FlywaySchemaHistory, Integer](FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY, classOf[jooq.db.tables.pojos.FlywaySchemaHistory], configuration) {

  def this() = {
    this(null)
  }

  override protected def getId(o : jooq.db.tables.pojos.FlywaySchemaHistory) : Integer = {
    o.getInstalledRank
  }

  def fetchByInstalledRank(values : Integer*) : List[jooq.db.tables.pojos.FlywaySchemaHistory] = {
    fetch(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.INSTALLED_RANK, values:_*)
  }

  def fetchOneByInstalledRank(value : Integer) : jooq.db.tables.pojos.FlywaySchemaHistory = {
    fetchOne(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.INSTALLED_RANK, value)
  }

  def fetchByVersion(values : String*) : List[jooq.db.tables.pojos.FlywaySchemaHistory] = {
    fetch(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.VERSION, values:_*)
  }

  def fetchByDescription(values : String*) : List[jooq.db.tables.pojos.FlywaySchemaHistory] = {
    fetch(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.DESCRIPTION, values:_*)
  }

  def fetchByType(values : String*) : List[jooq.db.tables.pojos.FlywaySchemaHistory] = {
    fetch(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.TYPE, values:_*)
  }

  def fetchByScript(values : String*) : List[jooq.db.tables.pojos.FlywaySchemaHistory] = {
    fetch(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.SCRIPT, values:_*)
  }

  def fetchByChecksum(values : Integer*) : List[jooq.db.tables.pojos.FlywaySchemaHistory] = {
    fetch(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.CHECKSUM, values:_*)
  }

  def fetchByInstalledBy(values : String*) : List[jooq.db.tables.pojos.FlywaySchemaHistory] = {
    fetch(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.INSTALLED_BY, values:_*)
  }

  def fetchByInstalledOn(values : LocalDateTime*) : List[jooq.db.tables.pojos.FlywaySchemaHistory] = {
    fetch(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.INSTALLED_ON, values:_*)
  }

  def fetchByExecutionTime(values : Integer*) : List[jooq.db.tables.pojos.FlywaySchemaHistory] = {
    fetch(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.EXECUTION_TIME, values:_*)
  }

  def fetchBySuccess(values : Byte*) : List[jooq.db.tables.pojos.FlywaySchemaHistory] = {
    fetch(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.SUCCESS, values:_*)
  }
}
