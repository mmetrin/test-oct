import floraNotificationLogo from '../../assets/enterprise-hero/flora-notification-logo-source.png'
import './FlowerShopBubbles.css'

export function FlowerShopBubbles({ visible, messageReady }) {
  const showSearching = visible && !messageReady
  const showMessage = visible && messageReady

  return (
    <div className="flower-shop-bubbles" aria-hidden="true">
      <div className={`flower-shop-bubbles__message${showSearching ? ' flower-shop-bubbles__message--visible' : ''}`}>
        <div className="flower-shop-bubbles__message-content flower-shop-bubbles__skeleton">
          <span className="flower-shop-bubbles__message-icon">
            <img src={floraNotificationLogo} alt="" />
          </span>
          <div className="flower-shop-bubbles__message-copy">
            <div className="flower-shop-bubbles__message-heading">
              <strong>Ищем ЦА рядом</strong>
            </div>
            <div className="flower-shop-bubbles__message-body flower-shop-bubbles__skeleton-lines">
              <span className="flower-shop-bubbles__skeleton-shape" />
              <span className="flower-shop-bubbles__skeleton-shape" />
            </div>
          </div>
        </div>
      </div>
      <div className={`flower-shop-bubbles__message flower-shop-bubbles__message--resolved${showMessage ? ' flower-shop-bubbles__message--visible' : ''}`}>
        <div className="flower-shop-bubbles__message-content">
          <span className="flower-shop-bubbles__message-icon">
            <img src={floraNotificationLogo} alt="" />
          </span>
          <div className="flower-shop-bubbles__message-copy">
            <div className="flower-shop-bubbles__message-heading">
              <strong>Флора</strong>
              <span>сейчас</span>
            </div>
            <div className="flower-shop-bubbles__message-body">
              <p>
                Порадуйте близких цветами 💐<br />Букеты в паре шагов от вас!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
