import projectScreen from '../../assets/figma/platform-sections/interface-project-screen.png'
import campaignScreen from '../../assets/figma/platform-sections/interface-campaign-screen.png'
import audienceScreen from '../../assets/figma/platform-sections/interface-audience-screen.png'
import projectIllustration from '../../assets/figma/platform-sections/interface-project-illustration.png'
import campaignIllustration from '../../assets/figma/platform-sections/interface-campaign-illustration.png'
import audienceIllustration from '../../assets/figma/platform-sections/interface-audience-illustration.png'

export const platformInterfaceSlides = [
  {
    id: 'project', label: 'Создание нового проекта', screen: projectScreen, illustration: projectIllustration,
    title: 'Маркировка и UTM «из коробки»',
    description: 'Токены ОРД и динамические UTM-метки генерируются автоматически по ИНН',
  },
  {
    id: 'campaign', label: 'Мастер создания РК', screen: campaignScreen, illustration: campaignIllustration,
    title: 'Честная оценка результата',
    description: 'Результат считается по одному идентификатору, а не по разрозненным cookie и ID площадок',
  },
  {
    id: 'audience', label: 'Настройки ЦА', screen: audienceScreen, illustration: audienceIllustration,
    title: 'Управление частотой показов',
    description: 'Управляйте общей частотой показов на всех площадках, чтобы бюджет шёл в новый охват, а не в лишние повторы',
  },
]
