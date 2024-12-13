import { useTranslations } from "next-intl";
import './page.css'
import { Link } from "../../i18n/routing";


export default function Home() {

  const t = useTranslations('Home');
  return (
    <div className="main-container">
      <h1 className="main-title">{t('title')}</h1>
      <div className="main-link">
        <Link href={'/documents'}>{t('documents')}</Link>
      </div>
      <div className="link-container">
        <Link href={'/'} locale="en">EN</Link>
        <Link href={'/'} locale="ru">RU</Link>
        <Link href={'/'} locale="et">ET</Link>
      </div>
    </div>
  );
}