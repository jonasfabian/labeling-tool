import {Component, Input, OnChanges} from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {
  @Input() username: string;
  @Input() hover: string;
  initials = '';
  color = '';
  size = 32;
  fontSize = 15;
  borderRadius = 50;

  ngOnChanges(): void {
    if (this.username) {
      this.initials = this.username.charAt(0).toLocaleUpperCase();
      this.color = this.stringToColor(this.username);
    }
  }

  /**
   * from https://github.com/flarum/core/blob/v0.1.0-beta.8/js/src/common/utils/stringToColor.js
   */
  hsvToRgb(h: number, s: number, v: number) {
    let r: number;
    let g: number;
    let b: number;

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }

    return {
      r: Math.floor(r * 255),
      g: Math.floor(g * 255),
      b: Math.floor(b * 255),
    };
  }

  /**
   * Convert the given string to a unique color.
   * from https://github.com/flarum/core/blob/v0.1.0-beta.8/js/src/common/utils/stringToColor.js
   */
  stringToColor(str: string): string {
    let num = 0;

    // Convert the username into a number based on the ASCII value of each
    // character.
    for (let i = 0; i < str.length; i++) {
      num += str.charCodeAt(i);
    }

    // Construct a color using the remainder of that number divided by 360, and
    // some predefined saturation and value values.
    const hue = num % 360;
    const rgb = this.hsvToRgb(hue / 360, 0.3, 0.9);

    return '#' + rgb.r.toString(16) + rgb.g.toString(16) + rgb.b.toString(16);
  }

}
