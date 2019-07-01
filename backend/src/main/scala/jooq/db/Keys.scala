/*
 * This file is generated by jOOQ.
 */
package jooq.db


import java.lang.Integer

import jooq.db.tables.FlywaySchemaHistory
import jooq.db.tables.Match
import jooq.db.tables.records.FlywaySchemaHistoryRecord
import jooq.db.tables.records.MatchRecord

import org.jooq.Identity
import org.jooq.UniqueKey
import org.jooq.impl.Internal


object Keys {

  // -------------------------------------------------------------------------
  // IDENTITY definitions
  // -------------------------------------------------------------------------

  val IDENTITY_MATCH = Identities0.IDENTITY_MATCH

  // -------------------------------------------------------------------------
  // UNIQUE and PRIMARY KEY definitions
  // -------------------------------------------------------------------------

  val KEY_FLYWAY_SCHEMA_HISTORY_PRIMARY = UniqueKeys0.KEY_FLYWAY_SCHEMA_HISTORY_PRIMARY
  val KEY_MATCH_PRIMARY = UniqueKeys0.KEY_MATCH_PRIMARY

  // -------------------------------------------------------------------------
  // FOREIGN KEY definitions
  // -------------------------------------------------------------------------


  // -------------------------------------------------------------------------
  // [#1459] distribute members to avoid static initialisers > 64kb
  // -------------------------------------------------------------------------

  private object Identities0 {
    val IDENTITY_MATCH : Identity[MatchRecord, Integer] = Internal.createIdentity(Match.MATCH, Match.MATCH.MATCHID)
  }

  private object UniqueKeys0 {
    val KEY_FLYWAY_SCHEMA_HISTORY_PRIMARY : UniqueKey[FlywaySchemaHistoryRecord] = Internal.createUniqueKey(FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY, "KEY_flyway_schema_history_PRIMARY", FlywaySchemaHistory.FLYWAY_SCHEMA_HISTORY.INSTALLED_RANK)
    val KEY_MATCH_PRIMARY : UniqueKey[MatchRecord] = Internal.createUniqueKey(Match.MATCH, "KEY_match_PRIMARY", Match.MATCH.MATCHID)
  }
}
