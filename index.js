import {registerRootComponent} from 'expo';
import App from './src/App';

if (process.env.NODE_ENV === 'development' && false) {
  import('./src/wdyr');
}

registerRootComponent(App);
