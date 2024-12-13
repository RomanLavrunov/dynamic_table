import React from 'react';
import './MissingTable.css';
import { useTranslations } from 'next-intl';

export const MissingTable= () => {
    const t = useTranslations("Service")
    return (<tr>
        <td className="missing-data">
            <div className="missing-data-message">{t(`nothing_found`)}...</div>
        </td>
    </tr>)
};
