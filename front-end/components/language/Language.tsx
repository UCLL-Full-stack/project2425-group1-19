import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const Language: React.FC = () => {
  const router = useRouter();
  const { locale, pathname, asPath, query } = router;
  const { t } = useTranslation();

  const handleLanguageChange = (event: { target: { value: string } }) => {
    const locale = event.target.value;
    router.push({ pathname, query }, asPath, { locale });
  };

  return (
    <div>
      <label htmlFor="language" className="text-white">
        {t("header.nav.language")}
      </label>
      <select
        id="language"
        className="ml-2 p-1"
        value={locale}
        onChange={handleLanguageChange}
      >
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="nl">Nederlands</option>
      </select>
    </div>
  );
};

export default Language;
