import styles from './web-next.module.scss';

/* eslint-disable-next-line */
export interface WebNextProps {}

export function WebNext(props: WebNextProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to WebNext!</h1>
    </div>
  );
}

export default WebNext;
