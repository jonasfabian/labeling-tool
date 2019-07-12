import io.circe.generic.semiauto.{deriveDecoder, deriveEncoder}

case class TextAudioIndexWithText(id: Int, samplingRate: Int, textStartPos: Int, textEndPos: Int, audioStartPos: Double, audioEndPos: Double, speakerKey: Int, labeled: Byte, transcriptFileId: Int, text: String) {
}
object TextAudioIndexWithText {
  implicit val encoder = deriveEncoder[TextAudioIndexWithText]
  implicit val decoder = deriveDecoder[TextAudioIndexWithText]
}
