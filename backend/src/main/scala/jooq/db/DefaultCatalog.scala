/*
 * This file is generated by jOOQ.
 */
package jooq.db


import java.util.ArrayList
import java.util.Arrays
import java.util.List

import org.jooq.Schema
import org.jooq.impl.CatalogImpl


object DefaultCatalog {

  val DEFAULT_CATALOG = new DefaultCatalog
}

class DefaultCatalog extends CatalogImpl("") {

  val LABELING_TOOL = jooq.db.LabelingTool.LABELING_TOOL

  override def getSchemas : List[Schema] = {
    val result = new ArrayList[Schema]
    result.addAll(getSchemas0)
    result
  }

  private def getSchemas0(): List[Schema] = {
    return Arrays.asList[Schema](
      LabelingTool.LABELING_TOOL)
  }
}