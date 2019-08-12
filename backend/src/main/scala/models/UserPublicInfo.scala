package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class UserPublicInfo(id: Int, firstName: String, lastName: String, email: String) {
}

object UserPublicInfo {
  implicit val encoder = deriveEncoder[UserPublicInfo]
  implicit val decoder = deriveDecoder[UserPublicInfo]
}
