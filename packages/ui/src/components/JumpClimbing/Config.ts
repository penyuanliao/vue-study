

export const config = {
    loader: import.meta.glob('../../assets/frog/*.png', { eager: true, import: 'default' }) as Record<string, string>,
    grass: import.meta.glob(`../../assets/ground/grass/*.png`, { eager: true, import: 'default' }) as Record<string, string>,
    digits: import.meta.glob(`../../assets/hud/digits/*.npg`, { eager: true, import: 'default' }) as Record<string, string>,
}