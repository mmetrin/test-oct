import office from '../../assets/figma/targeted-calls/access-imgImage2090007934.png'
import laptop from '../../assets/figma/targeted-calls/access-imgImage2090007936.png'
import detail from '../../assets/figma/targeted-calls/access-imgVector7195.svg'
import update from '../../assets/figma/targeted-calls/access-imgBox.svg'
import signature from '../../assets/figma/targeted-calls/access-imgBox1.svg'
import control from '../../assets/figma/targeted-calls/access-imgBox2.svg'
import payment from '../../assets/figma/targeted-calls/access-imgBox3.svg'

const benefits = [
  { title: 'Актуальность', text: 'Данные обновляются в реальном времени, номера не устаревают', icon: update },
  { title: 'Легальность', text: 'Все контакты — абоненты МТС, которые дали согласие на обработку персональных данных', icon: signature },
  { title: 'Контроль', text: 'Управляйте обзвоном в личном кабинете: статусы, комментарии, аналитика', icon: control },
  { title: 'Оплата', text: 'Только за состоявшиеся звонки. За недозвоны и сбросы возвращаем деньги', icon: payment },
]

export function CallsAccess() {
  return <section className="calls-access" aria-labelledby="calls-access-title">
    <div className="calls-access__scene" aria-hidden="true">
      <img className="calls-access__office" src={office} alt="" width="2160" height="821" loading="lazy" />
      <img className="calls-access__laptop" src={laptop} alt="" width="981" height="464" loading="lazy" />
      <img className="calls-access__detail" src={detail} alt="" />
    </div>
    <div className="calls-access__content calls-container">
      <h2 id="calls-access-title">Доступ к аудитории<br />вместо покупки базы</h2>
      <div className="calls-access__cards">{benefits.map(item => <article className="calls-access__card" key={item.title}>
        <div><h3>{item.title}</h3><p>{item.text}</p></div><span className="calls-icon"><img src={item.icon} alt="" /></span>
      </article>)}</div>
      <div className="calls-access__targeting"><div><h3>Таргетинг</h3><p>Не просто ФИО и номер, а настройки по интересам и поведению</p></div><a className="calls-button" href="#calls-lead">Получить консультацию</a></div>
    </div>
  </section>
}
