import peopleShadows from '../../assets/cursor-grid/people-shadows.png'
import { CursorGrid } from '../../features/cursor-grid'
import { SiteHeader } from '../../shared/ui/site-header'
import './CursorGridPage.css'

export function CursorGridPage() {
  return (
    <>
    <SiteHeader />
    <main className="cursor-grid-page" id="top">
      <div className="cursor-grid-page__effect" aria-hidden="true">
        <CursorGrid
          color="#0d5eaf"
          farColor="#82bbed"
          gridColor="#a9b7c6"
          cellSize={70}
          radius={220}
          holdTime={150}
          fadeDuration={700}
          lineWidth={2.2}
          gridOpacity={0.5}
          clickPulse
        />
      </div>

      <div className="cursor-grid-page__layout">
        <h1 className="cursor-grid-page__title">
          <span>Анализируем больше данных —</span>
          <strong>точнее находим ваших клиентов</strong>
        </h1>

        <div className="cursor-grid-page__visual">
          <img
            className="cursor-grid-page__people"
            src={peopleShadows}
            alt="Люди идут по диагонали, отбрасывая длинные голубые тени"
            draggable={false}
          />
        </div>

        <div className="cursor-grid-page__captions">
          <p>Подберём точную аудиторию среди 65+ млн абонентов МТС на основе их интересов, геоданных, интернет-поведения и звонков</p>
          <p>Обогащаем выборку данными партнёров — знаем детали о реальных покупках товаров вашей категории или бренда</p>
        </div>
      </div>
    </main>
    </>
  )
}
