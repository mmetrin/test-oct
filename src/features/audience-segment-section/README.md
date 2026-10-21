# Блок Big Data

`AudienceSegmentSection` расположен под воронкой на странице `FunnelJourneyPage`.
Он выводит текст и надпись BIG DATA МТС по макету Figma `9043:50525`. Фон,
зацикленное видео, световые переходы и логотипы М.Видео вынесены в
`AudienceDataVideo.jsx`.

Видео `src/assets/funnel-journey/big-data/big-data-background.mp4` взято из
переданного пользователем файла `новое.mp4`. Для начальной загрузки используется
постер из того же видео. Световые переходы, маска надписи и логотипы М.Видео
находятся в `src/assets/figma/big-data-stage/`.

Появление заголовка, текста и надписи запускается через `useRevealOnVisible`.
Параметры `activeSegment`, `onSegmentChange` и `hideTabs` сохраняют интерфейс
секции для переключателя аудиторий. `AudienceDataScene` и его дочерние
компоненты используются в отдельном `AudienceOrbitSection` после воронки на
странице `EnterpriseHeroPage`; исходная страница продолжает показывать видео.
