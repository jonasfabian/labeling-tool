import com.typesafe.config.Config
import org.jooq.DSLContext
import org.jooq.impl.DSL
import jooq.db.Tables.MATCH
import jooq.db.tables.records.{MatchRecord, TextaudioindexRecord}

import scala.xml.XML

class LabelingToolService(config: Config) {

  private val url = config.getString("labeling-tool.db.url")
  private val user = config.getString("labeling-tool.db.user")
  private val password = config.getString("labeling-tool.db.password")

  def withDslContext[A](f: DSLContext => A): A = {
    val ctx = DSL.using(url, user, password)
    try {
      f(ctx)
    }
    catch {
      case e: Exception =>
        println(e)
        throw new RuntimeException(e)
    }
    finally ctx.close()
  }

  def extractFromXml(): Unit = {
    val file = XML.loadFile("/home/jonas/Documents/DeutschAndreaErzaehlt/36/transcript_indexes.xml")
    val samplingRate = (file \ "SamplingRate").text
    (file \ "TextAudioIndex").foreach(m => {
      val textAudioIndex = new TextAudioIndex(samplingRate.toInt, (m \ "TextStartPos").text.toInt, (m \ "TextEndPos").text.toInt, (m \ "AudioStartPos").text.toInt, (m \ "AudioEndPos").text.toInt, (m \ "SpeakerKey").text.toInt)
      newTextAudioIndex(textAudioIndex)
    })
  }

  def newTextAudioIndex(t: TextAudioIndex): Unit = withDslContext(dslContext => {
    val rec = textAudioIndexToRecord(t)
    dslContext.executeInsert(rec)
    ()
  })

  def matches: Array[Match] = withDslContext(dslContext => {
    dslContext.selectFrom(MATCH).fetchArray().map(m => Match(m.getMatchid, m.getAudiostart, m.getAudioend, m.getTextstart, m.getTextend))
  })

  def newMatch(m: Match): Unit = withDslContext(dslContext => {
    val rec = matchToRecord(m)
    dslContext.executeInsert(rec)
    ()
  })

  def matchToRecord(m: Match): MatchRecord = {
    val rec = new MatchRecord()
    rec.setAudiostart(m.audioStart)
    rec.setAudioend(m.audioEnd)
    rec.setTextstart(m.textStart)
    rec.setTextend(m.textEnd)
    rec
  }

  def textAudioIndexToRecord(m: TextAudioIndex): TextaudioindexRecord = {
    val rec = new TextaudioindexRecord()
    rec.setSamplingrate(m.samplingRate)
    rec.setTextstartpos(m.textStartPos)
    rec.setTextendpos(m.textEndPos)
    rec.setAudiostartpos(m.audioStartPos)
    rec.setAudioendpos(m.audioEndPos)
    rec.setSpeakerkey(m.speakerKey)
    rec
  }
}
