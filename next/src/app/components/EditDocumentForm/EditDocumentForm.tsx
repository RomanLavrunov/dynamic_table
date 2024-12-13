import React, { useEffect, useState } from 'react';
import { IDocument, DocumentStateType } from '../../../shared/utilities/dataStorage/data.types';
import eventEmitter from '../../../shared/utilities/emitters/EventEmitter';
import { useTranslations } from 'next-intl';
import { useModal } from '../Modal/ModalContext';
import './EditDocumentForm.css';
import { formatToISODate } from '../../../shared/utilities/dataStorage/formatDocumentData';

const documentStates = ['SUBMITTED', 'IN_PROCESS', 'ADDITIONAL_REVIEW', 'REVIEW_COMPLETED', 'INVALID'] as DocumentStateType[];

export const EditDocumentForm = ({ document }) => {
    const { closeModal } = useModal();
    const th = useTranslations('Home');
    const ts = useTranslations('Service');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<IDocument | null>(null);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true)

    useEffect(() => {
        setFormData(document)
    }, []);

    useEffect(() => {
        setIsSubmitDisabled((formData?.documentTotalAmount.toString() === "" || formData?.documentTotalAmount == 0));
    }, [formData]);

    const closeEditForm = () => {
        setIsEditing(false);
        setFormData(null);
        closeModal();
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {

        const date = new Date()
            .toISOString()
            .split('.')[0]
            .replace('T', ' ');

     
        let { name, value } = e.target;

        if (name === 'documentTotalAmount' && isNaN(Number(value))) {
            return;
        }

        setFormData((prev) =>
            prev ? { ...prev, [name]: value as DocumentStateType, stateTime: date } : null
        );
    
    }

    const handleSave = () => {
        if (formData !== document && document) eventEmitter.emit('updateDocumentOnServer', formData);
        closeModal();
    };

    const handleDelete = () => {
        eventEmitter.emit('deleteDocumentOnServer', document.id)
        closeModal();
    }

    return (
        <div className='edit-form'>
            <div className='edit-form-header'>
                <p className='edit-form-document-id'>ID: {document?.id}</p>
                <div className='edit-form-button-container'>
                    {!isEditing ? (
                        <button className='edit-form-edit-button' onClick={() => setIsEditing(true)}>
                            {ts('edit')}
                        </button>
                    ) : (
                        <button disabled={isSubmitDisabled} className={isSubmitDisabled ? 'edit-form-save-button--disabled' : 'edit-form-save-button'} onClick={handleSave}>
                            {ts('save')}
                        </button>
                    )}
                    <button className='edit-form-close-button' onClick={closeEditForm}>
                        {ts('close')}
                    </button>
                </div>
            </div>
            <div className='edit-form-content'>
                {isEditing ? (
                    <form className='edit-form-form'>
                        <label>
                            {th('headerTitle.documentName')}
                            <input
                                disabled={true}
                                type='text'
                                name='documentName'
                                value={formData?.documentName}
                            />
                        </label>
                        <label>
                            {th('headerTitle.stateTime')}
                            <input
                                readOnly={true}
                                type='text'
                                name='documentName'
                                value={formatToISODate(formData?.stateTime)}
                            />
                        </label>
                        <label>
                            {th('headerTitle.state')}
                            <select onChange={handleChange} name="state" id="state-select" value={formData?.state} >
                                <option value={formData?.state} disabled>{th(`document.state.${formData?.state}`)}</option>
                                {documentStates.filter((state) => state !== formData?.state).map((state) => (<option key={state} value={state}>{th(`document.state.${state}`)}</option>)
                                )}
                            </select>
                        </label>
                        <label>
                            {th('headerTitle.documentTotalAmount')}
                            <input
                                type='text'
                                name='documentTotalAmount'
                                value={formData?.documentTotalAmount}
                                onChange={handleChange}
                            />
                        </label>
                    </form>
                ) : (
                    <div className='edit-form-details'>
                        <p><strong>{th('headerTitle.documentName')}: </strong>{document?.documentName}</p>
                        <p><strong>{th('headerTitle.state')}: </strong>  {document?.state ? th(`document.state.${document.state}`) : ''}</p>
                        <p><strong>{th('headerTitle.documentTotalAmount')}: </strong> {document?.documentTotalAmount}</p>
                    </div>
                )}
                <div className='delete-button-container'>
                    <button onClick={handleDelete} className='edit-form-delete-button'>
                    {ts('delete')}
                    </button>
                </div>
            </div>
        </div>)
};
