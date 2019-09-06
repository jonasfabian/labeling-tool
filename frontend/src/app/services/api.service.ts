import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TextAudioIndexWithText} from '../models/textAudioIndexWithText';
import {Sums} from '../models/Sums';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {User} from '../models/user';
import {EmailPassword} from '../models/EmailPassword';
import {UserAndTextAudioIndex} from '../models/UserAndTextAudioIndex';
import {UserPublicInfo} from '../models/UserPublicInfo';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {TextAudioIndex} from '../models/textAudioIndex';
import {Avatar} from '../models/avatar';
import {Chat} from '../models/Chat';
import {ChatMessage} from '../models/ChatMessage';
import {ChatMember} from '../models/ChatMember';
import {ChatMessageInfo} from "../models/ChatMessageInfo";

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private router: Router,
    private authService: AuthService
  ) {
  }

  url = 'http://localhost:8080/api/match/';
  BASE64_MARKER = ';base64,';
  blobUrl: SafeUrl | string = '';
  showTenMoreQuest = false;
  chatArray: Array<Chat> = [];

  getTextAudioIndexes(): Observable<Array<TextAudioIndexWithText>> {
    return this.http.get<Array<TextAudioIndexWithText>>(this.url + 'getTextAudioIndexes');
  }

  getCheckedTextAudioIndexesByUser(userId: number): Observable<Array<TextAudioIndex>> {
    return this.http.get<Array<TextAudioIndex>>(this.url + 'getCheckedTextAudioIndexesByUser?id=' + userId);
  }

  getUser(id: number): Observable<UserPublicInfo> {
    return this.http.get<UserPublicInfo>(this.url + 'getUser?id=' + id);
  }

  getUserByUsername(username: string): Observable<UserPublicInfo> {
    return this.http.get<UserPublicInfo>(this.url + 'getUserByUsername?username=' + username);
  }

  getAllMessagesFromChat(chatId: number): Observable<Array<ChatMessageInfo>> {
    return this.http.get<Array<ChatMessageInfo>>(this.url + 'getAllMessagesFromChat?id=' + chatId);
  }

  getAllChatMemberFromChat(chatId: number): Observable<Array<ChatMember>> {
    return this.http.get<Array<ChatMember>>(this.url + 'getAllChatMemberFromChat?id=' + chatId);
  }

  getAvatar(id: number): Observable<Avatar> {
    return this.http.get<Avatar>(this.url + 'getAvatar?id=' + id);
  }

  getUserByEmail(email: string): Observable<UserPublicInfo> {
    return this.http.get<UserPublicInfo>(this.url + 'getUserByEmail?email=' + email);
  }

  createUser(user: User): Observable<any> {
    return this.http.post(this.url + 'createUser', user);
  }

  createChat(chat: Chat): Observable<any> {
    return this.http.post(this.url + 'createChat', chat);
  }

  createChatMember(chatMember: ChatMember): Observable<any> {
    return this.http.post(this.url + 'createChatMember', chatMember);
  }

  createChatMessage(chatMessage: ChatMessage): Observable<any> {
    return this.http.post(this.url + 'createChatMessage', chatMessage);
  }

  getChats(): Observable<Array<Chat>> {
    return this.http.get<Array<Chat>>(this.url + 'getChats');
  }

  getChatsFromUser(userId: number): Observable<Array<Chat>> {
    return this.http.get<Array<Chat>>(this.url + 'getChatsPerUser?id=' + userId);
  }

  removeChatMember(chatMember: ChatMember): Observable<any> {
    return this.http.post(this.url + 'removeChatMember', chatMember);
  }

  createAvatar(avatar: Avatar): Observable<any> {
    return this.http.post(this.url + 'createAvatar', avatar);
  }

  createUserAndTextAudioIndex(userAndTextAudioIndex: UserAndTextAudioIndex): Observable<any> {
    return this.http.post(this.url + 'createUserAndTextAudioIndex', userAndTextAudioIndex);
  }

  checkLogin(emailPassword: EmailPassword): Observable<any> {
    return this.http.post(this.url + 'checkLogin', emailPassword);
  }

  updateTextAudioIndex(textAudioIndex: TextAudioIndexWithText): Observable<any> {
    return this.http.post(this.url + 'updateTextAudioIndex', textAudioIndex);
  }

  updateUser(user: UserPublicInfo): Observable<any> {
    return this.http.post(this.url + 'updateUser', user);
  }

  getAudioFile(fileId: number): Observable<any> {
    return this.http.get(this.url + 'getAudioFile?id=' + fileId, {responseType: 'blob'});
  }

  getNonLabeledTextAudioIndex(labeledType: number): Observable<TextAudioIndexWithText> {
    return this.http.get<TextAudioIndexWithText>(this.url + 'getNonLabeledDataIndexes?id=' + labeledType);
  }

  getTenNonLabeledTextAudioIndex(userId: number): Observable<Array<TextAudioIndexWithText>> {
    return this.http.get<Array<TextAudioIndexWithText>>(this.url + 'getTenNonLabeledDataIndexes?userId=' + userId);
  }

  getLabeledSums(): Observable<Array<Sums>> {
    return this.http.get<Array<Sums>>(this.url + 'getLabeledSums');
  }

  convertDataURIToBinary(dataURI): Uint8Array {
    const base64Index = dataURI.indexOf(this.BASE64_MARKER) + this.BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }

  loadAudioBlob(file: TextAudioIndexWithText): void {
    this.getAudioFile(file.transcriptFileId).subscribe(resp => {
      const reader = new FileReader();
      reader.readAsDataURL(resp);
      reader.addEventListener('loadend', _ => {
        const binary = this.convertDataURIToBinary(reader.result);
        const blob = new Blob([binary], {type: `application/octet-stream`});
        this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      });
    });
  }

  logOut(): void {
    sessionStorage.clear();
    this.router.navigate(['/labeling-tool/login']);
    this.authService.isAuthenticated = false;
    this.authService.loggedInUser = new UserPublicInfo(-1, '', '', '', '', 0);
  }
}
