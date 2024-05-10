import styles from '../page.module.css';
import { DynamicContent } from 'libs/web-react/src/containers/DynamicContent/DynamicContent';

export default function Page() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <DynamicContent pageConfig={{}} />
        </div>
      </div>
    </div>
  );
}
