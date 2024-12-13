import React from 'react';
import './Spinner.css';
import { useTranslations } from 'next-intl';

const Spinner = () => {
    const t = useTranslations("Service");
    return (<tr>
        <td className="loader">
            <div className="loader-animation"></div>
            <div className="loader-text">{t('loading')}...</div>
        </td>
    </tr>)
};

export default Spinner;
