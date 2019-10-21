import java.io.File
import com.typesafe.config.{ConfigFactory, ConfigValueFactory}
import models.Speaker
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
      case (file, _) =>
        val f = XML.loadFile(file.getAbsolutePath)
        (f \\ "speaker").foreach(spk => {
          newSpeaker(new Speaker(
            (spk \\ "abbreviation").text,
            (spk \\ "sex").\@("value"),
            (spk \\ "languages-used" \ "language").\@("lang"),
            (spk \\ "ud-speaker-information" \ "ud-information").text
          ))
        })
        val tliMap = (f \\ "common-timeline").headOption
          .map(tli => tli.\\("tli")
            .map(t => (t.\@("id"), t.\@("time")))
            .toMap
          ).get
        (f \\ "tier").foreach(tli => {
          val tas = tli.\\("event").map(event => {
            jooq.db.tables.pojos.Textaudio(null, tliMap(event.\@("start")).toDouble, tliMap(event.\@("end")).toDouble, event.text, 1, "", 0, 0, 0)
          })
          labelingToolService.insert(tas)
        })
    }
    println("\nExtracted all xml-data from directory ...")
  }

  def newSpeaker(speaker: Speaker): Unit = labelingToolService.withDslContext(dslContext => {
    val rec = labelingToolService.speakerToRecord(speaker)
    dslContext.executeInsert(rec)
    ()
  })
}
