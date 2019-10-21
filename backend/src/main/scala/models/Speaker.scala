package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Speaker(
                    id: String,
                    sex: String,
                    languageUsed: String,
                    dialect: String
                  ) {
}

object Speaker {
  implicit val encoder = deriveEncoder[Speaker]
  implicit val decoder = deriveDecoder[Speaker]
}
