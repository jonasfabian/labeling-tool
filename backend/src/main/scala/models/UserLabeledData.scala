package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class UserLabeledData(
                            userId: Long,
                            username: String,
                            labelCount: Int
                          ) {
}

object UserLabeledData {
  implicit val encoder = deriveEncoder[UserLabeledData]
  implicit val decoder = deriveDecoder[UserLabeledData]
}
