export interface Navigation {
  navigate: (scene: string, data?: object) => void;
  data: any;
}
