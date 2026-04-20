import { useEffect, useState } from 'react';
import { verifyEmail } from '../api/auth';
import styles from './VerifyEmail.module.css';

export default function VerifyEmail({ token, onSuccess, onSignIn }) {
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function verify() {
      const { status: httpStatus, data } = await verifyEmail(token);
      if (httpStatus === 200 && data.ok && data.token) {
        setStatus('success');
        setTimeout(() => onSuccess(data.token), 1500);
      } else {
        const msgs = {
          missing_token:    'Verification link is invalid.',
          invalid_token:    'Verification link is invalid or has already been used.',
          token_expired:    'This verification link has expired. Please register again.',
          already_verified: 'Your account is already verified. You can sign in.',
        };
        setErrorMsg(msgs[data.error] || 'Verification failed. Please try again.');
        setStatus('error');
      }
    }
    verify();
  }, [token]);

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <div className={styles.logo}>Serrah</div>
        {status === 'loading' && (
          <><div className={styles.spinner} /><p className={styles.msg}>Verifying your email…</p></>
        )}
        {status === 'success' && (
          <><div className={styles.iconSuccess}>✓</div><p className={styles.msg}>Email verified — signing you in…</p></>
        )}
        {status === 'error' && (
          <>
            <div className={styles.iconError}>✕</div>
            <p className={styles.msgError}>{errorMsg}</p>
            <button className={styles.btn} onClick={onSignIn}>Back to Sign In</button>
          </>
        )}
      </div>
    </div>
  );
}
