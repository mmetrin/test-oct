# Видео hero /mads/

Исходник: `video-hero.mp4` из корня проекта, 2880×2160, 30 FPS, около 12,33 с. Исходник не перезаписывается.

`scripts/prepare-mads-hero.py` создаёт:

- `src/assets/funnel-journey/hero/hero-background.mp4` — полный цикл вперёд → назад.
- `src/assets/funnel-journey/hero/hero-background-backdrop.mp4` — тот же цикл в 960×720 для размытого фона широких экранов.
- `src/assets/funnel-journey/hero/hero-background-poster.jpg` — первый кадр нового видео для загрузки и reduced motion.

В начале прямого прохода скорость около 0,9×, плавно достигает 1× за первые две секунды исходника. Обратный проход зеркалит прямой, поэтому к началу следующего цикла движение тоже немного замедляется. Повторяющиеся крайние кадры исключены из обратного прохода. Весь цикл запечён в MP4 и повторяется стандартным `loop` без JS-перемотки. Аудио удалено, H.264/yuv420p, BT.709, faststart.

Новый исходник используется без дополнительного запечённого размытия. Существующие CSS-размытия, затемнения и размещение fill сохранены. Компонент `FunnelHeroBackground` уже импортирует эти файлы: autoplay/muted/loop/playsInline. При reduced motion остаётся постер.

## Повторная генерация

```sh
python3 scripts/prepare-mads-hero.py
# Если ffmpeg отсутствует в PATH:
FFMPEG=/absolute/path/to/ffmpeg python3 scripts/prepare-mads-hero.py
```
