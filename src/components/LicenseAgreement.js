import React from 'react';
import Checkbox from './Checkbox';
import AgreementSubmitButton from './AgreementSubmitButton';
import styles from './LicenseAgreement.module.css';

const LicenseAgreement = () => {
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <h1 className={styles.eulaTitle}>End User License Agreement</h1>
        <p className={styles.eulaText}>
          Соглашайтесь :)
        </p>
        <div className={styles.agreementSection}>
          <Checkbox name="agree" label="Согласен" />
          <AgreementSubmitButton />
        </div>
      </div>
    </div>
  );
};

export default LicenseAgreement;
