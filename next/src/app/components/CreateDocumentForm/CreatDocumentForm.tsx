import React, { useEffect, useState } from 'react';
import { DocumentStateType, IDocument } from '../../../shared/utilities/dataStorage/data.types';
import eventEmitter from '../../../shared/utilities/emitters/EventEmitter';
import { useTranslations } from 'next-intl';
import { useModal } from '../Modal/ModalContext';
import { formatToISODate } from '../../../shared/utilities/dataStorage/formatDocumentData';
import './CreateDocumentForm.css';

const documentStates = ['SUBMITTED', 'IN_PROCESS', 'ADDITIONAL_REVIEW', 'REVIEW_COMPLETED', 'INVALID'] as string[];

const defaultFormData: Partial<IDocument> = {
    documentDate: new Date().toISOString().split('.')[0].replace('T', ' '),
    stateTime: new Date().toISOString().split('.')[0].replace('T', ' '),
};

export const CreateDocumentForm = () => {
    const { closeModal } = useModal();
    const [formData, setFormData] = useState<Partial<IDocument>>(defaultFormData);
    const th = useTranslations('Home');
    const ts = useTranslations('Service');
    const [nextId, setNextId] = useState<number | null>(null);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true)

    useEffect(() => {
        setIsSubmitDisabled(
            !formData?.documentName ||
            !documentStates.includes(formData?.state) ||
            formData?.documentTotalAmount === undefined || formData?.documentTotalAmount.toString() === '' || formData?.documentTotalAmount == 0

        );
    }, [formData]);

    const closeEditForm = () => {
        setFormData(null);
        closeModal();
    };

    useEffect(() => {
        (async function () {
            try {
                const response = await fetch('/api/db/GET/next-document');

                if (!response.ok) {
                    throw new Error(`Failed to fetch next ID: ${response.statusText}`);
                }
                const data = await response.json();

                setNextId(data.nextId);
                setFormData((prev) => { return { ...prev, id: data.nextId, documentName: data.documentName, documentNumber: `${data.nextId}` } })
            } catch (error) {
                console.error('Error fetching next ID:', error);
            }
        })()
    }, []);


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {

        let { name, value } = e.target;
        if (name === 'documentTotalAmount' && isNaN(Number(value))) {
            return;
        }

        setFormData((prev) =>
            prev ? { ...prev, [name]: value as DocumentStateType } : null
        );

    }

    const handleSave = (): MouseEvent => {
        if (!formData?.id || !formData?.documentName || !formData?.state) {
            console.error("Cannot save: missing required fields.");
            return;
        }

        eventEmitter.emit('addDocumentOnServer', formData);

        setFormData(defaultFormData);
        closeModal();
    };

    return (
        <div className='create-form'>
            <div className='create-form-header'>
                <p className='create-form-document-id'>ID: {nextId}</p>
                <div className='create-form-button-container'>
                    <button disabled={isSubmitDisabled} className={isSubmitDisabled ? 'create-form-save-button--disabled' : 'create-form-save-button'} onClick={handleSave}>
                        {ts('save')}
                    </button>
                    <button className='create-form-close-button' onClick={closeEditForm}>
                        {ts('close')}
                    </button>
                </div>
            </div>
            <div className='create-form-content'>
                <form className='create-form-form'>
                    <label>
                        {th('headerTitle.documentName')}
                        <input
                            type='text'
                            name='documentName'
                            onChange={handleChange}
                            value={formData?.documentName || ''}
                        />
                    </label>
                    <label>
                        {th('headerTitle.documentDate')}
                        <input
                            disabled={true}
                            type='text'
                            name='documentDate'
                            value={formatToISODate(formData?.documentDate) || ''}
                        />
                    </label>
                    <label>
                        {th('headerTitle.stateTime')}
                        <input
                            disabled={true}
                            type='text'
                            name='stateTime'
                            value={formatToISODate(formData?.stateTime) || ''}
                        />
                    </label>
                    <label>
                        {th('headerTitle.documentNumber')}
                        <input
                            disabled={true}
                            type='text'
                            name='documentNumber'
                            onChange={handleChange}
                            value={formData?.documentNumber || ''}
                        />
                    </label>
                    <label>
                        {th('headerTitle.state')}
                        <select onChange={handleChange} name="state" id="state-select" value={formData?.state || ""}>
                            <option value={formData?.state} disabled={!!formData?.state}>
                                {formData?.state ? th(`document.state.${formData?.state}`) : th('headerTitle.state')}
                            </option>
                            {documentStates.filter((state) => state !== formData?.state).map((state) => (
                                <option key={state} value={state}>
                                    {th(`document.state.${state}`)}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label>
                        {th('headerTitle.documentTotalAmount')}
                        <input
                            placeholder='0.00'
                            type='text'
                            name='documentTotalAmount'
                            value={formData?.documentTotalAmount || ''}
                            onChange={handleChange}
                        />
                    </label>
                </form>
            </div>
        </div>)
};
