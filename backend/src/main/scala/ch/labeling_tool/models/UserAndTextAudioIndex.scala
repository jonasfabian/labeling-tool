package ch.labeling_tool.models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class UserAndTextAudioIndex(id: Integer, userId: Integer, textAudioIndexId: Integer) {
}

object UserAndTextAudioIndex {
  implicit val encoder = deriveEncoder[UserAndTextAudioIndex]
  implicit val decoder = deriveDecoder[UserAndTextAudioIndex]
}
