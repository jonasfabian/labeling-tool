package ch.labeling_tool.models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Sums(nonLabeled: Integer, correct: Integer, wrong: Integer, skipped: Integer) {
}

object Sums {
  implicit val encoder = deriveEncoder[Sums]
  implicit val decoder = deriveDecoder[Sums]
}
