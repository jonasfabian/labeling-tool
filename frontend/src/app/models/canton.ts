export class Canton {
  // TODO not sure if makes more sense to poll them from the backend/database?
  static cantons: Canton[] = [
    {cantonId: 'ag', cantonName: 'Aargau'},
    {cantonId: 'ai', cantonName: 'Appenzell Innerrhoden'},
    {cantonId: 'ar', cantonName: 'Appenzell Ausserrhoden'},
    {cantonId: 'be', cantonName: 'Bern'},
    {cantonId: 'bl', cantonName: 'Basel-Landschaft'},
    {cantonId: 'bs', cantonName: 'Basel-Stadt'},
    {cantonId: 'fr', cantonName: 'Freiburg'},
    {cantonId: 'ge', cantonName: 'Genf'},
    {cantonId: 'gl', cantonName: 'Glarus'},
    {cantonId: 'gr', cantonName: 'Graubünden'},
    {cantonId: 'ju', cantonName: 'Jura'},
    {cantonId: 'lu', cantonName: 'Luzern'},
    {cantonId: 'ne', cantonName: 'Neuenburg'},
    {cantonId: 'nw', cantonName: 'Nidwalden'},
    {cantonId: 'ow', cantonName: 'Obwalden'},
    {cantonId: 'sg', cantonName: 'St. Gallen'},
    {cantonId: 'sh', cantonName: 'Schaffhausen'},
    {cantonId: 'so', cantonName: 'Solothurn'},
    {cantonId: 'sz', cantonName: 'Schwyz'},
    {cantonId: 'tg', cantonName: 'Thurgau'},
    {cantonId: 'ti', cantonName: 'Tessin'},
    {cantonId: 'ur', cantonName: 'Uri'},
    {cantonId: 'vd', cantonName: 'Waadt'},
    {cantonId: 'vs', cantonName: 'Wallis'},
    {cantonId: 'zg', cantonName: 'Zug'},
    {cantonId: 'zh', cantonName: 'Zürich'}
  ];
  cantonId: string;
  cantonName: string;

  constructor(cantonId: string, cantonName: string) {
    this.cantonId = cantonId;
    this.cantonName = cantonName;
  }
}
