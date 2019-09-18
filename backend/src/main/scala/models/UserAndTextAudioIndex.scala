package models

import java.time.LocalDateTime

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class UserAndTextAudioIndex(id: Integer, userId: Integer, textAudioIndexId: Integer, time: Option[LocalDateTime]) {
}

object UserAndTextAudioIndex {
  implicit val encoder = deriveEncoder[UserAndTextAudioIndex]
  implicit val decoder = deriveDecoder[UserAndTextAudioIndex]
}
