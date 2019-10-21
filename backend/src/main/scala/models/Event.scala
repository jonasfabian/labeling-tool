package models

import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class Event(
                start: String,
                end: String,
                text: String
              ) {
}

object Event {
  implicit val encoder = deriveEncoder[Event]
  implicit val decoder = deriveDecoder[Event]
}
