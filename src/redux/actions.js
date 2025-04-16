export const AGREE_TO_TERMS = 'AGREE_TO_TERMS';
export const REVOKE_AGREEMENT = 'REVOKE_AGREEMENT';

export const agreeToTerms = (agreed) => ({
    type: AGREE_TO_TERMS,
    payload: agreed,
});

export const revokeAgreement = () => ({
    type: REVOKE_AGREEMENT,
});