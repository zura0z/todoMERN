import BaseComponent from '../../Components/Commons/Base.Component';

import illustration from '../../utils/illustration.svg';
import './HomePage.css';

class HomePage extends BaseComponent {
    render() {
        return (
            <main className="homePage-container">
                <img src={illustration} className="illustration" />
            </main>
        );
    }
}

export default HomePage;
