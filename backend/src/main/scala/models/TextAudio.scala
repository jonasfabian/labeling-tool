package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class TextAudio(
                      id: BigInt,
                      audioStart: Float,
                      audioEnd: Float,
                      text: String,
                      fileId: BigInt,
                      speaker: String,
                      labeled: BigInt,
                      correct: BigInt,
                      wrong: BigInt
                    ) {
}

object TextAudio {
  implicit val encoder = deriveEncoder[TextAudio]
  implicit val decoder = deriveDecoder[TextAudio]
}
