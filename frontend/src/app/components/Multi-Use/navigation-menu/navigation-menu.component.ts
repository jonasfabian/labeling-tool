import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {ApiService} from '../../../services/api.service';
import {MatSidenav} from '@angular/material';
import {MatMenu} from '@angular/material/menu';
import {Router} from '@angular/router';
import {NavigationItem} from '../../../models/NavigationItem';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {
  }

  @ViewChild('sidenav', {static: true}) sidenav: MatSidenav;
  @ViewChild('menu', {static: true}) menu: MatMenu;
  navigationContainer: Array<NavigationItem> = [
    new NavigationItem(0, 'Check', 'check'),
    new NavigationItem(1, 'Label', 'label'),
    new NavigationItem(2, 'Overview', 'view_list'),
    new NavigationItem(4, 'Settings', 'settings'),
  ];
  bookmarksContainer: Array<NavigationItem> = [];

  ngOnInit() {
    if (sessionStorage.getItem('sidenav')) {
      this.sidenav.toggle(JSON.parse(sessionStorage.getItem('sidenav')).open);
    }
    if (localStorage.getItem('bookmark')) {
      JSON.parse(localStorage.getItem('bookmark')).forEach(l => {
        this.navigationContainer.splice(this.navigationContainer.indexOf(l), 1);
        this.bookmarksContainer.push(l);
      });
    }
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
    sessionStorage.setItem('sidenav', JSON.stringify({open: this.sidenav.opened}));
  }

  redirectToPage(route: string): void {
    this.router.navigate(['/labeling-tool/' + route]);
    this.toggleSidenav();
  }

  markAsBookmark(naviItem: NavigationItem) {
    this.bookmarksContainer.push(naviItem);
    this.navigationContainer.splice(this.navigationContainer.indexOf(naviItem), 1);
    this.saveBookmarkToLocalStorage(naviItem);
  }

  unmarkAsBookmark(naviItem: NavigationItem) {
    this.navigationContainer.push(naviItem);
    this.bookmarksContainer.splice(this.bookmarksContainer.indexOf(naviItem), 1);
    this.removeBookmarkFromLocalStorage(naviItem);
  }

  saveBookmarkToLocalStorage(naviItem: NavigationItem): void {
    const bookmarkArray: Array<NavigationItem> = [];
    if (localStorage.getItem('bookmark')) {
      JSON.parse(localStorage.getItem('bookmark')).forEach(l => bookmarkArray.push(l));
      bookmarkArray.push(naviItem);
      localStorage.setItem('bookmark', JSON.stringify(bookmarkArray));
    } else {
      bookmarkArray.push(naviItem);
      localStorage.setItem('bookmark', JSON.stringify(bookmarkArray));
    }
  }

  removeBookmarkFromLocalStorage(naviItem: NavigationItem): void {
    const bookmarkArray: Array<NavigationItem> = [];
    if (localStorage.getItem('bookmark')) {
      JSON.parse(localStorage.getItem('bookmark')).forEach(l => bookmarkArray.push(l));
      bookmarkArray.splice(bookmarkArray.indexOf(naviItem));
      localStorage.setItem('bookmark', JSON.stringify(bookmarkArray));
    }
  }
}
