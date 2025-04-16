import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { agreeToTerms } from '../redux/actions';
import styles from './AgreementForm.module.css'; // Импортируем стили

const AgreementForm = ({ onAccept }) => {
    const dispatch = useDispatch();
    const agreed = useSelector(state => state.agreement.agreed);

    const handleCheckboxChange = (event) => {
        dispatch(agreeToTerms(event.target.checked));
    };

    const handleSubmit = () => {
        onAccept();
    };

    return (
        <div className={styles.container}> {/* Используем стили */}
            <h2 className={styles.heading}>Пользовательское соглашение</h2> {/* Используем стили */}
            <p className={styles.paragraph}>Прочитайте внимательно условия соглашения...</p> {/* Используем стили */}

            <label className={styles.label}> {/* Используем стили */}
                <input
                    type="checkbox"
                    checked={agreed}
                    onChange={handleCheckboxChange}
                    className={styles.checkbox} // Используем стили
                />
                Я принимаю условия соглашения
            </label>

            <button onClick={handleSubmit} disabled={!agreed} className={styles.button}> {/* Используем стили */}
                Подтвердить
            </button>

        </div>
    );
};

export default AgreementForm;

