import java.io.File

import akka.http.scaladsl.marshalling.ToResponseMarshallable
import akka.http.scaladsl.model.{ContentTypes, HttpEntity}
import models.{Audio, Avatar, Chat, ChatMember, ChatMessage, ChatMessageInfo, EmailPassword, Sums, TextAudioIndex, TextAudioIndexWithText, Transcript, User, UserAndTextAudioIndex, UserLabeledData, UserPublicInfo}
import com.typesafe.config.Config
import org.jooq.{DSLContext, Field}
import org.jooq.impl.DSL
import jooq.db.Tables._
import jooq.db.tables.records.{AudioRecord, AvatarRecord, ChatRecord, ChatmemberRecord, ChatmessageRecord, TextaudioindexRecord, TranscriptRecord, UserRecord, UserandtextaudioindexRecord}
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

  // get all
  def getTextAudioIndexes: Array[TextAudioIndex] = withDslContext(dslContext => {
    dslContext.selectFrom(TEXTAUDIOINDEX).fetchArray().map(m => TextAudioIndex(m.getId, m.getSamplingrate, m.getTextstartpos, m.getTextendpos, m.getAudiostartpos, m.getAudioendpos, m.getSpeakerkey, m.getLabeled, m.getCorrect, m.getWrong, m.getTranscriptFileId))
  })

  def getChats: Array[Chat] = withDslContext(dslContext => {
    dslContext.selectFrom(CHAT).fetchArray().map(m => Chat(m.getId, m.getChatname))
  })

  def getChatsPerUser(userId: Int): Array[Chat] = withDslContext(dslContext => {
    dslContext.select()
      .from(CHAT)
      .join(CHATMEMBER)
      .on(CHAT.ID.eq(CHATMEMBER.CHATID))
      .and(CHATMEMBER.USERID.eq(userId))
      .fetchArray().map(m => Chat(m.get(CHAT.ID).toInt, m.get(CHAT.CHATNAME)))
  })

  def getAllChatMemberFromChat(chatId: Int): Array[ChatMember] = withDslContext(dslContext => {
    dslContext.select(CHATMEMBER.ID, CHATMEMBER.CHATID, CHATMEMBER.USERID)
      .from(CHATMEMBER)
      .join(CHAT).on(CHAT.ID.eq(CHATMEMBER.CHATID))
      .and(CHAT.ID.eq(chatId))
      .fetchArray().map(m => ChatMember(m.get(CHATMEMBER.ID).toInt, m.get(CHATMEMBER.CHATID).toInt, m.get(CHATMEMBER.USERID).toInt))
  })

  def getTopFiveUsersLabeledCount: (Array[UserLabeledData]) = withDslContext(dslContext => {
    dslContext.select(USER.ID, USER.USERNAME, DSL.count()).from(USERANDTEXTAUDIOINDEX).join(USER).on(USER.ID.eq(USERANDTEXTAUDIOINDEX.USERID)).groupBy(USER.ID)
      .fetchArray().map(m => UserLabeledData(m.get(USER.ID).asInstanceOf[Int], m.get(USER.USERNAME), m.get(2).asInstanceOf[Int]))
  })

  def getAllMessagesFromChat(chatId: Int): Array[ChatMessageInfo] = withDslContext(dslContext => {
    dslContext.select(
      CHAT.ID, USER.USERNAME, CHATMESSAGE.MESSAGE
    ).from(CHATMESSAGE)
      .join(CHATMEMBER).on(CHATMEMBER.ID.eq(CHATMESSAGE.CHATMEMBERID))
      .join(CHAT).on(CHAT.ID.eq(CHATMEMBER.CHATID))
      .and(CHAT.ID.eq(chatId))
      .join(USER).on(CHATMEMBER.USERID.eq(USER.ID))
      .fetchArray().map(m => ChatMessageInfo(m.get(CHAT.ID).toInt, m.get(USER.USERNAME), m.get(CHATMESSAGE.MESSAGE)))
  })

  // get one by id
  def getTextAudioIndexById(id: Int): TextAudioIndex = withDslContext(dslContext => {
    dslContext.select()
      .from(TEXTAUDIOINDEX)
      .where(TEXTAUDIOINDEX.ID.eq(id))
      .fetchOne().map(m => TextAudioIndex(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toDouble, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toDouble, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toInt, m.get(TEXTAUDIOINDEX.CORRECT).toInt, m.get(TEXTAUDIOINDEX.WRONG).toInt, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt))
  })

  def getUserById(id: Int): UserPublicInfo = withDslContext(dslContext => {
    dslContext.select()
      .from(USER)
      .where(USER.ID.eq(id))
      .fetchOne().map(m => UserPublicInfo(m.get(USER.ID).toInt, m.get(USER.FIRSTNAME), m.get(USER.LASTNAME), m.get(USER.EMAIL), m.get(USER.USERNAME), m.get(USER.AVATARVERSION).toInt))
  })

  def getUserByUsername(username: String): UserPublicInfo = withDslContext(dslContext => {
    dslContext.select()
      .from(USER)
      .where(USER.USERNAME.eq(username))
      .fetchOne().map(m => UserPublicInfo(m.get(USER.ID).toInt, m.get(USER.FIRSTNAME), m.get(USER.LASTNAME), m.get(USER.EMAIL), m.get(USER.USERNAME), m.get(USER.AVATARVERSION).toInt))
  })

  def getUserByEmail(email: String): UserPublicInfo = withDslContext(dslContext => {
    dslContext.select()
      .from(USER)
      .where(USER.EMAIL.eq(email))
      .fetchOne().map(m => UserPublicInfo(m.get(USER.ID).toInt, m.get(USER.FIRSTNAME), m.get(USER.LASTNAME), m.get(USER.EMAIL), m.get(USER.USERNAME), m.get(USER.AVATARVERSION).toInt))
  })

  // get all of labeled-type
  def getTextAudioIndexesByLabeledType(labeledType: Int): Array[TextAudioIndex] = withDslContext(dslContext => {
    dslContext.select()
      .from(TEXTAUDIOINDEX)
      .where(TEXTAUDIOINDEX.LABELED.eq(labeledType))
      .fetchArray().map(m => TextAudioIndex(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toDouble, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toDouble, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toInt, m.get(TEXTAUDIOINDEX.CORRECT).toInt, m.get(TEXTAUDIOINDEX.WRONG).toInt, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt))
  })

  // get sums of labeled
  def getLabeledSums: Array[Sums] = withDslContext(dslContext => {
    val correct: Field[Integer] = dslContext.selectCount().from(TEXTAUDIOINDEX).where(TEXTAUDIOINDEX.CORRECT.ne(0)).asField("correct")
    val wrong: Field[Integer] = dslContext.selectCount().from(TEXTAUDIOINDEX).where(TEXTAUDIOINDEX.WRONG.ne(0)).asField("wrong")
    val totalTextAudioIndexes: Field[Integer] = dslContext.selectCount().from(TEXTAUDIOINDEX).asField("totalTextAudioIndexes")
    dslContext.select(
      correct, wrong, totalTextAudioIndexes
    ).from(TEXTAUDIOINDEX).limit(1).fetchArray().map(m => Sums(m.get(correct).asInstanceOf[Int], m.get(wrong).asInstanceOf[Int], m.get(totalTextAudioIndexes).asInstanceOf[Int]))
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

  def getAvatar(userId: Integer): Avatar = withDslContext(dslContext => {
    dslContext.select()
      .from(AVATAR)
      .where(AVATAR.USERID.eq(userId))
      .fetchOne().map(m => Avatar(m.get(AVATAR.ID).toInt, m.get(AVATAR.USERID).toInt, m.get(AVATAR.AVATAR_)))
  })

  def getNonLabeledDataIndexes(labeledType: Integer): TextAudioIndexWithText = withDslContext(dslContext => {
    dslContext.select(
      TEXTAUDIOINDEX.ID, TEXTAUDIOINDEX.SAMPLINGRATE, TEXTAUDIOINDEX.TEXTSTARTPOS, TEXTAUDIOINDEX.TEXTENDPOS, TEXTAUDIOINDEX.AUDIOSTARTPOS, TEXTAUDIOINDEX.AUDIOENDPOS,
      TEXTAUDIOINDEX.SPEAKERKEY, TEXTAUDIOINDEX.LABELED, TEXTAUDIOINDEX.CORRECT, TEXTAUDIOINDEX.WRONG, TRANSCRIPT.FILEID.as("transcript_file_id"), TRANSCRIPT.TEXT
    ).from(TEXTAUDIOINDEX)
      .join(TRANSCRIPT)
      .on(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID.eq(TRANSCRIPT.FILEID))
      .where(TEXTAUDIOINDEX.LABELED.eq(labeledType))
      .orderBy(TEXTAUDIOINDEX.ID.asc())
      .limit(1)
      .fetchOne().map(m => TextAudioIndexWithText(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toDouble, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toDouble, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toInt, m.get(TEXTAUDIOINDEX.CORRECT).toInt, m.get(TEXTAUDIOINDEX.WRONG).toInt, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt, m.get(TRANSCRIPT.TEXT).toString))
  })

  def getTenNonLabeledDataIndexes(): Array[TextAudioIndexWithText] = withDslContext(dslContext => {
    dslContext.select(
      TEXTAUDIOINDEX.ID, TEXTAUDIOINDEX.SAMPLINGRATE, TEXTAUDIOINDEX.TEXTSTARTPOS, TEXTAUDIOINDEX.TEXTENDPOS, TEXTAUDIOINDEX.AUDIOSTARTPOS, TEXTAUDIOINDEX.AUDIOENDPOS,
      TEXTAUDIOINDEX.SPEAKERKEY, TEXTAUDIOINDEX.LABELED, TEXTAUDIOINDEX.CORRECT, TEXTAUDIOINDEX.WRONG, TRANSCRIPT.FILEID.as("transcript_file_id"), TRANSCRIPT.TEXT
    ).from(TEXTAUDIOINDEX)
      .join(TRANSCRIPT)
      .on(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID.eq(TRANSCRIPT.FILEID))
      .orderBy(TEXTAUDIOINDEX.ID.asc())
      .limit(10)
      .fetchArray().map(m => TextAudioIndexWithText(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toDouble, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toDouble, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toInt, m.get(TEXTAUDIOINDEX.CORRECT).toInt, m.get(TEXTAUDIOINDEX.WRONG).toInt, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt, m.get(TRANSCRIPT.TEXT)))
  })

  def getTenNonLabeledDataIndexesByUser(userId: Integer): Array[TextAudioIndexWithText] = withDslContext(dslContext => {
    val selectAllByUser = dslContext.select(
      TEXTAUDIOINDEX.ID
    ).from(TEXTAUDIOINDEX)
      .join(USERANDTEXTAUDIOINDEX)
      .on(USERANDTEXTAUDIOINDEX.TEXTAUDIOINDEXID.eq(TEXTAUDIOINDEX.ID))
      .and(USERANDTEXTAUDIOINDEX.USERID.eq(userId))

    dslContext.select(
      TEXTAUDIOINDEX.ID, TEXTAUDIOINDEX.SAMPLINGRATE, TEXTAUDIOINDEX.TEXTSTARTPOS, TEXTAUDIOINDEX.TEXTENDPOS, TEXTAUDIOINDEX.AUDIOSTARTPOS, TEXTAUDIOINDEX.AUDIOENDPOS,
      TEXTAUDIOINDEX.SPEAKERKEY, TEXTAUDIOINDEX.LABELED, TEXTAUDIOINDEX.CORRECT, TEXTAUDIOINDEX.WRONG, TRANSCRIPT.FILEID.as("transcript_file_id"), TRANSCRIPT.TEXT
    ).from(TEXTAUDIOINDEX)
      .join(TRANSCRIPT)
      .on(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID.eq(TRANSCRIPT.FILEID))
      .where(TEXTAUDIOINDEX.ID.notIn(selectAllByUser))
      .limit(10)
      .fetchArray().map(m => TextAudioIndexWithText(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toDouble, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toDouble, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toInt, m.get(TEXTAUDIOINDEX.CORRECT).toInt, m.get(TEXTAUDIOINDEX.WRONG).toInt, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt, m.get(TRANSCRIPT.TEXT)))
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
      .set(TEXTAUDIOINDEX.CORRECT, Integer.valueOf(textAudioIndex.correct))
      .set(TEXTAUDIOINDEX.WRONG, Integer.valueOf(textAudioIndex.wrong))
      .set(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID, Integer.valueOf(textAudioIndex.transcriptFileId))
      .where(TEXTAUDIOINDEX.ID.eq(textAudioIndex.id))
      .execute()
    ()
  })

  def createChat(chat: Chat): Unit = withDslContext(dslContext => {
    val rec = chatToRecord(new Chat(chat.id, chat.chatName))
    dslContext.executeInsert(rec)
    ()
  })

  def createChatMember(chatMember: ChatMember): Unit = withDslContext(dslContext => {
    val rec = chatMemberToRecord(new ChatMember(chatMember.id, chatMember.chatId, chatMember.userId))
    dslContext.executeInsert(rec)
    ()
  })

  def removeChatMember(chatMember: ChatMember): Unit = withDslContext(dslContext => {
    dslContext.delete(CHATMEMBER)
      .where(CHATMEMBER.USERID.eq(chatMember.userId))
      .and(CHATMEMBER.CHATID.eq(chatMember.chatId))
      .execute()
  })

  def createChatMessage(chatMessage: ChatMessage): Unit = withDslContext(dslContext => {
    val rec = chatMessageToRecord(new ChatMessage(chatMessage.id, chatMessage.chatMemberId, chatMessage.message))
    dslContext.executeInsert(rec)
    ()
  })

  def createUser(user: User): Unit = withDslContext(dslContext => {
    val hashedPw = BCrypt.hashpw(user.password, BCrypt.gensalt())
    val rec = userToRecord(new User(user.id, user.firstName, user.lastName, user.email, user.username, user.avatarVersion, hashedPw))
    dslContext.executeInsert(rec)
    ()
  })

  def updateUser(user: UserPublicInfo): Unit = withDslContext(dslContext => {
    dslContext.update(USER)
      .set(USER.FIRSTNAME, user.firstName)
      .set(USER.LASTNAME, user.lastName)
      .set(USER.EMAIL, user.email)
      .set(USER.USERNAME, user.username)
      .set(USER.AVATARVERSION, Integer.valueOf(user.avatarVersion))
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

  def createUserAndTextAudioIndex(userAndTextAudioIndex: UserAndTextAudioIndex): Unit = withDslContext(dslContext => {
    val rec = userAndTextAudioIndexToRecord(new UserAndTextAudioIndex(userAndTextAudioIndex.id, userAndTextAudioIndex.userId, userAndTextAudioIndex.textAudioIndexId))
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

  def getCheckedTextAudioIndexesByUser(userId: Int): Array[TextAudioIndex] = withDslContext(dslContext => {
    dslContext.select(
      TEXTAUDIOINDEX.ID,
      TEXTAUDIOINDEX.SAMPLINGRATE,
      TEXTAUDIOINDEX.TEXTSTARTPOS,
      TEXTAUDIOINDEX.TEXTENDPOS,
      TEXTAUDIOINDEX.AUDIOSTARTPOS,
      TEXTAUDIOINDEX.AUDIOENDPOS,
      TEXTAUDIOINDEX.SPEAKERKEY,
      TEXTAUDIOINDEX.LABELED,
      TEXTAUDIOINDEX.CORRECT,
      TEXTAUDIOINDEX.WRONG,
      TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID
    ).from(TEXTAUDIOINDEX)
      .join(USERANDTEXTAUDIOINDEX)
      .on(TEXTAUDIOINDEX.ID.eq(USERANDTEXTAUDIOINDEX.TEXTAUDIOINDEXID))
      .and(USERANDTEXTAUDIOINDEX.USERID.eq(userId))
      .fetchArray().map(m => TextAudioIndex(m.get(TEXTAUDIOINDEX.ID).toInt, m.get(TEXTAUDIOINDEX.SAMPLINGRATE).toInt, m.get(TEXTAUDIOINDEX.TEXTSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.TEXTENDPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOSTARTPOS).toInt, m.get(TEXTAUDIOINDEX.AUDIOENDPOS).toInt, m.get(TEXTAUDIOINDEX.SPEAKERKEY).toInt, m.get(TEXTAUDIOINDEX.LABELED).toInt, m.get(TEXTAUDIOINDEX.CORRECT).toInt, m.get(TEXTAUDIOINDEX.WRONG).toInt, m.get(TEXTAUDIOINDEX.TRANSCRIPT_FILE_ID).toInt))
  })

  def transcriptToRecord(t: Transcript): TranscriptRecord = {
    val rec = new TranscriptRecord()
    rec.setText(t.text)
    rec.setFileid(t.fileId)
    rec
  }

  def chatToRecord(c: Chat): ChatRecord = {
    val rec = new ChatRecord()
    rec.setChatname(c.chatName)
    rec
  }

  def chatMemberToRecord(c: ChatMember): ChatmemberRecord = {
    val rec = new ChatmemberRecord()
    rec.setChatid(c.chatId)
    rec.setUserid(c.userId)
    rec
  }

  def chatMessageToRecord(c: ChatMessage): ChatmessageRecord = {
    val rec = new ChatmessageRecord()
    rec.setChatmemberid(c.chatMemberId)
    rec.setMessage(c.message)
    rec
  }

  def userAndTextAudioIndexToRecord(t: UserAndTextAudioIndex): UserandtextaudioindexRecord = {
    val rec = new UserandtextaudioindexRecord()
    rec.setUserid(t.userId)
    rec.setTextaudioindexid(t.textAudioIndexId)
    rec
  }

  def audioToRecord(t: Audio): AudioRecord = {
    val rec = new AudioRecord()
    rec.setPath(t.path)
    rec.setFileid(t.fileId)
    rec
  }

  def avatarToRecord(avatar: Avatar): AvatarRecord = {
    val rec = new AvatarRecord()
    rec.setUserid(avatar.userId)
    rec.setAvatar(avatar.avatar)
    rec
  }

  def userToRecord(u: User): UserRecord = {
    val rec = new UserRecord()
    rec.setFirstname(u.firstName)
    rec.setLastname(u.lastName)
    rec.setEmail(u.email)
    rec.setUsername(u.username)
    rec.setAvatarversion(u.avatarVersion)
    rec.setPassword(u.password)
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
