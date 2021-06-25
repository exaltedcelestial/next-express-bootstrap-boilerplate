import Link from 'next/link';
import { Button } from 'react-bootstrap';
import Theme from '../components/Theme';
import App from '../components/App';
import CommonStudent from '../components/CommonStudent';
// Straight away require/import scss/css just like in react.
import indexStyle from '../styles/index.scss';

const Index = () => (
    // Wrap your page inside <Theme> HOC to get bootstrap styling.
    // Theme can also be omitted if react-bootstrap components are not used.
    <Theme>
        {
            /*
            Set indexStyling via dangerouslySetInnerHTML.
            This step will make the below classes to work.
            */
        }
        <style dangerouslySetInnerHTML={{ __html: indexStyle }} />
        <App>
          <CommonStudent />
        </App>

        {/* Styling using styled-jsx. */}
        {/* <style jsx>
            {`
              .btn {
                display: flex;
                justify-content: center;
              }`
            }
        </style> */}
    </Theme>
);

export default Index;
