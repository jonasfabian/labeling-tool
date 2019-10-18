package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Sums(
                 correct: Integer,
                 wrong: Integer,
                 totalTextAudios: Integer
               ) {
}

object Sums {
  implicit val encoder = deriveEncoder[Sums]
  implicit val decoder = deriveDecoder[Sums]
}
