export interface VisualizationTheme {
  id: string;
  name: string;
  colors: string[];
  animation_style: 'waves' | 'particles' | 'geometric' | 'organic';
  intensity: number;
  speed: number;
}

export interface AnimationSettings {
  enabled: boolean;
  theme: VisualizationTheme;
  responsiveness: number; // How much it responds to music
  opacity: number;
}