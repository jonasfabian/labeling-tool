import java.io.File
import models.{Event, Speaker, TextAudio, Tli}
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
      case (file, count) =>
        val f = XML.loadFile(file.getAbsolutePath)
        (f \\ "speaker").foreach(spk => {
          newSpeaker(new Speaker(
            (spk \\ "abbreviation").text,
            (spk \\ "sex").\@("value"),
            (spk \\ "languages-used" \ "language").\@("lang"),
            (spk \\ "ud-speaker-information" \ "ud-information").text
          ))
        })
        // tli-attribute Array from xml
        val tliArray = Array.empty[Tli]
        (f \\ "common-timeline").foreach(tli => {
          tli.\\("tli").foreach(t => {
            tliArray :+ new Tli(t.\@("id"), t.\@("time"))
          })
        })
        // event-attribute Array from xml
        val eventArray = Array.empty[Event]
        val finalArray = Array.empty[Event]
        (f \\ "tier").foreach(tli => {
          tli.\\("event").foreach(event => {
            eventArray :+ new Event(event.\@("start"), event.\@("end"), event.text)
            eventArray.foreach(e => {
              println("yete")
              tliArray.foreach(t => {
                if (e.start == t.id) {
                  finalArray :+ new Event(t.time, e.end, e.text)
                }
              })
            })
            finalArray.foreach(e => {
              tliArray.foreach(t => {
                if (e.end == t.id) {
                  println("yeet")
                  newTextAudio(new TextAudio(-1, e.start.toFloat, t.time.toFloat, e.text, 1, "", 0, 0, 0))
                }
              })
            })
          })
        })
    }
    println("\nExtracted all xml-data from directory ...")
  }

  def newTextAudio(t: TextAudio): Unit = labelingToolService.withDslContext(dslContext => {
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
