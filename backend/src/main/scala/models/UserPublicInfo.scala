package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class UserPublicInfo(id: Int, firstName: String, lastName: String, email: String, username: String, avatarVersion: Int, canton: String) {
}

object UserPublicInfo {
  implicit val encoder = deriveEncoder[UserPublicInfo]
  implicit val decoder = deriveDecoder[UserPublicInfo]
}
