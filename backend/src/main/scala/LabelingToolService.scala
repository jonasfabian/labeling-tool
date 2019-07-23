import java.io.File

import akka.http.scaladsl.marshalling.ToResponseMarshallable
import akka.http.scaladsl.model.{ContentTypes, HttpEntity}
import com.typesafe.config.Config
import org.jooq.{DSLContext, Field}
import org.jooq.impl.DSL
import jooq.db.Tables._
import jooq.db.tables.records.{AudioRecord, TextaudioindexRecord, TranscriptRecord}

class LabelingToolService(config: Config) {

  val url: String = config.getString("labeling-tool.db.url")
  val user: String = config.getString("labeling-tool.db.user")
  val password: String = config.getString("labeling-tool.db.password")

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

  // get all
  def getTextAudioIndexes: Array[TextAudioIndex] = withDslContext(dslContext => {
    dslContext.selectFrom(TEXTAUDIOINDEX).fetchArray().map(m => TextAudioIndex(m.getId, m.getSamplingrate, m.getTextstartpos, m.getTextendpos, m.getAudiostartpos, m.getAudioendpos, m.getSpeakerkey, m.getLabeled, m.getTranscriptFileId))
  })

  // get one by id
  def getTextAudioIndexById(id: Int): TextAudioIndex = withDslContext(dslContext => {
    dslContext.select()
      .from(TEXTAUDIOINDEX)
      .where(TEXTAUDIOINDEX.ID.eq(id))
      .fetchOne().map(m => TextAudioIndex(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toDouble, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toDouble, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toInt, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt))
  })

  // get all of labeled-type
  def getTextAudioIndexesByLabeledType(labeledType: Int): Array[TextAudioIndex] = withDslContext(dslContext => {
    dslContext.select()
      .from(TEXTAUDIOINDEX)
      .where(TEXTAUDIOINDEX.LABELED.eq(labeledType))
      .fetchArray().map(m => TextAudioIndex(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toDouble, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toDouble, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toInt, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt))
  })

  // get sums of labeled
  def getLabeledSums: Array[Sums] = withDslContext(dslContext => {
    val nonLabeled: Field[Integer] = dslContext.selectCount().from(TEXTAUDIOINDEX).where(TEXTAUDIOINDEX.LABELED.eq(0)).asField("books")
    val correct: Field[Integer] = dslContext.selectCount().from(TEXTAUDIOINDEX).where(TEXTAUDIOINDEX.LABELED.eq(1)).asField("correct")
    val wrong: Field[Integer] = dslContext.selectCount().from(TEXTAUDIOINDEX).where(TEXTAUDIOINDEX.LABELED.eq(2)).asField("wrong")
    val skipped: Field[Integer] = dslContext.selectCount().from(TEXTAUDIOINDEX).where(TEXTAUDIOINDEX.LABELED.eq(3)).asField("skipped")
    dslContext.select(
      nonLabeled, correct, wrong, skipped
    ).from(TEXTAUDIOINDEX).limit(1).fetchArray().map(m => Sums(m.get(nonLabeled).toString.toInt, m.get(correct).toString.toInt, m.get(wrong).toString.toInt, m.get(skipped).toString.toInt))
  })

  def getTranscript(id: Int): Transcript = withDslContext(dslContext => {
    dslContext.select()
      .from(TRANSCRIPT)
      .where(TRANSCRIPT.FILEID.eq(id))
      .fetchOne().map(m => Transcript(m.get(TRANSCRIPT.ID).toInt, m.get(TRANSCRIPT.TEXT).toString, m.get(TRANSCRIPT.FILEID).toInt))
  })

  def getAudio(id: Int): Audio = withDslContext(dslContext => {
    dslContext.select()
      .from(AUDIO)
      .where(AUDIO.FILEID.eq(id))
      .fetchOne().map(m => Audio(m.get(AUDIO.ID).toInt, m.get(AUDIO.PATH).toString, m.get(AUDIO.FILEID).toInt))
  })

  def getAudioFile(fileId: Int): ToResponseMarshallable = {
    val path = "/home/jonas/Documents/DeutschAndreaErzaehlt/"
    HttpEntity.fromFile(ContentTypes.`application/octet-stream`, new File(path + fileId + "/audio.mp3"))
  }

  def getTranscripts: Array[Transcript] = withDslContext(dslContext => {
    dslContext.selectFrom(TRANSCRIPT).fetchArray().map(m => Transcript(m.getId, m.getText, m.getFileid))
  })

  def getNonLabeledDataIndexes(): TextAudioIndexWithText = withDslContext(dslContext => {
    dslContext.select(
      TEXTAUDIOINDEX.ID, TEXTAUDIOINDEX.SAMPLINGRATE, TEXTAUDIOINDEX.TEXTSTARTPOS, TEXTAUDIOINDEX.TEXTENDPOS, TEXTAUDIOINDEX.AUDIOSTARTPOS, TEXTAUDIOINDEX.AUDIOENDPOS,
      TEXTAUDIOINDEX.SPEAKERKEY, TEXTAUDIOINDEX.LABELED, TRANSCRIPT.FILEID.as("transcript_file_id"), TRANSCRIPT.TEXT
    ).from(TEXTAUDIOINDEX)
      .join(TRANSCRIPT)
      .on(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID.eq(TRANSCRIPT.FILEID))
      .where(TEXTAUDIOINDEX.LABELED.eq(0))
      .orderBy(TEXTAUDIOINDEX.ID.asc())
      .limit(1)
      .fetchOne().map(m => TextAudioIndexWithText(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toDouble, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toDouble, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toInt, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt, m.get(TRANSCRIPT.TEXT).toString))
  })

  def getTenNonLabeledDataIndexes(): Array[TextAudioIndexWithText] = withDslContext(dslContext => {
    dslContext.select(
      TEXTAUDIOINDEX.ID, TEXTAUDIOINDEX.SAMPLINGRATE, TEXTAUDIOINDEX.TEXTSTARTPOS, TEXTAUDIOINDEX.TEXTENDPOS, TEXTAUDIOINDEX.AUDIOSTARTPOS, TEXTAUDIOINDEX.AUDIOENDPOS,
      TEXTAUDIOINDEX.SPEAKERKEY, TEXTAUDIOINDEX.LABELED, TRANSCRIPT.FILEID.as("transcript_file_id"), TRANSCRIPT.TEXT
    ).from(TEXTAUDIOINDEX)
      .join(TRANSCRIPT)
      .on(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID.eq(TRANSCRIPT.FILEID))
      .where(TEXTAUDIOINDEX.LABELED.eq(0))
      .orderBy(TEXTAUDIOINDEX.ID.asc())
      .limit(10)
      .fetchArray().map(m => TextAudioIndexWithText(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toDouble, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toDouble, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toInt, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt, m.get(TRANSCRIPT.TEXT).toString))
  })

  def updateTextAudioIndex(textAudioIndex: TextAudioIndex): Unit = withDslContext(dslContext => {
    dslContext.update(TEXTAUDIOINDEX)
      .set(TEXTAUDIOINDEX.SAMPLINGRATE, Integer.valueOf(textAudioIndex.samplingRate))
      .set(TEXTAUDIOINDEX.TEXTSTARTPOS, Integer.valueOf(textAudioIndex.textStartPos))
      .set(TEXTAUDIOINDEX.TEXTENDPOS, Integer.valueOf(textAudioIndex.textEndPos))
      .set(TEXTAUDIOINDEX.AUDIOSTARTPOS, java.lang.Double.valueOf(textAudioIndex.audioStartPos))
      .set(TEXTAUDIOINDEX.AUDIOENDPOS, java.lang.Double.valueOf(textAudioIndex.audioEndPos))
      .set(TEXTAUDIOINDEX.SPEAKERKEY, Integer.valueOf(textAudioIndex.speakerKey))
      .set(TEXTAUDIOINDEX.LABELED, Integer.valueOf(textAudioIndex.labeled))
      .set(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID, Integer.valueOf(textAudioIndex.transcriptFileId))
      .where(TEXTAUDIOINDEX.ID.eq(textAudioIndex.id))
      .execute()
    ()
  })

  def transcriptToRecord(t: Transcript): TranscriptRecord = {
    val rec = new TranscriptRecord()
    rec.setText(t.text)
    rec.setFileid(t.fileId)
    rec
  }

  def audioToRecord(t: Audio): AudioRecord = {
    val rec = new AudioRecord()
    rec.setPath(t.path)
    rec.setFileid(t.fileId)
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
    rec.setLabeled(m.labeled)
    rec.setTranscriptFileId(m.transcriptFileId)
    rec
  }
}
