// lib/tailwind.js
import {create} from 'twrnc';
import twConfig from '../tailwind.config.cjs';

// create the customized version...
const tw = create(twConfig); // <- your path may differ

// ... and then this becomes the main function your app uses
export default tw;
