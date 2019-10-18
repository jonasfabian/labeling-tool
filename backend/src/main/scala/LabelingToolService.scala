import java.io.File
import java.time.LocalDateTime
import akka.http.scaladsl.marshalling.ToResponseMarshallable
import akka.http.scaladsl.model.{ContentTypes, HttpEntity}
import models.{Avatar, ChangePassword, EmailPassword, Recording, Sums, TextAudio, User, UserAndTextAudio, UserLabeledData, UserPublicInfo}
import com.typesafe.config.Config
import org.jooq.{DSLContext, Field}
import org.jooq.impl.DSL
import jooq.db.Tables._
import jooq.db.tables.pojos.Textaudio
import jooq.db.tables.records.{AvatarRecord, RecordingsRecord, TextaudioRecord, UserRecord, UserandtextaudioRecord}
import org.mindrot.jbcrypt.BCrypt

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

  def getTextAudios: Array[TextAudio] = withDslContext(dslContext => {
    dslContext.selectFrom(TEXTAUDIO).fetchArray().map(m => TextAudio(m.getId.toLong, m.getAudiostart, m.getAudioend, m.getText, m.getFileid, m.getSpeaker, m.getLabeled, m.getCorrect, m.getWrong))
  })

  def getTopFiveUsersLabeledCount: (Array[UserLabeledData]) = withDslContext(dslContext => {
    dslContext.select(USER.ID, USER.USERNAME, DSL.count()).from(USERANDTEXTAUDIO).join(USER).on(USER.ID.eq(USERANDTEXTAUDIO.USERID)).groupBy(USER.ID)
      .fetchArray().map(m => UserLabeledData(m.get(USER.ID).asInstanceOf[Int], m.get(USER.USERNAME), m.get(2).asInstanceOf[Int]))
  })

  def getTextAudioIndexById(id: Int): TextAudio = withDslContext(dslContext => {
    dslContext.select()
      .from(TEXTAUDIO)
      .where(TEXTAUDIO.ID.eq(id))
      .fetchOne().map(m => TextAudio(m.get(TEXTAUDIO.ID).toInt, m.get(TEXTAUDIO.AUDIOSTART).toInt, m.get(TEXTAUDIO.AUDIOSTART).toInt, m.get(TEXTAUDIO.TEXT).toInt, m.get(TEXTAUDIO.FILEID).toDouble, m.get(TEXTAUDIO.SPEAKER).toDouble, m.get(TEXTAUDIO.LABELED).toInt, m.get(TEXTAUDIO.CORRECT).toInt, m.get(TEXTAUDIO.WRONG).toInt))
  })

  def getUserById(id: Int): UserPublicInfo = withDslContext(dslContext => {
    dslContext.select()
      .from(USER)
      .where(USER.ID.eq(id))
      .fetchOne().map(m => UserPublicInfo(m.get(USER.ID).toInt, m.get(USER.FIRSTNAME), m.get(USER.LASTNAME), m.get(USER.EMAIL), m.get(USER.USERNAME), m.get(USER.AVATARVERSION).toInt, m.get(USER.CANTON)))
  })

  def getUserByUsername(username: String): UserPublicInfo = withDslContext(dslContext => {
    dslContext.select()
      .from(USER)
      .where(USER.USERNAME.eq(username))
      .fetchOne().map(m => UserPublicInfo(m.get(USER.ID).toInt, m.get(USER.FIRSTNAME), m.get(USER.LASTNAME), m.get(USER.EMAIL), m.get(USER.USERNAME), m.get(USER.AVATARVERSION).toInt, m.get(USER.CANTON)))
  })

  def getUserByEmail(email: String): UserPublicInfo = withDslContext(dslContext => {
    dslContext.select()
      .from(USER)
      .where(USER.EMAIL.eq(email))
      .fetchOne().map(m => UserPublicInfo(m.get(USER.ID).toInt, m.get(USER.FIRSTNAME), m.get(USER.LASTNAME), m.get(USER.EMAIL), m.get(USER.USERNAME), m.get(USER.AVATARVERSION).toInt, m.get(USER.CANTON)))
  })

  def getTextAudioIndexesByLabeledType(labeledType: Int): Array[TextAudio] = withDslContext(dslContext => {
    dslContext.select()
      .from(TEXTAUDIO)
      .where(TEXTAUDIO.LABELED.eq(labeledType))
      .fetchArray().map(m => TextAudio(m.get(TEXTAUDIO.ID).toInt, m.get(TEXTAUDIO.AUDIOSTART).toInt, m.get(TEXTAUDIO.AUDIOEND).toInt, m.get(TEXTAUDIO.TEXT).toDouble, m.get(TEXTAUDIO.FILEID).toDouble, m.get(TEXTAUDIO.SPEAKER).toInt, m.get(TEXTAUDIO.LABELED).toInt, m.get(TEXTAUDIO.CORRECT).toInt, m.get(TEXTAUDIO.WRONG).toInt))
  })

  def getLabeledSums: Array[Sums] = withDslContext(dslContext => {
    val correct: Field[Integer] = dslContext.selectCount().from(TEXTAUDIO).where(TEXTAUDIO.CORRECT.ne(0)).asField("correct")
    val wrong: Field[Integer] = dslContext.selectCount().from(TEXTAUDIO).where(TEXTAUDIO.WRONG.ne(0)).asField("wrong")
    val totalTextAudioIndexes: Field[Integer] = dslContext.selectCount().from(TEXTAUDIO).asField("totalTextAudioIndexes")
    dslContext.select(
      correct, wrong, totalTextAudioIndexes
    ).from(TEXTAUDIO).limit(1).fetchArray().map(m => Sums(m.get(correct).asInstanceOf[Int], m.get(wrong).asInstanceOf[Int], m.get(totalTextAudioIndexes).asInstanceOf[Int]))
  })

  def getAudioFile(fileId: Int): ToResponseMarshallable = {
    val path = "C:\\Users\\Jonas\\Documents\\Data\\"
    HttpEntity.fromFile(ContentTypes.`application/octet-stream`, new File(path + fileId + "/audio.wav"))
  }

  def getAvatar(userId: Integer): Avatar = withDslContext(dslContext => {
    dslContext.select()
      .from(AVATAR)
      .where(AVATAR.USERID.eq(userId))
      .fetchOne().map(m => Avatar(m.get(AVATAR.ID).toInt, m.get(AVATAR.USERID).toInt, m.get(AVATAR.AVATAR_)))
  })

  def getNonLabeledDataIndexes(labeledType: Integer): TextAudio = withDslContext(dslContext => {
    dslContext.select(
      TEXTAUDIO.ID, TEXTAUDIO.AUDIOSTART, TEXTAUDIO.AUDIOEND, TEXTAUDIO.TEXT, TEXTAUDIO.FILEID, TEXTAUDIO.SPEAKER,
      TEXTAUDIO.LABELED, TEXTAUDIO.CORRECT, TEXTAUDIO.WRONG
    ).from(TEXTAUDIO)
      .where(TEXTAUDIO.LABELED.eq(labeledType))
      .orderBy(TEXTAUDIO.ID.asc())
      .limit(1)
      .fetchOne().map(m => TextAudio(m.get(TEXTAUDIO.ID).toInt, m.get(TEXTAUDIO.AUDIOSTART).toInt, m.get(TEXTAUDIO.AUDIOEND).toInt, m.get(TEXTAUDIO.TEXT), m.get(TEXTAUDIO.FILEID).toInt, m.get(TEXTAUDIO.SPEAKER), m.get(TEXTAUDIO.LABELED).toInt, m.get(TEXTAUDIO.CORRECT).toInt, m.get(TEXTAUDIO.WRONG).toInt))
  })

  def getTenNonLabeledDataIndexes(): TextAudio = withDslContext(dslContext => {
    dslContext.select(
      TEXTAUDIO.ID, TEXTAUDIO.AUDIOSTART, TEXTAUDIO.AUDIOEND, TEXTAUDIO.TEXT, TEXTAUDIO.FILEID, TEXTAUDIO.SPEAKER,
      TEXTAUDIO.LABELED, TEXTAUDIO.CORRECT, TEXTAUDIO.WRONG
    ).from(TEXTAUDIO)
      .where(TEXTAUDIO.LABELED.eq(0))
      .orderBy(TEXTAUDIO.ID.asc())
      .limit(10)
      .fetchOne().map(m => TextAudio(m.get(TEXTAUDIO.ID).toInt, m.get(TEXTAUDIO.AUDIOSTART).toInt, m.get(TEXTAUDIO.AUDIOEND).toInt, m.get(TEXTAUDIO.TEXT), m.get(TEXTAUDIO.FILEID).toInt, m.get(TEXTAUDIO.SPEAKER), m.get(TEXTAUDIO.LABELED).toInt, m.get(TEXTAUDIO.CORRECT).toInt, m.get(TEXTAUDIO.WRONG).toInt))
  })

  def getTenNonLabeledTextAudiosByUser(userId: Integer): Array[TextAudio] = withDslContext(dslContext => {
    val selectAllByUser = dslContext.select(
      TEXTAUDIO.ID
    ).from(TEXTAUDIO)
      .join(USERANDTEXTAUDIO)
      .on(USERANDTEXTAUDIO.TEXTAUDIOID.eq(TEXTAUDIO.ID))
      .and(USERANDTEXTAUDIO.USERID.eq(userId))

    dslContext.select(
      TEXTAUDIO.ID, TEXTAUDIO.AUDIOSTART, TEXTAUDIO.AUDIOEND, TEXTAUDIO.TEXT, TEXTAUDIO.FILEID, TEXTAUDIO.SPEAKER,
      TEXTAUDIO.LABELED, TEXTAUDIO.CORRECT, TEXTAUDIO.WRONG
    ).from(TEXTAUDIO)
      .where(TEXTAUDIO.ID.notIn(selectAllByUser))
      .limit(10)
      .fetchArray().map(m => TextAudio(m.get(TEXTAUDIO.ID).toInt, m.get(TEXTAUDIO.AUDIOSTART).toInt, m.get(TEXTAUDIO.AUDIOEND).toInt, m.get(TEXTAUDIO.TEXT), m.get(TEXTAUDIO.FILEID).toInt, m.get(TEXTAUDIO.SPEAKER), m.get(TEXTAUDIO.LABELED).toInt, m.get(TEXTAUDIO.CORRECT).toInt, m.get(TEXTAUDIO.WRONG).toInt))
  })

  def updateTextAudioIndex(textAudio: TextAudio): Unit = withDslContext(dslContext => {
    dslContext.update(TEXTAUDIO)
      .set(TEXTAUDIO.AUDIOSTART, textAudio.audioStart)
      .set(TEXTAUDIO.AUDIOEND, textAudio.audioEnd)
      .set(TEXTAUDIO.TEXT, textAudio.text)
      .set(TEXTAUDIO.FILEID, textAudio.fileId)
      .set(TEXTAUDIO.SPEAKER, textAudio.speaker)
      .set(TEXTAUDIO.LABELED, textAudio.labeled)
      .set(TEXTAUDIO.CORRECT, textAudio.correct)
      .set(TEXTAUDIO.WRONG, textAudio.wrong)
      .where(TEXTAUDIO.ID.eq(textAudio.id))
      .execute()
    ()
  })

  def createUser(user: User): Unit = withDslContext(dslContext => {
    val hashedPw = BCrypt.hashpw(user.password, BCrypt.gensalt())
    val rec = userToRecord(new User(user.id, user.firstName, user.lastName, user.email, user.username, user.avatarVersion, hashedPw, user.canton))
    dslContext.executeInsert(rec)
    ()
  })

  def createRecording(recording: Recording): Unit = withDslContext(dslContext => {
    val rec = recordingToRecord(new Recording(recording.id, recording.text, recording.userId, recording.audio))
    dslContext.executeInsert(rec)
    ()
  })

  def updateUser(user: UserPublicInfo): Unit = withDslContext(dslContext => {
    dslContext.update(USER)
      .set(USER.FIRSTNAME, user.firstName)
      .set(USER.LASTNAME, user.lastName)
      .set(USER.EMAIL, user.email)
      .set(USER.USERNAME, user.username)
      .set(USER.AVATARVERSION, long2Long(user.avatarVersion.toLong))
      .set(USER.CANTON, user.canton)
      .where(USER.ID.eq(user.id))
      .execute()
    ()
  })

  def createAvatar(avatar: Avatar): Unit = withDslContext(dslContext => {
    dslContext.delete(AVATAR)
      .where(AVATAR.USERID.eq(avatar.userId))
      .execute()
    val rec = avatarToRecord(new Avatar(avatar.id, avatar.userId, avatar.avatar))
    dslContext.executeInsert(rec)
    ()
  })

  def changePassword(changePwd: ChangePassword): Boolean = withDslContext(dslContext => {
    val passwordDB = dslContext.select()
      .from(USER)
      .where(USER.ID.eq(changePwd.userId))
      .fetchOptional(USER.PASSWORD)
    if (passwordDB.filter(p => BCrypt.checkpw(changePwd.password, p)).isPresent()) {
      dslContext.update(USER)
        .set(USER.PASSWORD, BCrypt.hashpw(changePwd.newPassword, BCrypt.gensalt()))
        .where(USER.ID.eq(changePwd.userId))
        .execute()
      return true
    } else {
      return false
    }
  })

  def createUserAndTextAudioIndex(userAndTextAudio: UserAndTextAudio): Unit = withDslContext(dslContext => {
    println(LocalDateTime.now())
    val rec = userAndTextAudioToRecord(new UserAndTextAudio(userAndTextAudio.id, userAndTextAudio.userId, userAndTextAudio.textAudioId, Some(LocalDateTime.now())))
    dslContext.executeInsert(rec)
    ()
  })

  def checkLogin(emailPassword: EmailPassword): Boolean = withDslContext(dslContext => {
    val test = dslContext.select()
      .from(USER)
      .where(USER.EMAIL.eq(emailPassword.email))
      .fetchOptional(USER.PASSWORD)
    test.filter(test => BCrypt.checkpw(emailPassword.password, test)).isPresent()
  })

  def getCheckedTextAudioIndexesByUser(userId: Int): Array[TextAudio] = withDslContext(dslContext => {
    dslContext.select(
      TEXTAUDIO.ID,
      TEXTAUDIO.AUDIOSTART,
      TEXTAUDIO.AUDIOEND,
      TEXTAUDIO.TEXT,
      TEXTAUDIO.FILEID,
      TEXTAUDIO.SPEAKER,
      TEXTAUDIO.LABELED,
      TEXTAUDIO.CORRECT,
      TEXTAUDIO.WRONG
    ).from(TEXTAUDIO)
      .join(USERANDTEXTAUDIO)
      .on(TEXTAUDIO.ID.eq(USERANDTEXTAUDIO.TEXTAUDIOID))
      .and(USERANDTEXTAUDIO.USERID.eq(userId))
      .fetchArray().map(m => TextAudio(m.get(TEXTAUDIO.ID).toInt, m.get(TEXTAUDIO.AUDIOSTART).toInt, m.get(TEXTAUDIO.AUDIOEND).toInt, m.get(TEXTAUDIO.TEXT), m.get(TEXTAUDIO.FILEID).toInt, m.get(TEXTAUDIO.SPEAKER), m.get(TEXTAUDIO.LABELED).toInt, m.get(TEXTAUDIO.CORRECT).toInt, m.get(TEXTAUDIO.WRONG).toInt))
  })


  def userAndTextAudioToRecord(t: UserAndTextAudio): UserandtextaudioRecord = {
    val rec = new UserandtextaudioRecord()
    rec.setUserid(int2Integer(t.userId).toString)
    rec.setTextaudioid(int2Integer(t.textAudioId).toString)
    rec.setTime(t.time.getOrElse(LocalDateTime.now()).toString)
    rec
  }

  def avatarToRecord(avatar: Avatar): AvatarRecord = {
    val rec = new AvatarRecord()
    rec.setUserid(avatar.userId)
    rec.setAvatar(avatar.avatar)
    rec
  }

  def recordingToRecord(recording: Recording): RecordingsRecord = {
    val rec = new RecordingsRecord()
    rec.setText(recording.text)
    rec.setUserid(recording.userId)
    rec.setAudio(recording.audio)
    rec
  }

  def userToRecord(u: User): UserRecord = {
    val rec = new UserRecord()
    rec.setFirstname(u.firstName)
    rec.setLastname(u.lastName)
    rec.setEmail(u.email)
    rec.setUsername(u.username)
    rec.setAvatarversion(u.avatarVersion.toLong)
    rec.setPassword(u.password)
    rec.setCanton(u.canton)
    rec
  }

  def textAudioToRecord(m: TextAudio): TextaudioRecord = {
    val rec = new TextaudioRecord()
    rec.setAudiostart(m.audioStart.toDouble)
    rec.setAudioend(m.audioEnd.toDouble)
    rec.setText(m.text)
    rec.setFileid(m.fileId.toLong)
    rec.setSpeaker(m.speaker)
    rec.setLabeled(m.labeled.toLong)
    rec.setCorrect(m.correct.toLong)
    rec.setWrong(m.wrong.toLong)
    rec
  }
}
