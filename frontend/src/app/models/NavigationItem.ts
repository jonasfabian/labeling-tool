export class NavigationItem {
  id: number;
  title: string;
  matIcon: string;

  constructor(id: number, title: string, matIcon: string) {
    this.id = id;
    this.title = title;
    this.matIcon = matIcon;
  }
}
