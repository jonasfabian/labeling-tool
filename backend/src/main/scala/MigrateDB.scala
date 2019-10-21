import java.io.File

import models.{Speaker, TextAudio}
import com.typesafe.config.{ConfigFactory, ConfigValueFactory}

import scala.xml.XML

object MigrateDB extends App with CorsSupport {

  private var labelingToolService = new LabelingToolService(null)

  override def main(args: Array[String]): Unit = {
    val config = ConfigFactory.load().withValue("akka.remote.netty.tcp.port", ConfigValueFactory.fromAnyRef(2556))
    labelingToolService = new LabelingToolService(config)
    extractFromXml()
  }

  def getFileTree(f: File): Stream[File] =
    f #:: (if (f.isDirectory) f.listFiles().toStream.flatMap(getFileTree)
    else Stream.empty)

  def extractFromXml(): Unit = {
    val path = "C:\\Users\\Jonas\\Documents\\Data\\"
    getFileTree(new File(path)).filter(_.getName.endsWith(".xml")).zipWithIndex.foreach {
      case (file, count) => {
        val f = XML.loadFile(file.getAbsolutePath)
        (f \\ "speaker").foreach(spk => {
          newSpeaker(new Speaker(
            (spk \\ "abbreviation").text,
            (spk \\ "sex").\@("value"),
            (spk \\ "languages-used" \ "language").\@("lang"),
            (spk \\ "ud-speaker-information" \ "ud-information").text
          ))
        })
      }
    }
    println("\nExtracted all xml-data from directory ...")
  }

  def newTextAudioIndex(t: TextAudio): Unit = labelingToolService.withDslContext(dslContext => {
    val rec = labelingToolService.textAudioToRecord(t)
    dslContext.executeInsert(rec)
    ()
  })

  def newSpeaker(speaker: Speaker): Unit = labelingToolService.withDslContext(dslContext => {
    val rec = labelingToolService.speakerToRecord(speaker)
    dslContext.executeInsert(rec)
    ()
  })
}
