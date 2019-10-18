package models

import java.time.LocalDateTime

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class UserAndTextAudio(
                             id: Integer,
                             userId: Integer,
                             textAudioId: Integer,
                             time: Option[LocalDateTime]
                           ) {
}

object UserAndTextAudio {
  implicit val encoder = deriveEncoder[UserAndTextAudio]
  implicit val decoder = deriveDecoder[UserAndTextAudio]
}
